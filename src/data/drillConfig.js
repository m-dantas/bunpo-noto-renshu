// O que cada tópico treina em "Treinar a gramática"
// conj: 'v' | 'a' (lição 8) ou 'dict' | 'koto' | 'te' (lição 9) = só esse tipo de conjugação
// blank: completar a lacuna (src/data/blanks.js)
export const CONF = {
  8: [{ blank: 1 }, { conj: 'v', blank: 1 }, { conj: 'a', blank: 1 }, { blank: 1 }],
  9: [{ conj: 'dict', blank: 1 }, { blank: 1 }, { conj: 'koto', blank: 1 }, { conj: 'te', blank: 1 }],
}

// Lições 1 a 5 (conj: 'masu' | 'i' | 'na' | 'past' | 'apast' | 'tai')
CONF[1] = [{ blank: 1 }, { blank: 1 }, { blank: 1 }, { blank: 1 }]
CONF[2] = [{ blank: 1 }, { blank: 1 }, { blank: 1 }, { blank: 1 }]
CONF[3] = [{ blank: 1 }, { blank: 1 }, { conj: 'masu', blank: 1 }, { blank: 1 }]
CONF[4] = [{ blank: 1 }, { conj: 'i', blank: 1 }, { conj: 'na', blank: 1 }, { blank: 1 }]
CONF[5] = [{ conj: 'past', blank: 1 }, { blank: 1 }, { conj: 'apast', blank: 1 }, { conj: 'tai', blank: 1 }]

// Lições 6 e 7 (conj: 'invite' | 'te' | 'kata' | 'teiru')
CONF[6] = [{ conj: 'invite', blank: 1 }, { blank: 1 }, { blank: 1 }, { blank: 1 }]
CONF[7] = [{ blank: 1 }, { conj: 'te', blank: 1 }, { conj: 'kata', blank: 1 }, { conj: 'teiru', blank: 1 }]

// Lições 10 a 15
// conj: 'tekuru' | 'perm' | 'naru' | 'tari' | 'plain' | 'houga' | 'kara' | 'mae' | 'koto' | 'must' | 'nakute' | 'souda' | 'cond'
CONF[10] = [{ conj: 'tekuru', blank: 1 }, { blank: 1 }, { conj: 'perm', blank: 1 }, { conj: 'naru', blank: 1 }]
CONF[11] = [{ blank: 1 }, { conj: 'tari', blank: 1 }, { blank: 1 }, { conj: 'plain', blank: 1 }]
CONF[12] = [{ blank: 1 }, { conj: 'houga', blank: 1 }, { conj: 'kara', blank: 1 }, { conj: 'mae', blank: 1 }]
CONF[13] = [{ conj: 'koto', blank: 1 }, { blank: 1 }, { blank: 1 }, { blank: 1 }]
CONF[14] = [{ blank: 1 }, { blank: 1 }, { conj: 'must', blank: 1 }, { conj: 'nakute', blank: 1 }]
CONF[15] = [{ conj: 'souda', blank: 1 }, { blank: 1 }, { conj: 'cond', blank: 1 }, { blank: 1 }]
