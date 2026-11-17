<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { READY } from '../data/lessons'
import { CONF } from '../data/drillConfig'
import { BLANKS } from '../data/blanks'
import { SENTENCES } from '../data/sentences'
import { CUES } from '../data/cues'
import { makeNum, hasNum } from '../utils/numbers'
import { makeQuestion } from '../utils/questions'
import { flush } from '../utils/kana'
import { matchChunks } from '../utils/answer'
import { rb, furi } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'
import { useI18n } from 'vue-i18n'
import { tc } from '../i18n'

const { t } = useI18n()

const lessons = READY
const TYPES = ['conj', 'sent', 'blank', 'cue', 'num']
const cfg = reactive({ from: lessons[0], to: Math.min(5, lessons[lessons.length - 1]), types: ['conj', 'sent'], count: 10, hints: true, furi: true })

const stage = ref('setup') // setup | run | done
const msg = ref('')
const queue = ref([]), idx = ref(0), results = ref([])
const answer = ref(''), picked = ref(''), answered = ref(false), good = ref(false)
const inp = ref(null), go = ref(null)

const pick = a => a[Math.floor(Math.random() * a.length)]
const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const fin = s => (s.endsWith('。') ? s : s + '。')
// furigana ligado/desligado (opção da sessão)
const rbx = s => (cfg.furi ? rb(s) : s.replace(/《[^》]*》/g, ''))
const kanjiHtml = (k, r) => (cfg.furi ? furi(k, r) : k)
const sentHtml = x => fin(x.s.c.map(c => kanjiHtml(c[0], c[1])).join(''))
const joinC = (x, k) => x.s.c.map(c => c[k]).join('')
const inRange = () => lessons.filter(n => n >= cfg.from && n <= cfg.to)

// ---------- geração das questões ----------
const OPTS = {
  8: () => ({ groups: ['u', 'ru', 'irr'], forms: ['pol', 'neg', 'plain'], adj: ['i', 'na', 'n'] }),
  9: () => ({ groups: ['u', 'ru', 'irr'], forms: ['dict', 'koto', 'te'] }),
}
function genConj(L) {
  const tp = (CONF[L] || []).flatMap(c => (c.conj ? [].concat(c.conj) : []))
  if (L < 3 || !tp.length) return null
  const kind = pick(tp)
  const o = OPTS[L] ? OPTS[L]() : {}
  if (L === 9) o.forms = [kind]
  return { kind: 'conj', L, ...makeQuestion(L, o, kind) }
}
const genSent = L => { const s = pick(SENTENCES[L]); return { kind: 'sent', L, s, hint: shuffle(s.c) } }
const genNum = L => (hasNum(L) ? { kind: 'num', L, ...makeNum(L) } : null)
const genCue = L => {
  const c = pick(CUES[L] || [])
  return c ? { kind: 'cue', L, cue: c.cue, s: { c: c.c, pt: c.pt, n: t('common.cueShort') } } : null
}
const hira = s => s.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
const genBlank = L => { const b = pick(BLANKS[L]); return { kind: 'blank', L, raw: b[1], opts: shuffle(b[2]), a: b[3], pt: b[4], why: b[5] } }
const keyOf = q => q.kind + q.L + (q.k ? q.k + q.tag[0] : q.kind === 'num' ? q.big : q.s ? q.s.pt : q.raw)

function build() {
  const Ls = inRange(), out = [], seen = new Set()
  for (let guard = 0; out.length < cfg.count && guard < 600; guard++) {
    const kind = pick(cfg.types), L = pick(Ls)
    const q = kind === 'conj' ? genConj(L) : kind === 'sent' ? genSent(L) : kind === 'cue' ? genCue(L) : kind === 'num' ? genNum(L) : genBlank(L)
    if (!q) continue
    const k = keyOf(q)
    if (seen.has(k) && guard < 300) continue // evita repetir enquanto houver variedade
    seen.add(k)
    out.push(q)
  }
  return out
}

// ---------- sessão ----------
const q = computed(() => queue.value[idx.value])
const okCount = computed(() => results.value.filter(r => r.good).length)
const misses = computed(() => results.value.filter(r => !r.good).map(r => r.q))
const byLesson = computed(() => {
  const m = {}
  results.value.forEach(r => { (m[r.q.L] ||= { ok: 0, n: 0 }).n++; if (r.good) m[r.q.L].ok++ })
  return Object.entries(m).map(([L, v]) => ({ L, ...v }))
})
const tags = x => (x.kind === 'conj' ? x.tag : x.kind === 'num' ? [t('common.num'), x.label] : x.kind === 'cue' ? [t('common.cue')] : x.kind === 'sent' ? (cfg.hints ? [t('common.translate'), tc(x.s.n)] : [t('common.translate')]) : [t('common.blank')])
const blankHtml = computed(() =>
  q.value && q.value.kind === 'blank'
    ? rbx(q.value.raw.replace('＿', answered.value ? `<b class="ok">${q.value.a}</b>` : '<span class="blank"></span>'))
    : '')
