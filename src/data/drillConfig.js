// O que cada parte treina em "Treinar a gramática" (3 partes por lição)
// conj: tipo de conjugação (texto) ou lista de tipos; blank: completar a lacuna (src/data/blanks.js)
// Lição 8: 'v' (verbo) | 'a' (adjetivo). Lição 9: 'dict' | 'koto' | 'te'.
// Lições 3 a 7 e 10 a 15: 'masu' 'i' 'na' 'past' 'apast' 'tai' 'invite' 'te' 'kata' 'teiru'
//   'tekuru' 'perm' 'naru' 'tari' 'plain' 'houga' 'kara' 'mae' 'koto' 'must' 'nakute' 'souda' 'cond'
export const CONF = {
  1: [{ blank: 1 }, { blank: 1 }, { blank: 1 }],
  2: [{ blank: 1 }, { blank: 1 }, { blank: 1 }],
  3: [{ blank: 1 }, { conj: 'masu', blank: 1 }, { blank: 1 }],
  4: [{ blank: 1 }, { conj: ['i', 'na'], blank: 1 }, { blank: 1 }],
  5: [{ conj: 'past', blank: 1 }, { conj: 'apast', blank: 1 }, { conj: 'tai', blank: 1 }],
  6: [{ conj: 'invite', blank: 1 }, { blank: 1 }, { blank: 1 }],
  7: [{ blank: 1 }, { conj: ['te', 'teiru'], blank: 1 }, { conj: 'kata', blank: 1 }],
  8: [{ conj: 'v', blank: 1 }, { conj: 'a', blank: 1 }, { blank: 1 }],
  9: [{ conj: 'dict', blank: 1 }, { conj: 'koto', blank: 1 }, { conj: 'te', blank: 1 }],
  10: [{ conj: 'tekuru', blank: 1 }, { conj: 'perm', blank: 1 }, { conj: 'naru', blank: 1 }],
  11: [{ conj: 'tari', blank: 1 }, { blank: 1 }, { conj: 'plain', blank: 1 }],
  12: [{ blank: 1 }, { conj: 'houga', blank: 1 }, { conj: ['kara', 'mae'], blank: 1 }],
  13: [{ conj: 'koto', blank: 1 }, { blank: 1 }, { blank: 1 }],
  14: [{ blank: 1 }, { blank: 1 }, { conj: ['must', 'nakute'], blank: 1 }],
  15: [{ conj: 'souda', blank: 1 }, { conj: 'cond', blank: 1 }, { blank: 1 }],
}
