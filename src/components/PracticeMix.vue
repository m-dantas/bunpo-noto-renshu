<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import KanaInput from './KanaInput.vue'
import { READY } from '../data/lessons'
import { CONF } from '../data/drillConfig'
import { BLANKS } from '../data/blanks'
import { SENTENCES } from '../data/sentences'
import { CUES } from '../data/cues'
import { makeNum, hasNum } from '../utils/numbers'
import { makeQuestion } from '../utils/questions'
import { flush } from '../utils/kana'
import { matchChunks } from '../utils/answer'
import { rb, furi } from '../utils/ruby'
import { useEnter } from '../utils/useEnter'

const lessons = READY
const TYPES = [['conj', 'Conjugar (digitar)'], ['sent', 'Traduzir frase (digitar)'], ['blank', 'Completar a lacuna (escolher)'], ['cue', 'Palavras-chave → frase (digitar)'], ['num', 'Números e contadores (digitar)']]
const cfg = reactive({ from: lessons[0], to: Math.min(5, lessons[lessons.length - 1]), types: ['conj', 'sent'], count: 10, hints: true, furi: true })

const stage = ref('setup') // setup | run | done
const msg = ref('')
const queue = ref([]), idx = ref(0), results = ref([])
const answer = ref(''), picked = ref(''), answered = ref(false), good = ref(false)
const inp = ref(null), go = ref(null)

const pick = a => a[Math.floor(Math.random() * a.length)]
const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const fin = s => (s.endsWith('。') ? s : s + '。')
// furigana ligado/desligado (opção da sessão)
const rbx = s => (cfg.furi ? rb(s) : s.replace(/《[^》]*》/g, ''))
const kanjiHtml = (k, r) => (cfg.furi ? furi(k, r) : k)
const sentHtml = x => fin(x.s.c.map(c => kanjiHtml(c[0], c[1])).join(''))
const joinC = (x, k) => x.s.c.map(c => c[k]).join('')
const inRange = () => lessons.filter(n => n >= cfg.from && n <= cfg.to)

// ---------- geração das questões ----------
const OPTS = {
  8: () => ({ groups: ['u', 'ru', 'irr'], forms: ['pol', 'neg', 'plain'], adj: ['i', 'na', 'n'] }),
  9: () => ({ groups: ['u', 'ru', 'irr'], forms: ['dict', 'koto', 'te'] }),
}
function genConj(L) {
  const tp = (CONF[L] || []).flatMap(c => (c.conj ? [].concat(c.conj) : []))
  if (L < 3 || !tp.length) return null
  const kind = pick(tp)
  const o = OPTS[L] ? OPTS[L]() : {}
  if (L === 9) o.forms = [kind]
  return { kind: 'conj', L, ...makeQuestion(L, o, kind) }
}
const genSent = L => { const s = pick(SENTENCES[L]); return { kind: 'sent', L, s, hint: shuffle(s.c) } }
const genNum = L => (hasNum(L) ? { kind: 'num', L, ...makeNum(L) } : null)
const genCue = L => {
  const c = pick(CUES[L] || [])
  return c ? { kind: 'cue', L, cue: c.cue, s: { c: c.c, pt: c.pt, n: 'Palavras-chave' } } : null
}
const hira = s => s.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
const genBlank = L => { const b = pick(BLANKS[L]); return { kind: 'blank', L, raw: b[1], opts: shuffle(b[2]), a: b[3], pt: b[4], why: b[5] } }
const keyOf = q => q.kind + q.L + (q.k ? q.k + q.tag[0] : q.kind === 'num' ? q.big : q.s ? q.s.pt : q.raw)

function build() {
  const Ls = inRange(), out = [], seen = new Set()
  for (let guard = 0; out.length < cfg.count && guard < 600; guard++) {
    const kind = pick(cfg.types), L = pick(Ls)
    const q = kind === 'conj' ? genConj(L) : kind === 'sent' ? genSent(L) : kind === 'cue' ? genCue(L) : kind === 'num' ? genNum(L) : genBlank(L)
    if (!q) continue
    const k = keyOf(q)
    if (seen.has(k) && guard < 300) continue // evita repetir enquanto houver variedade
    seen.add(k)
    out.push(q)
  }
  return out
}

// ---------- sessão ----------
const q = computed(() => queue.value[idx.value])
const okCount = computed(() => results.value.filter(r => r.good).length)
const misses = computed(() => results.value.filter(r => !r.good).map(r => r.q))
const byLesson = computed(() => {
  const m = {}
  results.value.forEach(r => { (m[r.q.L] ||= { ok: 0, n: 0 }).n++; if (r.good) m[r.q.L].ok++ })
  return Object.entries(m).map(([L, v]) => ({ L, ...v }))
})
const tags = x => (x.kind === 'conj' ? x.tag : x.kind === 'num' ? ['Números e contadores', x.label] : x.kind === 'cue' ? ['Palavras-chave → frase'] : x.kind === 'sent' ? (cfg.hints ? ['Traduza para o japonês', x.s.n] : ['Traduza para o japonês']) : ['Completar a lacuna'])
const blankHtml = computed(() =>
  q.value && q.value.kind === 'blank'
    ? rbx(q.value.raw.replace('＿', answered.value ? `<b class="ok">${q.value.a}</b>` : '<span class="blank"></span>'))
    : '')