const missHtml = x => (x.kind === 'conj' ? `${kanjiHtml(x.k, x.r)} → ${x.ans[0]}` : x.kind === 'num' ? `${x.big} → ${x.ans[0]}` : x.kind === 'sent' || x.kind === 'cue' ? `${tc(x.s.pt)} → ${sentHtml(x)}` : rbx(x.raw.replace('＿', x.a)))

function begin(list) {
  msg.value = ''
  if (!list.length) { msg.value = t('mix.empty'); stage.value = 'setup'; return }
  queue.value = list
  idx.value = 0
  results.value = []
  stage.value = 'run'
  resetQ()
}
const start = () => begin(build())
const retry = () => begin(shuffle(misses.value))
function resetQ() {
  answer.value = ''; picked.value = ''; answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}
function finish(g) {
  answered.value = true
  good.value = g
  results.value.push({ q: q.value, good: g })
  nextTick(() => go.value && go.value.focus())
}
function check() {
  const x = q.value
  const cl = s => s.replace(/[\s。、]/g, '')
  const v = flush(answer.value).normalize('NFKC')
  if (!cl(v)) return
  if (x.kind === 'conj') finish(x.ans.includes(v.replace(/\s/g, '')))
  else if (x.kind === 'num') finish(x.ans.includes(hira(v).replace(/\s/g, '')))
  else finish(matchChunks(v, x.s.c))
}
function choose(o) {
  if (answered.value) return
  picked.value = o
  finish(o === q.value.a)
}
function next() {
  if (idx.value + 1 >= queue.value.length) { stage.value = 'done'; return }
  idx.value++
  resetQ()
}
const primary = () => { if (answered.value) next(); else if (q.value.kind !== 'blank') check() }
useEnter(primary, () => stage.value === 'run')

function fix(which) {
  if (cfg.from > cfg.to) { if (which === 'from') cfg.to = cfg.from; else cfg.from = cfg.to }
}
</script>

