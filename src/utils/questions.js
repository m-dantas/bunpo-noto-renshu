import { VERBS, ADJ, VERBS9, VERBSB, ADJB } from '../data/drill'
import { te, TE, SUF, FORM, ruleV, IROW, masu, nai, ta, ARow } from './conjugation'

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
const DEFAULT = { 3: ['masu'], 4: ['i', 'na'], 5: ['past', 'apast', 'tai'], 6: ['invite'], 7: ['te', 'kata', 'teiru'],
  10: ['tekuru', 'perm', 'naru'], 11: ['tari', 'plain'], 12: ['houga', 'kara', 'mae'], 13: ['koto'], 14: ['must', 'nakute'], 15: ['souda', 'cond'] }
function makeBasic(lesson, only) {
  const kind = only || pick(DEFAULT[lesson])
  if (KIND_FORMS[kind]) return makeVerbF(kind)
  return ['masu', 'past', 'tai', 'invite', 'te', 'teiru', 'kata'].includes(kind) ? makeVerb(kind) : makeAdj(kind)
}

// verbo no dicionário → Vます, Vません, Vました, Vませんでした, Vたいです, Vませんか, Vましょう,
// Vてください, Vています, Vかた
function makeVerb(kind) {
  const FORMS = { masu: ['masu', 'masen'], past: ['mashita', 'masendeshita'], tai: ['tai'], invite: ['masenka', 'mashou'],
    te: ['te'], teiru: ['teiru'], kata: ['kata'] }
  const f = pick(FORMS[kind])
  const [k, r, g, pt] = pick(kind === 'kata' ? VERBSB.filter(v => v[2] !== 'irr') : VERBSB)
  const e = k.slice(-1)
  const SUF = { masu: 'ます', masen: 'ません', mashita: 'ました', masendeshita: 'ませんでした', tai: 'たいです',
    masenka: 'ませんか', mashou: 'ましょう', te: 'ください', teiru: 'います', kata: '方' }
  const TAG = { masu: ['Vます', 'afirmativa polida'], masen: ['Vません', 'negativa polida'], mashita: ['Vました', 'passado'],
    masendeshita: ['Vませんでした', 'passado negativo'], tai: ['Vたいです', 'querer fazer'], masenka: ['Vませんか', 'convite'],
    mashou: ['Vましょう', 'proposta'], te: ['Vてください', 'pedido'], teiru: ['Vています', 'em andamento'], kata: ['Vかた', 'o jeito de fazer'] }
  const stem = x => masu(x, g).slice(0, -2)
  const useTe = f === 'te' || f === 'teiru'
  const mk = x => (useTe ? te(x, g) + SUF[f] : stem(x) + SUF[f])
  const teRule = g === 'u' ? (k.endsWith('行く') ? 'Exceção: 行く → 行って' : `Grupo う: ${e} → ${TE[e]}`) : g === 'ru' ? 'Grupo る: tire る e coloque て' : 'Irregular: して, 来て'
  const base = g === 'u' ? `Grupo う: ${e} → ${IROW[e]}` : g === 'ru' ? 'Grupo る: tire る' : 'Irregular: する → し, 来る → き'
  const ans = f === 'kata' ? [stem(k) + '方', stem(r) + 'かた', stem(k) + 'かた'] : [mk(k), mk(r)]
  const rule = useTe ? `${teRule} + ${SUF[f]}` : f === 'kata' ? 'Forma ます sem o ます + 方 (かた)' : `${base} + ${SUF[f]}`
  return { k, r, pt, tag: TAG[f], ans, rule }
}

