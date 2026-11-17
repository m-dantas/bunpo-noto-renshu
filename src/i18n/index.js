// Internacionalização (vue-i18n).
// - Textos da interface: src/i18n/locales/<idioma>.js (mensagens do vue-i18n, com {parâmetros}).
// - Conteúdo das lições (explicações, traduções, significados dos kanji…): continua escrito em
//   português em src/data/*. Cada idioma tem um dicionário em src/i18n/content/<idioma>/,
//   em que a chave é o texto original em português. tc() devolve a tradução ou, se faltar, o original.
// Só o português (idioma original, também usado como reserva) vai no pacote principal. Os outros
// idiomas são baixados sob demanda, quando escolhidos, e ficam guardados pelo PWA para uso offline.
import { shallowRef } from 'vue'
import { createI18n } from 'vue-i18n'
import pt from './locales/pt'

export const LOCALES = [
  { code: 'pt', name: 'Português', html: 'pt-BR' },
  { code: 'zh', name: '简体中文', html: 'zh-CN' },
]
// cada idioma (menos o português) carrega as mensagens da interface e o dicionário do conteúdo
const LOADERS = {
  zh: () => Promise.all([import('./locales/zh.js'), import('./content/zh/index.js')]),
}
const KEY = 'lang'
const known = code => LOCALES.some(l => l.code === code)

const saved = () => { try { return localStorage.getItem(KEY) } catch (e) { return null } }
const save = code => { try { localStorage.setItem(KEY, code) } catch (e) { /* sem storage */ } }

function initial() {
  const s = saved()
  if (known(s)) return s
  const nav = typeof navigator === 'undefined' ? [] : (navigator.languages || [navigator.language || ''])
  for (const n of nav.map(x => x.toLowerCase())) {
    const hit = LOCALES.find(l => n === l.code || n.startsWith(l.code + '-'))
    if (hit) return hit.code
  }
  return 'pt'
}

export const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'pt',
  messages: { pt },
  warnHtmlMessage: false, // algumas mensagens têm <b>…</b> e são mostradas com v-html
})

const content = shallowRef({}) // dicionário do conteúdo no idioma atual ({} = português)
const cache = { pt: {} }

const applyHtml = code => {
  if (typeof document === 'undefined') return // fora do navegador (testes)
  document.documentElement.lang = LOCALES.find(l => l.code === code).html
}

let last = 0
// Troca o idioma. Só depois de baixar tudo o idioma muda, então não aparece tela pela metade.
// Se o download falhar (ex.: offline sem cache), lança erro e o idioma atual continua.
// persist: grava a escolha. Só a escolha da pessoa é gravada; a tentativa automática da abertura,
// não, para que uma falha passageira nunca apague o idioma escolhido.
export async function setLocale(code, { persist = true } = {}) {
  if (!known(code)) throw new Error('idioma desconhecido: ' + code)
  const req = ++last
  if (!cache[code]) {
    const [msgs, dict] = await LOADERS[code]()
    i18n.global.setLocaleMessage(code, msgs.default)
    cache[code] = dict.default
  }
  if (req !== last) return // outra troca começou depois desta
  content.value = cache[code]
  i18n.global.locale.value = code
  applyHtml(code)
  if (persist) save(code)
}

// idioma da abertura: o salvo (ou o do navegador). Se não carregar, abre em português,
// mas mantém a escolha salva para a próxima vez.
export const ready = setLocale(initial(), { persist: false }).catch(() => applyHtml('pt'))

// atalho para usar fora dos componentes (geradores de questões)
export const t = (...a) => i18n.global.t(...a)

// tradução do conteúdo escrito em português em src/data (reativa: muda com o idioma)
export function tc(s) {
  return (s && content.value[s]) || s
}
