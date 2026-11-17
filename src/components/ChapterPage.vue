<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { KCHAPTERS } from '../data/kanji'
import { rb } from '../utils/ruby'
import { tc } from '../i18n'

const props = defineProps({ chapter: Number, tab: [Number, String] })
const emit = defineEmits(['update:tab', 'go'])
const { t } = useI18n()

const ch = computed(() => KCHAPTERS.find(c => c.n === props.chapter))
const multi = computed(() => ch.value.sections.length > 1)
const isAll = computed(() => !multi.value || props.tab === 'all')
const shown = computed(() => (isAll.value ? ch.value.sections : [ch.value.sections[props.tab]]))
const goto = n => { emit('update:tab', n); window.scrollTo(0, 0) }
const word = w => rb(w.split('=')[0])
const mean = w => tc(w.split('=')[1])
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">{{ t('chapter.title') }}</h2>
    <nav v-if="multi" class="tabs" role="tablist">
      <button v-for="(s, i) in ch.sections" :key="i" role="tab" :aria-selected="tab === i" :class="{ on: tab === i }" :title="tc(s.t)" @click="goto(i)">{{ tc(s.t) }}</button>
      <button role="tab" :aria-selected="isAll" :class="{ on: isAll }" @click="goto('all')">{{ t('common.all') }}</button>
    </nav>

    <template v-for="s in shown" :key="s.t">
      <h2 v-if="multi" class="go" style="margin-top: 8px">{{ tc(s.t) }}</h2>
      <article v-for="e in s.k" :key="e.k" class="kcard">
        <div class="kbig" lang="ja">{{ e.k }}</div>
        <div class="kinfo">
          <div class="kmean">{{ tc(e.m) }}</div>
          <div class="kread">
            <span v-if="e.kun.length"><small>kun</small> {{ e.kun.join('・') }}</span>
            <span v-if="e.on.length"><small>on</small> {{ e.on.join('・') }}</span>
          </div>
          <ul class="kwords">
            <li v-for="w in e.words" :key="w"><span class="kw" lang="ja" v-html="word(w)"></span> <span class="tr">{{ mean(w) }}</span></li>
          </ul>
        </div>
      </article>
    </template>

    <div v-if="multi && !isAll" class="pager">
      <button v-if="tab > 0" class="back" @click="goto(tab - 1)">{{ t('chapter.prev') }}</button><span v-else></span>
      <button v-if="tab < ch.sections.length - 1" class="back" @click="goto(tab + 1)">{{ t('chapter.next') }}</button>
    </div>

    <h2 class="go">{{ isAll ? t('chapter.practiceAll') : t('chapter.practiceSection', { n: tab + 1 }) }}</h2>
    <button class="choice" @click="$emit('go', 'kdrill', 'reading')"><b>{{ t('chapter.drill') }}</b><span>{{ t('chapter.drillDesc') }}</span></button>
    <button class="choice" @click="$emit('go', 'kdrill', 'word')"><b>{{ t('chapter.words') }}</b><span>{{ t('chapter.wordsDesc') }}</span></button>
  </section>
</template>
