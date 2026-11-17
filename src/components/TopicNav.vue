<script setup>
import { useI18n } from 'vue-i18n'

defineProps({ labels: Array, tab: [Number, String], title: { type: String, default: '' } })
const emit = defineEmits(['update:tab'])
const { t } = useI18n()
const pick = n => { emit('update:tab', n); window.scrollTo(0, 0) }
</script>

<template>
  <nav class="topicnav" :aria-label="title || t('app.parts')">
    <h2>{{ title || t('app.parts') }}</h2>
    <button v-for="(x, i) in labels" :key="i" :class="{ on: tab === i }" :aria-current="tab === i" @click="pick(i)">{{ x }}</button>
    <button :class="{ on: tab === 'all' }" :aria-current="tab === 'all'" @click="pick('all')">{{ t('common.all') }}</button>
  </nav>
</template>
