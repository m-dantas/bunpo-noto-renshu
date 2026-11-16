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

const ch1 = [
  { t: '① Dinheiro e números grandes', k: K([
    ['円', 'iene', '', 'エン', ['円《えん》=iene', '百円《ひゃくえん》=100 ienes', '千円《せんえん》=1000 ienes']],
    ['百', 'cem', '', 'ヒャク', ['百《ひゃく》=cem', '三百《さんびゃく》=300', '六百《ろっぴゃく》=600']],
    ['千', 'mil', 'ち', 'セン', ['千《せん》=mil', '三千《さんぜん》=3000', '八千《はっせん》=8000']],
    ['万', 'dez mil', '', 'マン', ['一万円《いちまんえん》=10.000 ienes', '百万《ひゃくまん》=um milhão']],
  ]) },
  { t: '② Partes do dia', k: K([
    ['毎', 'todo(a), cada', '', 'マイ', ['毎日《まいにち》=todo dia', '毎週《まいしゅう》=toda semana', '毎年《まいとし》=todo ano']],
    ['朝', 'manhã', 'あさ', 'チョウ', ['朝《あさ》=manhã', '毎朝《まいあさ》=toda manhã', '今朝《けさ》=esta manhã']],
    ['晩', 'noite', '', 'バン', ['晩《ばん》=noite', '毎晩《まいばん》=toda noite', '今晩《こんばん》=esta noite']],
  ]) },
  { t: '③ Agora e as horas', k: K([
    ['今', 'agora', 'いま', 'コン・キン', ['今《いま》=agora', '今日《きょう》=hoje', '今年《ことし》=este ano']],
    ['何', 'o quê, quanto', 'なに・なん', 'カ', ['何《なに》=o quê', '何人《なんにん》=quantas pessoas', '何時《なんじ》=que horas']],
    ['時', 'hora, tempo', 'とき', 'ジ', ['一時《いちじ》=1 hora', '時々《ときどき》=às vezes', '時間《じかん》=tempo, horas']],
  ]) },
]

const ch2 = [
  { t: '① Escola', k: K([
    ['生', 'vida, nascer', 'い・いきる・う・うまれる・なま', 'セイ・ショウ', ['学生《がくせい》=estudante', '生《う》まれる=nascer', '一年生《いちねんせい》=aluno do 1º ano']],
    ['先', 'antes, à frente', 'さき', 'セン', ['先生《せんせい》=professor(a)', '先月《せんげつ》=mês passado', '先週《せんしゅう》=semana passada']],
    ['学', 'estudar', 'まな・まなぶ', 'ガク', ['学校《がっこう》=escola', '大学《だいがく》=universidade', '留学《りゅうがく》=estudar no exterior']],
    ['校', 'escola', '', 'コウ', ['学校《がっこう》=escola', '高校《こうこう》=ensino médio', '校長《こうちょう》=diretor(a)']],
  ]) },
  { t: '② Descanso, nome e meio-dia', k: K([
    ['休', 'descansar', 'やす・やすむ', 'キュウ', ['休《やす》み=folga', '昼休《ひるやす》み=intervalo do almoço', '休日《きゅうじつ》=dia de folga']],
    ['名', 'nome', 'な', 'メイ・ミョウ', ['名前《なまえ》=nome', '有名《ゆうめい》=famoso', '名字《みょうじ》=sobrenome']],
    ['昼', 'meio-dia, dia', 'ひる', 'チュウ', ['昼《ひる》=meio-dia', '昼《ひる》ご飯《はん》=almoço', '昼休《ひるやす》み=intervalo do almoço']],
  ]) },
  { t: '③ Intervalo, metade e minutos', k: K([
    ['間', 'intervalo, entre', 'あいだ・ま', 'カン・ケン', ['時間《じかん》=tempo, horas', '一週間《いっしゅうかん》=uma semana', '人間《にんげん》=ser humano']],
    ['半', 'metade', 'なか', 'ハン', ['二時半《にじはん》=2h30', '半分《はんぶん》=metade', '半年《はんとし》=meio ano']],
    ['分', 'minuto; entender', 'わ・わかる・わける', 'ブン・フン・ブ', ['五分《ごふん》=5 minutos', '分《わ》かる=entender', '自分《じぶん》=si mesmo']],
  ]) },
]

