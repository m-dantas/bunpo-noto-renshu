<script setup>
import { GRAMMAR } from '../data/grammar'
import { rb } from '../utils/ruby'
defineProps({ lesson: Number })
defineEmits(['go'])
const DESC = {
  8: 'Conjugação: Vています e a forma て',
  9: 'Forma do dicionário, ことができます e forma て',
}
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">Resumo de gramática</h2>
    <p class="lead">Os 4 tópicos da lição. No fim da página, escolha como praticar.</p>
    <article v-for="t in GRAMMAR[lesson]" :key="t[0]" class="topic">
      <h2>{{ t[0] }}</h2>
      <template v-for="(b, i) in t.slice(1)" :key="i">
        <p v-if="b[0] === 'p'" v-html="rb(b[1])"></p>
        <p v-else-if="b[0] === 'pat'"><span class="pat" v-html="rb(b[1])"></span></p>
        <div v-else-if="b[0] === 'ex'" class="ex">
          <p class="jp" v-html="rb(b[1])"></p>
          <p class="tr">{{ b[2] }}</p>
        </div>
        <div v-else style="overflow-x: auto" v-html="rb(b[1])"></div>
      </template>
    </article>

    <h2 class="go">Hora de praticar</h2>
    <button class="choice" @click="$emit('go', 'drill')">
      <b>Treinar a gramática</b><span>{{ DESC[lesson] }}</span>
    </button>
    <button class="choice" @click="$emit('go', 'build')">
      <b>Criar frases</b><span>Monte com blocos ou escreva a frase em kana</span>
    </button>
  </section>
</template>
