<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { makeQuestion } from '../utils/questions'
import { flush } from '../utils/kana'
import { useEnter } from '../utils/useEnter'

const props = defineProps({ lesson: Number })
defineEmits(['back'])

const GROUPS = [['u', 'う-verbs'], ['ru', 'る-verbs'], ['irr', 'Irregulares']]
const FORMS = {
  8: [['pol', 'ています'], ['neg', 'ていません'], ['plain', 'ている']],
  9: [['dict', '辞書形'], ['koto', 'ことができます'], ['te', 'て形']],
}
const ADJ = [['i', 'イA → くて'], ['na', 'ナA → で'], ['n', 'N → で']]

const opts = reactive(
  props.lesson === 9
    ? { groups: ['u', 'ru', 'irr'], forms: ['dict', 'koto'] }
    : { groups: ['u', 'ru', 'irr'], forms: ['pol'], adj: ['i', 'na', 'n'] }
)
const q = ref(null), answer = ref(''), answered = ref(false), good = ref(false)
const streak = ref(0), ok = ref(0), total = ref(0), max = ref(0)
const furi = ref('always'), tr = ref('always')
const inp = ref(null), go = ref(null)
try { max.value = +localStorage.getItem('l8max') || 0 } catch (e) { /* sem storage */ }

const showFuri = computed(() => furi.value === 'always' || answered.value)
const showTr = computed(() => tr.value === 'always' || answered.value)

function next() {
  q.value = makeQuestion(props.lesson, opts)
  answer.value = ''
  answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}

function check() {
  const v = flush(answer.value).normalize('NFKC').replace(/\s/g, '')
  if (!v) return
  answered.value = true
  total.value++
  good.value = q.value.ans.includes(v)
  if (good.value) {
    ok.value++
    streak.value++
    if (streak.value > max.value) {
      max.value = streak.value
      try { localStorage.setItem('l8max', max.value) } catch (e) { /* sem storage */ }
    }
  } else streak.value = 0
  nextTick(() => go.value && go.value.focus())
}

const primary = () => (answered.value ? next() : check())
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
          <div>{{ q.ans[0] === q.ans[1] ? '' : q.ans[1] }}</div>
          <div class="rule">{{ q.rule }}</div>
        </template>
      </div>
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
      <fieldset>
        <legend>{{ lesson === 9 ? 'Verbos (mostrados na forma ます)' : 'Verbos → Vています' }}</legend>
        <label v-for="g in GROUPS" :key="g[0]"><input v-model="opts.groups" type="checkbox" :value="g[0]" />{{ g[1] }}</label>
      </fieldset>
      <fieldset>
        <legend>{{ lesson === 9 ? 'Formas pedidas' : 'Formas do verbo' }}</legend>
        <label v-for="f in FORMS[lesson]" :key="f[0]"><input v-model="opts.forms" type="checkbox" :value="f[0]" />{{ f[1] }}</label>
      </fieldset>
      <fieldset v-if="lesson === 8">
        <legend>Ligar frases com て</legend>
        <label v-for="a in ADJ" :key="a[0]"><input v-model="opts.adj" type="checkbox" :value="a[0]" />{{ a[1] }}</label>
      </fieldset>
      <p class="hint">Digite em romaji: minúsculas viram ひらがな e, com Caps Lock ligado, viram カタカナ (masu → ます, nn → ん, xtu → っ, - → ー). O IME japonês também funciona.</p>
    </details>
  </section>
</template>
