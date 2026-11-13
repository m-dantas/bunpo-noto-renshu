import { VERBS, ADJ, VERBS9 } from '../data/drill'
import { te, TE, SUF, FORM, ruleV, IROW, masu } from './conjugation'

const pick = a => a[Math.floor(Math.random() * a.length)]

export const makeQuestion = (lesson, o) => (lesson === 9 ? make9(o) : make8(o))

function make8({ groups, forms, adj }) {
  const pool = []
  if (groups.length && forms.length) pool.push('v')
  if (adj.length) pool.push('a')
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