const ch3 = [
  { t: '① Ir, vir e voltar', k: K([
    ['帰', 'voltar', 'かえ・かえる', 'キ', ['帰《かえ》る=voltar', '帰国《きこく》=voltar ao país', '帰《かえ》り=volta']],
    ['来', 'vir', 'く・くる・き', 'ライ', ['来《く》る=vir', '来週《らいしゅう》=semana que vem', '来年《らいねん》=ano que vem']],
    ['行', 'ir', 'い・いく・おこな', 'コウ・ギョウ', ['行《い》く=ir', '旅行《りょこう》=viagem', '銀行《ぎんこう》=banco']],
    ['去', 'passado, ir embora', 'さ・さる', 'キョ・コ', ['去年《きょねん》=ano passado', '去《さ》る=ir embora']],
  ]) },
  { t: '② Anos, países e amigos', k: K([
    ['年', 'ano', 'とし', 'ネン', ['今年《ことし》=este ano', '去年《きょねん》=ano passado', '一年《いちねん》=um ano']],
    ['国', 'país', 'くに', 'コク', ['国《くに》=país', '外国《がいこく》=exterior', '帰国《きこく》=voltar ao país']],
    ['友', 'amigo', 'とも', 'ユウ', ['友達《ともだち》=amigo', '友人《ゆうじん》=amigo(a)', '親友《しんゆう》=melhor amigo']],
  ]) },
  { t: '③ Semana, carro e pessoa', k: K([
    ['週', 'semana', '', 'シュウ', ['今週《こんしゅう》=esta semana', '毎週《まいしゅう》=toda semana', '週末《しゅうまつ》=fim de semana']],
    ['車', 'carro, veículo', 'くるま', 'シャ', ['車《くるま》=carro', '電車《でんしゃ》=trem', '自転車《じてんしゃ》=bicicleta']],
    ['人', 'pessoa', 'ひと', 'ジン・ニン', ['人《ひと》=pessoa', '日本人《にほんじん》=japonês(a)', '三人《さんにん》=três pessoas']],
  ]) },
]

const ch4 = [
  { t: '① Flor e livro', k: K([
    ['花', 'flor', 'はな', 'カ', ['花《はな》=flor', '花見《はなみ》=ver as flores de cerejeira', '花火《はなび》=fogos de artifício']],
    ['本', 'livro, origem', 'もと', 'ホン', ['本《ほん》=livro', '日本《にほん》=Japão', '三本《さんぼん》=três (objetos longos)']],
  ]) },
  { t: '② Mão e papel', k: K([
    ['手', 'mão', 'て', 'シュ', ['手《て》=mão', '上手《じょうず》=habilidoso', '下手《へた》=sem habilidade']],
    ['紙', 'papel', 'かみ', 'シ', ['紙《かみ》=papel', '手紙《てがみ》=carta', '表紙《ひょうし》=capa']],
  ]) },
  { t: '③ Pai e mãe', k: K([
    ['父', 'pai', 'ちち', 'フ', ['父《ちち》=meu pai', 'お父《とう》さん=pai (de outra pessoa)', '父《ちち》の日《ひ》=Dia dos Pais']],
    ['母', 'mãe', 'はは', 'ボ', ['母《はは》=minha mãe', 'お母《かあ》さん=mãe (de outra pessoa)', '母《はは》の日《ひ》=Dia das Mães']],
  ]) },
]

