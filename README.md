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

## Tópicos

Cada lição tem 4 tópicos (abas na página da lição). Ao escolher um tópico, os dois treinos praticam só ele:

- `src/data/sentences.js`: cada frase tem `t` (índice do tópico, de 0 a 3).
- `src/data/blanks.js`: exercícios de completar a lacuna, `[tópico, frase com ＿, alternativas, resposta, tradução, explicação]`.
- `src/data/drillConfig.js`: o que cada tópico mistura em "Treinar a gramática" (conjugação e/ou lacuna).

## Adicionar uma nova lição

1. `src/data/lessons.js`: acrescente o número em `READY`.
2. `src/data/grammar.js`: crie `G10` (mesmo formato de `G8`) e registre em `GRAMMAR`.
3. `src/data/sentences.js`, `blanks.js` e `drillConfig.js`: frases (`c` = blocos `[kanji, leitura]`), lacunas e configuração por tópico.
4. `src/utils/questions.js`: se a lição tiver um treino de conjugação próprio, crie `make10` e
   ligue em `makeQuestion` (e as opções em `GrammarDrill.vue`).

Furigana nos textos: escreva `漢字《かんじ》` e o componente converte em `<ruby>`.
