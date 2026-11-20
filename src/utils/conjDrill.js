// Treino só de conjugação (menu 活用): verbos e adjetivos em qualquer forma já vista nas lições.
import { VERBS, VERBSB, ADJ, ADJB } from '../data/drill'
import { te, TE, IROW, masu, nai, ta, ARow } from './conjugation'
import { t } from '../i18n'

const pick = a => a[Math.floor(Math.random() * a.length)]
const uniq = list => { const s = new Set(); return list.filter(w => !s.has(w[0]) && s.add(w[0])) }

// vocabulário: todos os verbos e adjetivos (い e な) dos treinos das lições, sem repetir
export const CV = uniq([...VERBSB, ...VERBS])
export const CA = uniq([...ADJB, ...ADJ]).filter(a => a[2] !== 'n')

// ---------- verbos ----------
// [rótulo, construção, base da regra]  base: stem (raiz ます) | dict | te | ta | nai
const stem = (x, g) => masu(x, g).slice(0, -2)
export const VFORMS = {
  masu: ['Vます', (x, g) => stem(x, g) + 'ます', 'stem'],
  masen: ['Vません', (x, g) => stem(x, g) + 'ません', 'stem'],
  mashita: ['Vました', (x, g) => stem(x, g) + 'ました', 'stem'],
  masendeshita: ['Vませんでした', (x, g) => stem(x, g) + 'ませんでした', 'stem'],
  tai: ['Vたいです', (x, g) => stem(x, g) + 'たいです', 'stem'],
  mashou: ['Vましょう', (x, g) => stem(x, g) + 'ましょう', 'stem'],
  dict: ['辞書形', x => x, 'dict'],
  te: ['Vて', (x, g) => te(x, g), 'te'],
  ta: ['Vた', (x, g) => ta(x, g), 'ta'],
  tara: ['Vたら', (x, g) => ta(x, g) + 'ら', 'ta'],
  nai: ['Vない', (x, g) => nai(x, g), 'nai'],
  nakatta: ['Vなかった', (x, g) => nai(x, g).slice(0, -1) + 'かった', 'nai'],
}
export const VGROUPS = { polite: ['masu', 'masen', 'mashita', 'masendeshita', 'tai', 'mashou'], plain: ['dict', 'te', 'ta', 'tara', 'nai', 'nakatta'] }

function makeV(f, groups) {
  const ws = CV.filter(v => groups.includes(v[2]))
  if (!ws.length) return null
  const [k, r, g, pt] = pick(ws)
  const [lab, fn, base] = VFORMS[f]
  const e = k.slice(-1)
  const teR = g === 'u' ? (k.endsWith('行く') ? t('gen.ikuEx') : t('gen.uTe', { e, te: TE[e] })) : t(g === 'ru' ? 'gen.ruTe' : 'gen.irrTe8')
  const out = lab.replace(/^V/, '')
  const rule = {
    stem: (g === 'u' ? t('gen.uStem', { e, i: IROW[e] }) : t(g === 'ru' ? 'gen.ruStem' : 'gen.irrStem')) + ' + ' + out,
    dict: g === 'u' ? t('gen.uDict', { i: IROW[e], e }) : t(g === 'ru' ? 'gen.ruDict' : 'gen.irrDict'),
    te: teR,
    ta: t('gen.taRule', { r: teR }) + (f === 'tara' ? ' → たら' : ''),
    nai: (g === 'u' ? t('gen.uNai', { e, a: ARow[e] }) : t(g === 'ru' ? 'gen.ruNai' : 'gen.irrNai')) + (f === 'nakatta' ? ' → なかった' : ''),
  }[base]
  // a forma do dicionário é pedida a partir da forma ます
  const show = f === 'dict' ? [masu(k, g), masu(r, g)] : [k, r]
  return { cat: 'v', f, g, k: show[0], r: show[1], pt, tag: [lab, t('conj.f.' + f)], ans: [...new Set([fn(k, g), fn(r, g)])], rule }
}

// ---------- adjetivos ----------
// [rótulo い, sufixos い (o 1º é o principal), rótulo な, sufixos な]
// ans: todas as respostas aceitas (kanji e kana); alt: as outras formas certas, mostradas no feedback
export const AFORMS = {
  neg: ['〜くないです', ['くないです', 'くありません'], '〜じゃないです', ['じゃないです', 'ではないです', 'じゃありません', 'ではありません']],
  past: ['〜かったです', ['かったです'], '〜でした', ['でした']],
  pastneg: ['〜くなかったです', ['くなかったです', 'くありませんでした'], '〜じゃなかったです', ['じゃなかったです', 'ではなかったです', 'じゃありませんでした', 'ではありませんでした']],
  pnai: ['〜くない', ['くない'], '〜じゃない', ['じゃない', 'ではない']],
  pta: ['〜かった', ['かった'], '〜だった', ['だった']],
  pnakatta: ['〜くなかった', ['くなかった'], '〜じゃなかった', ['じゃなかった', 'ではなかった']],
  te: ['〜くて', ['くて'], '〜で', ['で']],
  naru: ['〜くなります', ['くなります'], '〜になります', ['になります']],
}
export const AGROUPS = { polite: ['neg', 'past', 'pastneg'], plain: ['pnai', 'pta', 'pnakatta'], link: ['te', 'naru'] }

function makeA(f, ty) {
  const ws = CA.filter(a => a[2] === ty)
  const [k, r, , pt] = pick(ws)
  const [li, si, ln, sn] = AFORMS[f]
  if (ty === 'i') {
    const root = x => (x === 'いい' ? 'よ' : x.slice(0, -1)) // いい → よ〜
    const ans = [...new Set(si.flatMap(s => [root(k) + s, root(r) + s]))]
    const base = f === 'te' ? t('gen.adjRule.i') : f === 'naru' ? t('gen.iBecomeRule') : t('gen.iRule', { suf: si[0] })
    return { cat: 'i', f, k, r, pt, tag: [li, t('conj.a.' + f)], ans, alt: si.slice(1).map(s => root(k) + s), rule: base + (k === 'いい' ? ' (いい → よ〜)' : '') }
  }
  const ans = [...new Set(sn.flatMap(s => [k + s, r + s]))]
  const rule = f === 'te' ? t('gen.adjRule.na') : f === 'naru' ? t('gen.naBecomeRule') : t('gen.naRule', { suf: sn[0] })
  return { cat: 'na', f, k, r, pt, tag: [ln, t('conj.a.' + f)], ans, alt: sn.slice(1).map(s => k + s), rule }
}

// o: { words: ['v','i','na'], groups: ['u','ru','irr'], vforms: [...], aforms: [...] }
export function makeConj(o) {
  const pool = []
  if (o.words.includes('v') && o.groups.length && o.vforms.length) pool.push('v')
  if (o.aforms.length) o.words.filter(w => w !== 'v').forEach(w => pool.push(w))
  if (!pool.length) return null
  const c = pick(pool)
  return c === 'v' ? makeV(pick(o.vforms), o.groups) : makeA(pick(o.aforms), c)
}
