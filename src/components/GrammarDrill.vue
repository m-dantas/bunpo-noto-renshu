<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { makeQuestion } from '../utils/questions'
import { flush } from '../utils/kana'
import { rb } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'
import { BLANKS } from '../data/blanks'
import { CONF } from '../data/drillConfig'

const props = defineProps({ lesson: Number, topic: { type: Number, default: null } })
defineEmits(['back'])

const GROUPS = [['u', 'う-verbs'], ['ru', 'る-verbs'], ['irr', 'Irregulares']]
const FORMS = {
  8: [['pol', 'ています'], ['neg', 'ていません'], ['plain', 'ている']],
  9: [['dict', '辞書形'], ['koto', 'ことができます'], ['te', 'て形']],
}
const ADJ = [['i', 'イA → くて'], ['na', 'ナA → で'], ['n', 'N → で']]

// O que este treino mistura: conjugação (conf.conj) e/ou completar a lacuna
const conf = props.topic == null ? { conj: true, blank: 1 } : CONF[props.lesson][props.topic]
const only = typeof conf.conj === 'string' ? conf.conj : null
const hasConj = !!conf.conj && props.lesson > 2 // lições 1 e 2 só têm lacunas
const blanks = BLANKS[props.lesson].filter(b => props.topic == null || b[0] === props.topic)
const advanced = props.lesson === 8 || props.lesson === 9
const showVerb = advanced && hasConj && !(props.lesson === 8 && only === 'a')
const showForms = showVerb && !(props.lesson === 9 && only)
const showAdj = hasConj && props.lesson === 8 && only !== 'v'

const opts = reactive(
  props.lesson === 9
    ? { groups: ['u', 'ru', 'irr'], forms: only ? [only] : ['dict', 'koto'] }
    : props.lesson === 8
      ? { groups: ['u', 'ru', 'irr'], forms: ['pol'], adj: ['i', 'na', 'n'] }
      : {}
)
const q = ref(null), answer = ref(''), picked = ref(''), answered = ref(false), good = ref(false)
const streak = ref(0), ok = ref(0), total = ref(0), max = ref(0)
const furi = ref('always'), tr = ref('always')
const inp = ref(null), go = ref(null)
try { max.value = +localStorage.getItem('l8max') || 0 } catch (e) { /* sem storage */ }

const showFuri = computed(() => furi.value === 'always' || answered.value)
const showTr = computed(() => tr.value === 'always' || answered.value)
const blankHtml = computed(() =>
  q.value && q.value.kind === 'blank'
    ? rb(q.value.raw.replace('＿', answered.value ? `<b class="ok">${q.value.a}</b>` : '<span class="blank"></span>'))
    : ''
)

const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
let lastBlank = null

function next() {
  answered.value = false
  picked.value = ''
  answer.value = ''
  if (!hasConj || (blanks.length && Math.random() < 0.4)) {
    let b
    do { b = blanks[Math.floor(Math.random() * blanks.length)] } while (b === lastBlank && blanks.length > 1)
    lastBlank = b
    q.value = { kind: 'blank', raw: b[1], opts: shuffle(b[2]), a: b[3], pt: b[4], why: b[5] }
  } else {
    q.value = { kind: 'conj', ...makeQuestion(props.lesson, opts, only) }
  }
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
      try { localStorage.setItem('l8max', max.value) } catch (e) { /* sem storage */ }
    }
  } else streak.value = 0
  nextTick(() => go.value && go.value.focus())
}

function check() {
  const v = flush(answer.value).normalize('NFKC').replace(/\s/g, '')
  if (v) tally(q.value.ans.includes(v))
}
function choose(o) {
  if (answered.value) return
  picked.value = o
  tally(o === q.value.a)
}

const primary = () => {
  if (answered.value) next()
  else if (q.value.kind === 'conj') check()
}
useEnter(primary)

// Cada grupo de opções precisa ter ao menos um item marcado
Object.keys(opts).forEach(k =>
  watch(() => opts[k].slice(), (n, o) => { if (!n.length) opts[k] = o; else next() })
)
next()
</script>

