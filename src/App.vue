<script setup>
import { ref, computed } from 'vue'
import SideMenu from './components/SideMenu.vue'
import LessonPage from './components/LessonPage.vue'
import TopicNav from './components/TopicNav.vue'
import GrammarDrill from './components/GrammarDrill.vue'
import SentenceBuilder from './components/SentenceBuilder.vue'
import { LESSONS } from './data/lessons'

const view = ref('home') // home | menu | drill | build
const cur = ref(0)
const tab = ref(0) // índice do tópico (0..3) ou 'all'
const open = ref(false)
const topic = computed(() => (tab.value === 'all' ? null : tab.value)) // null = lição toda

const sub = computed(() => {
  if (!cur.value) return 'できる日本語 初級'
  const base = `第${cur.value}課 ${LESSONS[cur.value - 1].title}`
  return view.value === 'drill' || view.value === 'build' ? base + (topic.value == null ? ' · lição toda' : ` · tópico ${topic.value + 1}`) : base
})

function select(n) {
  cur.value = n
  tab.value = 0
  view.value = 'menu'
  open.value = false
  window.scrollTo(0, 0)
}
</script>

<template>
  <SideMenu :open="open" :current="cur" @select="select" />
  <div class="wrap">
    <div class="topics-col"><TopicNav v-if="view === 'menu'" v-model:tab="tab" :lesson="cur" /></div>
    <main>
      <button class="burger" @click="open = !open">☰ Lições</button>
      <h1>わたしの文法ノート</h1>
      <p class="sub">{{ sub }}</p>
      <p v-if="view === 'home'">Escolha uma lição no menu lateral. As lições em cinza ainda não foram desenvolvidas.</p>
      <LessonPage v-else-if="view === 'menu'" v-model:tab="tab" :lesson="cur" @go="view = $event" />
      <GrammarDrill v-else-if="view === 'drill'" :lesson="cur" :topic="topic" @back="view = 'menu'" />
      <SentenceBuilder v-else :lesson="cur" :topic="topic" @back="view = 'menu'" />
    </main>
  </div>
</template>
