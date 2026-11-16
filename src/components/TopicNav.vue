<script setup>
defineProps({ labels: Array, tab: [Number, String], title: { type: String, default: 'Partes' } })
const emit = defineEmits(['update:tab'])
const pick = n => { emit('update:tab', n); window.scrollTo(0, 0) }
</script>

<template>
  <nav class="topicnav" :aria-label="title">
    <h2>{{ title }}</h2>
    <button v-for="(t, i) in labels" :key="i" :class="{ on: tab === i }" :aria-current="tab === i" @click="pick(i)">{{ t }}</button>
    <button :class="{ on: tab === 'all' }" :aria-current="tab === 'all'" @click="pick('all')">Tudo</button>
  </nav>
</template>
