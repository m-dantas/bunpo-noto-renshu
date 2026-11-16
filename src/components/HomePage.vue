<script setup>
import { READY, LESSONS } from '../data/lessons'
import { KCHAPTERS, ALL_KANJI } from '../data/kanji'

defineEmits(['open'])
const nLessons = READY.length
const readyList = READY.join(', ')
const nChapters = KCHAPTERS.filter(c => c.ready).length
</script>

<template>
  <section>
    <h2 class="go" style="margin-top: 0">A proposta</h2>
    <article class="topic">
      <p>Este app é um <b>caderno de treino</b> para quem estuda japonês com dois livros: o <b>わたしの文法ノート</b> (Dekiru Nihongo 初級) e o <b>漢字 hop! step! jump! 初級I</b>.</p>
      <p>A ideia é ir além de reconhecer: você lê o resumo da gramática de cada lição e depois <b>pratica escrevendo em japonês</b>, digitando em romaji, que o app converte em kana na hora.</p>
      <p class="lead" style="margin-bottom: 0">Ele não substitui os livros. As explicações, os exemplos e os exercícios foram escritos para este app, seguindo a lista de gramática e de kanji de cada lição.</p>
    </article>

    <h2 class="go">Os menus</h2>
    <p class="lead">Os três botões no topo do menu lateral:</p>

    <article class="topic">
      <h2>文法 · Gramática</h2>
      <p>Lições do caderno de gramática. Hoje estão prontas <b>{{ nLessons }} de {{ LESSONS.length }}</b> (lições {{ readyList }}); as outras aparecem em cinza, como “em breve”.</p>
      <p>Cada lição tem <b>3 partes</b>, como no livro. Escolha uma parte na coluna ao lado (ou nas abas, em telas estreitas) para ler o <b>resumo de gramática</b>, com o padrão da frase, uma explicação curta e exemplos com furigana e tradução. No fim da página há a <b>Hora de praticar</b>:</p>
      <p><span class="pat">Treinar a gramática</span> conjugação (nas partes em que faz sentido) e completar a lacuna.</p>
      <p><span class="pat">Criar frases</span> montar a frase com blocos ou escrevê-la em kana, vendo as palavras como dica.</p>
      <p>O treino vale só para a parte aberta. Em <b>Tudo</b>, ele mistura a lição inteira.</p>
      <button @click="$emit('open', 'bunpo')">Abrir a gramática</button>
    </article>

    <article class="topic">
      <h2>漢字 · Kanji</h2>
      <p>Capítulos do livro de kanji, do 0 ao 9. Por enquanto está pronto <b>{{ nChapters }} capítulo</b> (o capítulo 0, com {{ ALL_KANJI.length }} kanji em 3 seções); os demais mostram “em breve”.</p>
      <p>Cada kanji aparece com o significado, as leituras <b>kun</b> e <b>on</b> e palavras de exemplo. Há quatro treinos, que você troca dentro da mesma tela:</p>
      <p><span class="pat">Kanji → leitura</span> <span class="pat">Ler palavras</span> <span class="pat">Kanji → significado</span> <span class="pat">Significado → kanji</span></p>
      <button @click="$emit('open', 'kanji')">Abrir os kanji</button>
    </article>

    <article class="topic">
      <h2>練習 · Treino misto</h2>
      <p>Para <b>revisar várias lições de uma vez</b>. Você escolhe um intervalo (por exemplo, da lição 1 à 5), os tipos de exercício e a quantidade de questões:</p>
      <p><span class="pat">Conjugar</span> digitando a forma pedida.</p>
      <p><span class="pat">Traduzir frase</span> escrevendo em japonês a frase dada em português.</p>
      <p><span class="pat">Completar a lacuna</span> escolhendo a alternativa certa.</p>
      <p>Dá para ligar ou desligar as dicas e o furigana. No fim você vê o resultado por lição, a lista do que errou e pode <b>refazer só os erros</b>.</p>
      <button @click="$emit('open', 'mix')">Abrir o treino misto</button>
    </article>

    <h2 class="go">Como digitar em japonês</h2>
    <article class="topic">
      <p>Nos campos de resposta, digite em <b>romaji</b> e o app converte sozinho:</p>
      <div class="ex"><p class="jp">masu → ます</p><p class="tr">letras minúsculas viram hiragana</p></div>
      <div class="ex"><p class="jp">MASU → マス</p><p class="tr">com Caps Lock ligado, viram katakana (o aviso “あ / ア” abaixo do campo mostra o modo)</p></div>
      <p>Atalhos: <b>nn</b> → ん, <b>xtu</b> → っ, <b>-</b> → ー. Se você usa o teclado japonês do sistema (IME), ele também funciona. Nas frases, a resposta pode ser em kanji ou só em kana.</p>
    </article>

    <h2 class="go">Dicas de uso</h2>
    <article class="topic">
      <p><b>Passo a passo:</b> leia o resumo da parte, pratique só ela e, depois, use <b>Tudo</b> e o treino misto para juntar o que aprendeu.</p>
      <p><b>Furigana:</b> fica sempre em cima dos kanji e pode ser desligado nos treinos, para você testar a leitura.</p>
      <p><b>Offline:</b> o app é uma PWA. Depois do primeiro acesso, ele funciona sem internet e pode ser instalado pelo navegador (“Instalar app” ou “Adicionar à tela inicial”).</p>
      <p><b>Seu progresso:</b> o recorde de sequência fica guardado no aparelho em que você estuda.</p>
    </article>
  </section>
</template>
