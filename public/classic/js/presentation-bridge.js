(function () {
  window.PRESENTATION_FREEZE = false

  var originalScore = window.score
  var originalMessage = window.message
  var originalResumePacman = window.resumePacman
  var originalResumeGhosts = window.resumeGhosts

  // Wrap all sound functions so they are silenced during freeze
  var soundFns = [
    'playEatingSound', 'playEatGhostSound', 'playGhostEatenSound',
    'playWazaSound', 'playSirenSound', 'playEatPillSound',
    'playEatFruitSound', 'playExtraLifeSound', 'playReadySound', 'playDieSound'
  ]
  var originalSounds = {}
  soundFns.forEach(function (name) {
    if (typeof window[name] === 'function') {
      originalSounds[name] = window[name]
      window[name] = function () {
        if (window.PRESENTATION_FREEZE === true) return
        return originalSounds[name].apply(this, arguments)
      }
    }
  })

  if (typeof originalResumePacman === 'function') {
    window.resumePacman = function () {
      if (window.PRESENTATION_FREEZE === true) return
      return originalResumePacman.apply(this, arguments)
    }
  }

  if (typeof originalResumeGhosts === 'function') {
    window.resumeGhosts = function () {
      if (window.PRESENTATION_FREEZE === true) return
      return originalResumeGhosts.apply(this, arguments)
    }
  }

  if (typeof originalScore === 'function') {
    window.score = function (s, type) {
      originalScore.apply(this, arguments)

      if (type === 'blinky' || type === 'pinky' || type === 'inky' || type === 'clyde') {
        window.parent.postMessage(
          {
            source: 'pacman-classic',
            event: 'ghost-eaten',
            payload: { ghost: type, score: s },
          },
          window.location.origin,
        )
      }
    }
  }

  if (typeof originalMessage === 'function') {
    window.message = function (m) {
      originalMessage.apply(this, arguments)

      if (typeof m === 'string' && m.toLowerCase() === 'game over') {
        window.parent.postMessage(
          {
            source: 'pacman-classic',
            event: 'game-over',
          },
          window.location.origin,
        )
      }
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return
    var data = event.data
    if (!data || data.source !== 'pacman-present-host') return
    if (data.event !== 'presentation-freeze') return

    window.PRESENTATION_FREEZE = data.payload && data.payload.frozen === true

    if (window.PRESENTATION_FREEZE === true) {
      if (window.GROUP_SOUND) {
        try { window.GROUP_SOUND.stop() } catch (e) {}
      }
      if (typeof window.pauseGame === 'function' && window.PAUSE === false) {
        window.pauseGame()
      }
    } else {
      if (typeof window.resumeGame === 'function' && window.PAUSE === true) {
        window.resumeGame()
      }
    }
  })
})()
