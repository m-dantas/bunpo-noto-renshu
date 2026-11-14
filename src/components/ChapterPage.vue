<script setup>
import { computed } from 'vue'
import { KCHAPTERS } from '../data/kanji'
import { rb } from '../utils/ruby'

const props = defineProps({ chapter: Number, tab: [Number, String] })
const emit = defineEmits(['update:tab', 'go'])

const ch = computed(() => KCHAPTERS.find(c => c.n === props.chapter))
const multi = computed(() => ch.value.sections.length > 1)
const isAll = computed(() => !multi.value || props.tab === 'all')
const shown = computed(() => (isAll.value ? ch.value.sections : [ch.value.sections[props.tab]]))
const goto = n => { emit('update:tab', n); window.scrollTo(0, 0) }
const word = w => rb(w.split('=')[0])
const mean = w => w.split('=')[1]
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">Kanji do capítulo</h2>
    <nav v-if="multi" class="tabs" role="tablist">
      <button v-for="(s, i) in ch.sections" :key="i" role="tab" :aria-selected="tab === i" :class="{ on: tab === i }" :title="s.t" @click="goto(i)">{{ s.t }}</button>
      <button role="tab" :aria-selected="isAll" :class="{ on: isAll }" @click="goto('all')">Tudo</button>
    </nav>

    <template v-for="s in shown" :key="s.t">
      <h2 v-if="multi" class="go" style="margin-top: 8px">{{ s.t }}</h2>
      <article v-for="e in s.k" :key="e.k" class="kcard">
        <div class="kbig">{{ e.k }}</div>
        <div class="kinfo">
          <div class="kmean">{{ e.m }}</div>
          <div class="kread">
            <span v-if="e.kun.length"><small>kun</small> {{ e.kun.join('・') }}</span>
            <span v-if="e.on.length"><small>on</small> {{ e.on.join('・') }}</span>
          </div>
          <ul class="kwords">
            <li v-for="w in e.words" :key="w"><span class="kw" v-html="word(w)"></span> <span class="tr">{{ mean(w) }}</span></li>
          </ul>
        </div>
      </article>
    </template>

    <div v-if="multi && !isAll" class="pager">
      <button v-if="tab > 0" class="back" @click="goto(tab - 1)">← Seção anterior</button><span v-else></span>
      <button v-if="tab < ch.sections.length - 1" class="back" @click="goto(tab + 1)">Próxima seção →</button>
    </div>

    <h2 class="go">{{ isAll ? 'Hora de praticar (capítulo todo)' : `Hora de praticar (seção ${tab + 1})` }}</h2>
    <button class="choice" @click="$emit('go', 'kdrill', 'reading')"><b>Treinar kanji</b><span>Leitura, significado e kanji pelo significado</span></button>
    <button class="choice" @click="$emit('go', 'kdrill', 'word')"><b>Ler palavras</b><span>Digite a leitura de palavras com esses kanji</span></button>
  </section>
</template>
