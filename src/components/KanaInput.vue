<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toKana, kt, flush } from '../utils/kana'

defineProps({ modelValue: String, disabled: Boolean })
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const el = ref(null)
const kata = ref(false)
let nn = false // acabou de digitar “nn” (→ ん): se vier vogal, ela forma a sílaba com n (donna → どんな)
const caps = e => !!(e.getModifierState && e.getModifierState('CapsLock'))

function set(v) {
  el.value.value = v
  el.value.setSelectionRange(v.length, v.length)
  emit('update:modelValue', v)
}

// Letras: minúsculas viram hiragana, com Caps Lock ligado viram katakana
function onKeydown(e) {
  kata.value = caps(e)
  if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
  const i = el.value
  if (i.selectionStart !== i.value.length || i.selectionEnd !== i.value.length) return
  if (/[a-zA-Z]/.test(e.key)) {
    e.preventDefault()
    const v = i.value
    const m = v.match(/[a-z]*$/)[0]
    const key = e.key.toLowerCase()
    if (nn && /[aiueoy]/.test(key) && v.endsWith('ん')) {
      nn = false
      const syl = toKana('n' + key)
      set(v + (kata.value ? kt(syl) : syl))
      return
    }
    nn = m === 'n' && key === 'n'
    let out = toKana(m + key)
    if (kata.value) out = kt(out)
    set(v.slice(0, v.length - m.length) + out)
  } else if (e.key === '-') {
    e.preventDefault(); set(flush(i.value) + 'ー')
  } else if (e.key === ',' || e.key === '.') {
    e.preventDefault(); set(flush(i.value) + (e.key === '.' ? '。' : '、'))
  }
}

// Teclados virtuais (celular): converte para hiragana
function onInput(e) {
  if (e.isComposing || e.inputType !== 'insertText' || !/^[a-zA-Z]$/.test(e.data || '')) {
    emit('update:modelValue', e.target.value)
    return
  }
  const v = e.target.value
  const m = v.match(/[a-zA-Z]*$/)[0]
  set(v.slice(0, v.length - m.length) + toKana(m.toLowerCase()))
}

defineExpose({ focus: () => el.value && el.value.focus() })
</script>

<template>
  <div class="kana">
    <input ref="el" type="text" :value="modelValue" :disabled="disabled" autocomplete="off" autocapitalize="off"
      spellcheck="false" lang="ja" :aria-label="t('kana.aria')"
      @keydown="onKeydown" @keyup="kata = caps($event)" @input="onInput" />
    <div class="mode">{{ t(kata ? 'kana.kata' : 'kana.hira') }}</div>
  </div>
</template>
