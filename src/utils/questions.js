import { VERBS, ADJ, VERBS9, VERBSB, ADJB } from '../data/drill'
import { te, TE, SUF, FORM, ruleV, IROW, masu } from './conjugation'

const pick = a => a[Math.floor(Math.random() * a.length)]

export const makeQuestion = (lesson, o, only) => (lesson === 9 ? make9(o) : lesson === 8 ? make8(o, only) : makeBasic(lesson, only))

function make8({ groups, forms, adj }, only) {
  const pool = []
  if (only !== 'a' && groups.length && forms.length) pool.push('v')
  if (only !== 'v' && adj.length) pool.push('a')
  if (!pool.length) return null
  if (pick(pool) === 'v') {
    const [k, r, g, pt] = pick(VERBS.filter(v => groups.includes(v[2])))
    const f = pick(forms)
    return { k, r, pt, tag: [FORM[f], { pol: 'polida', neg: 'negativa polida', plain: 'simples' }[f]],
      ans: [te(k, g) + SUF[f], te(r, g) + SUF[f]], rule: ruleV(k, g, f) }
  }
  const [k, r, t, pt] = pick(ADJ.filter(a => adj.includes(a[2])))
  const fn = x => (t === 'i' ? x.slice(0, -1) + 'くて' : x + 'で')
  return { k, r, pt, tag: [{ i: 'イA → くて', na: 'ナA → で', n: 'N → で' }[t], 'forma de ligação'],
    ans: [fn(k), fn(r)],
    rule: { i: 'い-adjetivo: tire い e coloque くて', na: 'な-adjetivo: acrescente で', n: 'Substantivo: acrescente で' }[t] }
}

function make9({ groups, forms }) {
  const ws = VERBS9.filter(v => groups.includes(v[2]))
  if (!ws.length || !forms.length) return null
  const [k, r, g, pt] = pick(ws)
  const f = pick(forms), e = k.slice(-1)
  const out = x => (f === 'dict' ? x : f === 'koto' ? x + 'ことができます' : te(x, g))
  const tag = { dict: ['辞書形', 'ます → forma do dicionário'], koto: ['Vることができます', 'sei / consigo V'], te: ['Vて、〜', 'forma て'] }[f]
  const dr = g === 'u' ? `Grupo う: ${IROW[e]}ます → ${e}` : g === 'ru' ? 'Grupo る: tire ます e coloque る' : 'Irregular: します → する, きます → くる'
  const tr = g === 'u' ? `Grupo う: ${e} → ${TE[e]}` : g === 'ru' ? 'Grupo る: tire る e coloque て' : 'Irregular: して, きて'
  return { k: masu(k, g), r: masu(r, g), pt, tag, ans: [out(k), out(r)],
    rule: f === 'dict' ? dr : f === 'koto' ? `Dicionário + ことができます (${dr})` : tr }
}

// ---------- Lições 3 a 5 ----------
const DEFAULT = { 3: ['masu'], 4: ['i', 'na'], 5: ['past', 'apast', 'tai'] }
function makeBasic(lesson, only) {
  const kind = only || pick(DEFAULT[lesson])
  return ['masu', 'past', 'tai'].includes(kind) ? makeVerb(kind) : makeAdj(kind)
}

// verbo no dicionário → Vます / Vません / Vました / Vませんでした / Vたいです
function makeVerb(kind) {
  const [k, r, g, pt] = pick(VERBSB)
  const e = k.slice(-1)
  const f = pick({ masu: ['masu', 'masen'], past: ['mashita', 'masendeshita'], tai: ['tai'] }[kind])
  const SUF = { masu: 'ます', masen: 'ません', mashita: 'ました', masendeshita: 'ませんでした', tai: 'たいです' }
  const TAG = { masu: ['Vます', 'afirmativa polida'], masen: ['Vません', 'negativa polida'], mashita: ['Vました', 'passado'],
    masendeshita: ['Vませんでした', 'passado negativo'], tai: ['Vたいです', 'querer fazer'] }
  const mk = x => masu(x, g).slice(0, -2) + SUF[f]
  const base = g === 'u' ? `Grupo う: ${e} → ${IROW[e]}` : g === 'ru' ? 'Grupo る: tire る' : 'Irregular: する → し, 来る → き'
  return { k, r, pt, tag: TAG[f], ans: [mk(k), mk(r)], rule: `${base} + ${SUF[f]}` }
}

// adjetivo → negativo (lição 4) ou passado / passado negativo (lição 5)
function makeAdj(kind) {
  const t = kind === 'i' ? 'i' : kind === 'na' ? 'na' : pick(['i', 'na'])
  const [k, r, , pt] = pick(ADJB.filter(a => a[2] === t))
  const f = kind === 'apast' ? pick(['past', 'pastneg']) : 'neg'
  const adj = t === 'i' ? 'い' : 'な'
  const label = { neg: 'negativa', past: 'passado', pastneg: 'passado negativo' }[f]
  if (t === 'i') {
    const SUF = { neg: 'くないです', past: 'かったです', pastneg: 'くなかったです' }[f]
    const mk = x => (x === 'いい' ? 'よ' : x.slice(0, -1)) + SUF
    return { k, r, pt, tag: ['〜' + SUF, `${adj}-adjetivo · ${label}`], ans: [mk(k), mk(r)],
      rule: `Tire い e coloque ${SUF}` + (k === 'いい' ? ' (いい → よ〜)' : '') }
  }
  const SUF = { neg: ['じゃないです', 'ではありません'], past: ['でした'], pastneg: ['じゃありませんでした', 'ではありませんでした'] }[f]
  return { k, r, pt, tag: ['〜' + SUF[0], `${adj}-adjetivo · ${label}`], ans: [k + SUF[0], r + SUF[0], ...SUF.slice(1).flatMap(s => [k + s, r + s])],
    rule: `な-adjetivo: acrescente ${SUF[0]}` }
}