// adjetivo → negativo (lição 4) ou passado / passado negativo (lição 5)
function makeAdj(kind) {
  if (kind === 'naru') { // lição 10: イA → くなります / ナA → になります
    const t = pick(['i', 'na'])
    const [k, r, , pt] = pick(ADJB.filter(a => a[2] === t))
    if (t === 'i') {
      const mk = x => (x === 'いい' ? 'よ' : x.slice(0, -1)) + 'くなります'
      return { k, r, pt, tag: ['〜くなります', 'い-adjetivo · ficar'], ans: [mk(k), mk(r)], rule: 'Tire い e coloque くなります' + (k === 'いい' ? ' (いい → よ〜)' : '') }
    }
    return { k, r, pt, tag: ['〜になります', 'な-adjetivo · ficar'], ans: [k + 'になります', r + 'になります'], rule: 'な-adjetivo: acrescente になります' }
  }
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

// ---------- Lições 10 a 15: formas com て, ない e た ----------
// [rótulo, descrição, construção, base]  (base: te | nai | ta | dict)
const FV = {
  tekuru: ['Vてきます', 'ir fazer e voltar', (x, g) => te(x, g) + 'きます', 'te'],
  temo: ['Vてもいいですか', 'pedir permissão', (x, g) => te(x, g) + 'もいいですか', 'te'],
  naide: ['Vないでください', 'pedir para não fazer', (x, g) => nai(x, g) + 'でください', 'nai'],
  tari: ['Vたり', 'listar atividades', (x, g) => ta(x, g) + 'り', 'ta'],
  nai: ['Vない', 'forma simples negativa', (x, g) => nai(x, g), 'nai'],
  ta: ['Vた', 'forma simples passada', (x, g) => ta(x, g), 'ta'],
  nakatta: ['Vなかった', 'forma simples passada negativa', (x, g) => nai(x, g).slice(0, -1) + 'かった', 'nai'],
  houga: ['Vたほうがいいです', 'conselho', (x, g) => ta(x, g) + 'ほうがいいです', 'ta'],
  naihouga: ['Vないほうがいいです', 'conselho (não fazer)', (x, g) => nai(x, g) + 'ほうがいいです', 'nai'],
  kara: ['Vてから', 'depois de', (x, g) => te(x, g) + 'から', 'te'],
  mae: ['Vる前に', 'antes de', null, 'dict'],
  koto: ['Vたことがあります', 'experiência', (x, g) => ta(x, g) + 'ことがあります', 'ta'],
  must: ['Vなければなりません', 'obrigação', (x, g) => nai(x, g).slice(0, -1) + 'ければなりません', 'nai'],
  teha: ['Vてはいけません', 'proibição', (x, g) => te(x, g) + 'はいけません', 'te'],
  nakute: ['Vなくてもいいです', 'não precisa', (x, g) => nai(x, g).slice(0, -1) + 'くてもいいです', 'nai'],
  souda: ['Vたそうです', 'ouvi dizer (passado)', (x, g) => ta(x, g) + 'そうです', 'ta'],
  tara: ['Vたら', 'se / quando', (x, g) => ta(x, g) + 'ら', 'ta'],
  temo2: ['Vても', 'mesmo que', (x, g) => te(x, g) + 'も', 'te'],
}
const KIND_FORMS = { tekuru: ['tekuru'], perm: ['temo', 'naide'], tari: ['tari'], plain: ['nai', 'ta', 'nakatta'],
  houga: ['houga', 'naihouga'], kara: ['kara'], mae: ['mae'], koto: ['koto'], must: ['must', 'teha'], nakute: ['nakute'],
  souda: ['souda'], cond: ['tara', 'temo2'] }

function makeVerbF(kind) {
  const f = pick(KIND_FORMS[kind])
  const [t1, t2, fn, base] = FV[f]
  const [k, r, g, pt] = pick(VERBSB)
  const e = k.slice(-1)
  const teR = g === 'u' ? (k.endsWith('行く') ? 'Exceção: 行く → 行って' : `Grupo う: ${e} → ${TE[e]}`) : g === 'ru' ? 'Grupo る: tire る e coloque て' : 'Irregular: して, 来て'
  const naiR = g === 'u' ? `Grupo う: ${e} → ${ARow[e]}ない` : g === 'ru' ? 'Grupo る: tire る e coloque ない' : 'Irregular: しない, 来ない (こない)'
  const rule = { te: teR, ta: `${teR}; て → た, で → だ`, nai: naiR, dict: 'Forma do dicionário + 前に' }[base]
  if (f === 'mae') { // o exercício mostra a forma ます e pede o dicionário + 前に
    return { k: masu(k, g), r: masu(r, g), pt, tag: [t1, t2], ans: [k + '前に', r + 'まえに', k + 'まえに'], rule }
  }
  return { k, r, pt, tag: [t1, t2], ans: [fn(k, g), fn(r, g)], rule: `${rule} → ${t1}` }
}