const ch5 = [
  { t: '① Beber e comer', k: K([
    ['飲', 'beber', 'の・のむ', 'イン', ['飲《の》む=beber', '飲《の》み物《もの》=bebida', '飲食《いんしょく》=comer e beber']],
    ['食', 'comer', 'た・たべる・く', 'ショク', ['食《た》べる=comer', '食《た》べ物《もの》=comida', '食事《しょくじ》=refeição']],
    ['茶', 'chá', '', 'チャ・サ', ['お茶《ちゃ》=chá', '緑茶《りょくちゃ》=chá verde', '紅茶《こうちゃ》=chá preto']],
    ['酒', 'saquê, bebida alcoólica', 'さけ・さか', 'シュ', ['お酒《さけ》=bebida alcoólica', '日本酒《にほんしゅ》=saquê', '居酒屋《いざかや》=izakaya']],
  ]) },
  { t: '② Gostar e ver', k: K([
    ['好', 'gostar', 'す・すき・このむ', 'コウ', ['好《す》き=gostar', '大好《だいす》き=adorar', '好《す》きな食《た》べ物《もの》=comida favorita']],
    ['見', 'ver', 'み・みる', 'ケン', ['見《み》る=ver', '花見《はなみ》=ver as flores', '見物《けんぶつ》=turismo']],
  ]) },
  { t: '③ Cinema', k: K([
    ['映', 'projetar, refletir', 'うつ・うつる', 'エイ', ['映画《えいが》=filme', '映画館《えいがかん》=cinema', '映《うつ》る=refletir']],
    ['画', 'quadro, filme', '', 'ガ・カク', ['映画《えいが》=filme', '漫画《まんが》=mangá', '画家《がか》=pintor(a)']],
  ]) },
]

const ch6 = [
  { t: '① Comprar e coisas novas ou velhas', k: K([
    ['買', 'comprar', 'か・かう', 'バイ', ['買《か》う=comprar', '買《か》い物《もの》=compras', '買《か》い物《もの》をする=fazer compras']],
    ['物', 'coisa, objeto', 'もの', 'ブツ・モツ', ['物《もの》=coisa', '荷物《にもつ》=bagagem', '動物《どうぶつ》=animal']],
    ['新', 'novo', 'あたら・あたらしい', 'シン', ['新《あたら》しい=novo', '新聞《しんぶん》=jornal', '新年《しんねん》=ano novo']],
    ['古', 'velho (coisas)', 'ふる・ふるい', 'コ', ['古《ふる》い=velho', '古本《ふるほん》=livro usado', '中古《ちゅうこ》=de segunda mão']],
  ]) },
  { t: '② Amplo, perto, longe e lugar', k: K([
    ['広', 'amplo', 'ひろ・ひろい', 'コウ', ['広《ひろ》い=amplo', '広場《ひろば》=praça', '広《ひろ》い部屋《へや》=quarto amplo']],
    ['近', 'perto', 'ちか・ちかい', 'キン', ['近《ちか》い=perto', '近《ちか》く=nas proximidades', '近所《きんじょ》=vizinhança']],
    ['遠', 'longe', 'とお・とおい', 'エン', ['遠《とお》い=longe', '遠足《えんそく》=excursão', '遠《とお》くの町《まち》=cidade distante']],
    ['所', 'lugar', 'ところ', 'ショ', ['所《ところ》=lugar', '近所《きんじょ》=vizinhança', '台所《だいどころ》=cozinha']],
  ]) },
  { t: '③ Fora, viagem e mundo', k: K([
    ['外', 'fora, exterior', 'そと・ほか', 'ガイ・ゲ', ['外《そと》=fora', '外国《がいこく》=exterior', '外国人《がいこくじん》=estrangeiro(a)']],
    ['旅', 'viagem', 'たび', 'リョ', ['旅《たび》=viagem', '旅行《りょこう》=viagem', '旅館《りょかん》=pousada japonesa']],
    ['世', 'mundo, geração', 'よ', 'セ・セイ', ['世界《せかい》=mundo', '世紀《せいき》=século']],
    ['界', 'mundo, limite', '', 'カイ', ['世界《せかい》=mundo', '世界一《せかいいち》=o melhor do mundo']],
  ]) },
]