<template>
  <section>
    <button class="back" @click="$emit('back')">← Voltar à lição</button>
    <div class="stats">
      <div>Sequência<b>{{ streak }}</b></div>
      <div>Recorde<b>{{ max }}</b></div>
      <div>Acertos<b>{{ ok }}/{{ total }}</b></div>
    </div>

    <div v-if="q" class="sheet">
      <!-- completar a lacuna -->
      <template v-if="q.kind === 'blank'">
        <div class="tags"><span class="tag">Completar a lacuna</span></div>
        <div class="bq" v-html="blankHtml"></div>
        <div class="pt">{{ showTr ? q.pt : '' }}</div>
        <div class="choices">
          <button v-for="o in q.opts" :key="o" class="tl" :class="{ right: answered && o === q.a, wrong: answered && o === picked && o !== q.a }"
            :disabled="answered" @click="choose(o)" v-html="rb(o)"></button>
        </div>
        <div class="fb" aria-live="polite">
          <template v-if="answered">
            <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : 'Quase.' }}</div>
            <div class="rule">{{ q.why }}</div>
          </template>
        </div>
        <div class="row"><button v-if="answered" ref="go" @click="primary">Próxima</button></div>
      </template>

      <!-- conjugação -->
      <template v-else>
        <div class="tags"><span v-for="t in q.tag" :key="t" class="tag">{{ t }}</span></div>
        <div class="word">
          <ruby v-if="showFuri && q.k !== q.r">{{ q.k }}<rt>{{ q.r }}</rt></ruby>
          <template v-else>{{ q.k }}</template>
        </div>
        <div class="pt">{{ showTr ? q.pt : '' }}</div>
        <div class="row">
          <KanaInput ref="inp" v-model="answer" :disabled="answered" />
          <button ref="go" @click="primary">{{ answered ? 'Próxima' : 'Verificar' }}</button>
        </div>
        <div class="fb" aria-live="polite">
          <template v-if="answered">
            <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : 'Quase. Resposta: ' + q.ans[0] }}</div>
            <div v-if="!good" class="rule">Você escreveu: {{ answer }}</div>
            <div>{{ q.ans[0] === q.ans[1] ? '' : q.ans[1] }}</div>
            <div class="rule">{{ q.rule }}</div>
          </template>
        </div>
      </template>
    </div>

    <details>
      <summary>Opções</summary>
      <fieldset>
        <legend>Mostrar</legend>
        <label>Furigana
          <select v-model="furi"><option value="always">sempre</option><option value="after">só depois de responder</option></select>
        </label>
        <label>Tradução
          <select v-model="tr"><option value="always">sempre</option><option value="after">só depois de responder</option></select>
        </label>
      </fieldset>
      <fieldset v-if="showVerb">
        <legend>{{ lesson === 9 ? 'Verbos (mostrados na forma ます)' : 'Verbos → Vています' }}</legend>
        <label v-for="g in GROUPS" :key="g[0]"><input v-model="opts.groups" type="checkbox" :value="g[0]" />{{ g[1] }}</label>
      </fieldset>
      <fieldset v-if="showForms">
        <legend>{{ lesson === 9 ? 'Formas pedidas' : 'Formas do verbo' }}</legend>
        <label v-for="f in FORMS[lesson]" :key="f[0]"><input v-model="opts.forms" type="checkbox" :value="f[0]" />{{ f[1] }}</label>
      </fieldset>
      <fieldset v-if="showAdj">
        <legend>Ligar frases com て</legend>
        <label v-for="a in ADJ" :key="a[0]"><input v-model="opts.adj" type="checkbox" :value="a[0]" />{{ a[1] }}</label>
      </fieldset>
      <p v-if="hasConj" class="hint">Nas conjugações, digite em romaji: minúsculas viram ひらがな e, com Caps Lock ligado, viram カタカナ (masu → ます, nn → ん, xtu → っ, - → ー). O IME japonês também funciona.</p>
    </details>
  </section>
</template>
