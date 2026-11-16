# わたしの文法ノート · treino de gramática (Vue 3 + Vite)

Treino interativo baseado no caderno *Dekiru Nihongo Shokyū – Watashi no Bunpō Nōto*.
Lições ativas: **8** (大切な人) e **9** (好きなこと).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera a pasta dist/
```

## PWA (instalar e usar offline)

O app é uma PWA (`vite-plugin-pwa`): depois do primeiro acesso funciona sem internet e pode ser instalado.

```bash
npm install
npm run build && npm run preview   # o service worker só existe no build
```

Abra o endereço do `preview` e, no Chrome/Edge, use o ícone de instalar na barra de endereço
(no celular: menu → "Instalar app" / "Adicionar à tela inicial"). Para publicar, hospede a pasta `dist/` com **HTTPS**
(Netlify, Vercel, Cloudflare Pages, GitHub Pages...). Se ficar em um subcaminho, defina `base` em `vite.config.js`.

- Nome, cores e ícones: `manifest` em `vite.config.js` e a pasta `public/`.
- Seu progresso (recorde de sequência) fica no `localStorage` do aparelho.

## Estrutura

```
src/
  App.vue                     # layout, menu lateral e navegação entre telas
  components/
    SideMenu.vue              # lista das 15 lições (só as de READY ficam ativas)
    LessonPage.vue            # "Resumo de gramática" + "Hora de praticar"
    GrammarDrill.vue          # treino de conjugação
    SentenceBuilder.vue       # criar frases (blocos ou escrever)
    KanaInput.vue             # campo com conversão romaji → hiragana/katakana
  data/                       # conteúdo: lições, gramática, verbos/adjetivos, frases
  utils/                      # conjugação, romaji → kana, perguntas, rubi (furigana)
```

## Menu no celular

No celular há uma barra fixa no topo (☰ e o lugar onde você está). O menu abre como gaveta com fundo escurecido (toque fora,
no ✕ ou em Esc para fechar). Trocar entre **文法 / 漢字** não fecha a gaveta, porque você ainda vai escolher a lição; ela só
fecha ao escolher uma lição ou ao abrir Início e Treino misto. Ao voltar a um livro, você retorna à lição em que estava.

## Início

A tela inicial (`src/components/HomePage.vue`) apresenta a proposta do app e explica cada menu. Para abri-la, clique em
**文法ノート** no topo do menu lateral. Os números (lições e capítulos prontos) vêm dos dados, então se atualizam sozinhos.

## Livros

O menu lateral tem um seletor de livros (**文法** e **漢字**):

- **わたしの文法ノート** (gramática): lições 1 a 15 prontas, com 3 partes, lacunas e criação de frases.
- **漢字 hop! step! jump! 初級I** (kanji): capítulos 0 a 9 do sumário do livro. Por enquanto só o **capítulo 0** está
  desenvolvido (26 kanji em 3 seções); os demais já têm a lista de kanji em `src/data/kanji.js` e aparecem desativados.

Para desenvolver um capítulo de kanji, troque o `todo(...)` dele em `src/data/kanji.js` por um objeto com `ready: true` e
`sections`, no mesmo formato do `ch0` (cada kanji: `[kanji, significado, kun, on, palavras]`; palavras no formato
`'山田《やまだ》さん=Sr(a). Yamada'`). Os exemplos de palavras são escritos para este app, não copiados do livro.

Treinos de kanji (`KanjiDrill.vue`): kanji → leitura, ler palavras (digitando em romaji), kanji → significado e significado → kanji.

## Treino misto (練習)

O terceiro botão do menu lateral (**練習**) abre o treino misto: escolha um intervalo de lições (ex.: 1 a 5), os tipos de
exercício (conjugar digitando, traduzir frase digitando, completar a lacuna) e a quantidade de questões. Ao final há o
resultado por lição, a lista do que errou e o botão para refazer só os erros. O código está em `src/components/PracticeMix.vue`
e usa os mesmos dados dos treinos por lição (`blanks.js`, `sentences.js`, `drillConfig.js`).

## Partes de cada lição

Cada lição tem **3 partes**, como no livro (abas na página da lição). Ao escolher uma parte, os dois treinos praticam só ela. Os nomes das partes são um agrupamento próprio do app (ver `src/data/grammar.js`):

- `src/data/sentences.js`: cada frase tem `t` (índice da parte, de 0 a 2).
- `src/data/blanks.js`: exercícios de completar a lacuna, `[parte, frase com ＿, alternativas, resposta, tradução, explicação]`.
- `src/data/drillConfig.js`: o que cada parte mistura em "Treinar a gramática" (conjugação e/ou lacuna; `conj` pode ser um texto ou uma lista de tipos).

## Adicionar uma nova lição

1. `src/data/lessons.js`: acrescente o número em `READY`.
2. `src/data/grammar.js`: acrescente a lição em `GRAMMAR_ALL` com 3 partes.
3. `src/data/sentences.js` (registre em `SENTENCES`), `blanks.js` e `drillConfig.js`: frases (`c` = blocos `[kanji, leitura]`), lacunas e configuração por parte.
4. `src/utils/questions.js`: se a lição tiver um treino de conjugação próprio, crie `make10` e
   ligue em `makeQuestion` (e as opções em `GrammarDrill.vue`).

Furigana nos textos: escreva `漢字《かんじ》` e o componente converte em `<ruby>`.
