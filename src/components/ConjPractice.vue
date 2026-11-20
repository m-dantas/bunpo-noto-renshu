<script setup>
// 活用: treino só de conjugação de verbos e adjetivos, com as formas escolhidas pela pessoa
import { ref, reactive, computed, nextTick, watch } from 'vue'
import KanaInput from './KanaInput.vue'
import { makeConj, VFORMS, AFORMS, VGROUPS, AGROUPS, CV, CA } from '../utils/conjDrill'
import { flush } from '../utils/kana'
import { furi } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'
import { useI18n } from 'vue-i18n'
import { tc } from '../i18n'

const { t } = useI18n()

// ---------- configuração (lembrada no aparelho) ----------
const KEY = 'conjCfg'
const DEF = { words: ['v', 'i', 'na'], groups: ['u', 'ru', 'irr'], vforms: ['masu', 'masen', 'te', 'nai', 'ta'], aforms: ['neg', 'past', 'pastneg'], count: 20, furi: true, rules: false }
const load = () => { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch (e) { return { ...DEF } } }
const cfg = reactive(load())
watch(cfg, v => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (e) { /* sem storage */ } }, { deep: true })

const WORDS = ['v', 'i', 'na']
const GROUPS = ['u', 'ru', 'irr']
const hasV = computed(() => cfg.words.includes('v'))
const hasA = computed(() => cfg.words.some(w => w !== 'v'))
const nWords = computed(() => (hasV.value ? CV.filter(v => cfg.groups.includes(v[2])).length : 0) + CA.filter(a => cfg.words.includes(a[2])).length)
const toggle = (list, keys, on) => { keys.forEach(k => { const i = cfg[list].indexOf(k); if (on && i < 0) cfg[list].push(k); if (!on && i >= 0) cfg[list].splice(i, 1) }) }
const allOn = (list, keys) => keys.every(k => cfg[list].includes(k))
const ready = computed(() => (hasV.value && cfg.groups.length && cfg.vforms.length) || (hasA.value && cfg.aforms.length))

// ---------- sessão ----------
const stage = ref('setup') // setup | run | done
const queue = ref([]), idx = ref(0), results = ref([])
const answer = ref(''), answered = ref(false), good = ref(false)
const streak = ref(0), best = ref(0)
const inp = ref(null), go = ref(null)

const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const html = (k, r) => (cfg.furi ? furi(k, r) : k)

function build() {
  const o = { words: cfg.words, groups: cfg.groups, vforms: hasV.value ? cfg.vforms : [], aforms: hasA.value ? cfg.aforms : [] }
  const out = [], seen = new Set()
  for (let guard = 0; out.length < cfg.count && guard < 800; guard++) {
    const q = makeConj(o)
    if (!q) break
    const key = q.k + q.tag[0]
    if (seen.has(key) && guard < 400) continue // evita repetir enquanto houver variedade
    seen.add(key)
    out.push(q)
  }
  return out
}
const q = computed(() => queue.value[idx.value])
const okCount = computed(() => results.value.filter(r => r.good).length)
const misses = computed(() => results.value.filter(r => !r.good).map(r => r.q))
const byForm = computed(() => {
  const m = {}
  results.value.forEach(r => { const k = r.q.tag[0]; (m[k] ||= { label: r.q.tag[0], d: r.q.tag[1], ok: 0, n: 0 }).n++; if (r.good) m[k].ok++ })
  return Object.values(m).sort((a, b) => a.ok / a.n - b.ok / b.n)
})
const catTag = x => t('conj.cat.' + (x.cat === 'v' ? x.g : x.cat))

function begin(list) {
  if (!list.length) return
  queue.value = list
  idx.value = 0
  results.value = []
  streak.value = 0
  stage.value = 'run'
  resetQ()
}
const start = () => begin(build())
const retry = () => begin(shuffle(misses.value))
function resetQ() {
  answer.value = ''; answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}
function check() {
  const v = flush(answer.value).normalize('NFKC').replace(/[\s。、]/g, '')
  if (!v) return
  const g = q.value.ans.includes(v)
  answered.value = true
  good.value = g
  results.value.push({ q: q.value, good: g })
  if (g) { streak.value++; best.value = Math.max(best.value, streak.value) } else streak.value = 0
  nextTick(() => go.value && go.value.focus())
}
function next() {
  if (idx.value + 1 >= queue.value.length) { stage.value = 'done'; return }
  idx.value++
  resetQ()
}
const primary = () => { if (answered.value) next(); else check() }
useEnter(primary, () => stage.value === 'run')
</script>

