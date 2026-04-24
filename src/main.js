import './style.css'

const presentationPoints = [
  {
    title: 'Chi Sono: Cronistoria',
    body: '1992 - Nato e cresciuto a Torino\n2014 - Laurea in Informatica e primo ingresso in Reply come consulente esterno\n2016 - Assunto interno in Cluster Manufacturing\n2018 - Passaggio in Cluster Dynamics, nel team di Chiara Ippolito e Lorenzo Marcellino\n2022 - Senior Consultant\n2026 - Lead',
  },
  {
    title: 'Main Projects',
    body: 'Nel mio percorso in Reply ho avuto modo di lavorare su tanti contesti e clienti diversi, da grandi gruppi industriali a realtà molto strutturate come CNH, Azimut, Datalogic, iGuzzini, Maire Technimont, Qubica, Lucart, Fedrigoni e molti altri.\nNegli ultimi anni mi sono concentrato soprattutto su iniziative che mi hanno permesso di toccare tutti i principali moduli CRM e Digital Contact Center.\nHo portato soluzioni sia low-code con Power Platform, sia pro-code su architetture Azure, sempre integrate nei processi aziendali.',
  },
  {
    title: 'AI Addicted',
    body: 'Con la spinta di Lorenzo abbiamo iniziato presto a sperimentare soluzioni AI: dai primi bot RAG per risposte contestuali fino a soluzioni agentiche avanzate (Copilot Studio, Code Interpreter, IVR) e architetture AI complesse rilasciate in produzione.\nEsempi concreti includono il processo PIN per iGuzzini.\nQuesta esperienza mi ha portato ad avviare il percorso B6 insieme a Giovanni Campolo e ha consolidato una forte attitudine a portare AI e innovazione nei processi dei clienti.',
  },
  {
    title: 'Crescita del Team (People first)',
    body: 'Credo molto nella crescita delle persone, non solo dal punto di vista tecnico ma anche nella costruzione di fiducia e relazioni solide.\nPromuovo la condivisione continua delle conoscenze e un ambiente di confronto aperto e costruttivo.\nRitengo che questo sia fondamentale per costruire team coesi, valorizzare i colleghi più giovani e favorire una crescita professionale sostenibile.\nNel mio ruolo cerco di essere un punto di riferimento, portando qualità nel lavoro e attenzione al clima del team.',
  },
  {
    title: 'Fuori dal Lavoro',
    body: 'Fuori dall\'ufficio: famiglia (presto saremo in 4 👶), judo 🥋, gite fuori porta 🥾 e sofferenza settimanale con l\'Inter ⚫🔵.\nIl judo mi ha insegnato equilibrio e disciplina.\nDiventare padre mi ha insegnato a gestire anche le situazioni più complesse con calma e metodo.\nL\'Inter… beh che c\'è sempre speranza 😄.',
  },
]

const state = {
  unlocked: [],
  queue: [],
  modalOpen: false,
  completed: false,
  typingTimer: null,
  isTyping: false,
  typingText: '',
  typingIndex: 0,
}

document.querySelector('#app').innerHTML = `
<main class="shell">
  <header class="topbar">
    <div>
      <h1>Pacman Presents Me</h1>
    </div>
    <div class="status">Punti sbloccati: <span id="count">0</span>/5</div>
  </header>

  <section class="layout">
    <div class="game-frame-wrap">
      <iframe id="classic-frame" src="classic/index.html" title="Classic Pacman"></iframe>
    </div>

  </section>
</main>

<div id="overlay" class="overlay hidden" role="dialog" aria-modal="true">
  <div class="modal">
    <p class="badge">Nuovo punto sbloccato</p>
    <h3 id="modal-title"></h3>
    <div class="speaker">
      <img class="speaker-photo" src="classic/img/profile.png" alt="Giunta Gabriele" />
      <p id="modal-body" class="speech-text"></p>
    </div>
    <button id="modal-close" type="button">Continua il gioco</button>
  </div>
</div>

<div id="final-overlay" class="overlay hidden" role="dialog" aria-modal="true">
  <div class="modal">
    <h3>Presentazione completata.</h3>
    <p class="final-text">È stato un piacere potermi presentare.\nSpero di avervi fatto divertire ed essere riuscito a darvi un quadro completo di chi sono.\nSe volete approfondire qualcosa o semplicemente fare due chiacchiere, mi trovate su Teams 😊.</p>
    <button id="final-close" type="button">Ricomincia</button>
  </div>
</div>
`

const countEl = document.querySelector('#count')
const frameEl = document.querySelector('#classic-frame')
const overlayEl = document.querySelector('#overlay')
const finalOverlayEl = document.querySelector('#final-overlay')
const titleEl = document.querySelector('#modal-title')
const bodyEl = document.querySelector('#modal-body')
const closeEl = document.querySelector('#modal-close')
const finalCloseEl = document.querySelector('#final-close')
const frameWrap = document.querySelector('.game-frame-wrap')

const GAME_WIDTH = 610

