import { VERBS, ADJ, VERBS9, VERBSB, ADJB } from '../data/drill'
import { te, TE, SUF, FORM, ruleV, IROW, masu, nai, ta, ARow } from './conjugation'
import { t } from '../i18n'

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
    return { k, r, pt, tag: [FORM[f], t('gen.' + f)],
      ans: [te(k, g) + SUF[f], te(r, g) + SUF[f]], rule: ruleV(k, g, f) }
  }
  const [k, r, ty, pt] = pick(ADJ.filter(a => adj.includes(a[2])))
  const fn = x => (ty === 'i' ? x.slice(0, -1) + 'くて' : x + 'で')
  return { k, r, pt, tag: [{ i: 'イA → くて', na: 'ナA → で', n: 'N → で' }[ty], t('gen.link')],
    ans: [fn(k), fn(r)],
    rule: t('gen.adjRule.' + ty) }
}

function make9({ groups, forms }) {
  const ws = VERBS9.filter(v => groups.includes(v[2]))
  if (!ws.length || !forms.length) return null
  const [k, r, g, pt] = pick(ws)
  const f = pick(forms), e = k.slice(-1)
  const out = x => (f === 'dict' ? x : f === 'koto' ? x + 'ことができます' : te(x, g))
  const tag = { dict: ['辞書形', t('gen.dict')], koto: ['Vることができます', t('gen.koto')], te: ['Vて、〜', t('gen.teForm')] }[f]
  const dr = g === 'u' ? t('gen.uDict', { i: IROW[e], e }) : t(g === 'ru' ? 'gen.ruDict' : 'gen.irrDict')
  const tr = g === 'u' ? t('gen.uTe', { e, te: TE[e] }) : t(g === 'ru' ? 'gen.ruTe' : 'gen.irrTe9')
  return { k: masu(k, g), r: masu(r, g), pt, tag, ans: [out(k), out(r)],
    rule: f === 'dict' ? dr : f === 'koto' ? t('gen.kotoRule', { r: dr }) : tr }
}

// regra da forma て (lições 3 a 7 e 10 a 15)
const teR = (k, g, e) => g === 'u' ? (k.endsWith('行く') ? t('gen.ikuEx') : t('gen.uTe', { e, te: TE[e] })) : t(g === 'ru' ? 'gen.ruTe' : 'gen.irrTe')

// ---------- Lições 3 a 5 ----------
const DEFAULT = { 3: ['masu'], 4: ['i', 'na'], 5: ['past', 'apast', 'tai'], 6: ['invite'], 7: ['te', 'kata', 'teiru'],
  10: ['tekuru', 'perm', 'naru'], 11: ['tari', 'plain'], 12: ['houga', 'kara', 'mae'], 13: ['koto'], 14: ['must', 'nakute'], 15: ['souda', 'cond'] }
function makeBasic(lesson, only) {
  const kind = Array.isArray(only) ? pick(only) : only || pick(DEFAULT[lesson])
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
  const TAG = { masu: 'Vます', masen: 'Vません', mashita: 'Vました', masendeshita: 'Vませんでした', tai: 'Vたいです', masenka: 'Vませんか',
    mashou: 'Vましょう', te: 'Vてください', teiru: 'Vています', kata: 'Vかた' }
  const stem = x => masu(x, g).slice(0, -2)
  const useTe = f === 'te' || f === 'teiru'
  const mk = x => (useTe ? te(x, g) + SUF[f] : stem(x) + SUF[f])
  const teRule = teR(k, g, e)
  const base = g === 'u' ? t('gen.uStem', { e, i: IROW[e] }) : t(g === 'ru' ? 'gen.ruStem' : 'gen.irrStem')
  const ans = f === 'kata' ? [stem(k) + '方', stem(r) + 'かた', stem(k) + 'かた'] : [mk(k), mk(r)]
  const rule = useTe ? `${teRule} + ${SUF[f]}` : f === 'kata' ? t('gen.kataRule') : `${base} + ${SUF[f]}`
  return { k, r, pt, tag: [TAG[f], t('gen.tag.' + f)], ans, rule }
}

