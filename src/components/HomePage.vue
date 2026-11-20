<script setup>
import { useI18n } from 'vue-i18n'
import { READY, LESSONS } from '../data/lessons'
import { KCHAPTERS, ALL_KANJI } from '../data/kanji'

defineEmits(['open'])
const { t } = useI18n()
const nLessons = READY.length
const readyList = READY.join(', ')
const nChapters = KCHAPTERS.filter(c => c.ready).length
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">{{ t('home.h1') }}</h2>
    <article class="topic">
      <p v-html="t('home.p1')"></p>
      <p v-html="t('home.p2')"></p>
      <p class="lead" style="margin-bottom: 0">{{ t('home.p3') }}</p>
    </article>

    <h2 class="go">{{ t('home.h2') }}</h2>
    <p class="lead">{{ t('home.menusLead') }}</p>

    <article class="topic">
      <h2>{{ t('home.bunpoTitle') }}</h2>
      <p v-html="t('home.bunpo1', { n: nLessons, total: LESSONS.length, list: readyList })"></p>
      <p v-html="t('home.bunpo2')"></p>
      <p><span class="pat">{{ t('home.bDrill') }}</span> {{ t('home.bDrillD') }}</p>
      <p><span class="pat">{{ t('home.bBuild') }}</span> {{ t('home.bBuildD') }}</p>
      <p><span class="pat">{{ t('home.bCue') }}</span> {{ t('home.bCueD') }}</p>
      <p><span class="pat">{{ t('home.bNum') }}</span> {{ t('home.bNumD') }}</p>
      <p v-html="t('home.bunpo3')"></p>
      <button @click="$emit('open', 'bunpo')">{{ t('home.bunpoBtn') }}</button>
    </article>

    <article class="topic">
      <h2>{{ t('home.kanjiTitle') }}</h2>
      <p v-html="t('home.kanji1', { n: nChapters, k: ALL_KANJI.length })"></p>
      <p v-html="t('home.kanji2')"></p>
      <p>
        <span class="pat">{{ t('kanji.modes.reading') }}</span> <span class="pat">{{ t('kanji.modes.word') }}</span>
        <span class="pat">{{ t('kanji.modes.kmean') }}</span> <span class="pat">{{ t('kanji.modes.mkanji') }}</span>
      </p>
      <button @click="$emit('open', 'kanji')">{{ t('home.kanjiBtn') }}</button>
    </article>

    <article class="topic">
      <h2>活用 · {{ t('conj.name') }}</h2>
      <p v-html="t('conj.home1')"></p>
      <p v-html="t('conj.home2')"></p>
      <button @click="$emit('open', 'conj')">{{ t('conj.homeBtn') }}</button>
    </article>

    <article class="topic">
      <h2>{{ t('home.mixTitle') }}</h2>
      <p v-html="t('home.mix1')"></p>
      <p><span class="pat">{{ t('home.mConj') }}</span> {{ t('home.mConjD') }}</p>
      <p><span class="pat">{{ t('home.mSent') }}</span> {{ t('home.mSentD') }}</p>
      <p><span class="pat">{{ t('home.mBlank') }}</span> {{ t('home.mBlankD') }}</p>
      <p v-html="t('home.mix2')"></p>
      <button @click="$emit('open', 'mix')">{{ t('home.mixBtn') }}</button>
    </article>

    <h2 class="go">{{ t('home.h3') }}</h2>
    <article class="topic">
      <p v-html="t('home.type1')"></p>
      <div class="ex"><p class="jp">masu → ます</p><p class="tr">{{ t('home.typeHira') }}</p></div>
      <div class="ex"><p class="jp">MASU → マス</p><p class="tr">{{ t('home.typeKata') }}</p></div>
      <p v-html="t('home.type2')"></p>
    </article>

    <h2 class="go">{{ t('home.h4') }}</h2>
    <article class="topic">
      <p v-html="t('home.tip1')"></p>
      <p v-html="t('home.tip2')"></p>
      <p v-html="t('home.tip3')"></p>
      <p v-html="t('home.tip4')"></p>
    </article>
  </section>
</template>
