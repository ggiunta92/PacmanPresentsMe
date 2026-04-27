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
  assistMode: false,
  assistPressTimer: null,
  assistCooldownUntil: 0,
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
      <a class="powered-by" href="https://github.com/features/copilot" target="_blank" rel="noopener">
        powered by
        <svg class="copilot-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.463-1.735 1.234-2.35.2-.16.418-.293.648-.397C4.954.747 6.554.5 8.002.5c1.447 0 3.049.247 4.624.54.23.104.448.237.648.397.77.615 1.234 1.48 1.234 2.35 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.918c-.13.835-3.44 3.749-8.01 3.749Zm3.635-6.928c-.039-.013-.077-.026-.118-.036a3.287 3.287 0 0 0-.036-.218c-.029-.183-.06-.384-.126-.612.201-.508.254-1.084.254-1.656 0-.87-.463-1.735-1.234-2.35a2.573 2.573 0 0 0-.648-.397c-.61-.227-1.257-.38-1.908-.476v-.004c-.652.096-1.299.249-1.908.476a2.56 2.56 0 0 0-.648.397c-.77.615-1.234 1.48-1.234 2.35 0 .572.053 1.148.254 1.656-.066.228-.098.429-.126.612a3.287 3.287 0 0 1-.036.218c-.04.01-.079.023-.118.036a2.23 2.23 0 0 0-.99.665 6.453 6.453 0 0 0-.126.052c.008-.012.016-.024.026-.035.41-.457.893-.68 1.39-.823a2.05 2.05 0 0 1 .143-.036c.121-.027.246-.048.371-.067.376-.054.763-.06 1.13-.06h3.045c.367 0 .754.006 1.13.06.125.019.25.04.371.067a2.05 2.05 0 0 1 .143.036c.497.143.98.366 1.39.823.01.011.018.023.026.035-.042-.018-.084-.036-.126-.052a2.23 2.23 0 0 0-.99-.665Zm-7.27 1.485a1.376 1.376 0 1 0 0 2.751 1.376 1.376 0 0 0 0-2.751Zm7.275 0a1.376 1.376 0 1 0 0 2.751 1.376 1.376 0 0 0 0-2.751Z"></path></svg>
        GitHub Copilot
      </a>
    </div>
    <div class="top-actions">
      <div id="assist-status" class="status assist-trigger" role="button" tabindex="0" title="Tieni premuto per attivare l'assistenza">Punti sbloccati: <span id="count">0</span>/5</div>
      <button id="assist-next" class="assist-next hidden" type="button">Sblocca punto successivo</button>
    </div>
  </header>

  <section class="layout">
    <div class="game-frame-wrap">
      <iframe id="classic-frame" src="classic/index.html" title="Classic Pacman" scrolling="no"></iframe>
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
const assistStatusEl = document.querySelector('#assist-status')
const assistNextEl = document.querySelector('#assist-next')

const GAME_WIDTH = 610
const MOBILE_CSS_ID = 'mobile-hide-css'
const ASSIST_LONG_PRESS_MS = 1200
const ASSIST_COOLDOWN_MS = 600

const injectMobileCss = (iframeDoc) => {
  if (!iframeDoc || iframeDoc.getElementById(MOBILE_CSS_ID)) return
  const style = iframeDoc.createElement('style')
  style.id = MOBILE_CSS_ID
  style.textContent = `
    #panel h1, #canvas-panel-title-pacman, #score, #highscore { display: none !important; }
    #panel { padding-top: 0; }
    #board { top: 5px; }
    #canvas-lifes, #canvas-level-fruits { top: 565px; }
  `
  iframeDoc.head.appendChild(style)
}

const removeMobileCss = (iframeDoc) => {
  if (!iframeDoc) return
  const el = iframeDoc.getElementById(MOBILE_CSS_ID)
  if (el) el.remove()
}

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
    try { injectMobileCss(frameEl.contentDocument) } catch (e) {}
  } else {
    frameEl.style.position = ''
    frameEl.style.top = ''
    frameEl.style.left = ''
    frameEl.style.transform = ''
    frameEl.style.width = '100%'
    frameEl.style.height = ''
    frameWrap.style.height = ''
    try { removeMobileCss(frameEl.contentDocument) } catch (e) {}
  }
}

scaleIframe()
frameEl.addEventListener('load', scaleIframe)
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

const setAssistMode = (enabled) => {
  state.assistMode = enabled
  assistNextEl.classList.toggle('hidden', !enabled)
  assistStatusEl.classList.toggle('assist-active', enabled)
}

const requestAssistModeActivation = () => {
  if (state.assistMode || state.completed) return
  setAssistMode(true)
}

const startAssistLongPress = (event) => {
  if (state.assistMode || state.completed) return
  event.preventDefault()

  if (state.assistPressTimer) {
    clearTimeout(state.assistPressTimer)
  }

  state.assistPressTimer = setTimeout(() => {
    state.assistPressTimer = null
    requestAssistModeActivation()
  }, ASSIST_LONG_PRESS_MS)
}

const cancelAssistLongPress = () => {
  if (!state.assistPressTimer) return
  clearTimeout(state.assistPressTimer)
  state.assistPressTimer = null
}

const manualUnlockNextPoint = () => {
  if (!state.assistMode || state.modalOpen || state.completed) return

  const now = Date.now()
  if (now < state.assistCooldownUntil) return
  state.assistCooldownUntil = now + ASSIST_COOLDOWN_MS

  enqueueUnlock()
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
  cancelAssistLongPress()
  state.unlocked = []
  state.queue = []
  state.modalOpen = false
  state.completed = false
  state.assistCooldownUntil = 0
  state.typingText = ''
  state.typingIndex = 0
  state.isTyping = false
  setAssistMode(false)
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

assistStatusEl.addEventListener('pointerdown', startAssistLongPress)
assistStatusEl.addEventListener('pointerup', cancelAssistLongPress)
assistStatusEl.addEventListener('pointercancel', cancelAssistLongPress)
assistStatusEl.addEventListener('pointerleave', cancelAssistLongPress)
assistStatusEl.addEventListener('touchstart', startAssistLongPress, { passive: false })
assistStatusEl.addEventListener('touchend', cancelAssistLongPress)
assistStatusEl.addEventListener('touchcancel', cancelAssistLongPress)
assistStatusEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  requestAssistModeActivation()
})

assistNextEl.addEventListener('click', manualUnlockNextPoint)