const ch7 = [
  { t: '① Cidade, tamanho e paisagem', k: K([
    ['町', 'cidade, bairro', 'まち', 'チョウ', ['町《まち》=cidade', '下町《したまち》=bairro popular', '町《まち》の人《ひと》=moradores da cidade']],
    ['大', 'grande', 'おお・おおきい', 'ダイ・タイ', ['大《おお》きい=grande', '大学《だいがく》=universidade', '大切《たいせつ》=importante']],
    ['小', 'pequeno', 'ちい・ちいさい・こ・お', 'ショウ', ['小《ちい》さい=pequeno', '小学校《しょうがっこう》=escola primária', '小川《おがわ》=riacho']],
    ['有', 'ter, existir', 'あ・ある', 'ユウ・ウ', ['有名《ゆうめい》=famoso', '有料《ゆうりょう》=pago, com taxa', '有《あ》る=existir (raro em kanji)']],
    ['静', 'quieto', 'しず・しずか', 'セイ', ['静《しず》か=tranquilo', '静岡《しずおか》=Shizuoka']],
    ['緑', 'verde', 'みどり', 'リョク', ['緑《みどり》=verde', '緑茶《りょくちゃ》=chá verde', '緑《みどり》の山《やま》=montanha verde']],
  ]) },
  { t: '② Irmãos', k: K([
    ['兄', 'irmão mais velho', 'あに', 'ケイ・キョウ', ['兄《あに》=meu irmão mais velho', 'お兄《にい》さん=irmão mais velho (de outra pessoa)', '兄弟《きょうだい》=irmãos']],
    ['弟', 'irmão mais novo', 'おとうと', 'ダイ・テイ', ['弟《おとうと》=meu irmão mais novo', '弟《おとうと》さん=irmão mais novo (de outra pessoa)', '兄弟《きょうだい》=irmãos']],
    ['姉', 'irmã mais velha', 'あね', 'シ', ['姉《あね》=minha irmã mais velha', 'お姉《ねえ》さん=irmã mais velha (de outra pessoa)', '姉妹《しまい》=irmãs']],
    ['妹', 'irmã mais nova', 'いもうと', 'マイ', ['妹《いもうと》=minha irmã mais nova', '妹《いもうと》さん=irmã mais nova (de outra pessoa)', '姉妹《しまい》=irmãs']],
  ]) },
  { t: '③ Em cima, embaixo, idade e cachorro', k: K([
    ['上', 'em cima', 'うえ・かみ・あがる', 'ジョウ', ['上《うえ》=em cima', '上手《じょうず》=habilidoso', '川上《かわかみ》=nascente do rio']],
    ['下', 'embaixo', 'した・しも・くださる', 'カ・ゲ', ['下《した》=embaixo', '下手《へた》=sem habilidade', '地下《ちか》=subsolo']],
    ['才', 'anos de idade; talento', '', 'サイ', ['十五才《じゅうごさい》=15 anos', '天才《てんさい》=gênio']],
    ['犬', 'cachorro', 'いぬ', 'ケン', ['犬《いぬ》=cachorro', '子犬《こいぬ》=filhote de cachorro', '小犬《こいぬ》=cãozinho']],
  ]) },
]

const ch8 = [
  { t: '① Tempo e quantidade', k: K([
    ['天', 'céu', 'あま・あめ', 'テン', ['天気《てんき》=tempo (clima)', '天《てん》の川《がわ》=Via Láctea', '天才《てんさい》=gênio']],
    ['気', 'ânimo, ar', 'き', 'キ・ケ', ['天気《てんき》=tempo (clima)', '元気《げんき》=bem de saúde', '人気《にんき》=popularidade']],
    ['多', 'muito', 'おお・おおい', 'タ', ['多《おお》い=muito', '多《おお》くの人《ひと》=muitas pessoas']],
    ['少', 'pouco', 'すく・すくない・すこ・すこし', 'ショウ', ['少《すく》ない=pouco', '少《すこ》し=um pouco', '少年《しょうねん》=menino']],
  ]) },
  { t: '② Ruim, frio, mar e azul', k: K([
    ['悪', 'ruim', 'わる・わるい', 'アク', ['悪《わる》い=ruim', '悪口《わるくち》=falar mal', '最悪《さいあく》=o pior']],
    ['寒', 'frio (clima)', 'さむ・さむい', 'カン', ['寒《さむ》い=frio', '寒《さむ》さ=frio (intensidade)', '寒気《さむけ》=calafrio']],
    ['海', 'mar', 'うみ', 'カイ', ['海《うみ》=mar', '海外《かいがい》=exterior', '日本海《にほんかい》=Mar do Japão']],
    ['青', 'azul', 'あお・あおい', 'セイ', ['青《あお》い=azul', '青空《あおぞら》=céu azul', '青《あお》い海《うみ》=mar azul']],
  ]) },
  { t: '③ Nadar, concha, parque e andar', k: K([
    ['泳', 'nadar', 'およ・およぐ', 'エイ', ['泳《およ》ぐ=nadar', '水泳《すいえい》=natação']],
    ['貝', 'concha, molusco', 'かい', '', ['貝《かい》=concha', '貝《かい》がら=casca de concha']],
    ['公', 'público', 'おおやけ', 'コウ', ['公園《こうえん》=parque', '公立《こうりつ》=público (escola, etc.)']],
    ['歩', 'andar', 'ある・あるく・あゆむ', 'ホ・ブ', ['歩《ある》く=andar', '散歩《さんぽ》=passeio', '歩《ある》いて行《い》く=ir a pé']],
  ]) },
]