<template>
  <!-- configuração -->
  <section v-if="stage === 'setup'">
    <h2 class="go" style="margin-top: 0">{{ t('mix.title') }}</h2>
    <p class="lead">{{ t('mix.lead') }}</p>
    <div class="sheet">
      <fieldset class="first">
        <legend>{{ t('mix.lessons') }}</legend>
        <label>{{ t('mix.from') }}
          <select v-model.number="cfg.from" @change="fix('from')"><option v-for="n in lessons" :key="n" :value="n">{{ n }}</option></select>
        </label>
        <label>{{ t('mix.to') }}
          <select v-model.number="cfg.to" @change="fix('to')"><option v-for="n in lessons" :key="n" :value="n">{{ n }}</option></select>
        </label>
        <span class="lead">{{ t('mix.count', { n: inRange().length }) }}</span>
      </fieldset>
      <fieldset>
        <legend>{{ t('mix.typesLegend') }}</legend>
        <label v-for="k in TYPES" :key="k"><input v-model="cfg.types" type="checkbox" :value="k" />{{ t('mix.types.' + k) }}</label>
      </fieldset>
      <fieldset>
        <legend>{{ t('mix.session') }}</legend>
        <label>{{ t('mix.questions') }}
          <select v-model.number="cfg.count"><option :value="10">10</option><option :value="20">20</option><option :value="30">30</option><option :value="50">50</option></select>
        </label>
        <label><input v-model="cfg.hints" type="checkbox" />{{ t('mix.hints') }}</label>
        <label>{{ t('common.furigana') }}
          <select v-model="cfg.furi"><option :value="true">{{ t('common.withFuri') }}</option><option :value="false">{{ t('common.noFuri') }}</option></select>
        </label>
      </fieldset>
      <p v-if="msg" class="bad">{{ msg }}</p>
      <div class="row" style="margin-top: 16px"><button :disabled="!cfg.types.length" @click="start">{{ t('mix.start') }}</button></div>
    </div>
    <p class="hint">{{ t('mix.hint') }}</p>
  </section>

  <!-- treino -->
  <section v-else-if="stage === 'run' && q">
    <button class="back" @click="stage = 'setup'">{{ t('mix.stop') }}</button>
    <div class="stats"><div>{{ t('common.question') }}<b>{{ idx + 1 }}/{{ queue.length }}</b></div><div>{{ t('common.hits') }}<b>{{ okCount }}</b></div></div>
    <div class="bar"><span :style="{ width: (idx / queue.length) * 100 + '%' }"></span></div>

    <div class="sheet">
      <div class="tags"><span class="tag">第{{ q.L }}課</span><span v-for="x in tags(q)" :key="x" class="tag">{{ x }}</span></div>

      <template v-if="q.kind === 'conj'">
        <div class="word" lang="ja" v-html="kanjiHtml(q.k, q.r)"></div>
        <div class="pt">{{ tc(q.pt) }}</div>
      </template>
      <template v-else-if="q.kind === 'num'">
        <div class="pt">{{ t('common.howRead') }}</div>
        <div class="word" lang="ja">{{ q.big }}</div>
      </template>
      <template v-else-if="q.kind === 'cue'">
        <div class="word t" lang="ja" style="font-size: 1.7rem" v-html="rbx(tc(q.cue))"></div>
        <div class="pt">{{ tc(q.s.pt) }}</div>
      </template>
      <template v-else-if="q.kind === 'sent'">
        <div class="word t" style="font-size: 1.7rem">{{ tc(q.s.pt) }}</div>
        <div v-if="cfg.hints" class="choices" lang="ja"><button v-for="h in q.hint" :key="h[0]" class="tl" type="button" disabled v-html="kanjiHtml(h[0], h[1])"></button></div>
      </template>
      <template v-else>
        <div class="bq" lang="ja" v-html="blankHtml"></div>
        <div class="pt">{{ tc(q.pt) }}</div>
        <div class="choices">
          <button v-for="o in q.opts" :key="o" class="tl" :class="{ right: answered && o === q.a, wrong: answered && o === picked && o !== q.a }"
            :disabled="answered" @click="choose(o)" v-html="rbx(o)"></button>
        </div>
      </template>

      <div v-if="q.kind !== 'blank'" class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? t('common.next') : t('common.check') }}</button>
      </div>
      <div v-else class="row"><button v-if="answered" ref="go" @click="primary">{{ t('common.next') }}</button></div>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? t('common.correct') : t('common.almost') }}</div>
          <div v-if="!good && q.kind !== 'blank'" class="rule">{{ t('common.youWrote', { a: answer }) }}</div>
          <template v-if="q.kind === 'conj'"><div>{{ t('common.answer', { a: q.ans[0] }) }}<template v-if="q.ans[0] !== q.ans[1]"> ({{ q.ans[1] }})</template></div><div class="rule">{{ q.rule }}</div></template>
          <template v-else-if="q.kind === 'num'"><div>{{ t('common.answer', { a: q.ans[0] }) }}<template v-if="q.ans.length > 1">{{ t('common.also', { list: q.ans.slice(1).join(', ') }) }}</template></div><div class="rule">{{ q.rule }}</div></template>
          <template v-else-if="q.kind === 'sent' || q.kind === 'cue'"><div lang="ja" style="font-size: 1.4rem" v-html="sentHtml(q)"></div><div class="rule">{{ fin(joinC(q, 1)) }} · {{ tc(q.s.n) }}</div></template>
          <div v-else class="rule">{{ tc(q.why) }}</div>
        </template>
      </div>
    </div>
  </section>

  <!-- resultado -->
  <section v-else-if="stage === 'done'">
    <h2 class="go" style="margin-top: 0">{{ t('mix.result') }}</h2>
    <div class="sheet">
      <div class="word" style="font-size: 3rem">{{ okCount }}/{{ results.length }}</div>
      <div class="pt">{{ t('mix.pct', { n: Math.round((okCount / results.length) * 100) }) }}</div>
      <div style="overflow-x: auto">
        <table class="g">
          <thead><tr><th>{{ t('mix.lesson') }}</th><th>{{ t('common.hits') }}</th></tr></thead>
          <tbody>
            <tr v-for="b in byLesson" :key="b.L"><td>第{{ b.L }}課</td><td>{{ b.ok }}/{{ b.n }}</td></tr>
          </tbody>
        </table>
      </div>
      <template v-if="misses.length">
        <h2 class="go">{{ t('mix.review') }}</h2>
        <ul class="kwords"><li v-for="(m, i) in misses" :key="i"><span class="tag">第{{ m.L }}課</span> <span class="kw" v-html="missHtml(m)"></span></li></ul>
      </template>
    </div>
    <div style="margin-top: 16px">
      <button v-if="misses.length" class="choice" @click="retry"><b>{{ t('mix.retry') }}</b><span>{{ t('mix.retryDesc', { n: misses.length }) }}</span></button>
      <button class="choice" @click="start"><b>{{ t('mix.again') }}</b><span>{{ t('mix.againDesc', { from: cfg.from, to: cfg.to, n: cfg.count }) }}</span></button>
      <button class="choice" @click="stage = 'setup'"><b>{{ t('mix.change') }}</b><span>{{ t('mix.changeDesc') }}</span></button>
    </div>
  </section>
</template>
