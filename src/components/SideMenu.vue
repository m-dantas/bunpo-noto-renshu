<script setup>
defineProps({ open: Boolean, current: Number, book: String, items: Array })
defineEmits(['select', 'book'])
</script>

<template>
  <aside :class="{ open }">
    <div class="seg" role="group" aria-label="Livro">
      <button type="button" :class="{ on: book === 'bunpo' }" @click="$emit('book', 'bunpo')">文法</button>
      <button type="button" :class="{ on: book === 'kanji' }" @click="$emit('book', 'kanji')">漢字</button>
    </div>
    <h2>{{ book === 'bunpo' ? 'Lições' : 'Capítulos' }}</h2>
    <ul id="lessons">
      <li v-for="it in items" :key="it.key">
        <button :disabled="!it.ready" :class="{ on: current === it.key }" @click="$emit('select', it.key)">
          <span class="n">{{ it.label }}</span>{{ it.title }}
          <small>{{ it.ready ? it.pt : 'em breve' }}</small>
        </button>
      </li>
    </ul>
  </aside>
</template>