// adjetivo → negativo (lição 4) ou passado / passado negativo (lição 5)
function makeAdj(kind) {
  if (kind === 'naru') { // lição 10: イA → くなります / ナA → になります
    const ty = pick(['i', 'na'])
    const [k, r, , pt] = pick(ADJB.filter(a => a[2] === ty))
    if (ty === 'i') {
      const mk = x => (x === 'いい' ? 'よ' : x.slice(0, -1)) + 'くなります'
      return { k, r, pt, tag: ['〜くなります', t('gen.iBecome')], ans: [mk(k), mk(r)], rule: t('gen.iBecomeRule') + (k === 'いい' ? ' (いい → よ〜)' : '') }
    }
    return { k, r, pt, tag: ['〜になります', t('gen.naBecome')], ans: [k + 'になります', r + 'になります'], rule: t('gen.naBecomeRule') }
  }
  const ty = kind === 'i' ? 'i' : kind === 'na' ? 'na' : pick(['i', 'na'])
  const [k, r, , pt] = pick(ADJB.filter(a => a[2] === ty))
  const f = kind === 'apast' ? pick(['past', 'pastneg']) : 'neg'
  const adj = ty === 'i' ? 'い' : 'な'
  const label = t({ neg: 'gen.adjNeg', past: 'gen.adjPast', pastneg: 'gen.adjPastNeg' }[f])
  if (ty === 'i') {
    const SUF = { neg: 'くないです', past: 'かったです', pastneg: 'くなかったです' }[f]
    const mk = x => (x === 'いい' ? 'よ' : x.slice(0, -1)) + SUF
    return { k, r, pt, tag: ['〜' + SUF, t('gen.adjTag', { adj, label })], ans: [mk(k), mk(r)],
      rule: t('gen.iRule', { suf: SUF }) + (k === 'いい' ? ' (いい → よ〜)' : '') }
  }
  const SUF = { neg: ['じゃないです', 'ではありません'], past: ['でした'], pastneg: ['じゃありませんでした', 'ではありませんでした'] }[f]
  return { k, r, pt, tag: ['〜' + SUF[0], t('gen.adjTag', { adj, label })], ans: [k + SUF[0], r + SUF[0], ...SUF.slice(1).flatMap(s => [k + s, r + s])],
    rule: t('gen.naRule', { suf: SUF[0] }) }
}

// ---------- Lições 10 a 15: formas com て, ない e た ----------
// [rótulo, construção, base]  (base: te | nai | ta | dict); a descrição vem de gen.fv.<forma> (src/i18n/locales)
const FV = {
  tekuru: ['Vてきます', (x, g) => te(x, g) + 'きます', 'te'],
  temo: ['Vてもいいですか', (x, g) => te(x, g) + 'もいいですか', 'te'],
  naide: ['Vないでください', (x, g) => nai(x, g) + 'でください', 'nai'],
  tari: ['Vたり', (x, g) => ta(x, g) + 'り', 'ta'],
  nai: ['Vない', (x, g) => nai(x, g), 'nai'],
  ta: ['Vた', (x, g) => ta(x, g), 'ta'],
  nakatta: ['Vなかった', (x, g) => nai(x, g).slice(0, -1) + 'かった', 'nai'],
  houga: ['Vたほうがいいです', (x, g) => ta(x, g) + 'ほうがいいです', 'ta'],
  naihouga: ['Vないほうがいいです', (x, g) => nai(x, g) + 'ほうがいいです', 'nai'],
  kara: ['Vてから', (x, g) => te(x, g) + 'から', 'te'],
  mae: ['Vる前に', null, 'dict'],
  koto: ['Vたことがあります', (x, g) => ta(x, g) + 'ことがあります', 'ta'],
  must: ['Vなければなりません', (x, g) => nai(x, g).slice(0, -1) + 'ければなりません', 'nai'],
  teha: ['Vてはいけません', (x, g) => te(x, g) + 'はいけません', 'te'],
  nakute: ['Vなくてもいいです', (x, g) => nai(x, g).slice(0, -1) + 'くてもいいです', 'nai'],
  souda: ['Vたそうです', (x, g) => ta(x, g) + 'そうです', 'ta'],
  tara: ['Vたら', (x, g) => ta(x, g) + 'ら', 'ta'],
  temo2: ['Vても', (x, g) => te(x, g) + 'も', 'te'],
}
const KIND_FORMS = { tekuru: ['tekuru'], perm: ['temo', 'naide'], tari: ['tari'], plain: ['nai', 'ta', 'nakatta'],
  houga: ['houga', 'naihouga'], kara: ['kara'], mae: ['mae'], koto: ['koto'], must: ['must', 'teha'], nakute: ['nakute'],
  souda: ['souda'], cond: ['tara', 'temo2'] }

function makeVerbF(kind) {
  const f = pick(KIND_FORMS[kind])
  const [t1, fn, base] = FV[f]
  const t2 = t('gen.fv.' + f)
  const [k, r, g, pt] = pick(VERBSB)
  const e = k.slice(-1)
  const tR = teR(k, g, e)
  const naiR = g === 'u' ? t('gen.uNai', { e, a: ARow[e] }) : t(g === 'ru' ? 'gen.ruNai' : 'gen.irrNai')
  const rule = { te: tR, ta: t('gen.taRule', { r: tR }), nai: naiR, dict: t('gen.maeRule') }[base]
  if (f === 'mae') { // o exercício mostra a forma ます e pede o dicionário + 前に
    return { k: masu(k, g), r: masu(r, g), pt, tag: [t1, t2], ans: [k + '前に', r + 'まえに', k + 'まえに'], rule }
  }
  return { k, r, pt, tag: [t1, t2], ans: [fn(k, g), fn(r, g)], rule: `${rule} → ${t1}` }
}
