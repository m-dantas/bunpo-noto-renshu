<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, setLocale } from '../i18n'

defineProps({ open: Boolean, current: Number, book: String, items: Array })
defineEmits(['select', 'book', 'close'])
const { t, locale } = useI18n()

// o dropdown mostra a escolha na hora; o idioma só muda depois de baixado.
// Se falhar (ex.: offline), volta para o idioma atual.
const pick = ref(locale.value)
const busy = ref(false)
watch(locale, v => { pick.value = v })
async function change() {
  busy.value = true
  try { await setLocale(pick.value) } catch (e) { pick.value = locale.value } finally { busy.value = false }
}
</script>

<template>
  <aside :class="{ open }">
    <button type="button" class="closebtn" :aria-label="t('menu.close')" @click="$emit('close')">✕</button>
    <label class="langpick">
      <span aria-hidden="true">🌐</span>
      <select v-model="pick" :disabled="busy" :aria-label="t('lang.label')" @change="change">
        <option v-for="l in LOCALES" :key="l.code" :value="l.code" :lang="l.html">{{ l.name }}</option>
      </select>
    </label>
    <button type="button" class="brand" :class="{ on: book === 'home' }" @click="$emit('book', 'home')">
      文法ノート<small>{{ t('menu.homeSub') }}</small>
    </button>
    <div class="seg" role="group" :aria-label="t('menu.book')">
      <button type="button" :class="{ on: book === 'bunpo' }" @click="$emit('book', 'bunpo')">文法</button>
      <button type="button" :class="{ on: book === 'kanji' }" @click="$emit('book', 'kanji')">漢字</button>
      <button type="button" :class="{ on: book === 'mix' }" @click="$emit('book', 'mix')">練習</button>
    </div>
    <h2>{{ t(book === 'bunpo' ? 'menu.lessons' : book === 'kanji' ? 'menu.chapters' : book === 'mix' ? 'menu.mix' : 'menu.home') }}</h2>
    <p v-if="book === 'mix'" class="lead" style="margin: 0 8px">{{ t('menu.mixLead') }}</p>
    <p v-if="book === 'home'" class="lead" style="margin: 0 8px">{{ t('menu.homeLead') }}</p>
    <ul id="lessons">
      <li v-for="it in items" :key="it.key">
        <button :disabled="!it.ready" :class="{ on: current === it.key }" @click="$emit('select', it.key)">
          <span class="n">{{ it.label }}</span>{{ it.title }}
          <small>{{ it.ready ? it.pt : t('menu.soon') }}</small>
        </button>
      </li>
    </ul>
  </aside>
</template>
