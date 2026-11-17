// Palavras-chave → frase (como os exercícios de transformação do caderno).
// [parte (0 a 2), palavras-chave, frase dividida em blocos por "/", tradução]
// Os blocos aceitam kanji ou kana; os dígitos podem ser escritos em algarismos.
const RAW = {
  1: [
    [0, '私・ワン', '私《わたし》は/ワンです', 'Eu sou o Wan.'],
    [0, '私・会社員（negativo）', '私《わたし》は/会社員《かいしゃいん》じゃありません', 'Não sou funcionário de empresa.'],
    [0, '西川さん・ふじみ大学・学生', '西川《にしかわ》さんは/ふじみ大学《だいがく》の/学生《がくせい》です', 'O Nishikawa é estudante da Universidade Fujimi.'],
    [1, '私・25歳', '私《わたし》は/25歳《にじゅうごさい》です', 'Tenho 25 anos.'],
    [1, '私の誕生日・9月8日', '私《わたし》の/誕生日《たんじょうび》は/9月《くがつ》8日《ようか》です', 'Meu aniversário é 8 de setembro.'],
    [2, '私・趣味・旅行', '私《わたし》の/趣味《しゅみ》は/旅行《りょこう》です', 'Meu hobby é viajar.'],
    [2, 'ワンさん・趣味・料理 / ナタポンさん・趣味・料理', 'ワンさんの/趣味《しゅみ》は/料理《りょうり》です。/ナタポンさんの/趣味《しゅみ》も/料理《りょうり》です', 'O hobby do Wan é cozinhar. O do Natapon também.'],
  ],
  2: [
    [0, 'レストラン・5階', 'レストランは/5階《ごかい》です', 'O restaurante fica no 5º andar.'],
    [0, 'トイレ・ここ', 'トイレは/ここです', 'O banheiro é aqui.'],
    [0, '靴屋・あそこ', '靴屋《くつや》は/あそこです', 'A sapataria é ali.'],
    [1, 'これ・2000円', 'これは/2000円《にせんえん》です', 'Isto custa 2000 ienes.'],
    [1, 'あの・シャツ・3000円', 'あの/シャツは/3000円《さんぜんえん》です', 'Aquela camisa custa 3000 ienes.'],
    [1, 'それ・15000円', 'それは/15000円《いちまんごせんえん》です', 'Isso custa 15000 ienes.'],
    [2, 'これ・英語・何', 'これは/英語《えいご》で/何《なん》ですか', 'Como se diz isto em inglês?'],
    [2, 'これ・私・財布', 'これは/私《わたし》の/財布《さいふ》です', 'Esta é a minha carteira.'],
    [2, 'コーヒー・2つ', 'コーヒーを/二《ふた》つ/ください', 'Dois cafés, por favor.'],
  ],
  3: [
    [0, 'さくら病院・9時半・3時', 'さくら病院《びょういん》は/9時半《くじはん》から/3時《さんじ》までです', 'O hospital Sakura funciona das 9h30 às 3h.'],
    [0, '1日・日曜日', '1日《ついたち》は/日曜日《にちようび》です', 'O dia 1 é domingo.'],
    [0, '銀行・午前9時・午後3時', '銀行《ぎんこう》は/午前《ごぜん》9時《くじ》から/午後《ごご》3時《さんじ》までです', 'O banco abre das 9h às 15h.'],
    [1, '朝ご飯・食べる', '朝《あさ》ご飯《はん》を/食《た》べます', 'Tomo café da manhã.'],
    [1, '富士山・行く', '富士山《ふじさん》へ/行《い》きます', 'Vou ao Monte Fuji.'],
    [1, '横浜・花火・見る', '横浜《よこはま》で/花火《はなび》を/見《み》ます', 'Vejo fogos de artifício em Yokohama.'],
    [2, '毎朝・7時・起きる', '毎朝《まいあさ》/7時《しちじ》に/起《お》きます', 'Acordo às 7h toda manhã.'],
    [2, 'パン・卵・食べる', 'パンや/卵《たまご》などを/食《た》べます', 'Como pão, ovos e outras coisas.'],
    [2, '日曜日・どこ・行く（negativo）', '日曜日《にちようび》は/どこへも/行《い》きません', 'No domingo não vou a lugar nenhum.'],
  ],
  4: [
    [0, '北海道・日本・北', '北海道《ほっかいどう》は/日本《にほん》の/北《きた》です', 'Hokkaido fica ao norte do Japão.'],
    [0, '私の国・日本・2時間', '私《わたし》の/国《くに》から/日本《にほん》まで/2時間《にじかん》です', 'Do meu país até o Japão são 2 horas.'],
    [0, '東京・沖縄・飛行機・3時間', '東京《とうきょう》から/沖縄《おきなわ》まで/飛行機《ひこうき》で/3時間《さんじかん》です', 'De Tóquio a Okinawa são 3 horas de avião.'],
    [1, '箱根・温泉・ある', '箱根《はこね》に/温泉《おんせん》が/あります', 'Em Hakone há fontes termais.'],
    [1, 'この町・小さい・にぎやか', 'この/町《まち》は/小《ちい》さいですが、/にぎやかです', 'Esta cidade é pequena, mas movimentada.'],
    [1, 'これ・古い・お寺', 'これは/古《ふる》い/お寺《てら》です', 'Este é um templo antigo.'],
    [2, 'タイ・一年中・とても・暑い', 'タイは/一年中《いちねんじゅう》/とても/暑《あつ》いです', 'Na Tailândia faz muito calor o ano todo.'],
    [2, 'ロシア・夏・あまり・暑い', 'ロシアは/夏《なつ》/あまり/暑《あつ》くないです', 'Na Rússia, no verão, não faz muito calor.'],
  ],
  5: [
    [0, '昨日・勉強する', '昨日《きのう》/勉強《べんきょう》しました', 'Estudei ontem.'],
    [0, '友達・サッカー', '友達《ともだち》と/サッカーを/しました', 'Joguei futebol com um amigo.'],
    [0, '先週の日曜日・うち・勉強する', '先週《せんしゅう》の/日曜日《にちようび》/うちで/勉強《べんきょう》しました', 'No domingo passado estudei em casa.'],
    [1, '今朝・寒い', '今朝《けさ》は/寒《さむ》かったです', 'Esta manhã estava frio.'],
    [1, '公園・静か', '公園《こうえん》は/静《しず》かでした', 'O parque estava tranquilo.'],
    [1, 'パーティー・にぎやか（negativo）', 'パーティーは/にぎやかじゃありませんでした', 'A festa não estava animada.'],
    [2, '新宿・映画・見る・行く', '新宿《しんじゅく》へ/映画《えいが》を/見《み》に/行《い》きます', 'Vou a Shinjuku ver um filme.'],
    [2, '私・パソコン', '私《わたし》は/パソコンが/ほしいです', 'Eu quero um computador.'],
    [2, '映画・見る（たい）', '映画《えいが》を/見《み》たいです', 'Quero ver um filme.'],
  ],
  6: [
    [0, '今晩・一緒に・ご飯', '今晩《こんばん》/一緒《いっしょ》に/ご飯《はん》を/食《た》べませんか', 'Que tal jantarmos juntos esta noite?'],
    [0, '来週の日曜日・横浜・花火', '来週《らいしゅう》の/日曜日《にちようび》、/横浜《よこはま》で/花火《はなび》が/あります', 'No domingo que vem há fogos em Yokohama.'],
    [0, '映画のチケット・2枚', '映画《えいが》の/チケットが/2枚《にまい》あります', 'Tenho dois ingressos de cinema.'],
    [1, '横浜・鎌倉・近い', '横浜《よこはま》と/鎌倉《かまくら》と/どちらが/近《ちか》いですか', 'Qual é mais perto, Yokohama ou Kamakura?'],
    [1, 'みどり寿司・さくら寿司・安い', 'みどり寿司《ずし》は/さくら寿司《ずし》より/安《やす》いです', 'O Midori Sushi é mais barato que o Sakura Sushi.'],
    [1, '食べ物・ラーメン・いちばん・好き', '食《た》べ物《もの》で/ラーメンが/いちばん/好《す》きです', 'De comidas, o que mais gosto é de lámen.'],
    [2, 'もう・昼ご飯・食べる', 'もう/昼《ひる》ご飯《はん》を/食《た》べましたか', 'Você já almoçou?'],
  ],
  7: [
    [0, '喫茶店・コンビニ・上', '喫茶店《きっさてん》は/コンビニの/上《うえ》に/あります', 'A cafeteria fica em cima da loja de conveniência.'],
    [0, '私・病院・前・いる', '私《わたし》は/病院《びょういん》の/前《まえ》に/います', 'Estou em frente ao hospital.'],
    [1, 'サラダ・作る（てください）', 'サラダを/作《つく》ってください', 'Faça a salada, por favor.'],
    [1, 'ナイフ・りんご・切る', 'ナイフで/りんごを/切《き》ります', 'Corto a maçã com a faca.'],
    [1, 'スープ・作る・かた', 'スープの/作《つく》り方《かた》', 'O modo de fazer a sopa.'],
    [2, 'CD・聞く（ています）', 'CDを/聞《き》いています', 'Estou ouvindo um CD.'],
    [2, 'ケーキ・切る（ましょうか）', 'ケーキを/切《き》りましょうか', 'Quer que eu corte o bolo?'],
    [2, 'お茶・まだ・ある', 'お茶《ちゃ》は/まだ/あります', 'Ainda tem chá.'],
  ],
  8: [
    [0, '私・大阪・住む', '私《わたし》は/大阪《おおさか》に/住《す》んでいます', 'Moro em Osaka.'],
    [0, '私・弟・2人', '私《わたし》は/弟《おとうと》と/2人《ふたり》で/住《す》んでいます', 'Moro com meu irmão mais novo, nós dois.'],
    [0, '姉・高校・英語・教える', '姉《あね》は/高校《こうこう》で/英語《えいご》を/教《おし》えています', 'Minha irmã ensina inglês numa escola de ensino médio.'],
    [1, 'カルロスさん・ギター・上手', 'カルロスさんは/ギターが/上手《じょうず》です', 'O Carlos toca bem violão.'],
    [1, '父・背・高い', '父《ちち》は/背《せ》が/高《たか》いです', 'Meu pai é alto.'],
    [1, '弟・目・大きい・髪・短い', '弟《おとうと》は/目《め》が/大《おお》きくて、/髪《かみ》が/短《みじか》いです', 'Meu irmão tem olhos grandes e cabelo curto.'],
    [2, '私・ワンさん・本・あげる', '私《わたし》は/ワンさんに/本《ほん》を/あげます', 'Dou um livro para o Wan.'],
    [2, '私・アンナさん・時計・もらう', '私《わたし》は/アンナさんに/時計《とけい》を/もらいました', 'Ganhei um relógio da Anna.'],
    [2, '祖母・私・手紙・くれる', '祖母《そぼ》が/私《わたし》に/手紙《てがみ》を/くれました', 'Minha avó me mandou uma carta.'],
  ],
  9: [
    [0, '趣味・本・読む', '趣味《しゅみ》は/本《ほん》を/読《よ》むことです', 'Meu hobby é ler livros.'],
    [0, '私・よく・映画館・行く', '私《わたし》は/よく/映画館《えいがかん》へ/行《い》きます', 'Vou muito ao cinema.'],
    [0, '1週間・2回・プール・泳ぐ', '1週間《いっしゅうかん》に/2回《にかい》/プールで/泳《およ》ぎます', 'Nado na piscina duas vezes por semana.'],
    [1, '私・料理・できる', '私《わたし》は/料理《りょうり》が/できます', 'Eu sei cozinhar.'],
    [1, 'バクさん・ケーキ・作る・できる', 'バクさんは/ケーキを/作《つく》ることが/できます', 'O Bak sabe fazer bolo.'],
    [1, '私・日本語・電話・かける・できない', '私《わたし》は/日本語《にほんご》で/電話《でんわ》を/かけることが/できません', 'Não consigo telefonar em japonês.'],
    [2, '朝・起きる・ご飯・食べる・学校・行く', '朝《あさ》/起《お》きて、/ご飯《はん》を/食《た》べて、/学校《がっこう》へ/行《い》きます', 'De manhã acordo, tomo café e vou à escola.'],
    [2, '受付・名前・書く・カード・作る', '受付《うけつけ》で/名前《なまえ》を/書《か》いて、/カードを/作《つく》ります', 'Escrevo meu nome na recepção e faço o cartão.'],
  ],
  10: [
    [0, 'チケット・まだ・買う', 'チケットを/まだ/買《か》っていません', 'Ainda não comprei o ingresso.'],
    [0, 'トイレ・行く（てきます）', 'トイレへ/行《い》ってきます', 'Vou ao banheiro e já volto.'],
    [0, '橋・渡る', '橋《はし》を/渡《わた》ります', 'Atravesso a ponte.'],
    [1, 'ここ・写真・撮る（てもいい）', 'ここで/写真《しゃしん》を/撮《と》ってもいいですか', 'Posso tirar foto aqui?'],
    [1, 'ここ・たばこ・吸う（ないでください）', 'ここで/たばこを/吸《す》わないでください', 'Não fume aqui.'],
    [2, 'サル・バナナ・食べる', 'サルが/バナナを/食《た》べています', 'O macaco está comendo banana.'],
    [2, 'ここ・きれいな写真・撮る（ことができます）', 'ここで/きれいな/写真《しゃしん》を/撮《と》ることが/できます', 'Aqui dá para tirar fotos bonitas.'],
    [2, '寒い（なる）', '寒《さむ》くなりました', 'Ficou frio.'],
  ],
  11: [
    [0, '犬・好き・猫・あまり好きじゃない', '犬《いぬ》は/好《す》きですが、/猫《ねこ》は/あまり/好《す》きじゃありません', 'Gosto de cachorro, mas não gosto muito de gato.'],
    [0, '毎朝・ジョギング・する', '毎朝《まいあさ》/ジョギングを/しています', 'Toda manhã faço jogging.'],
    [0, '日曜日・音楽・聞く・小説・読む', '日曜日《にちようび》/音楽《おんがく》を/聞《き》いたり、/小説《しょうせつ》を/読《よ》んだり/します', 'No domingo ouço música, leio romances etc.'],
    [1, '中学生・ギター・始める', '中学生《ちゅうがくせい》のとき、/ギターを/始《はじ》めました', 'Comecei a tocar violão quando era do ginásio.'],
    [1, '料理・する・雑誌・見る', '料理《りょうり》を/するとき、/料理《りょうり》の/雑誌《ざっし》を/見《み》ます', 'Quando cozinho, olho uma revista de culinária.'],
    [1, '寂しい・家族・電話', '寂《さび》しいとき、/家族《かぞく》に/電話《でんわ》します', 'Quando me sinto sozinho, ligo para a família.'],
    [2, '毎日・インターネット・する（forma simples）', '毎日《まいにち》、/インターネットを/する', 'Todo dia uso a internet.'],
    [2, '昨日・友達・お酒・飲む（forma simples）', '昨日《きのう》/友達《ともだち》と/お酒《さけ》を/飲《の》んだ', 'Ontem bebi com um amigo.'],
  ],
  12: [
    [0, 'おなか・痛い（んです）', 'おなかが/痛《いた》いんです', 'Estou com dor de barriga.'],
    [0, '熱・39度・ある（んです）', '熱《ねつ》が/39度《さんじゅうきゅうど》/あるんです', 'Estou com 39 graus de febre.'],
    [1, '早く・病院・行く（たほうがいい）', '早《はや》く/病院《びょういん》へ/行《い》ったほうが/いいです', 'É melhor ir logo ao hospital.'],
    [1, 'あまり・お酒・飲む（ないほうがいい）', 'あまり/お酒《さけ》を/飲《の》まないほうが/いいです', 'É melhor não beber muito.'],
    [1, '牛乳・体・いい・毎朝・飲む', '牛乳《ぎゅうにゅう》は/体《からだ》に/いいですから、/毎朝《まいあさ》/飲《の》んだほうが/いいです', 'Leite faz bem ao corpo, então é melhor beber toda manhã.'],
    [2, '手・洗う・ご飯・食べる', '手《て》を/洗《あら》ってから、/ご飯《はん》を/食《た》べます', 'Lavo as mãos e depois como.'],
    [2, '寝る・歯・磨く（前に）', '寝《ね》る前《まえ》に、/歯《は》を/磨《みが》きます', 'Antes de dormir, escovo os dentes.'],
    [2, '2週間・風邪・ひく（前に）', '2週間《にしゅうかん》前《まえ》に、/風邪《かぜ》を/ひきました', 'Peguei um resfriado duas semanas atrás.'],
  ],
  13: [
    [0, '富士山・登る（たことがある）', '富士山《ふじさん》に/登《のぼ》ったことが/あります', 'Já subi o Monte Fuji.'],
    [0, 'おいしいレストラン・知っている', 'おいしい/レストランを/知《し》っていますか', 'Você conhece algum restaurante bom?'],
    [0, 'これ・かりんとう・お菓子', 'これは/かりんとうという/お菓子《かし》です', 'Este é um doce chamado karinto.'],
    [1, 'これ・雑誌・私・よく読む', 'これは/私《わたし》が/よく/読《よ》む/雑誌《ざっし》です', 'Esta é a revista que eu leio sempre.'],
    [1, '茶色い靴・はく', '茶色《ちゃいろ》い/靴《くつ》を/はいています', 'Estou usando sapatos marrons.'],
    [1, 'ここ・友達・よく行く・喫茶店', 'ここは/友達《ともだち》と/よく/行《い》く/喫茶店《きっさてん》です', 'Esta é a cafeteria aonde vou sempre com amigos.'],
    [2, 'クラスメート・飲み会・する・店・探す', 'クラスメートと/飲《の》み会《かい》を/する/店《みせ》を/探《さが》しています', 'Procuro um lugar para um nomikai com colegas.'],
    [2, '歌・練習・できる・場所・探す', '歌《うた》の/練習《れんしゅう》が/できる/場所《ばしょ》を/探《さが》しています', 'Procuro um lugar onde possa praticar canto.'],
  ],
  14: [
    [0, 'このボタン・押す・ドア・開く', 'このボタンを/押《お》すと、/ドアが/開《あ》きます', 'Se apertar este botão, a porta abre.'],
    [0, 'このボタン・押す・音・小さい', 'このボタンを/押《お》すと、/音《おと》が/小《ちい》さくなります', 'Se apertar este botão, o som diminui.'],
    [1, '電車・携帯電話・使う（てはいけません）', '電車《でんしゃ》で/携帯電話《けいたいでんわ》を/使《つか》ってはいけません', 'Não se pode usar o celular no trem.'],
    [1, 'シートベルト・する（なければなりません）', 'シートベルトを/しなければなりません', 'É preciso usar o cinto de segurança.'],
    [1, '65歳以上・入場料・払う（なくてもいい）', '65歳《ろくじゅうごさい》以上《いじょう》の人《ひと》は/入場料《にゅうじょうりょう》を/払《はら》わなくてもいいです', 'Quem tem 65 anos ou mais não precisa pagar a entrada.'],
    [2, '日本の電車・静か（と思います）', '日本《にほん》の/電車《でんしゃ》は/静《しず》かだと/思《おも》います', 'Acho que o trem japonês é silencioso.'],
  ],
  15: [
    [0, '夕方・雨・降る（そうです）', '夕方《ゆうがた》から/雨《あめ》が/降《ふ》るそうです', 'Ouvi dizer que vai chover a partir do fim da tarde.'],
    [0, 'このラーメン屋・おいしい（そうです）', 'この/ラーメン屋《や》は/おいしいそうです', 'Dizem que esta lanchonete de lámen é gostosa.'],
    [0, '風邪・アルバイト・休む', '風邪《かぜ》で/アルバイトを/休《やす》みました', 'Faltei ao trabalho por causa de um resfriado.'],
    [1, '雨・降る（たら）・試合・ない', '雨《あめ》が/降《ふ》ったら、/試合《しあい》は/ありません', 'Se chover, não haverá jogo.'],
    [1, '雨・降る（ても）・試合・ある', '雨《あめ》が/降《ふ》っても、/試合《しあい》は/あります', 'Mesmo que chova, haverá jogo.'],
    [1, '明日・たぶん・晴れる', '明日《あした》は/たぶん/晴《は》れると/思《おも》います', 'Acho que amanhã provavelmente fará sol.'],
    [2, '道・混む', '道《みち》が/混《こ》んでいます', 'A rua está congestionada.'],
    [2, '窓・割れる', '窓《まど》が/割《わ》れています', 'A janela está quebrada.'],
  ],
}

