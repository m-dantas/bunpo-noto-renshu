<script setup>
import { ref, computed } from 'vue'
import SideMenu from './components/SideMenu.vue'
import LessonPage from './components/LessonPage.vue'
import GrammarDrill from './components/GrammarDrill.vue'
import SentenceBuilder from './components/SentenceBuilder.vue'
import { LESSONS } from './data/lessons'

const view = ref('home') // home | menu | drill | build
const cur = ref(0)
const open = ref(false)
const sub = computed(() => (cur.value ? `第${cur.value}課 ${LESSONS[cur.value - 1].title}` : 'できる日本語 初級'))

function select(n) {
  cur.value = n
  view.value = 'menu'
  open.value = false
  window.scrollTo(0, 0)
}
</script>

<template>
  <SideMenu :open="open" :current="cur" @select="select" />
  <div class="wrap">
    <main>
      <button class="burger" @click="open = !open">☰ Lições</button>
      <h1>わたしの文法ノート</h1>
      <p class="sub">{{ sub }}</p>
      <p v-if="view === 'home'">Escolha uma lição no menu lateral. As lições em cinza ainda não foram desenvolvidas.</p>
      <LessonPage v-else-if="view === 'menu'" :lesson="cur" @go="view = $event" />
      <GrammarDrill v-else-if="view === 'drill'" :lesson="cur" @back="view = 'menu'" />
      <SentenceBuilder v-else :lesson="cur" @back="view = 'menu'" />
    </main>
  </div>
</template>
