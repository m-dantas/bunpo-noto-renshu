// Converte 漢字《かんじ》 em <ruby>漢字<rt>かんじ</rt></ruby>
export const rb = s => s.replace(/([\u4e00-\u9fff\u3005]+)《([^》]+)》/g, '<ruby>$1<rt>$2</rt></ruby>')

// Furigana só sobre os kanji: tira de k e r o início e o fim em kana que são iguais
// (ex.: 東京に / とうきょうに → <ruby>東京<rt>とうきょう</rt></ruby>に)
const KANJI = /[\u4e00-\u9fff\u3005]/
export function furi(k, r) {
  if (!r || k === r) return k
  let p = 0
  while (p < k.length && p < r.length && k[p] === r[p] && !KANJI.test(k[p])) p++
  let s = 0
  while (s < k.length - p && s < r.length - p && k[k.length - 1 - s] === r[r.length - 1 - s] && !KANJI.test(k[k.length - 1 - s])) s++
  return k.slice(0, p) + `<ruby>${k.slice(p, k.length - s)}<rt>${r.slice(p, r.length - s)}</rt></ruby>` + k.slice(k.length - s)
}
