<script setup>
import { computed } from 'vue'
import { GRAMMAR } from '../data/grammar'
import { CONF } from '../data/drillConfig'
import { rb } from '../utils/ruby'

const props = defineProps({ lesson: Number, tab: [Number, String] })
const emit = defineEmits(['update:tab', 'go'])

const topics = computed(() => GRAMMAR[props.lesson])
const isAll = computed(() => props.tab === 'all')
const shown = computed(() => (isAll.value ? topics.value : [topics.value[props.tab]]))
const goto = n => { emit('update:tab', n); window.scrollTo(0, 0) }

const drillDesc = computed(() => {
  if (isAll.value) return props.lesson > 2 ? 'Conjugação e completar a lacuna, com todos os tópicos' : 'Completar a lacuna, com todos os tópicos'
  return CONF[props.lesson][props.tab].conj && props.lesson > 2 ? 'Só este tópico: conjugação e completar a lacuna' : 'Só este tópico: completar a lacuna'
})
const buildDesc = computed(() => 'Monte com blocos ou escreva em kana' + (isAll.value ? '' : ' · só este tópico'))
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">Resumo de gramática</h2>
    <nav class="tabs" role="tablist">
      <button v-for="(t, i) in topics" :key="i" role="tab" :aria-selected="tab === i" :class="{ on: tab === i }" :title="t[0]" @click="goto(i)">{{ t[0] }}</button>
      <button role="tab" :aria-selected="isAll" :class="{ on: isAll }" @click="goto('all')">Tudo</button>
    </nav>

    <article v-for="t in shown" :key="t[0]" class="topic">
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

    <div v-if="!isAll" class="pager">
      <button v-if="tab > 0" class="back" @click="goto(tab - 1)">← Tópico anterior</button><span v-else></span>
      <button v-if="tab < topics.length - 1" class="back" @click="goto(tab + 1)">Próximo tópico →</button>
    </div>

    <h2 class="go">{{ isAll ? 'Hora de praticar (lição toda)' : `Hora de praticar (tópico ${tab + 1})` }}</h2>
    <button class="choice" @click="$emit('go', 'drill')"><b>Treinar a gramática</b><span>{{ drillDesc }}</span></button>
    <button class="choice" @click="$emit('go', 'build')"><b>Criar frases</b><span>{{ buildDesc }}</span></button>
  </section>
</template>
