// Números e contadores do caderno (別冊): idade, datas, horas, preços, andares, duração e contadores.
import { t } from '../i18n'

const D = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
const pick = a => a[Math.floor(Math.random() * a.length)]
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1))

// 1 a 99999
export function readBase(n) {
  if (n >= 10000) { const m = Math.floor(n / 10000), r = n % 10000; return readBase(m) + 'まん' + (r ? readBase(r) : '') }
  let s = ''
  const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), t = Math.floor((n % 100) / 10), o = n % 10
  if (th) s += th === 1 ? 'せん' : th === 3 ? 'さんぜん' : th === 8 ? 'はっせん' : D[th] + 'せん'
  if (h) s += h === 1 ? 'ひゃく' : h === 3 ? 'さんびゃく' : h === 6 ? 'ろっぴゃく' : h === 8 ? 'はっぴゃく' : D[h] + 'ひゃく'
  if (t) s += t === 1 ? 'じゅう' : D[t] + 'じゅう'
  if (o) s += D[o]
  return s
}

// tabela com a leitura de 1 a 10 (já com o contador) → 1 a 99
function compose(n, T) {
  if (n <= 10) return T[n]
  const t = Math.floor(n / 10), d = n % 10
  const tens = t === 1 ? 'じゅう' : D[t] + 'じゅう'
  if (d) return tens + T[d]
  return (t === 1 ? '' : D[t]) + T[10]
}
const tbl = s => [''].concat(s.split(' '))

const T = {
  fun: tbl('いっぷん にふん さんぷん よんぷん ごふん ろっぷん ななふん はっぷん きゅうふん じゅっぷん'),
  sai: tbl('いっさい にさい さんさい よんさい ごさい ろくさい ななさい はっさい きゅうさい じゅっさい'),
  kai: tbl('いっかい にかい さんがい よんかい ごかい ろっかい ななかい はっかい きゅうかい じゅっかい'),
  mai: tbl('いちまい にまい さんまい よんまい ごまい ろくまい ななまい はちまい きゅうまい じゅうまい'),
  nin: tbl('ひとり ふたり さんにん よにん ごにん ろくにん ななにん はちにん きゅうにん じゅうにん'),
  hiki: tbl('いっぴき にひき さんびき よんひき ごひき ろっぴき ななひき はっぴき きゅうひき じゅっぴき'),
  kaisu: tbl('いっかい にかい さんかい よんかい ごかい ろっかい ななかい はっかい きゅうかい じゅっかい'),
  satsu: tbl('いっさつ にさつ さんさつ よんさつ ごさつ ろくさつ ななさつ はっさつ きゅうさつ じゅっさつ'),
  hon: tbl('いっぽん にほん さんぼん よんほん ごほん ろっぽん ななほん はっぽん きゅうほん じゅっぽん'),
  hai: tbl('いっぱい にはい さんばい よんはい ごはい ろっぱい ななはい はっぱい きゅうはい じゅっぱい'),
}
const HOUR = ['', 'いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ']
const HOURS = ['', 'いちじかん', 'にじかん', 'さんじかん', 'よじかん', 'ごじかん', 'ろくじかん', 'ななじかん', 'はちじかん', 'くじかん', 'じゅうじかん', 'じゅういちじかん', 'じゅうにじかん']
const MONTH = ['', 'いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ']
const DAY = ['', 'ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか', 'じゅういちにち', 'じゅうににち', 'じゅうさんにち', 'じゅうよっか', 'じゅうごにち',
  'じゅうろくにち', 'じゅうしちにち', 'じゅうはちにち', 'じゅうくにち', 'はつか', 'にじゅういちにち', 'にじゅうににち', 'にじゅうさんにち', 'にじゅうよっか', 'にじゅうごにち', 'にじゅうろくにち',
  'にじゅうしちにち', 'にじゅうはちにち', 'にじゅうくにち', 'さんじゅうにち', 'さんじゅういちにち']

const WRITE = (s, ...alts) => [...new Set([s, ...alts])]
const alt7 = (s, n) => (n % 10 === 7 ? [s.replace(/なな(?!.*なな)/, 'しち')] : [])

