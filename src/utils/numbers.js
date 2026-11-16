// Números e contadores do caderno (別冊): idade, datas, horas, preços, andares, duração e contadores.
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
  sai: { label: 'Idade (歳)', make() {
    const n = pick([rnd(1, 12), rnd(13, 19), 20, 20, rnd(21, 60)])
    return { big: `${n}歳`, ans: n === 20 ? ['はたち'] : WRITE(compose(n, T.sai), ...alt7(compose(n, T.sai), n)),
      rule: '歳: 1 いっさい, 8 はっさい, 10 じゅっさい; 20 anos é はたち.' }
  } },
  date: { label: 'Data (月日)', make() {
    const m = rnd(1, 12), d = pick([rnd(1, 10), rnd(1, 31), rnd(11, 31)])
    return { big: `${m}月${d}日`, ans: [MONTH[m] + DAY[d]],
      rule: 'Meses: 4 しがつ, 7 しちがつ, 9 くがつ. Dias: 1 ついたち, 2 ふつか … 10 とおか, 14 じゅうよっか, 20 はつか, 24 にじゅうよっか.' }
  } },
  ji: { label: 'Horas (時・分)', make() {
    const h = rnd(1, 12), kind = pick(['jo', 'jo', 'min', 'han'])
    if (kind === 'jo') return { big: `${h}:00`, ans: [HOUR[h]], rule: 'Horas: 4 よじ, 7 しちじ, 9 くじ.' }
    if (kind === 'han') return { big: `${h}:30`, ans: [HOUR[h] + 'はん', HOUR[h] + compose(30, T.fun)], rule: '30 minutos: はん (ou さんじゅっぷん).' }
    const m = pick([5, 10, 15, 20, 25, 40, 45, 50, rnd(1, 59)])
    return { big: `${h}:${String(m).padStart(2, '0')}`, ans: [HOUR[h] + compose(m, T.fun)], rule: '分: 1 いっぷん, 3 さんぷん, 4 よんぷん, 6 ろっぷん, 8 はっぷん, 10 じゅっぷん; os outros ふん.' }
  } },
  nichi: { label: 'Dia do mês (日)', make() {
    const d = rnd(1, 31)
    return { big: `${d}日`, ans: [DAY[d]], rule: 'Dias 1–10, 14, 20 e 24 são irregulares; 2 ふつか, 3 みっか, 4 よっか, 5 いつか, 6 むいか, 7 なのか, 8 ようか, 9 ここのか, 10 とおか.' }
  } },
  en: { label: 'Preço (円)', make() {
    const n = pick([rnd(1, 9) * 100, rnd(1, 24) * 1000, rnd(1, 9) * 1000 + rnd(1, 9) * 100, rnd(1, 9) * 10000 + rnd(0, 9) * 1000, rnd(1, 99) * 100])
    let s = readBase(n)
    if (s.endsWith('よん')) s = s.slice(0, -2) + 'よ'
    return { big: `${n}円`, ans: WRITE(s + 'えん', ...(n % 10 === 7 ? [s.replace(/なな$/, 'しち') + 'えん'] : [])),
      rule: '300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく; 3000 さんぜん, 8000 はっせん; 10000 いちまん; 4円 よえん.' }
  } },
  kai: { label: 'Andar (階)', make() {
    if (Math.random() < 0.15) { const n = rnd(1, 2); return { big: `地下${n}階`, ans: ['ちか' + T.kai[n]], rule: '地下 = ちか (subsolo).' } }
    const n = rnd(1, 10)
    return { big: `${n}階`, ans: [T.kai[n]], rule: '階: 1 いっかい, 3 さんがい, 6 ろっかい, 8 はっかい, 10 じゅっかい.' }
  } },
  jikan: { label: 'Duração (時間・分)', make() {
    const kind = pick(['h', 'h', 'm', 'hm'])
    if (kind === 'h') { const n = rnd(1, 12); return { big: `${n}時間`, ans: WRITE(HOURS[n], ...(n === 7 ? ['しちじかん'] : [])), rule: '時間: 4 よじかん, 7 ななじかん (しちじかん), 9 くじかん.' } }
    if (kind === 'm') { const n = pick([10, 15, 20, 30, 40, 45, 50, rnd(1, 59)]); return { big: `${n}分`, ans: [compose(n, T.fun)], rule: '分: 1 いっぷん, 3 さんぷん, 4 よんぷん, 6 ろっぷん, 8 はっぷん, 10 じゅっぷん.' } }
    const h = rnd(1, 3)
    return { big: `${h}時間30分`, ans: [HOURS[h] + 'はん', HOURS[h] + compose(30, T.fun)], rule: '30 minutos: はん (ou さんじゅっぷん).' }
  } },
  mai: { label: 'Folhas, ingressos (枚)', make() { const n = rnd(1, 10); return { big: `${n}枚`, ans: [compose(n, T.mai)], rule: '枚: regular, só 4 よんまい e 7 ななまい merecem atenção.' } } },
  nin: { label: 'Pessoas (人)', make() {
    const n = rnd(1, 10)
    return { big: `${n}人`, ans: WRITE(T.nin[n], ...(n === 7 ? ['しちにん'] : [])), rule: '人: 1 ひとり, 2 ふたり, 4 よにん, 7 ななにん (しちにん); o resto: número + にん.' }
  } },
  hiki: { label: 'Animais pequenos (匹)', make() { const n = rnd(1, 10); return { big: `${n}匹`, ans: [compose(n, T.hiki)], rule: '匹: 1 いっぴき, 3 さんびき, 6 ろっぴき, 8 はっぴき, 10 じゅっぴき; os outros ひき.' } } },
  kaisu: { label: 'Vezes (回)', make() { const n = rnd(1, 10); return { big: `${n}回`, ans: [compose(n, T.kaisu)], rule: '回: 1 いっかい, 6 ろっかい, 8 はっかい, 10 じゅっかい.' } } },
  satsu: { label: 'Livros (冊)', make() { const n = rnd(1, 10); return { big: `${n}冊`, ans: [compose(n, T.satsu)], rule: '冊: 1 いっさつ, 8 はっさつ, 10 じゅっさつ.' } } },
  hon: { label: 'Objetos longos (本)', make() { const n = rnd(1, 10); return { big: `${n}本`, ans: [compose(n, T.hon)], rule: '本: 1 いっぽん, 3 さんぼん, 6 ろっぽん, 8 はっぽん, 10 じゅっぽん; os outros ほん.' } } },
  hai: { label: 'Copos, xícaras (杯)', make() { const n = rnd(1, 10); return { big: `${n}杯`, ans: [compose(n, T.hai)], rule: '杯: 1 いっぱい, 3 さんばい, 6 ろっぱい, 8 はっぱい, 10 じゅっぱい; os outros はい.' } } },
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