// "漢字《かんじ》かな" → [kanji, leitura]
const chunk = s => [s.replace(/《[^》]*》/g, ''), s.replace(/[一-鿿々]+《([^》]+)》/g, '$1')]

// leituras tiradas das frases: 漢字《かんじ》 → [漢字, かんじ]; com número, 25歳《にじゅうごさい》 → [25歳, …]
const readings = sent => [...sent.matchAll(/([0-9０-９]*[一-鿿々]+)《([^》]+)》/g)].map(m => [m[1], m[2]])
const ALL = new Map()
for (const L of Object.keys(RAW)) for (const [, , sent] of RAW[L]) for (const [k, r] of readings(sent)) if (!ALL.has(k)) ALL.set(k, r)

// furigana das palavras-chave: cada trecho (algarismos + kanji) é coberto pelas maiores palavras conhecidas,
// primeiro as da própria frase, depois as de todas as frases. O que não tiver leitura fica sem furigana.
// Notas entre parênteses sem kana (traduções como （否定）, （简体）) ficam como estão.
function cueRuby(own) {
  const look = k => own.get(k) || ALL.get(k)
  const ruby = s => s.replace(/（[^）]*）|[0-9０-９]*[一-鿿々]+/g, run => {
    if (run[0] === '（') return /[ぁ-ゖァ-ヺ]/.test(run) ? `（${ruby(run.slice(1, -1))}）` : run
    let out = '', i = 0
    while (i < run.length) {
      let j = run.length
      while (j > i && !look(run.slice(i, j))) j--
      if (j === i) { out += run[i++]; continue }
      out += `<ruby>${run.slice(i, j)}<rt>${look(run.slice(i, j))}</rt></ruby>`
      i = j
    }
    return out
  })
  return ruby
}

export const CUES = {}
for (const L of Object.keys(RAW))
  CUES[L] = RAW[L].map(([t, cue, sent, pt]) => ({ t, cue, pt, c: sent.split('/').map(chunk), ruby: cueRuby(new Map(readings(sent))) }))
