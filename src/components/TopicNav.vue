<script setup>
import { computed } from 'vue'
import { GRAMMAR } from '../data/grammar'

const props = defineProps({ lesson: Number, tab: [Number, String] })
const emit = defineEmits(['update:tab'])
const topics = computed(() => GRAMMAR[props.lesson] || [])
const pick = n => { emit('update:tab', n); window.scrollTo(0, 0) }
</script>

<template>
  <nav class="topicnav" aria-label="Tópicos da lição">
    <h2>Tópicos</h2>
    <button v-for="(t, i) in topics" :key="i" :class="{ on: tab === i }" :aria-current="tab === i" @click="pick(i)">{{ t[0] }}</button>
    <button :class="{ on: tab === 'all' }" :aria-current="tab === 'all'" @click="pick('all')">Tudo</button>
  </nav>
</template>