// ---------- categorias ----------
// cada uma devolve { big, ans, rule }
export const CATS = {
  sai: { get label() { return t('num.sai.label') }, make() {
    const n = pick([rnd(1, 12), rnd(13, 19), 20, 20, rnd(21, 60)])
    return { big: `${n}歳`, ans: n === 20 ? ['はたち'] : WRITE(compose(n, T.sai), ...alt7(compose(n, T.sai), n)),
      rule: t('num.sai.rule') }
  } },
  date: { get label() { return t('num.date.label') }, make() {
    const m = rnd(1, 12), d = pick([rnd(1, 10), rnd(1, 31), rnd(11, 31)])
    return { big: `${m}月${d}日`, ans: [MONTH[m] + DAY[d]],
      rule: t('num.date.rule') }
  } },
  ji: { get label() { return t('num.ji.label') }, make() {
    const h = rnd(1, 12), kind = pick(['jo', 'jo', 'min', 'han'])
    if (kind === 'jo') return { big: `${h}:00`, ans: [HOUR[h]], rule: t('num.ji.rule') }
    if (kind === 'han') return { big: `${h}:30`, ans: [HOUR[h] + 'はん', HOUR[h] + compose(30, T.fun)], rule: t('num.ji.half') }
    const m = pick([5, 10, 15, 20, 25, 40, 45, 50, rnd(1, 59)])
    return { big: `${h}:${String(m).padStart(2, '0')}`, ans: [HOUR[h] + compose(m, T.fun)], rule: t('num.ji.fun') }
  } },
  nichi: { get label() { return t('num.nichi.label') }, make() {
    const d = rnd(1, 31)
    return { big: `${d}日`, ans: [DAY[d]], rule: t('num.nichi.rule') }
  } },
  en: { get label() { return t('num.en.label') }, make() {
    const n = pick([rnd(1, 9) * 100, rnd(1, 24) * 1000, rnd(1, 9) * 1000 + rnd(1, 9) * 100, rnd(1, 9) * 10000 + rnd(0, 9) * 1000, rnd(1, 99) * 100])
    let s = readBase(n)
    if (s.endsWith('よん')) s = s.slice(0, -2) + 'よ'
    return { big: `${n}円`, ans: WRITE(s + 'えん', ...(n % 10 === 7 ? [s.replace(/なな$/, 'しち') + 'えん'] : [])),
      rule: t('num.en.rule') }
  } },
  kai: { get label() { return t('num.kai.label') }, make() {
    if (Math.random() < 0.15) { const n = rnd(1, 2); return { big: `地下${n}階`, ans: ['ちか' + T.kai[n]], rule: t('num.kai.basement') } }
    const n = rnd(1, 10)
    return { big: `${n}階`, ans: [T.kai[n]], rule: t('num.kai.rule') }
  } },
  jikan: { get label() { return t('num.jikan.label') }, make() {
    const kind = pick(['h', 'h', 'm', 'hm'])
    if (kind === 'h') { const n = rnd(1, 12); return { big: `${n}時間`, ans: WRITE(HOURS[n], ...(n === 7 ? ['しちじかん'] : [])), rule: t('num.jikan.rule') } }
    if (kind === 'm') { const n = pick([10, 15, 20, 30, 40, 45, 50, rnd(1, 59)]); return { big: `${n}分`, ans: [compose(n, T.fun)], rule: t('num.jikan.fun') } }
    const h = rnd(1, 3)
    return { big: `${h}時間30分`, ans: [HOURS[h] + 'はん', HOURS[h] + compose(30, T.fun)], rule: t('num.ji.half') }
  } },
  mai: { get label() { return t('num.mai.label') }, make() { const n = rnd(1, 10); return { big: `${n}枚`, ans: [compose(n, T.mai)], rule: t('num.mai.rule') } } },
  nin: { get label() { return t('num.nin.label') }, make() {
    const n = rnd(1, 10)
    return { big: `${n}人`, ans: WRITE(T.nin[n], ...(n === 7 ? ['しちにん'] : [])), rule: t('num.nin.rule') }
  } },
  hiki: { get label() { return t('num.hiki.label') }, make() { const n = rnd(1, 10); return { big: `${n}匹`, ans: [compose(n, T.hiki)], rule: t('num.hiki.rule') } } },
  kaisu: { get label() { return t('num.kaisu.label') }, make() { const n = rnd(1, 10); return { big: `${n}回`, ans: [compose(n, T.kaisu)], rule: t('num.kaisu.rule') } } },
  satsu: { get label() { return t('num.satsu.label') }, make() { const n = rnd(1, 10); return { big: `${n}冊`, ans: [compose(n, T.satsu)], rule: t('num.satsu.rule') } } },
  hon: { get label() { return t('num.hon.label') }, make() { const n = rnd(1, 10); return { big: `${n}本`, ans: [compose(n, T.hon)], rule: t('num.hon.rule') } } },
  hai: { get label() { return t('num.hai.label') }, make() { const n = rnd(1, 10); return { big: `${n}杯`, ans: [compose(n, T.hai)], rule: t('num.hai.rule') } } },
}

// que categorias o caderno treina em cada lição e parte (índice da parte, de 0 a 2)
const MAP = {
  1: { 1: ['sai', 'date'] },
  2: { 0: ['kai'], 1: ['en'] },
  3: { 0: ['ji', 'nichi'] },
  4: { 0: ['jikan'] },
  6: { 0: ['mai'] },
  8: { 0: ['nin', 'hiki'] },
  9: { 0: ['kaisu', 'satsu', 'hon', 'hai', 'jikan'] },
}
export const numCats = (L, part = null) => {
  const m = MAP[L]
  if (!m) return []
  return part == null ? [...new Set(Object.values(m).flat())] : m[part] || []
}
export const hasNum = (L, part = null) => numCats(L, part).length > 0

export function makeNum(L, part = null) {
  const id = pick(numCats(L, part))
  const c = CATS[id]
  return { id, label: c.label, ...c.make() }
}
