<script setup>
import { ref, computed } from 'vue'
import SideMenu from './components/SideMenu.vue'
import TopicNav from './components/TopicNav.vue'
import LessonPage from './components/LessonPage.vue'
import GrammarDrill from './components/GrammarDrill.vue'
import SentenceBuilder from './components/SentenceBuilder.vue'
import ChapterPage from './components/ChapterPage.vue'
import KanjiDrill from './components/KanjiDrill.vue'
import PracticeMix from './components/PracticeMix.vue'
import HomePage from './components/HomePage.vue'
import { LESSONS, READY } from './data/lessons'
import { GRAMMAR } from './data/grammar'
import { KCHAPTERS } from './data/kanji'

const book = ref('home') // home | bunpo | kanji | mix
const view = ref('home') // home | menu | drill | build | kdrill
const cur = ref(null) // lição (bunpo) ou capítulo (kanji)
const tab = ref(0) // tópico/seção (0..n) ou 'all'
const kmode = ref('reading')
const open = ref(false)

const items = computed(() =>
  book.value === 'mix' || book.value === 'home' ? [] : book.value === 'bunpo'
    ? LESSONS.map((l, i) => ({ key: i + 1, label: `第${i + 1}課`, title: l.title, pt: l.pt, ready: READY.includes(i + 1) }))
    : KCHAPTERS.map(c => ({ key: c.n, label: `${c.n}章`, title: c.title, pt: c.pt, ready: c.ready }))
)
const labels = computed(() => {
  if (cur.value == null) return []
  return book.value === 'bunpo' ? GRAMMAR[cur.value].map(t => t[0]) : KCHAPTERS.find(c => c.n === cur.value).sections.map(s => s.t)
})
const topic = computed(() => (tab.value === 'all' ? null : tab.value)) // null = tudo
const heading = computed(() => ({ home: '文法ノート', bunpo: 'わたしの文法ノート', kanji: '漢字 hop! step! jump!', mix: '練習 · treino misto' })[book.value])
const sub = computed(() => {
  if (book.value === 'home') return 'Treino de japonês para quem estuda com os seus livros'
  if (book.value === 'mix') return 'Pratique várias lições de uma vez'
  if (cur.value == null) return book.value === 'bunpo' ? 'できる日本語 初級' : '初級 I · WEWORLD'
  const it = items.value.find(i => i.key === cur.value)
  const base = `${it.label} ${it.title}`
  if (view.value === 'menu' || labels.value.length < 2) return base
  return base + (topic.value == null ? ' · tudo' : ` · parte ${topic.value + 1}`)
})

function setBook(b) { book.value = b; cur.value = null; view.value = 'home'; tab.value = 0; open.value = false }
function select(n) { cur.value = n; tab.value = 0; view.value = 'menu'; open.value = false; window.scrollTo(0, 0) }
function go(v, mode) { view.value = v; if (mode) kmode.value = mode }
</script>

<template>
  <SideMenu :open="open" :current="cur" :book="book" :items="items" @select="select" @book="setBook" />
  <div class="wrap">
    <div class="topics-col">
      <TopicNav v-if="view === 'menu' && labels.length > 1" v-model:tab="tab" :labels="labels" :title="book === 'bunpo' ? 'Tópicos' : 'Seções'" />
    </div>
    <main>
      <button class="burger" @click="open = !open">☰ Menu</button>
      <h1>{{ heading }}</h1>
      <p class="sub">{{ sub }}</p>
      <HomePage v-if="book === 'home'" @open="setBook" />
      <PracticeMix v-else-if="book === 'mix'" />
      <p v-else-if="view === 'home'">Escolha {{ book === 'bunpo' ? 'uma lição' : 'um capítulo' }} no menu lateral. Os itens em cinza ainda não foram desenvolvidos.</p>
      <LessonPage v-else-if="view === 'menu' && book === 'bunpo'" v-model:tab="tab" :lesson="cur" @go="go" />
      <ChapterPage v-else-if="view === 'menu'" v-model:tab="tab" :chapter="cur" @go="go" />
      <GrammarDrill v-else-if="view === 'drill'" :lesson="cur" :topic="topic" @back="view = 'menu'" />
      <SentenceBuilder v-else-if="view === 'build'" :lesson="cur" :topic="topic" @back="view = 'menu'" />
      <KanjiDrill v-else :chapter="cur" :section="topic" :mode="kmode" @back="view = 'menu'" />
    </main>
  </div>
</template>
