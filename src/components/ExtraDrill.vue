<script setup>
// Treinos extras do caderno: números e contadores (kind = 'num') e palavras-chave → frase (kind = 'cue')
import { ref, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { CUES } from '../data/cues'
import { makeNum } from '../utils/numbers'
import { flush } from '../utils/kana'
import { matchChunks } from '../utils/answer'
import { rb, furi } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'
import { useI18n } from 'vue-i18n'
import { tc } from '../i18n'

const props = defineProps({ lesson: Number, topic: { type: Number, default: null }, kind: String })
defineEmits(['back'])
const { t } = useI18n()

const pool = props.kind === 'cue' ? (CUES[props.lesson] || []).filter(c => props.topic == null || c.t === props.topic) : []
const hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
const pick = a => a[Math.floor(Math.random() * a.length)]
const fin = s => (s.endsWith('。') ? s : s + '。')

const q = ref(null), answer = ref(''), answered = ref(false), good = ref(false)
const streak = ref(0), ok = ref(0), total = ref(0)
const furiOn = ref(true)
const inp = ref(null), go = ref(null)
let last = null

function make() {
  if (props.kind === 'num') return { ...makeNum(props.lesson, props.topic) }
  let c
  do { c = pick(pool) } while (pool.length > 1 && c === last)
  last = c
  return { cue: c.cue, pt: c.pt, c: c.c }
}
function next() {
  q.value = make()
  answer.value = ''
  answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}
function check() {
  const v = flush(answer.value).normalize('NFKC')
  if (!v.replace(/[\s。、]/g, '')) return
  const x = q.value
  const g = props.kind === 'num' ? x.ans.includes(hira(v).replace(/\s/g, '')) : matchChunks(v, x.c)
  answered.value = true
  good.value = g
  total.value++
  if (g) { ok.value++; streak.value++ } else streak.value = 0
  nextTick(() => go.value && go.value.focus())
}
const primary = () => { if (answered.value) next(); else check() }
useEnter(primary)
const sentHtml = x => fin(x.c.map(k => (furiOn.value ? furi(k[0], k[1]) : k[0])).join(''))
const cueHtml = s => (furiOn.value ? rb(s) : s.replace(/《[^》]*》/g, ''))
next()
</script>

<template>
  <section>
    <button class="back" @click="$emit('back')">{{ t('common.backLesson') }}</button>
    <div class="stats">
      <div>{{ t('common.streak') }}<b>{{ streak }}</b></div>
      <div>{{ t('common.hits') }}<b>{{ ok }}/{{ total }}</b></div>
    </div>

    <div v-if="q" class="sheet">
      <div class="tags">
        <span class="tag">{{ t(kind === 'num' ? 'common.num' : 'common.cue') }}</span>
        <span v-if="kind === 'num'" class="tag">{{ q.label }}</span>
      </div>

      <template v-if="kind === 'num'">
        <div class="pt">{{ t('common.howRead') }}</div>
        <div class="word" lang="ja">{{ q.big }}</div>
      </template>
      <template v-else>
        <div class="pt">{{ t('extra.cuePrompt') }}</div>
        <div class="word t" lang="ja" style="font-size: 1.7rem" v-html="cueHtml(tc(q.cue))"></div>
        <div class="pt">{{ tc(q.pt) }}</div>
      </template>

      <div class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? t('common.next') : t('common.check') }}</button>
      </div>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? t('common.correct') : t('common.almost') }}</div>
          <div v-if="!good" class="rule">{{ t('common.youWrote', { a: answer }) }}</div>
          <template v-if="kind === 'num'">
            <div>{{ t('common.answer', { a: q.ans[0] }) }}<template v-if="q.ans.length > 1">{{ t('common.also', { list: q.ans.slice(1).join(', ') }) }}</template></div>
            <div class="rule">{{ q.rule }}</div>
          </template>
          <div v-else lang="ja" style="font-size: 1.4rem" v-html="sentHtml(q)"></div>
        </template>
      </div>
    </div>

    <details>
      <summary>{{ t('common.options') }}</summary>
      <fieldset v-if="kind === 'cue'">
        <legend>{{ t('common.show') }}</legend>
        <label>{{ t('common.furigana') }}
          <select v-model="furiOn"><option :value="true">{{ t('common.withFuri') }}</option><option :value="false">{{ t('common.noFuri') }}</option></select>
        </label>
      </fieldset>
      <p class="hint">{{ t('extra.hint') }}<template v-if="kind === 'cue'">{{ t('extra.hintCue') }}</template></p>
    </details>
  </section>
</template>
