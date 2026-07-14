# Game Hub — Arpan Lamsal

A small, growing collection of mini games, styled to match [arpanlamsal.com.np](https://arpanlamsal.com.np).

## Structure

```
index.html               ← the hub (dynamic game grid, read from Arcade.GAMES,
                             favorites, "Save for offline play")
manifest.json, sw.js      ← PWA / offline support (network-first, always fresh)
assets/
  css/theme.css           ← shared design tokens + components (nav, overlays,
                             buttons, HUD, option cards, footer, profile panel,
                             desktop phone-mockup frame...)
  js/common.js             ← shared helpers (synthesized SFX, best-score
                             storage, toasts, achievements, player profile,
                             favorites, settings, SW registration, and the
                             desktop phone-mockup frame builder)
flappy/index.html
dino/index.html
tic-tac-toe/index.html
Road-fighter/index.html
snake/index.html
stack-tower/index.html
brick-breaker/index.html
faviconset/, logo.png
```

Every game page links `../assets/css/theme.css` and `../assets/js/common.js`
instead of redefining the same nav/overlay/button/HUD styles and sound-synthesis
code in each file. Each game's `<style>` block only keeps what's actually
unique to that game (the canvas frame, a fuel bar, the tic-tac-toe board grid,
etc).

## Player profile

`Arcade.getProfile()` / `Arcade.setProfile(patch)` read/write a small
`{ username, avatar, createdAt }` record in `localStorage` — nothing ever
leaves the device. `Arcade.mountPanels()` (already called by every page)
adds a round avatar button to the nav; tapping it opens a panel to set a
username and upload a photo, which is downscaled to a 160×160 JPEG on a
canvas before being stored so it stays small. The hub's hero personalizes
itself ("Welcome back, ‹name›") once a profile is set.

## Favorites

`Arcade.toggleFavorite(gameId)` / `Arcade.isFavorite(gameId)` back the heart
button on each cartridge in the hub grid — purely local, no UI elsewhere
depends on it yet, but it's there for a future "Favorites only" filter.

## Desktop phone-mockup frame

On any viewport ≥861px wide (`assets/js/common.js`, runs on every page
automatically), the page hides itself, then rebuilds as a phone-shaped
bezel containing an `<iframe>` pointed at that same URL. The framed copy
gets a genuinely small real viewport (measures itself against the phone's
dimensions, not the desktop window), so canvas games size themselves
correctly with no per-game changes. Actual phones/tablets are under the
width threshold and always render natively, full-bleed. A "Open without
the frame" link next to the mockup opens the real page in a new tab.

## Design consistency (strict, across every page)

- **Nav**: identical everywhere — logo (`logo.png`, 38px, given visual
  priority) + game title on the left, immediately followed by a "← Hub"
  pill that always links to `../index.html`. Nothing on the right.
- **Difficulty / mode selection**: every game that has one uses the same
  `.option-list` / `.option-btn` card pattern (title + one-line description),
  and **picking an option starts the game immediately** — there is no
  separate "now tap to start" step. This is deliberate: an earlier version
  used small pill buttons for Flappy/Dino that required a second tap to
  begin, which read as the game being "stuck." Do not reintroduce a
  two-step start flow.
- **Panels**: `.overlay` / `.panel`, same max-width (360px), same
  `.stat-row` for Best Score, same `.btn-primary` / `.btn-secondary` /
  `.back-link` for actions.
- **Fonts/colors**: only the shared CSS variables in `theme.css` — never
  hardcode a color or font that isn't already a variable there.

## Adding a new game

1. Create `your-game/index.html`, link the two shared assets:
   ```html
   <link rel="stylesheet" href="../assets/css/theme.css">
   <script src="../assets/js/common.js"></script>
   ```
2. Copy the nav block verbatim from any existing game page (logo + Hub
   button) — do not redesign it.
3. Reuse the existing building blocks: `.overlay`/`.panel`,
   `.btn-primary`/`.btn-secondary`, `.option-list`/`.option-btn` for
   difficulty or mode selection, `.stat-row`, `.new-best`.
4. If the game has a score, use `Arcade.tone(...)` / `Arcade.noiseBurst(...)`
   for sound and `Arcade.getBest`/`setBest` for the high score.
5. Add a "Back to Home" link/button (`<a class="btn-secondary" href="../index.html">Back to Home</a>`)
   on the game-over screen, in addition to the nav's Hub button.
6. Add an entry to the `GAMES` array in the hub's `index.html` (folder,
   title, description, small inline SVG icon) — the numbered list,
   keyboard navigation, and offline caching all pick it up automatically.
   Also add the new page's path to `PRECACHE_URLS` in `sw.js`.
7. Bump `CACHE_NAME` in `sw.js` so returning visitors pick up the change —
   the service worker is network-first, so this mostly matters for anyone
   currently offline, but it's still good hygiene.

## Offline play

Tapping **Play Offline** on the hub registers a service worker and caches the
hub, all four games, and the shared assets, so everything keeps working with
no connection. The worker is **network-first**: online visitors always get
the latest files straight from the server (and the cache is refreshed
silently in the background); only when the network is unreachable does it
fall back to whatever was last cached. Bump `CACHE_NAME` in `sw.js` whenever
game files change.
