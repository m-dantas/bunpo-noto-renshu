<script setup>
import { LESSONS, READY } from '../data/lessons'
defineProps({ open: Boolean, current: Number })
defineEmits(['select'])
</script>

<template>
  <aside :class="{ open }">
    <h2>Lições</h2>
    <ul id="lessons">
      <li v-for="(l, i) in LESSONS" :key="i">
        <button :disabled="!READY.includes(i + 1)" :class="{ on: current === i + 1 }" @click="$emit('select', i + 1)">
          <span class="n">第{{ i + 1 }}課</span>{{ l.title }}
          <small>{{ READY.includes(i + 1) ? l.pt : 'em breve' }}</small>
        </button>
      </li>
    </ul>
  </aside>
</template>