<template>
  <!-- configuração -->
  <section v-if="stage === 'setup'">
    <h2 class="go" style="margin-top: 0">{{ t('conj.title') }}</h2>
    <p class="lead">{{ t('conj.lead') }}</p>
    <div class="sheet">
      <fieldset class="first">
        <legend>{{ t('conj.words') }}</legend>
        <label v-for="w in WORDS" :key="w"><input v-model="cfg.words" type="checkbox" :value="w" />{{ t('conj.w.' + w) }}</label>
        <span class="lead">{{ t('conj.nWords', { n: nWords }) }}</span>
      </fieldset>

      <template v-if="hasV">
        <fieldset>
          <legend>{{ t('conj.groups') }}</legend>
          <label v-for="g in GROUPS" :key="g"><input v-model="cfg.groups" type="checkbox" :value="g" />{{ t('conj.g.' + g) }}</label>
        </fieldset>
        <fieldset v-for="(keys, grp) in VGROUPS" :key="'v' + grp">
          <legend>{{ t('conj.vForms.' + grp) }}
            <button type="button" class="linkbtn" @click="toggle('vforms', keys, !allOn('vforms', keys))">{{ allOn('vforms', keys) ? t('conj.none') : t('conj.all') }}</button>
          </legend>
          <label v-for="f in keys" :key="f"><input v-model="cfg.vforms" type="checkbox" :value="f" /><span lang="ja">{{ VFORMS[f][0] }}</span>&nbsp;<small class="muted">{{ t('conj.f.' + f) }}</small></label>
        </fieldset>
      </template>

      <template v-if="hasA">
        <fieldset v-for="(keys, grp) in AGROUPS" :key="'a' + grp">
          <legend>{{ t('conj.aForms.' + grp) }}
            <button type="button" class="linkbtn" @click="toggle('aforms', keys, !allOn('aforms', keys))">{{ allOn('aforms', keys) ? t('conj.none') : t('conj.all') }}</button>
          </legend>
          <label v-for="f in keys" :key="f"><input v-model="cfg.aforms" type="checkbox" :value="f" /><span lang="ja">{{ AFORMS[f][0] }} / {{ AFORMS[f][2] }}</span>&nbsp;<small class="muted">{{ t('conj.a.' + f) }}</small></label>
        </fieldset>
      </template>

      <fieldset>
        <legend>{{ t('mix.session') }}</legend>
        <label>{{ t('mix.questions') }}
          <select v-model.number="cfg.count"><option :value="10">10</option><option :value="20">20</option><option :value="30">30</option><option :value="50">50</option></select>
        </label>
        <label>{{ t('common.furigana') }}
          <select v-model="cfg.furi"><option :value="true">{{ t('common.withFuri') }}</option><option :value="false">{{ t('common.noFuri') }}</option></select>
        </label>
        <label><input v-model="cfg.rules" type="checkbox" />{{ t('conj.rulesBefore') }}</label>
      </fieldset>
      <p v-if="!ready" class="bad">{{ t('conj.empty') }}</p>
      <div class="row" style="margin-top: 16px"><button :disabled="!ready" @click="start">{{ t('mix.start') }}</button></div>
    </div>
    <p class="hint">{{ t('conj.hint') }}</p>
  </section>

  <!-- treino -->
  <section v-else-if="stage === 'run' && q">
    <button class="back" @click="stage = 'setup'">{{ t('mix.stop') }}</button>
    <div class="stats">
      <div>{{ t('common.question') }}<b>{{ idx + 1 }}/{{ queue.length }}</b></div>
      <div>{{ t('common.hits') }}<b>{{ okCount }}</b></div>
      <div>{{ t('common.streak') }}<b>{{ streak }}</b></div>
    </div>
    <div class="bar"><span :style="{ width: (idx / queue.length) * 100 + '%' }"></span></div>

    <div class="sheet">
      <div class="tags"><span class="tag">{{ catTag(q) }}</span><span v-for="x in q.tag" :key="x" class="tag">{{ x }}</span></div>
      <div class="word" lang="ja" v-html="html(q.k, q.r)"></div>
      <div class="pt">{{ tc(q.pt) }}</div>
      <div v-if="cfg.rules && !answered" class="rule" style="text-align: center">{{ q.rule }}</div>

      <div class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? t('common.next') : t('common.check') }}</button>
      </div>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? t('common.correct') : t('common.almost') }}</div>
          <div v-if="!good" class="rule">{{ t('common.youWrote', { a: answer }) }}</div>
          <div lang="ja">{{ t('common.answer', { a: q.ans[0] }) }}<template v-if="q.ans[1] && !(q.alt || []).includes(q.ans[1])"> ({{ q.ans[1] }})</template><template v-if="q.alt && q.alt.length">{{ t('common.also', { list: q.alt.join(', ') }) }}</template></div>
          <div class="rule">{{ q.rule }}</div>
        </template>
      </div>
    </div>
  </section>

  <!-- resultado -->
  <section v-else-if="stage === 'done'">
    <h2 class="go" style="margin-top: 0">{{ t('mix.result') }}</h2>
    <div class="sheet">
      <div class="word" style="font-size: 3rem">{{ okCount }}/{{ results.length }}</div>
      <div class="pt">{{ t('mix.pct', { n: Math.round((okCount / results.length) * 100) }) }} · {{ t('conj.best', { n: best }) }}</div>
      <div style="overflow-x: auto">
        <table class="g">
          <thead><tr><th>{{ t('conj.form') }}</th><th>{{ t('common.hits') }}</th></tr></thead>
          <tbody>
            <tr v-for="b in byForm" :key="b.label"><td><span lang="ja">{{ b.label }}</span> <small class="muted">{{ b.d }}</small></td><td>{{ b.ok }}/{{ b.n }}</td></tr>
          </tbody>
        </table>
      </div>
      <template v-if="misses.length">
        <h2 class="go">{{ t('mix.review') }}</h2>
        <ul class="kwords"><li v-for="(m, i) in misses" :key="i"><span class="tag">{{ m.tag[0] }}</span> <span class="kw" lang="ja"><span v-html="html(m.k, m.r)"></span> → {{ m.ans[0] }}</span></li></ul>
      </template>
    </div>
    <div style="margin-top: 16px">
      <button v-if="misses.length" class="choice" @click="retry"><b>{{ t('mix.retry') }}</b><span>{{ t('mix.retryDesc', { n: misses.length }) }}</span></button>
      <button class="choice" @click="start"><b>{{ t('mix.again') }}</b><span>{{ t('conj.againDesc', { n: cfg.count }) }}</span></button>
      <button class="choice" @click="stage = 'setup'"><b>{{ t('mix.change') }}</b><span>{{ t('mix.changeDesc') }}</span></button>
    </div>
  </section>
</template>
