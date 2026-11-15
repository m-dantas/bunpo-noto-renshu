import { flush } from './kana'

const clean = s => s.replace(/[\s。、]/g, '')

// A frase digitada vale se cada bloco foi escrito em kanji OU em kana, em qualquer combinação.
// Ex.: どんな町ですか, どんなまちですか e (para vários blocos) 私はにほんじんです são aceitas.
// Espaços e a pontuação (。、) são ignorados.
export function matchChunks(input, chunks) {
  const v = clean(flush(input).normalize('NFKC'))
  if (!v) return false
  const opts = chunks.map(c => [...new Set([clean(c[0]), clean(c[1])])])
  const walk = (pos, i) => {
    if (i === opts.length) return pos === v.length
    return opts[i].some(o => v.startsWith(o, pos) && walk(pos + o.length, i + 1))
  }
  return walk(0, 0)
}
