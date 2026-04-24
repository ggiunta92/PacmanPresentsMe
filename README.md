# Pacman Present Me

Versione "classic" del gioco Pacman (motore originale) arricchita con popup di presentazione per il management meeting.

Obiettivo: durante la partita, ogni ghost mangiato sblocca un punto di presentazione in una finestra modale. Dopo 5 sblocchi, hai mostrato tutta la tua presentazione.

## Avvio locale

```bash
npm install
npm run dev
```

Apri l URL mostrato dal terminale (di default `http://localhost:5173`).

## Build produzione

```bash
npm run build
npm run preview
```

## Personalizzare i 5 punti

Modifica l array `presentationPoints` in `src/main.js` con i tuoi contenuti reali.

- Chi sono
- Focus
- Come lavoro
- Risultati
- Visione

## Comandi di gioco (motore classico)

- Enter: avvia partita dalla home del gioco classico
- Frecce: movimento Pacman
- P: pausa/riprendi
- Touch controls: disponibili nella UI classica

## Architettura

- `public/classic`: copia del motore Pacman originale (canvas + jQuery)
- `public/classic/js/presentation-bridge.js`: invia eventi `ghost-eaten` verso l'app host
- `src/main.js`: shell host Vite + overlay modali di presentazione
- `src/style.css`: stile shell host e modal

## Licenza del motore classico

La base del gioco in `public/classic` deriva dal repository `luciopanepinto/pacman`, distribuito in licenza GPLv3.
Nel progetto sono inclusi:

- `public/classic/LICENSE`
- `public/classic/README-reference.md`

## Deploy su Azure (opzione semplice)

Puoi pubblicare il contenuto statico della cartella `dist` su:

- Azure Static Web Apps (consigliato)
- Azure App Service (servendo file statici)

Pipeline minima:

1. `npm ci`
2. `npm run build`
3. Deploy della cartella `dist`
