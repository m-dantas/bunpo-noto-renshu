import { onMounted, onBeforeUnmount } from 'vue'

// Enter confirma / passa para a próxima (ignora o Enter que confirma o IME).
// `enabled` (opcional): função que diz se o atalho está ativo neste momento.
export function useEnter(fn, enabled) {
  const h = e => {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return
    if (enabled && !enabled()) return
    if (e.target.closest && e.target.closest('aside,.back,summary,select')) return
    e.preventDefault()
    fn()
  }
  onMounted(() => window.addEventListener('keydown', h))
  onBeforeUnmount(() => window.removeEventListener('keydown', h))
}
