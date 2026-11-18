// Conteúdo das lições em inglês: dicionários { 'texto original em português': 'English' }.
// Um arquivo por arquivo de src/data. Gerados a partir das listas de textos e revisados à mão.
import lessons from './lessons'
import drill from './drill'
import kanji from './kanji'
import sentences from './sentences'
import cues from './cues'
import blanks from './blanks'
import grammar from './grammar'

export default { ...lessons, ...drill, ...kanji, ...sentences, ...cues, ...blanks, ...grammar }
