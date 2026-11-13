# わたしの文法ノート · treino de gramática (Vue 3 + Vite)

Treino interativo baseado no caderno *Dekiru Nihongo Shokyū – Watashi no Bunpō Nōto*.
Lições ativas: **8** (大切な人) e **9** (好きなこと).

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera a pasta dist/
```

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

## Adicionar uma nova lição

1. `src/data/lessons.js`: acrescente o número em `READY`.
2. `src/data/grammar.js`: crie `G10` (mesmo formato de `G8`) e registre em `GRAMMAR`.
3. `src/data/sentences.js`: crie as frases (`c` = blocos `[kanji, leitura]`).
4. `src/utils/questions.js`: se a lição tiver um treino de conjugação próprio, crie `make10` e
   ligue em `makeQuestion` (e as opções em `GrammarDrill.vue`).

Furigana nos textos: escreva `漢字《かんじ》` e o componente converte em `<ruby>`.
