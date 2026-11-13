import { onMounted, onBeforeUnmount } from 'vue'

// Enter confirma / passa para a próxima (ignora o Enter que confirma o IME)
export function useEnter(fn) {
  const h = e => {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return
    if (e.target.closest && e.target.closest('aside,.back,summary,select')) return
    e.preventDefault()
    fn()
  }
  onMounted(() => window.addEventListener('keydown', h))
  onBeforeUnmount(() => window.removeEventListener('keydown', h))
}
