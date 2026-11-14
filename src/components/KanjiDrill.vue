<script setup>
import { ref, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { KCHAPTERS, ALL_KANJI } from '../data/kanji'
import { flush } from '../utils/kana'
import { rb } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'

const props = defineProps({ chapter: Number, section: { type: Number, default: null }, mode: { type: String, default: 'reading' } })
defineEmits(['back'])

const ch = KCHAPTERS.find(c => c.n === props.chapter)
const pool = (props.section == null ? ch.sections : [ch.sections[props.section]]).flatMap(s => s.k)
const MODES = [['reading', 'Kanji → leitura'], ['word', 'Ler palavras'], ['kmean', 'Kanji → significado'], ['mkanji', 'Significado → kanji']]

const hira = s => s.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
const pick = a => a[Math.floor(Math.random() * a.length)]
const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const plain = w => w.split('=')[0].replace(/[\u4e00-\u9fff\u3005]+《([^》]+)》/g, '$1')
const shownWord = w => w.split('=')[0].replace(/《[^》]*》/g, '')

const mode = ref(props.mode)
const q = ref(null), answer = ref(''), picked = ref(''), answered = ref(false), good = ref(false)
const streak = ref(0), ok = ref(0), total = ref(0), max = ref(0)
const inp = ref(null), go = ref(null)
try { max.value = +localStorage.getItem('kmax') || 0 } catch (e) { /* sem storage */ }

function choices(e, key) {
  const others = ALL_KANJI.filter(x => x.k !== e.k && x.m !== e.m)
  return shuffle([e, ...shuffle(others).slice(0, 3)]).map(x => x[key])
}

function make() {
  const m = mode.value
  const e = pick(m === 'word' ? pool.filter(x => x.words.length) : pool)
  if (m === 'word') {
    const w = pick(e.words)
    return { type: 'type', label: 'Qual é a leitura da palavra?', big: shownWord(w), raw: w, pt: w.split('=')[1], ans: [hira(plain(w))], e }
  }
  if (m === 'reading') {
    return { type: 'type', label: 'Digite uma leitura (kun ou on)', big: e.k, pt: e.m, ans: [...e.kun, ...e.on].map(hira), e }
  }
  if (m === 'kmean') return { type: 'choice', label: 'O que significa?', big: e.k, pt: '', opts: choices(e, 'm'), a: e.m, e }
  return { type: 'choice', label: 'Qual kanji é este?', big: e.m, small: true, pt: '', opts: choices(e, 'k'), a: e.k, e }
}

function next() {
  q.value = make()
  answer.value = ''
  picked.value = ''
  answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}

function tally(g) {
  answered.value = true
  total.value++
  good.value = g
  if (g) {
    ok.value++
    streak.value++
    if (streak.value > max.value) {
      max.value = streak.value
      try { localStorage.setItem('kmax', max.value) } catch (e) { /* sem storage */ }
    }
  } else streak.value = 0
  nextTick(() => go.value && go.value.focus())
}

function check() {
  const v = hira(flush(answer.value).normalize('NFKC')).replace(/\s/g, '')
  if (v) tally(q.value.ans.includes(v))
}
function choose(o) {
  if (answered.value) return
  picked.value = o
  tally(o === q.value.a)
}
const primary = () => { if (answered.value) next(); else if (q.value.type === 'type') check() }
useEnter(primary)
const setMode = m => { mode.value = m; next() }
next()
</script>

<template>
  <section>
    <button class="back" @click="$emit('back')">← Voltar ao capítulo</button>
    <div class="stats">
      <div>Sequência<b>{{ streak }}</b></div>
      <div>Recorde<b>{{ max }}</b></div>
      <div>Acertos<b>{{ ok }}/{{ total }}</b></div>
    </div>
    <div class="modes" role="group" aria-label="Tipo de treino">
      <button v-for="m in MODES" :key="m[0]" type="button" :class="{ on: mode === m[0] }" @click="setMode(m[0])">{{ m[1] }}</button>
    </div>

    <div v-if="q" class="sheet">
      <div class="tags"><span class="tag">{{ q.label }}</span></div>
      <div class="word" :class="{ t: q.small }" v-html="answered && q.raw ? rb(q.raw) : q.big"></div>
      <div class="pt">{{ q.pt }}</div>

      <div v-if="q.type === 'type'" class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? 'Próxima' : 'Verificar' }}</button>
      </div>
      <template v-else>
        <div class="choices">
          <button v-for="o in q.opts" :key="o" class="tl" :class="{ right: answered && o === q.a, wrong: answered && o === picked && o !== q.a }"
            :disabled="answered" @click="choose(o)">{{ o }}</button>
        </div>
        <div class="row"><button v-if="answered" ref="go" @click="primary">Próxima</button></div>
      </template>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : q.type === 'type' ? 'Quase. Resposta: ' + q.ans[0] : 'Quase.' }}</div>
          <div class="rule">{{ q.e.k }} · {{ q.e.m }}<template v-if="q.e.kun.length"> · kun: {{ q.e.kun.join('・') }}</template><template v-if="q.e.on.length"> · on: {{ q.e.on.join('・') }}</template></div>
        </template>
      </div>
    </div>
    <p class="hint">Nas respostas digitadas, use romaji (masu → ます). As leituras on podem ser escritas em hiragana ou em katakana (Caps Lock).</p>
  </section>
</template>