const missHtml = x => (x.kind === 'conj' ? `${kanjiHtml(x.k, x.r)} → ${x.ans[0]}` : x.kind === 'num' ? `${x.big} → ${x.ans[0]}` : x.kind === 'sent' || x.kind === 'cue' ? `${x.s.pt} → ${sentHtml(x)}` : rbx(x.raw.replace('＿', x.a)))

function begin(list) {
  msg.value = ''
  if (!list.length) { msg.value = 'Não há exercícios desses tipos nas lições escolhidas. Marque outro tipo ou amplie o intervalo.'; stage.value = 'setup'; return }
  queue.value = list
  idx.value = 0
  results.value = []
  stage.value = 'run'
  resetQ()
}
const start = () => begin(build())
const retry = () => begin(shuffle(misses.value))
function resetQ() {
  answer.value = ''; picked.value = ''; answered.value = false
  nextTick(() => inp.value && inp.value.focus())
}
function finish(g) {
  answered.value = true
  good.value = g
  results.value.push({ q: q.value, good: g })
  nextTick(() => go.value && go.value.focus())
}
function check() {
  const x = q.value
  const cl = s => s.replace(/[\s。、]/g, '')
  const v = flush(answer.value).normalize('NFKC')
  if (!cl(v)) return
  if (x.kind === 'conj') finish(x.ans.includes(v.replace(/\s/g, '')))
  else if (x.kind === 'num') finish(x.ans.includes(hira(v).replace(/\s/g, '')))
  else finish(matchChunks(v, x.s.c))
}
function choose(o) {
  if (answered.value) return
  picked.value = o
  finish(o === q.value.a)
}
function next() {
  if (idx.value + 1 >= queue.value.length) { stage.value = 'done'; return }
  idx.value++
  resetQ()
}
const primary = () => { if (answered.value) next(); else if (q.value.kind !== 'blank') check() }
useEnter(primary, () => stage.value === 'run')

function fix(which) {
  if (cfg.from > cfg.to) { if (which === 'from') cfg.to = cfg.from; else cfg.from = cfg.to }
}
</script>

