<script setup>
import { ref, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { SENTENCES } from '../data/sentences'
import { flush } from '../utils/kana'
import { matchChunks } from '../utils/answer'
import { useEnter } from '../utils/useEnter'
import { furi } from '../utils/ruby'

const props = defineProps({ lesson: Number, topic: { type: Number, default: null } })
defineEmits(['back'])

const pool = SENTENCES[props.lesson].filter(s => props.topic == null || s.t === props.topic)
const typing = ref(false)
const q = ref(null), picked = ref([]), bank = ref([]), typed = ref('')
const answered = ref(false), good = ref(false), ok = ref(0), total = ref(0)
const inp = ref(null), go = ref(null)

const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const join = k => q.value.c.map(c => c[k]).join('')
const fin = s => (s.endsWith('。') ? s : s + '。')
const tile = i => {
  const [k, r] = q.value.c[i]
  return furi(k, r)
}

function next() {
  const prev = q.value
  do { q.value = pool[Math.floor(Math.random() * pool.length)] } while (pool.length > 1 && q.value === prev)
  answered.value = false
  picked.value = []
  typed.value = ''
  bank.value = shuffle(q.value.c.map((_, i) => i))
  nextTick(() => typing.value && inp.value && inp.value.focus())
}

// Modo blocos: toque para mover entre o banco e a frase
function tap(i) {
  if (answered.value || typing.value) return
  if (bank.value.includes(i)) {
    bank.value = bank.value.filter(x => x !== i)
    picked.value = [...picked.value, i]
  } else {
    picked.value = picked.value.filter(x => x !== i)
    bank.value = [...bank.value, i]
  }
}

function check() {
  if (typing.value) {
    // aceita kanji ou kana; ignora espaços e pontuação (。、)
    const cl = s => s.replace(/[\s。、]/g, '')
    const v = cl(flush(typed.value).normalize('NFKC'))
    if (!v) return
    good.value = matchChunks(typed.value, q.value.c)
  } else {
    if (picked.value.length < q.value.c.length) return
    good.value = picked.value.every((x, i) => x === i)
    picked.value = q.value.c.map((_, i) => i) // mostra a ordem certa
    bank.value = []
  }
  answered.value = true
  total.value++
  if (good.value) ok.value++
  nextTick(() => go.value && go.value.focus())
}

const primary = () => (answered.value ? next() : check())
useEnter(primary)
const setMode = t => { typing.value = t; next() }
next()
</script>

<template>
  <section>
    <button class="back" @click="$emit('back')">← Voltar à lição</button>
    <div class="stats"><div>Acertos<b>{{ ok }}/{{ total }}</b></div></div>
    <div class="seg" role="group" aria-label="Modo de resposta">
      <button type="button" :class="{ on: !typing }" @click="setMode(false)">Montar com blocos</button>
      <button type="button" :class="{ on: typing }" @click="setMode(true)">Escrever</button>
    </div>

    <div v-if="q" class="sheet">
      <div class="pt" style="font-size: 1.1rem">{{ q.pt }}</div>

      <div v-if="!typing" class="built">
        <span v-if="!picked.length" class="ph">Toque nos blocos para montar a frase</span>
        <button v-for="i in picked" :key="i" class="tl" @click="tap(i)" v-html="tile(i)"></button>
      </div>
      <template v-else>
        <KanaInput ref="inp" v-model="typed" :disabled="answered" />
        <div class="cap">Palavras para usar, fora de ordem. Digite em romaji (Caps Lock liga o katakana).</div>
      </template>

      <div class="bank" :class="{ ref: typing }">
        <button v-for="i in bank" :key="i" class="tl" @click="tap(i)" v-html="tile(i)"></button>
      </div>

      <div class="row"><button ref="go" @click="primary">{{ answered ? 'Próxima' : 'Verificar' }}</button></div>
      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : 'Quase. Esta é a ordem certa:' }}</div>
          <div v-if="!good && typing" class="rule">Você escreveu: {{ typed }}</div>
          <div>{{ fin(join(0)) }}</div>
          <div class="rule">{{ fin(join(1)) }} · {{ q.n }}</div>
        </template>
      </div>
    </div>
  </section>
</template>