const scaleIframe = () => {
  const wrapW = frameWrap.clientWidth
  if (wrapW < GAME_WIDTH) {
    const s = wrapW / GAME_WIDTH
    frameEl.style.position = 'absolute'
    frameEl.style.top = '0'
    frameEl.style.left = '0'
    frameEl.style.transform = `scale(${s})`
    frameEl.style.width = `${GAME_WIDTH}px`
    frameEl.style.transformOrigin = 'top left'
    frameEl.style.height = '780px'
    frameWrap.style.height = `${Math.round(780 * s)}px`
  } else {
    frameEl.style.position = ''
    frameEl.style.top = ''
    frameEl.style.left = ''
    frameEl.style.transform = ''
    frameEl.style.width = '100%'
    frameEl.style.height = ''
    frameWrap.style.height = ''
  }
}

scaleIframe()
window.addEventListener('resize', scaleIframe)

const pauseClassicGame = () => {
  try {
    const gameWindow = frameEl.contentWindow
    if (gameWindow && typeof gameWindow.pauseGame === 'function' && gameWindow.PAUSE === false) {
      gameWindow.pauseGame()
    }
  } catch {
    // Ignore cross-frame issues in local dev hot reload.
  }
}

const setClassicFreeze = (frozen) => {
  try {
    const gameWindow = frameEl.contentWindow
    if (!gameWindow) return
    gameWindow.postMessage(
      {
        source: 'pacman-present-host',
        event: 'presentation-freeze',
        payload: { frozen },
      },
      window.location.origin,
    )
  } catch {
    // Ignore cross-frame issues in local dev hot reload.
  }
}

const stopTypingAnimation = () => {
  if (state.typingTimer) {
    clearInterval(state.typingTimer)
    state.typingTimer = null
  }
}

const completeTypingAnimation = () => {
  stopTypingAnimation()
  bodyEl.textContent = state.typingText
  bodyEl.classList.remove('is-typing')
  state.isTyping = false
}

const startTypingAnimation = (text) => {
  stopTypingAnimation()
  state.typingText = text
  state.typingIndex = 0
  state.isTyping = true
  bodyEl.textContent = ''
  bodyEl.classList.add('is-typing')

  state.typingTimer = setInterval(() => {
    state.typingIndex += 1
    bodyEl.textContent = state.typingText.slice(0, state.typingIndex)

    if (state.typingIndex >= state.typingText.length) {
      completeTypingAnimation()
    }
  }, 16)
}

const showNextModal = () => {
  if (state.modalOpen || state.queue.length === 0) return

  const pointIndex = state.queue.shift()
  titleEl.textContent = presentationPoints[pointIndex].title
  startTypingAnimation(presentationPoints[pointIndex].body)
  state.modalOpen = true
  setClassicFreeze(true)
  pauseClassicGame()
  overlayEl.classList.remove('hidden')
}

const finishPresentation = () => {
  state.completed = true
  state.modalOpen = true
  setClassicFreeze(true)
  pauseClassicGame()
  finalOverlayEl.classList.remove('hidden')
}

const resetPresentation = () => {
  stopTypingAnimation()
  state.unlocked = []
  state.queue = []
  state.modalOpen = false
  state.completed = false
  state.typingText = ''
  state.typingIndex = 0
  state.isTyping = false
  overlayEl.classList.add('hidden')
  finalOverlayEl.classList.add('hidden')

  try {
    const gameWindow = frameEl.contentWindow
    if (gameWindow && typeof gameWindow.location?.reload === 'function') {
      gameWindow.location.reload()
    } else {
      frameEl.src = '/classic/index.html'
    }
  } catch {
    frameEl.src = '/classic/index.html'
  }
}

const enqueueUnlock = () => {
  if (state.completed) return

  const pointIndex = state.unlocked.length
  if (pointIndex >= presentationPoints.length) return
  state.unlocked.push(pointIndex)
  state.queue.push(pointIndex)
  countEl.textContent = String(state.unlocked.length)
  showNextModal()
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return
  const data = event.data
  if (!data || data.source !== 'pacman-classic') return

  if (data.event === 'ghost-eaten') {
    enqueueUnlock()
  }
})

window.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    Enter: 13,
    p: 80,
    P: 80,
  }

  const code = keyMap[event.key]
  if (!code) return

  event.preventDefault()
  if (state.modalOpen || state.completed) return

  try {
    const gameWindow = frameEl.contentWindow
    if (!gameWindow || typeof gameWindow.simulateKeydown !== 'function') return
    gameWindow.simulateKeydown(code)
  } catch {
    // Ignore cross-frame issues in local dev hot reload.
  }
})

closeEl.addEventListener('click', () => {
  if (state.isTyping) {
    completeTypingAnimation()
    return
  }

  overlayEl.classList.add('hidden')
  state.modalOpen = false

  if (state.queue.length > 0) {
    showNextModal()
    return
  }

  if (state.unlocked.length >= presentationPoints.length) {
    finishPresentation()
    return
  }

  setClassicFreeze(false)
})

finalCloseEl.addEventListener('click', resetPresentation)
