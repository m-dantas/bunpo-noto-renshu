<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GRAMMAR } from '../data/grammar'
import { CONF } from '../data/drillConfig'
import { rb } from '../utils/ruby'
import { hasNum } from '../utils/numbers'
import { CUES } from '../data/cues'
import { tc } from '../i18n'

const props = defineProps({ lesson: Number, tab: [Number, String] })
const emit = defineEmits(['update:tab', 'go'])
const { t } = useI18n()

const topics = computed(() => GRAMMAR[props.lesson])
const isAll = computed(() => props.tab === 'all')
const shown = computed(() => (isAll.value ? topics.value : [topics.value[props.tab]]))
const goto = n => { emit('update:tab', n); window.scrollTo(0, 0) }

const drillDesc = computed(() => {
  if (isAll.value) return t(props.lesson > 2 ? 'lesson.drillAllConj' : 'lesson.drillAllBlank')
  return t(CONF[props.lesson][props.tab].conj && props.lesson > 2 ? 'lesson.drillPartConj' : 'lesson.drillPartBlank')
})
const part = computed(() => (isAll.value ? null : props.tab))
const numOn = computed(() => hasNum(props.lesson, part.value))
const cueOn = computed(() => (CUES[props.lesson] || []).some(c => part.value == null || c.t === part.value))
const scope = computed(() => t(isAll.value ? 'lesson.scopeAll' : 'lesson.scopePart'))
const buildDesc = computed(() => t('lesson.buildDesc') + (isAll.value ? '' : t('lesson.onlyPart')))
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">{{ t('lesson.summary') }}</h2>
    <nav class="tabs" role="tablist">
      <button v-for="(x, i) in topics" :key="i" role="tab" :aria-selected="tab === i" :class="{ on: tab === i }" :title="tc(x[0])" @click="goto(i)">{{ tc(x[0]) }}</button>
      <button role="tab" :aria-selected="isAll" :class="{ on: isAll }" @click="goto('all')">{{ t('common.all') }}</button>
    </nav>

    <article v-for="x in shown" :key="x[0]" class="topic">
      <h2>{{ tc(x[0]) }}</h2>
      <template v-for="(b, i) in x.slice(1)" :key="i">
        <p v-if="b[0] === 'p'" v-html="rb(tc(b[1]))"></p>
        <p v-else-if="b[0] === 'pat'"><span class="pat" v-html="rb(tc(b[1]))"></span></p>
        <div v-else-if="b[0] === 'ex'" class="ex">
          <p class="jp" lang="ja" v-html="rb(b[1])"></p>
          <p class="tr">{{ tc(b[2]) }}</p>
        </div>
        <div v-else style="overflow-x: auto" v-html="rb(tc(b[1]))"></div>
      </template>
    </article>

    <div v-if="!isAll" class="pager">
      <button v-if="tab > 0" class="back" @click="goto(tab - 1)">{{ t('lesson.prev') }}</button><span v-else></span>
      <button v-if="tab < topics.length - 1" class="back" @click="goto(tab + 1)">{{ t('lesson.next') }}</button>
    </div>

    <h2 class="go">{{ isAll ? t('lesson.practiceAll') : t('lesson.practicePart', { n: tab + 1 }) }}</h2>
    <button class="choice" @click="$emit('go', 'drill')"><b>{{ t('lesson.drill') }}</b><span>{{ drillDesc }}</span></button>
    <button class="choice" @click="$emit('go', 'build')"><b>{{ t('lesson.build') }}</b><span>{{ buildDesc }}</span></button>
    <button v-if="cueOn" class="choice" @click="$emit('go', 'cue')"><b>{{ t('common.cue') }}</b><span>{{ t('lesson.cueDesc', { scope }) }}</span></button>
    <button v-if="numOn" class="choice" @click="$emit('go', 'num')"><b>{{ t('common.num') }}</b><span>{{ t('lesson.numDesc', { scope }) }}</span></button>
  </section>
</template>
