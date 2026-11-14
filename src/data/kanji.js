// 漢字 hop! step! jump! 初級I (WEWORLD)
// Capítulos e kanji conforme o sumário do livro. Cada kanji: [kanji, significado, kun, on, palavras]
// Palavras: 'kanji《leitura》resto=significado' (exemplos escritos para este app, não copiados do livro)
const K = a => a.map(([k, m, kun, on, words]) => ({ k, m, kun: kun ? kun.split('・') : [], on: on ? on.split('・') : [], words }))

const ch0 = [
  { t: '① Kanji nascidos de formas', k: K([
    ['川', 'rio', 'かわ', 'セン', ['川《かわ》=rio', '小川《おがわ》=riacho']],
    ['山', 'montanha', 'やま', 'サン', ['山《やま》=montanha', '富士山《ふじさん》=Monte Fuji', '山田《やまだ》さん=Sr(a). Yamada']],
    ['田', 'campo de arroz', 'た', 'デン', ['田《た》んぼ=arrozal', '山田《やまだ》さん=Sr(a). Yamada', '水田《すいでん》=arrozal alagado']],
    ['日', 'dia, sol', 'ひ・か', 'ニチ・ジツ', ['日曜日《にちようび》=domingo', '誕生日《たんじょうび》=aniversário', '三日《みっか》=dia 3', '休日《きゅうじつ》=dia de folga']],
    ['月', 'lua, mês', 'つき', 'ゲツ・ガツ', ['月《つき》=lua', '月曜日《げつようび》=segunda-feira', '一月《いちがつ》=janeiro']],
    ['火', 'fogo', 'ひ', 'カ', ['火《ひ》=fogo', '火曜日《かようび》=terça-feira', '火山《かざん》=vulcão']],
    ['水', 'água', 'みず', 'スイ', ['水《みず》=água', '水曜日《すいようび》=quarta-feira', '水田《すいでん》=arrozal alagado']],
    ['木', 'árvore', 'き', 'モク・ボク', ['木《き》=árvore', '木曜日《もくようび》=quinta-feira']],
    ['金', 'ouro, dinheiro', 'かね', 'キン・コン', ['お金《かね》=dinheiro', '金曜日《きんようび》=sexta-feira']],
    ['土', 'terra, chão', 'つち', 'ド・ト', ['土《つち》=terra', '土曜日《どようび》=sábado']],
  ]) },
  { t: '② Combinando kanji', k: K([
    ['林', 'bosque', 'はやし', 'リン', ['林《はやし》=bosque', '小林《こばやし》さん=Sr(a). Kobayashi']],
    ['森', 'floresta', 'もり', 'シン', ['森《もり》=floresta', '森林《しんりん》=mata']],
    ['畑', 'horta, plantação', 'はたけ・はた', '', ['畑《はたけ》=horta', '田畑《たはた》=campos de cultivo']],
    ['里', 'aldeia, terra natal', 'さと', 'リ', ['里《さと》=aldeia', '山里《やまざと》=aldeia na montanha']],
    ['石', 'pedra', 'いし', 'セキ', ['石《いし》=pedra', '小石《こいし》=pedrinha', '石油《せきゆ》=petróleo']],
    ['岩', 'rocha', 'いわ', 'ガン', ['岩《いわ》=rocha', '岩山《いわやま》=montanha rochosa']],
  ]) },
  { t: '③ Números', k: K([
    ['一', 'um', 'ひと・ひとつ', 'イチ・イツ', ['一人《ひとり》=uma pessoa', '一《ひと》つ=um (coisa)', '一月《いちがつ》=janeiro']],
    ['二', 'dois', 'ふた・ふたつ', 'ニ', ['二人《ふたり》=duas pessoas', '二《ふた》つ=dois (coisas)', '二月《にがつ》=fevereiro']],
    ['三', 'três', 'み・みっつ', 'サン', ['三人《さんにん》=três pessoas', '三《みっ》つ=três (coisas)', '三月《さんがつ》=março']],
    ['四', 'quatro', 'よ・よん・よっつ', 'シ', ['四人《よにん》=quatro pessoas', '四《よっ》つ=quatro (coisas)', '四月《しがつ》=abril']],
    ['五', 'cinco', 'いつ・いつつ', 'ゴ', ['五人《ごにん》=cinco pessoas', '五《いつ》つ=cinco (coisas)', '五月《ごがつ》=maio']],
    ['六', 'seis', 'む・むっつ', 'ロク', ['六人《ろくにん》=seis pessoas', '六《むっ》つ=seis (coisas)', '六月《ろくがつ》=junho']],
    ['七', 'sete', 'なな・ななつ・なの', 'シチ', ['七《なな》つ=sete (coisas)', '七月《しちがつ》=julho', '七日《なのか》=dia 7']],
    ['八', 'oito', 'や・やっつ・よう', 'ハチ', ['八《やっ》つ=oito (coisas)', '八月《はちがつ》=agosto', '八日《ようか》=dia 8']],
    ['九', 'nove', 'ここの・ここのつ', 'キュウ・ク', ['九《ここの》つ=nove (coisas)', '九月《くがつ》=setembro', '九日《ここのか》=dia 9']],
    ['十', 'dez', 'とお', 'ジュウ・ジッ', ['十《とお》=dez (coisas)', '十月《じゅうがつ》=outubro', '十日《とおか》=dia 10']],
  ]) },
]

// Capítulos ainda não desenvolvidos: só a lista de kanji do sumário (chars)
const todo = (n, title, pt, chars) => ({ n, title, pt, ready: false, sections: [{ t: 'Kanji', k: [], chars }] })

export const KCHAPTERS = [
  { n: 0, title: 'ようこそ漢字の世界へ', pt: 'Bem-vindo ao mundo dos kanji', ready: true, sections: ch0 },
  todo(1, '新しい生活を始めよう', 'Vamos começar uma nova vida', '円百千万毎朝晩今何時'),
  todo(2, '学校へ行こう', 'Vamos à escola', '生先学校休名昼間半分'),
  todo(3, '予定を伝えよう', 'Vamos comunicar nossos planos', '帰来年去国行友週車人'),
  todo(4, '贈り物をしよう', 'Vamos dar um presente', '花本手紙父母'),
  todo(5, '友達と出かけよう', 'Vamos sair com amigos', '飲食茶酒好見映画'),
  todo(6, '希望を伝えよう', 'Vamos falar dos nossos desejos', '買物新古広近遠所外旅世界'),
  todo(7, 'ふるさとの話をしよう', 'Vamos falar da nossa terra natal', '町大小有静緑兄弟姉妹上下才犬'),
  todo(8, '週末の話をしよう', 'Vamos falar do fim de semana', '天気多少悪寒海青泳貝公歩'),
  todo(9, '電車で行こう', 'Vamos de trem', '駅電急特地鉄乗降'),
]

export const ALL_KANJI = KCHAPTERS.filter(c => c.ready).flatMap(c => c.sections.flatMap(s => s.k))