<template>
  <!-- configuração -->
  <section v-if="stage === 'setup'">
    <h2 class="go" style="margin-top: 0">Treino misto</h2>
    <p class="lead">Escolha um intervalo de lições e pratique escrevendo a gramática de todas elas misturada.</p>
    <div class="sheet">
      <fieldset class="first">
        <legend>Lições</legend>
        <label>De
          <select v-model.number="cfg.from" @change="fix('from')"><option v-for="n in lessons" :key="n" :value="n">{{ n }}</option></select>
        </label>
        <label>até
          <select v-model.number="cfg.to" @change="fix('to')"><option v-for="n in lessons" :key="n" :value="n">{{ n }}</option></select>
        </label>
        <span class="lead">{{ inRange().length }} lição(ões)</span>
      </fieldset>
      <fieldset>
        <legend>Tipos de exercício</legend>
        <label v-for="t in TYPES" :key="t[0]"><input v-model="cfg.types" type="checkbox" :value="t[0]" />{{ t[1] }}</label>
      </fieldset>
      <fieldset>
        <legend>Sessão</legend>
        <label>Questões
          <select v-model.number="cfg.count"><option :value="10">10</option><option :value="20">20</option><option :value="30">30</option><option :value="50">50</option></select>
        </label>
        <label><input v-model="cfg.hints" type="checkbox" />Mostrar dicas (blocos e ponto de gramática)</label>
        <label>Furigana
          <select v-model="cfg.furi"><option :value="true">Com furigana</option><option :value="false">Sem furigana</option></select>
        </label>
      </fieldset>
      <p v-if="msg" class="bad">{{ msg }}</p>
      <div class="row" style="margin-top: 16px"><button :disabled="!cfg.types.length" @click="start">Começar</button></div>
    </div>
    <p class="hint">Digitando: use romaji (masu → ます). Com Caps Lock ligado, a conversão sai em katakana. Lições 1 e 2 não têm conjugação, só frases e lacunas. Números e contadores existem nas lições 1 a 4, 6, 8 e 9.</p>
  </section>

  <!-- treino -->
  <section v-else-if="stage === 'run' && q">
    <button class="back" @click="stage = 'setup'">← Encerrar treino</button>
    <div class="stats"><div>Questão<b>{{ idx + 1 }}/{{ queue.length }}</b></div><div>Acertos<b>{{ okCount }}</b></div></div>
    <div class="bar"><span :style="{ width: (idx / queue.length) * 100 + '%' }"></span></div>

    <div class="sheet">
      <div class="tags"><span class="tag">第{{ q.L }}課</span><span v-for="t in tags(q)" :key="t" class="tag">{{ t }}</span></div>

      <template v-if="q.kind === 'conj'">
        <div class="word" v-html="kanjiHtml(q.k, q.r)"></div>
        <div class="pt">{{ q.pt }}</div>
      </template>
      <template v-else-if="q.kind === 'num'">
        <div class="pt">Como se lê?</div>
        <div class="word">{{ q.big }}</div>
      </template>
      <template v-else-if="q.kind === 'cue'">
        <div class="word t" style="font-size: 1.7rem" v-html="rbx(q.cue)"></div>
        <div class="pt">{{ q.s.pt }}</div>
      </template>
      <template v-else-if="q.kind === 'sent'">
        <div class="word t" style="font-size: 1.7rem">{{ q.s.pt }}</div>
        <div v-if="cfg.hints" class="choices"><button v-for="h in q.hint" :key="h[0]" class="tl" type="button" disabled v-html="kanjiHtml(h[0], h[1])"></button></div>
      </template>
      <template v-else>
        <div class="bq" v-html="blankHtml"></div>
        <div class="pt">{{ q.pt }}</div>
        <div class="choices">
          <button v-for="o in q.opts" :key="o" class="tl" :class="{ right: answered && o === q.a, wrong: answered && o === picked && o !== q.a }"
            :disabled="answered" @click="choose(o)" v-html="rbx(o)"></button>
        </div>
      </template>

      <div v-if="q.kind !== 'blank'" class="row">
        <KanaInput ref="inp" v-model="answer" :disabled="answered" />
        <button ref="go" @click="primary">{{ answered ? 'Próxima' : 'Verificar' }}</button>
      </div>
      <div v-else class="row"><button v-if="answered" ref="go" @click="primary">Próxima</button></div>

      <div class="fb" aria-live="polite">
        <template v-if="answered">
          <div class="big" :class="good ? 'ok' : 'bad'">{{ good ? 'Correto!' : 'Quase.' }}</div>
          <div v-if="!good && q.kind !== 'blank'" class="rule">Você escreveu: {{ answer }}</div>
          <template v-if="q.kind === 'conj'"><div>Resposta: {{ q.ans[0] }}<template v-if="q.ans[0] !== q.ans[1]"> ({{ q.ans[1] }})</template></div><div class="rule">{{ q.rule }}</div></template>
          <template v-else-if="q.kind === 'num'"><div>Resposta: {{ q.ans[0] }}<template v-if="q.ans.length > 1"> (também: {{ q.ans.slice(1).join(', ') }})</template></div><div class="rule">{{ q.rule }}</div></template>
          <template v-else-if="q.kind === 'sent' || q.kind === 'cue'"><div style="font-size: 1.4rem" v-html="sentHtml(q)"></div><div class="rule">{{ fin(joinC(q, 1)) }} · {{ q.s.n }}</div></template>
          <div v-else class="rule">{{ q.why }}</div>
        </template>
      </div>
    </div>
  </section>

  <!-- resultado -->
  <section v-else-if="stage === 'done'">
    <h2 class="go" style="margin-top: 0">Resultado</h2>
    <div class="sheet">
      <div class="word" style="font-size: 3rem">{{ okCount }}/{{ results.length }}</div>
      <div class="pt">{{ Math.round((okCount / results.length) * 100) }}% de acertos</div>
      <div style="overflow-x: auto">
        <table class="g">
          <thead><tr><th>Lição</th><th>Acertos</th></tr></thead>
          <tbody>
            <tr v-for="b in byLesson" :key="b.L"><td>第{{ b.L }}課</td><td>{{ b.ok }}/{{ b.n }}</td></tr>
          </tbody>
        </table>
      </div>
      <template v-if="misses.length">
        <h2 class="go">Para revisar</h2>
        <ul class="kwords"><li v-for="(m, i) in misses" :key="i"><span class="tag">第{{ m.L }}課</span> <span class="kw" v-html="missHtml(m)"></span></li></ul>
      </template>
    </div>
    <div style="margin-top: 16px">
      <button v-if="misses.length" class="choice" @click="retry"><b>Refazer só os erros</b><span>{{ misses.length }} questão(ões) que você errou</span></button>
      <button class="choice" @click="start"><b>Novo treino com as mesmas opções</b><span>Lições {{ cfg.from }} a {{ cfg.to }}, {{ cfg.count }} questões</span></button>
      <button class="choice" @click="stage = 'setup'"><b>Mudar as opções</b><span>Voltar à configuração</span></button>
    </div>
  </section>
</template>