const ch9 = [
  { t: '① Estação, trem e expresso', k: K([
    ['駅', 'estação', '', 'エキ', ['駅《えき》=estação', '駅前《えきまえ》=em frente à estação', '駅員《えきいん》=funcionário da estação']],
    ['電', 'eletricidade', '', 'デン', ['電車《でんしゃ》=trem', '電話《でんわ》=telefone', '電気《でんき》=eletricidade, luz']],
    ['急', 'pressa, urgente', 'いそ・いそぐ', 'キュウ', ['急《いそ》ぐ=apressar-se', '急行《きゅうこう》=trem expresso', '急《きゅう》に=de repente']],
    ['特', 'especial', '', 'トク', ['特急《とっきゅう》=trem super-expresso', '特別《とくべつ》=especial', '特《とく》に=especialmente']],
  ]) },
  { t: '② Metrô', k: K([
    ['地', 'terra, lugar', '', 'チ・ジ', ['地下《ちか》=subsolo', '地図《ちず》=mapa', '地下鉄《ちかてつ》=metrô']],
    ['鉄', 'ferro', '', 'テツ', ['鉄《てつ》=ferro', '地下鉄《ちかてつ》=metrô', '私鉄《してつ》=ferrovia particular']],
  ]) },
  { t: '③ Embarcar e descer', k: K([
    ['乗', 'embarcar, montar', 'の・のる', 'ジョウ', ['乗《の》る=embarcar', '乗《の》り物《もの》=veículo', '乗車《じょうしゃ》=embarque']],
    ['降', 'descer; chover', 'お・おりる・ふ・ふる', 'コウ', ['降《お》りる=descer', '降《ふ》る=cair (chuva)', '雨《あめ》が降《ふ》る=chover']],
  ]) },
]

export const KCHAPTERS = [
  { n: 0, title: 'ようこそ漢字の世界へ', pt: 'Bem-vindo ao mundo dos kanji', ready: true, sections: ch0 },
  { n: 1, title: '新しい生活を始めよう', pt: 'Vamos começar uma nova vida', ready: true, sections: ch1 },
  { n: 2, title: '学校へ行こう', pt: 'Vamos à escola', ready: true, sections: ch2 },
  { n: 3, title: '予定を伝えよう', pt: 'Vamos comunicar nossos planos', ready: true, sections: ch3 },
  { n: 4, title: '贈り物をしよう', pt: 'Vamos dar um presente', ready: true, sections: ch4 },
  { n: 5, title: '友達と出かけよう', pt: 'Vamos sair com amigos', ready: true, sections: ch5 },
  { n: 6, title: '希望を伝えよう', pt: 'Vamos falar dos nossos desejos', ready: true, sections: ch6 },
  { n: 7, title: 'ふるさとの話をしよう', pt: 'Vamos falar da nossa terra natal', ready: true, sections: ch7 },
  { n: 8, title: '週末の話をしよう', pt: 'Vamos falar do fim de semana', ready: true, sections: ch8 },
  { n: 9, title: '電車で行こう', pt: 'Vamos de trem', ready: true, sections: ch9 },
]

export const ALL_KANJI = KCHAPTERS.filter(c => c.ready).flatMap(c => c.sections.flatMap(s => s.k))
