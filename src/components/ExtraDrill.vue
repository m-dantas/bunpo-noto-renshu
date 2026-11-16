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

const props = defineProps({ lesson: Number, topic: { type: Number, default: null }, kind: String })
defineEmits(['back'])

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
    <button class="back" @click="$emit('back')">← Voltar à lição</button>
    <div class="stats">
      <div>Sequência<b>{{ streak }}</b></div>
      <div>Acertos<b>{{ ok }}/{{ total }}</b></div>
    </div>

    <div v-if="q" class="sheet">
      <div class="tags">
        <span class="tag">{{ kind === 'num' ? 'Números e contadores' : 'Palavras-chave → frase' }}</span>
        <span v-if="kind === 'num'" class="tag">{{ q.label }}</span>
      </div>

      <template v-if="kind === 'num'">
        <div class="pt">Como se lê?</div>
        <div class="word">{{ q.big }}</div>
      </template>
      <template v-else>
        <div class="pt">Escreva a frase completa com estas palavras (ajuste as partículas e as formas):</div>
        <div class="word t" style="font-size: 1.7rem" v-html="cueHtml(q.cue)"></div>
        <div class="pt">{{ q.pt }}</div>
      </template>

      <div class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? 'Próxima' : 'Verificar' }}</button>
      </div>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : 'Quase.' }}</div>
          <div v-if="!good" class="rule">Você escreveu: {{ answer }}</div>
          <template v-if="kind === 'num'">
            <div>Resposta: {{ q.ans[0] }}<template v-if="q.ans.length > 1"> (também: {{ q.ans.slice(1).join(', ') }})</template></div>
            <div class="rule">{{ q.rule }}</div>
          </template>
          <div v-else style="font-size: 1.4rem" v-html="sentHtml(q)"></div>
        </template>
      </div>
    </div>

    <details>
      <summary>Opções</summary>
      <fieldset v-if="kind === 'cue'">
        <legend>Mostrar</legend>
        <label>Furigana
          <select v-model="furiOn"><option :value="true">Com furigana</option><option :value="false">Sem furigana</option></select>
        </label>
      </fieldset>
      <p class="hint">Digite em romaji: minúsculas viram ひらがな e, com Caps Lock ligado, viram カタカナ. Nos números, escreva a leitura em kana (ex.: san-ji → さんじ).<template v-if="kind === 'cue'"> Cada bloco vale em kanji ou em kana, e algarismos são aceitos nos números.</template></p>
    </details>
  </section>
</template>
