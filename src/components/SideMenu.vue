<script setup>
defineProps({ open: Boolean, current: Number, book: String, items: Array })
defineEmits(['select', 'book'])
</script>

<template>
  <aside :class="{ open }">
    <button type="button" class="brand" :class="{ on: book === 'home' }" @click="$emit('book', 'home')">
      文法ノート<small>Início · a proposta do app</small>
    </button>
    <div class="seg" role="group" aria-label="Livro">
      <button type="button" :class="{ on: book === 'bunpo' }" @click="$emit('book', 'bunpo')">文法</button>
      <button type="button" :class="{ on: book === 'kanji' }" @click="$emit('book', 'kanji')">漢字</button>
      <button type="button" :class="{ on: book === 'mix' }" @click="$emit('book', 'mix')">練習</button>
    </div>
    <h2>{{ book === 'bunpo' ? 'Lições' : book === 'kanji' ? 'Capítulos' : book === 'mix' ? 'Treino misto' : 'Início' }}</h2>
    <p v-if="book === 'mix'" class="lead" style="margin: 0 8px">Escolha as lições e os tipos de exercício na tela ao lado.</p>
    <p v-if="book === 'home'" class="lead" style="margin: 0 8px">Escolha um dos três menus acima, ou leia a apresentação ao lado.</p>
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
