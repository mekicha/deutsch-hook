# By Hook or Crook: Deutsch!

A small, browser-only German-learning caper. Choose the charming Hook or curious Crook route, solve three scenes, and practice six beginner German phrases. No accounts, APIs, or backend required.

## Run locally

Requires Node.js 22.18+ (Node 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open the address printed by Vite. `npm run build` checks TypeScript and creates `dist/`; `npm run preview` serves that build. `npm test` runs answer-checking tests.

Mission data, translations, accepted answers, and hints live in `src/game.ts`. Progress and completed routes are stored in localStorage under `deutsch-caper-v1`. If storage is blocked, the game works for the current session and displays a notice. No personal data leaves the browser. Fonts optionally load from Google Fonts; system serif and sans-serif fallbacks keep the game usable offline.

Use the hint twice to reveal the full phrase; type it to advance. The phrasebook is always available. Keyboard: Tab to controls, Enter to submit, Escape to close the phrasebook. Umlaut spellings such as `ae` and `oe` are accepted.
