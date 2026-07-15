/* ==========================================
   GAME HUB — shared game helpers
   Loaded by every game page (and the hub) so
   new games can reuse the same building blocks
   instead of re-implementing them per-file.
   ========================================== */

window.Arcade = (function () {

  /* ---- Shared game registry (single source of truth) ----
     The hub's grid, the stats/leaderboard panel, and the service
     worker precache list all read from this instead of maintaining
     their own copies — add a game here once and it shows up everywhere. */
  const GAMES = [
    {
      id: 'flappy', title: 'Flappy Bird', href: 'flappy/index.html',
      accent: '#e8b55a', category: 'Arcade', difficulty: 'Medium', playTime: '2–4 min',
      desc: 'Tap to flap. Weave the gold bird through the pipes.',
      icon: `<defs><linearGradient id="g-flappy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <ellipse cx="55" cy="52" rx="9" ry="17" fill="#9c7328" transform="rotate(28 55 52)"/>
      <ellipse cx="48" cy="50" rx="30" ry="24" fill="url(#g-flappy)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5"/>
      <ellipse cx="38" cy="60" rx="17" ry="9" fill="rgba(240,237,230,0.16)"/>
      <ellipse cx="68" cy="38" rx="16" ry="15" fill="url(#g-flappy)"/>
      <path d="M80 32 L95 38 L80 44 Z" fill="#e8683a" stroke="rgba(12,12,11,0.3)" stroke-width="1"/>
      <circle cx="74" cy="32" r="3.4" fill="#0c0c0b"/>
      <circle cx="72.8" cy="30.8" r="1.2" fill="rgba(255,255,255,0.85)"/>`
    },
    {
      id: 'dino', title: 'Dino Run', href: 'dino/index.html',
      accent: '#7fd88f', category: 'Endless Runner', difficulty: 'Medium', playTime: '3–5 min',
      desc: 'Jump the thorns, duck the crows. Speed only goes up.',
      icon: `<defs><linearGradient id="g-dino" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <path d="M40 54 Q18 60 8 80 Q22 74 36 65 Z" fill="#9c7328" stroke="rgba(12,12,11,0.35)" stroke-width="1"/>
      <path d="M40 74 L36 92 M40 74 L46 91" stroke="#9c7328" stroke-width="6" stroke-linecap="round"/>
      <path d="M56 76 L53 93 M56 76 L60 92" stroke="#9c7328" stroke-width="6" stroke-linecap="round"/>
      <rect x="32" y="34" width="34" height="44" rx="15" fill="url(#g-dino)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5"/>
      <ellipse cx="42" cy="60" rx="11" ry="15" fill="rgba(240,237,230,0.16)"/>
      <line x1="58" y1="62" x2="67" y2="67" stroke="#9c7328" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="68" cy="27" rx="17" ry="15" fill="url(#g-dino)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5"/>
      <path d="M79 30 L96 35 L94 44 L74 39 Z" fill="url(#g-dino)" stroke="rgba(12,12,11,0.3)" stroke-width="1"/>
      <path d="M79 37 L82 41 L85 37 L88 41 L91 37" stroke="rgba(240,237,230,0.9)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <circle cx="73" cy="21" r="3" fill="#0c0c0b"/>
      <circle cx="71.8" cy="19.8" r="1.1" fill="rgba(255,255,255,0.85)"/>`
    },
    {
      id: 'tictactoe', title: 'Tic Tac Toe', href: 'tic-tac-toe/index.html',
      accent: '#e6e6e1', category: 'Strategy', difficulty: 'Easy', playTime: '~1 min',
      desc: 'Get three in a row to win.',
      icon: `<defs><linearGradient id="g-ttt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <line x1="38.3" y1="16" x2="38.3" y2="84" stroke="url(#g-ttt)" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="61.7" y1="16" x2="61.7" y2="84" stroke="url(#g-ttt)" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="16" y1="38.3" x2="84" y2="38.3" stroke="url(#g-ttt)" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="16" y1="61.7" x2="84" y2="61.7" stroke="url(#g-ttt)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M20.5 20.5 L32.5 32.5 M32.5 20.5 L20.5 32.5" stroke="url(#g-ttt)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="73" cy="27.3" r="8.3" fill="none" stroke="#f0ede6" stroke-width="5"/>
      <path d="M67.5 67.5 L79.5 79.5 M79.5 67.5 L67.5 79.5" stroke="url(#g-ttt)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="27.3" cy="73" r="8.3" fill="none" stroke="rgba(240,237,230,0.55)" stroke-width="5"/>`
    },
    {
      id: 'roadfighter', title: 'Road Fighter', href: 'Road-fighter/index.html',
      accent: '#e8683a', category: 'Racing', difficulty: 'Hard', playTime: '3–6 min',
      desc: 'Race against the traffic and avoid collisions.',
      icon: `<defs><linearGradient id="g-road" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <line x1="24" y1="18" x2="18" y2="30" stroke="#9c7328" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
      <line x1="34" y1="12" x2="28" y2="26" stroke="#9c7328" stroke-width="3.5" stroke-linecap="round" opacity="0.4"/>
      <rect x="32" y="16" width="36" height="68" rx="14" fill="url(#g-road)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5"/>
      <rect x="40" y="34" width="20" height="16" rx="5" fill="rgba(12,12,11,0.55)"/>
      <rect x="22" y="38" width="10" height="10" rx="3" fill="rgba(12,12,11,0.4)"/>
      <rect x="68" y="38" width="10" height="10" rx="3" fill="rgba(12,12,11,0.4)"/>
      <circle cx="42" cy="27" r="3.6" fill="#f0ede6"/>
      <circle cx="58" cy="27" r="3.6" fill="#f0ede6"/>
      <circle cx="41.5" cy="76" r="3.4" fill="#c8432a"/>
      <circle cx="58.5" cy="76" r="3.4" fill="#c8432a"/>`
    },
    {
      id: 'snake', title: 'Snake', href: 'snake/index.html',
      accent: '#6fd0a8', category: 'Arcade', difficulty: 'Medium', playTime: '2–5 min',
      desc: 'Eat, grow, don\u2019t bite yourself. Classic grid-snake.',
      icon: `<defs><linearGradient id="g-snake" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7fe0b0"/><stop offset="100%" stop-color="#3f9c74"/>
      </linearGradient></defs>
      <path d="M18 78 Q18 60 36 60 L54 60 Q72 60 72 42 Q72 24 54 24" fill="none" stroke="url(#g-snake)" stroke-width="14" stroke-linecap="round"/>
      <circle cx="54" cy="24" r="11" fill="url(#g-snake)"/>
      <circle cx="58" cy="20" r="1.8" fill="#0c0c0b"/>
      <circle cx="58.6" cy="19.4" r="0.7" fill="rgba(255,255,255,0.85)"/>
      <circle cx="30" cy="78" r="6" fill="#e8683a"/>`
    },
    {
      id: 'stacktower', title: 'Stack Tower', href: 'stack-tower/index.html',
      accent: '#e0a63c', category: 'Skill', difficulty: 'Medium', playTime: '2–4 min',
      desc: 'Time each drop. Perfect landings keep your width and build combo.',
      icon: `<defs><linearGradient id="g-stack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <rect x="22" y="68" width="56" height="16" rx="3" fill="url(#g-stack)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5"/>
      <rect x="30" y="50" width="40" height="16" rx="3" fill="url(#g-stack)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5" opacity="0.92"/>
      <rect x="36" y="32" width="28" height="16" rx="3" fill="url(#g-stack)" stroke="rgba(12,12,11,0.35)" stroke-width="1.5" opacity="0.85"/>
      <rect x="41" y="14" width="18" height="16" rx="3" fill="#f0ede6" stroke="rgba(12,12,11,0.3)" stroke-width="1.5" opacity="0.9"/>`
    },
    {
      id: 'brickbreaker', title: 'Brick Breaker', href: 'brick-breaker/index.html',
      accent: '#e8b55a', category: 'Arcade', difficulty: 'Medium', playTime: '2–5 min',
      desc: 'Steer the paddle, keep the ball alive, and clear the wall level by level.',
      icon: `<rect x="18" y="18" width="14" height="9" rx="1.5" fill="#e8683a"/>
      <rect x="34" y="18" width="14" height="9" rx="1.5" fill="#e0a63c"/>
      <rect x="50" y="18" width="14" height="9" rx="1.5" fill="#e0a63c"/>
      <rect x="66" y="18" width="14" height="9" rx="1.5" fill="#e8683a"/>
      <rect x="26" y="29" width="14" height="9" rx="1.5" fill="#e8b55a"/>
      <rect x="42" y="29" width="14" height="9" rx="1.5" fill="#c8973a"/>
      <rect x="58" y="29" width="14" height="9" rx="1.5" fill="#e8b55a"/>
      <circle cx="50" cy="58" r="5" fill="#f0ede6"/>
      <rect x="34" y="80" width="32" height="7" rx="3.5" fill="#e8b55a"/>`
    },
    {
      id: 'bouncetail', title: 'Bounce Tail', href: 'bounce-tail/index.html',
      accent: '#e8b55a', category: 'Arcade', difficulty: 'Medium', playTime: '2–5 min',
      desc: 'Steer the ball across bouncing platforms and climb as high as you dare.',
      icon: `<defs><linearGradient id="g-bounce" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0ede6"/><stop offset="100%" stop-color="#e8b55a"/>
      </linearGradient></defs>
      <circle cx="24" cy="70" r="10" fill="#e8b55a" opacity="0.28"/>
      <circle cx="34" cy="58" r="8" fill="#e8b55a" opacity="0.45"/>
      <circle cx="44" cy="46" r="14" fill="url(#g-bounce)" stroke="rgba(12,12,11,0.3)" stroke-width="1.5"/>
      <rect x="18" y="86" width="26" height="7" rx="3.5" fill="#c8973a"/>
      <rect x="58" y="60" width="24" height="7" rx="3.5" fill="#c8973a"/>
      <path d="M64 60 l0 -6 M60 56 l8 0" stroke="#e8b55a" stroke-width="2.5" stroke-linecap="round"/>`
    },
    {
      id: 'novadrift', title: 'Nova Drift', href: 'nova-drift/index.html',
      accent: '#b39cf0', category: 'Reflex', difficulty: 'Hard', playTime: '2–5 min',
      desc: 'Orbit the core, switch rings to dodge asteroids, and chain gold shards for combo score.',
      icon: `<defs><linearGradient id="g-nova" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8b55a"/><stop offset="100%" stop-color="#c8973a"/>
      </linearGradient></defs>
      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(240,237,230,0.18)" stroke-width="2"/>
      <circle cx="50" cy="50" r="23" fill="none" stroke="rgba(240,237,230,0.3)" stroke-width="2"/>
      <circle cx="50" cy="50" r="11" fill="url(#g-nova)"/>
      <circle cx="50" cy="15" r="4.6" fill="#f0ede6" stroke="rgba(12,12,11,0.35)" stroke-width="1"/>
      <path d="M79 50 l7 -4 3 4 -3 4 Z" fill="#e8683a"/>
      <path d="M22 63 L28 63 L25 68 Z" fill="#b39cf0"/>`
    }
  ];

  /* ---- Synthesized SFX (no audio files needed) ---- */
  let actx = null;
  function audioCtx() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur, type, startGain, opts) {
    if (getSettings().muted) return;
    const ac = audioCtx();
    if (!ac) return;
    opts = opts || {};
    const vol = getSettings().masterVolume;
    startGain = startGain * (vol == null ? 1 : vol);
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.sweepTo), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, startGain), t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  function noiseBurst(duration, startGain, lowpassFreq) {
    if (getSettings().muted) return;
    const ac = audioCtx();
    if (!ac) return;
    const vol = getSettings().masterVolume;
    startGain = startGain * (vol == null ? 1 : vol);
    const t0 = ac.currentTime;
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(Math.max(0.0001, startGain), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(lowpassFreq || 1200, t0);
    noise.connect(filter).connect(gain).connect(ac.destination);
    noise.start(t0);
  }

  /* ---- Ambient background music (synthesized, no audio files) ----
     A soft detuned pad with a slow LFO on filter cutoff. Starts/stops
     from the Settings panel's Music switch; volume follows masterVolume
     live so dragging the slider affects it in real time. */
  let musicNodes = null;
  function startMusic() {
    if (musicNodes) return;
    const ac = audioCtx();
    if (!ac) return;
    const master = ac.createGain();
    const vol = getSettings().masterVolume;
    master.gain.setValueAtTime(0.0001, ac.currentTime);
    master.gain.linearRampToValueAtTime(0.05 * (vol == null ? 1 : vol), ac.currentTime + 1.2);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 320;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    const notes = [110, 164.81, 220, 277.18]; // A2, E3, A3, C#4 — soft major-ish drone
    const oscs = notes.map((f, i) => {
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.detune.value = (i % 2 === 0 ? -4 : 4);
      const g = ac.createGain();
      g.gain.value = i === 0 ? 1 : 0.55;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });
    filter.connect(master).connect(ac.destination);
    musicNodes = { master: master, filter: filter, lfo: lfo, oscs: oscs };
  }
  function stopMusic() {
    if (!musicNodes) return;
    const ac = audioCtx();
    const now = ac ? ac.currentTime : 0;
    try {
      musicNodes.master.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      const nodes = musicNodes;
      setTimeout(() => {
        nodes.oscs.forEach(o => { try { o.stop(); } catch (e) {} });
        try { nodes.lfo.stop(); } catch (e) {}
      }, 650);
    } catch (e) {}
    musicNodes = null;
  }
  function setMusicVolume(vol) {
    if (!musicNodes) return;
    const ac = audioCtx();
    if (!ac) return;
    musicNodes.master.gain.linearRampToValueAtTime(Math.max(0.0001, 0.05 * vol), ac.currentTime + 0.15);
  }
  function syncMusic() {
    const s = getSettings();
    if (s.musicOn && !s.muted) startMusic(); else stopMusic();
    if (musicNodes) setMusicVolume(s.masterVolume == null ? 1 : s.masterVolume);
  }

  /* ---- Achievements registry (single source of truth) ----
     Every achievement id any game or the hub can unlock, with display
     copy, so the Stats panel can show a full locked/unlocked roster and
     an accurate completion percentage instead of a guessed count. */
  const ACHIEVEMENTS = [
    { id: 'first_run', title: 'First Contact', desc: 'Play your first game in the hub' },
    { id: 'ten_runs', title: 'Warming Up', desc: 'Complete 10 runs across any games' },
    { id: 'fifty_runs', title: 'Arcade Regular', desc: 'Complete 50 runs across any games' },
    { id: 'completionist', title: 'Completionist', desc: 'Play every game in the hub' },
    { id: 'first_favorite', title: 'Picked A Favorite', desc: 'Favorite your first game' },
    { id: 'offline_ready', title: 'Off The Grid', desc: 'Save the hub for offline play' },
    { id: 'flappy_10', title: 'Pipe Dream', desc: 'Score 10 in Flappy Bird' },
    { id: 'flappy_30', title: 'Sky Master', desc: 'Score 30 in Flappy Bird' },
    { id: 'dino_300', title: 'Marathon Runner', desc: 'Score 300 in Dino Run' },
    { id: 'dino_750', title: 'Prehistoric Legend', desc: 'Score 750 in Dino Run' },
    { id: 'snake_10', title: 'Growing Pains', desc: 'Score 10 in Snake' },
    { id: 'snake_25', title: 'Serpent King', desc: 'Score 25 in Snake' },
    { id: 'ttt_beat_hard', title: 'Unbeatable, Beaten', desc: 'Win a round on Hard difficulty' },
    { id: 'ttt_ten_wins', title: 'Three In A Row', desc: 'Win 10 rounds of Tic Tac Toe' },
    { id: 'roadfighter_fuel', title: 'Fumes', desc: 'Run clean out of fuel in Road Fighter' },
    { id: 'roadfighter_150', title: 'Long Haul', desc: 'Pass 150 cars in a single run of Road Fighter' },
    { id: 'hard_try_flappy', title: 'Hard Mode', desc: 'Play Flappy Bird on Hard' },
    { id: 'hard_try_dino', title: 'Hard Mode', desc: 'Play Dino Run on Hard' },
    { id: 'hard_try_snake', title: 'Hard Mode', desc: 'Play Snake on Hard' },
    { id: 'hard_try_roadfighter', title: 'Hard Mode', desc: 'Play Road Fighter on Hard' },
    { id: 'hard_try_tictactoe', title: 'Hard Mode', desc: 'Play Tic Tac Toe on Hard' },
    { id: 'stacktower_20', title: 'Getting Tall', desc: 'Stack 20 blocks in Stack Tower' },
    { id: 'stacktower_50', title: 'Skyscraper', desc: 'Stack 50 blocks in Stack Tower' },
    { id: 'stacktower_combo10', title: 'Perfect Ten', desc: 'Reach a 10x perfect combo in Stack Tower' },
    { id: 'hard_try_stacktower', title: 'Hard Mode', desc: 'Play Stack Tower on Hard' },
    { id: 'brickbreaker_30', title: 'Wall Breaker', desc: 'Break 30 bricks in a single run of Brick Breaker' },
    { id: 'brickbreaker_lvl3', title: 'Demolition Crew', desc: 'Clear 3 levels in one run of Brick Breaker' },
    { id: 'hard_try_brickbreaker', title: 'Hard Mode', desc: 'Play Brick Breaker on Hard' },
    { id: 'bouncetail_500', title: 'Sky High', desc: 'Reach 500m in Bounce Tail' },
    { id: 'bouncetail_1500', title: 'Stratosphere', desc: 'Reach 1500m in Bounce Tail' },
    { id: 'hard_try_bouncetail', title: 'Hard Mode', desc: 'Play Bounce Tail on Hard' },
    { id: 'novadrift_800', title: 'Steady Orbit', desc: 'Score 800 in Nova Drift' },
    { id: 'novadrift_2200', title: 'Solar Ace', desc: 'Score 2200 in Nova Drift' },
    { id: 'hard_try_novadrift', title: 'Hard Mode', desc: 'Play Nova Drift on Hard' }
  ];

  /* ---- Estimated per-session seconds, used until a game passes a real
     durationSec into logRun() — keeps "Total Play Time" meaningful from
     day one instead of reading 0 until every game is wired for timing. */
  const AVG_SESSION_SECONDS = { flappy: 150, dino: 210, tictactoe: 45, roadfighter: 240, snake: 180, stacktower: 150, brickbreaker: 180, bouncetail: 150, novadrift: 150 };
  const PLAYTIME_KEY = 'arcade_total_playtime_sec_v1';
  function getTotalPlayTimeSec() { return parseInt(localStorage.getItem(PLAYTIME_KEY) || '0', 10); }
  function formatDuration(sec) {
    sec = Math.max(0, sec | 0);
    if (sec < 60) return sec + 's';
    const totalMin = Math.floor(sec / 60);
    const h = Math.floor(totalMin / 60), m = totalMin % 60;
    return h > 0 ? (h + 'h ' + m + 'm') : (m + 'm');
  }

  /* ---- Best-score storage ---- */
  function getBest(key) {
    return parseInt(localStorage.getItem(key) || '0', 10);
  }
  function setBest(key, value) {
    localStorage.setItem(key, String(value));
  }

  /* ---- Difficulty pill wiring (Easy / Medium / Hard) ---- */
  function wireDifficulty(rowSelector, storageKey, defaultValue, onChange) {
    let current = localStorage.getItem(storageKey) || getSettings().difficulty || defaultValue;
    const buttons = Array.from(document.querySelectorAll(rowSelector + ' .diff-btn'));
    function applyUI() {
      buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-diff') === current));
    }
    buttons.forEach(b => {
      ['pointerdown', 'pointerup', 'touchstart'].forEach(evt => {
        b.addEventListener(evt, (e) => e.stopPropagation());
      });
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        current = b.getAttribute('data-diff');
        localStorage.setItem(storageKey, current);
        applyUI();
        if (onChange) onChange(current);
      });
    });
    applyUI();
    return { get: () => current, refreshUI: applyUI };
  }

  /* ---- Tiny toast ---- */
  let toastTimer = null;
  function toast(message, duration) {
    let el = document.getElementById('arcadeToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'arcadeToast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), duration || 2600);
  }

  /* ---- Shared "new best score" celebration ----
     One DOM-based confetti burst every game can call instead of each
     reimplementing its own canvas particle version. Respects the same
     reduced-motion / particles settings as everything else, and a
     matching haptic buzz on devices that support it. */
  function celebrate() {
    if (OS_REDUCED_MOTION || getSettings().reducedMotion || getSettings().particles === false) return;
    const palette = ['#c8973a', '#e8b55a', '#9c7328', '#f0ede6'];
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    const count = window.matchMedia('(pointer: coarse)').matches ? 26 : 44;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      const size = 5 + Math.random() * 5;
      piece.style.left = (Math.random() * 100) + '%';
      piece.style.width = size + 'px';
      piece.style.height = (size * 0.45) + 'px';
      piece.style.background = palette[(Math.random() * palette.length) | 0];
      piece.style.animationDuration = (1.8 + Math.random() * 1.2).toFixed(2) + 's';
      piece.style.animationDelay = (Math.random() * 0.3).toFixed(2) + 's';
      piece.style.setProperty('--drift', (Math.random() * 140 - 70).toFixed(0) + 'px');
      piece.style.setProperty('--spin', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 3200);
  }
  function celebrateHaptic() {
    if (navigator.vibrate) { try { navigator.vibrate([30, 40, 30, 40, 60]); } catch (e) {} }
  }

  /* ---- Achievement toast (distinct from the plain toast: trophy + glow) ---- */
  let achToastTimer = null;
  function showAchievementToast(title, desc) {
    let el = document.getElementById('arcadeAchToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'arcadeAchToast';
      el.className = 'ach-toast';
      el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3M17 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3"/></svg>
        <span class="ach-toast-body"><b>Achievement Unlocked</b><span id="arcadeAchTitle"></span></span>
      `;
      document.body.appendChild(el);
    }
    el.querySelector('#arcadeAchTitle').textContent = title + (desc ? ' — ' + desc : '');
    el.classList.remove('show'); void el.offsetWidth;
    el.classList.add('show');
    tone(660, 0.1, 'triangle', 0.16, { sweepTo: 990 });
    setTimeout(() => tone(990, 0.14, 'triangle', 0.14, { sweepTo: 1320 }), 90);
    clearTimeout(achToastTimer);
    achToastTimer = setTimeout(() => el.classList.remove('show'), 3600);
  }

  /* ---- Achievements engine ----
     A tiny generic unlock store, shared across every game. Each game calls
     Arcade.unlock(id, title, desc) at the moment a condition is met;
     duplicate unlocks are ignored so games can call it freely every run. */
  const ACH_KEY = 'arcade_achievements_v1';
  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem(ACH_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function unlock(id, title, desc) {
    const u = getUnlocked();
    if (u[id]) return false;
    u[id] = { title: title, desc: desc, date: Date.now() };
    localStorage.setItem(ACH_KEY, JSON.stringify(u));
    showAchievementToast(title, desc);
    return true;
  }
  function isUnlocked(id) { return !!getUnlocked()[id]; }

  /* ---- Stats & on-device leaderboard ----
     Every completed run gets logged per game (score, difficulty, date).
     Keeps the best 20 runs per game so the stats panel can show a
     personal leaderboard without needing any server. */
  const RUNS_PREFIX = 'arcade_runs_';
  const PLAYS_KEY = 'arcade_total_plays_v1';
  const GAME_PLAYS_PREFIX = 'arcade_gameplays_';
  const LAST_PLAYED_PREFIX = 'arcade_lastplayed_';
  function logRun(gameId, score, difficulty, durationSec) {
    const key = RUNS_PREFIX + gameId;
    let runs = [];
    try { runs = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    runs.push({ score: score, difficulty: difficulty || 'medium', date: Date.now() });
    runs.sort((a, b) => b.score - a.score);
    runs = runs.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(runs));

    const totalPlays = parseInt(localStorage.getItem(PLAYS_KEY) || '0', 10) + 1;
    localStorage.setItem(PLAYS_KEY, String(totalPlays));

    const gamePlays = parseInt(localStorage.getItem(GAME_PLAYS_PREFIX + gameId) || '0', 10) + 1;
    localStorage.setItem(GAME_PLAYS_PREFIX + gameId, String(gamePlays));
    localStorage.setItem(LAST_PLAYED_PREFIX + gameId, String(Date.now()));

    const addSeconds = (typeof durationSec === 'number' && durationSec > 0) ? durationSec : (AVG_SESSION_SECONDS[gameId] || 120);
    localStorage.setItem(PLAYTIME_KEY, String(getTotalPlayTimeSec() + Math.round(addSeconds)));

    // A handful of cross-game milestones live here so every game gets them
    // for free just by calling logRun — no per-game wiring needed.
    if (totalPlays === 1) unlock('first_run', 'First Contact', 'Play your first game in the hub');
    if (totalPlays === 10) unlock('ten_runs', 'Warming Up', 'Complete 10 runs across any games');
    if (totalPlays === 50) unlock('fifty_runs', 'Arcade Regular', 'Complete 50 runs across any games');
    if (difficulty === 'hard') unlock('hard_try_' + gameId, 'Hard Mode', 'Play ' + gameLabel(gameId) + ' on Hard');
    const playedGames = GAMES.filter(g => getRuns(g.id).length > 0).map(g => g.id);
    if (playedGames.length >= GAMES.length) unlock('completionist', 'Completionist', 'Play every game in the hub');

    return runs;
  }
  function getRuns(gameId) {
    try { return JSON.parse(localStorage.getItem(RUNS_PREFIX + gameId) || '[]'); }
    catch (e) { return []; }
  }
  function getTotalPlays() { return parseInt(localStorage.getItem(PLAYS_KEY) || '0', 10); }
  function getGamePlays(gameId) { return parseInt(localStorage.getItem(GAME_PLAYS_PREFIX + gameId) || '0', 10); }
  function getLastPlayed(gameId) { return parseInt(localStorage.getItem(LAST_PLAYED_PREFIX + gameId) || '0', 10); }
  function gameLabel(id) { const g = GAMES.find(g => g.id === id); return g ? g.title : id; }

  function getGamesPlayedCount() { return GAMES.filter(g => getRuns(g.id).length > 0).length; }
  function getFavoriteGameLabel() {
    let best = null, bestCount = 0;
    GAMES.forEach(g => { const c = getGamePlays(g.id); if (c > bestCount) { bestCount = c; best = g; } });
    return best ? best.title : '—';
  }
  function getHighestScoreOverall() {
    return GAMES.reduce((max, g) => Math.max(max, getRuns(g.id)[0]?.score || 0), 0);
  }
  function getAverageScoreOverall() {
    const all = GAMES.reduce((acc, g) => acc.concat(getRuns(g.id)), []);
    if (!all.length) return 0;
    return Math.round(all.reduce((s, r) => s + r.score, 0) / all.length);
  }
  function getCompletionPercent() {
    return Math.round((Object.keys(getUnlocked()).length / ACHIEVEMENTS.length) * 100);
  }

  /* ---- Reset Scores (Settings → destructive action) ----
     Clears every score, run, achievement, and play-count — everything
     that represents "progress" — but intentionally leaves favorites and
     preferences (theme, sound, difficulty) untouched. */
  const GAME_BEST_KEYS = {
    flappy: 'flappy_al_best', dino: 'dino_al_best', snake: 'snake_al_best', roadfighter: 'roadfighter_al_best', stacktower: 'stacktower_al_best', brickbreaker: 'brickbreaker_al_best', bouncetail: 'bouncetail_al_best', novadrift: 'novadrift_al_best'
  };
  const EXTRA_SCORE_KEYS = ['ttt_al_pvc_scores', 'ttt_al_pvp_scores'];
  function resetAllProgress() {
    GAMES.forEach(g => {
      localStorage.removeItem(RUNS_PREFIX + g.id);
      localStorage.removeItem(GAME_PLAYS_PREFIX + g.id);
      localStorage.removeItem(LAST_PLAYED_PREFIX + g.id);
      if (GAME_BEST_KEYS[g.id]) {
        ['easy', 'medium', 'hard'].forEach(d => localStorage.removeItem(GAME_BEST_KEYS[g.id] + '_' + d));
        localStorage.removeItem(GAME_BEST_KEYS[g.id]); // legacy flat key, pre-difficulty split
      }
    });
    EXTRA_SCORE_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(ACH_KEY);
    localStorage.removeItem(PLAYS_KEY);
    localStorage.removeItem(PLAYTIME_KEY);
    try { window.dispatchEvent(new CustomEvent('arcade:reset')); } catch (e) {}
  }

  /* ---- Player profile (username + avatar image, stored locally only) ----
     The avatar is downscaled to a small square on a canvas before being
     saved as a data URL, so even a large photo stays well under
     localStorage's size limits. Nothing ever leaves the device. */
  const PROFILE_KEY = 'arcade_profile_v1';
  const DEFAULT_PROFILE = { username: 'Player One', avatar: null, createdAt: null };
  function getProfile() {
    try { return Object.assign({}, DEFAULT_PROFILE, JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULT_PROFILE); }
  }
  function setProfile(patch) {
    const p = getProfile();
    if (!p.createdAt) p.createdAt = Date.now();
    Object.assign(p, patch);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    try { window.dispatchEvent(new CustomEvent('arcade:profile', { detail: p })); } catch (e) {}
    return p;
  }
  function readAvatarFile(file, callback) {
    if (!file || !/^image\//.test(file.type)) { callback(null); return; }
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        callback(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () { callback(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { callback(null); };
    reader.readAsDataURL(file);
  }
  function initials(name) {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'P1';
    return (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();
  }
  const AVATAR_FALLBACK_ICON = '<svg class="nav-avatar-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 10v4M5 12h4"/><circle cx="16" cy="10.7" r="1"/><circle cx="18.2" cy="12.9" r="1"/></svg>';

  /* ---- Favorites (hub grid "favorite" heart, saved locally) ---- */
  const FAV_KEY = 'arcade_favorites_v1';
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function isFavorite(gameId) { return getFavorites().indexOf(gameId) !== -1; }
  function toggleFavorite(gameId) {
    const favs = getFavorites();
    const i = favs.indexOf(gameId);
    if (i === -1) { favs.push(gameId); if (favs.length === 1) unlock('first_favorite', 'Picked A Favorite', 'Favorite your first game'); }
    else favs.splice(i, 1);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    return favs.indexOf(gameId) !== -1;
  }

  /* ---- Settings (mute / theme / reduced motion) ----
     A single small store, applied on every page load so a choice made
     inside one game (or the hub) instantly affects every other page. */
  const SETTINGS_KEY = 'arcade_settings_v1';
  const DEFAULT_SETTINGS = { muted: false, musicOn: false, masterVolume: 0.6, particles: true, reducedMotion: false, theme: 'gold', difficulty: 'medium' };
  function getSettings() {
    try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULT_SETTINGS); }
  }
  function setSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    applySettings(s);
    try { window.dispatchEvent(new CustomEvent('arcade:settings', { detail: s })); } catch (e) {}
    return s;
  }
  function applySettings(s) {
    s = s || getSettings();
    document.documentElement.setAttribute('data-theme', s.theme || 'gold');
    document.documentElement.classList.toggle('reduced-motion', !!s.reducedMotion);
    document.documentElement.classList.toggle('no-particles', s.particles === false);
    syncMusic();
  }
  // Apply immediately on script load so there's no flash of the wrong theme.
  applySettings();

  /* ---- Shared motion/particle gates ----
     Every game was copy-pasting its own one-line motionOK()/particlesOK()
     function; centralized here so there's one definition to get right.
     Also honors the OS-level prefers-reduced-motion media query, not just
     the in-app toggle — a person who set that at the system level never
     had to find this app's own Settings panel to get the same result. */
  const OS_REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function motionOK() { return !OS_REDUCED_MOTION && !getSettings().reducedMotion; }
  function particlesOK() { return motionOK() && getSettings().particles !== false; }

  /* ---- Shared particle system ----
     A tiny, self-contained particle list any game can instantiate once
     and call into its own update()/draw() loop. Replaces what used to be
     a hand-rolled copy of the same ~30 lines in every game file. Spawn
     calls are no-ops when particles/reduced-motion settings say so, so
     call sites never need their own "is this OK" check. */
  function createParticleSystem() {
    let list = [];
    function spawnBurst(x, y, color, count) {
      if (!particlesOK()) return;
      count = count || 8;
      for (let i = 0; i < count; i++) {
        list.push({
          x, y,
          vx: (Math.random() * 2 - 1) * 3, vy: (Math.random() * 2 - 1) * 3 - 1,
          gravity: 0.14, life: 24, maxLife: 24, size: 2 + Math.random() * 2.4,
          color, confetti: false
        });
      }
    }
    function spawnConfetti(width, palette, count) {
      if (!particlesOK()) return;
      palette = palette || ['#c8973a', '#e8b55a', '#9c7328', '#f0ede6'];
      count = count || 40;
      for (let i = 0; i < count; i++) {
        list.push({
          x: Math.random() * width, y: -10 - Math.random() * 60,
          vx: (Math.random() * 2 - 1) * 1.3, vy: 1 + Math.random() * 2,
          gravity: 0.05, life: 150 + Math.random() * 60, maxLife: 210,
          size: 4 + Math.random() * 4, color: palette[(Math.random() * palette.length) | 0], confetti: true
        });
      }
    }
    function update() {
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.vy += p.gravity; p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) list.splice(i, 1);
      }
    }
    function draw(ctx) {
      for (const p of list) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        if (p.confetti) ctx.fillRect(p.x - p.size / 2, p.y - p.size * 0.35, p.size, p.size * 0.7);
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
    }
    function clear() { list = []; }
    return { spawnBurst, spawnConfetti, update, draw, clear, get list() { return list; } };
  }

  /* ---- Shared haptic buzz (silently a no-op where unsupported) ---- */
  function vibrate(pattern) {
    if (!motionOK()) return; // treat strong haptic buzzes as "motion" too
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }

  /* ---- Offline / PWA support ---- */
  function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return Promise.resolve(null);
    return navigator.serviceWorker.register(swPath || '/sw.js').catch(() => null);
  }

  /* ---- Global UI: injects the Settings + Stats/Leaderboard buttons and
     panels into any page that calls Arcade.mountPanels(). Keeps every game
     page's own HTML tiny — the actual panel markup lives here, once. ---- */
  let panelsMounted = false;
  function mountPanels(opts) {
    if (panelsMounted) return;
    panelsMounted = true;
    opts = opts || {};
    const currentGameId = opts.gameId || null;

    const nav = document.querySelector('.nav');
    if (!nav) return;

    const group = document.createElement('div');
    group.className = 'nav-icon-group';
    const prof = getProfile();
    group.innerHTML = `
      <button type="button" class="nav-icon-btn nav-avatar-btn" id="arcadeProfileBtn" aria-label="Player profile">
        ${prof.avatar ? `<img src="${prof.avatar}" alt="">` : AVATAR_FALLBACK_ICON}
      </button>
      <button type="button" class="nav-icon-btn" id="arcadeStatsBtn" aria-label="Stats & achievements">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3M17 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3"/></svg>
      </button>
      <button type="button" class="nav-icon-btn" id="arcadeSettingsBtn" aria-label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.65 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.65a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.35 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.04Z"/></svg>
      </button>
    `;
    nav.appendChild(group);

    const profileOverlay = document.createElement('div');
    profileOverlay.className = 'overlay';
    profileOverlay.id = 'arcadeProfileOverlay';
    profileOverlay.innerHTML = `
      <div class="panel profile-panel">
        <div class="sub">Player Profile</div>
        <h1 style="font-size:1.9rem;">You, in the hub</h1>
        <div class="avatar-editor">
          <button type="button" class="avatar-preview" id="arcadeAvatarPreview" aria-label="Change avatar">
            ${prof.avatar ? `<img src="${prof.avatar}" alt="">` : AVATAR_FALLBACK_ICON}
            <span class="avatar-edit-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </span>
          </button>
          <input type="file" accept="image/*" id="arcadeAvatarInput" hidden>
        </div>
        <label class="field-label mono" for="arcadeUsernameInput">Username</label>
        <input type="text" id="arcadeUsernameInput" class="text-input" maxlength="18" placeholder="Player One" value="${prof.username.replace(/"/g, '&quot;')}">
        <button type="button" class="btn-primary" id="arcadeProfileSave">Save Profile</button>
        <p class="hint" id="arcadeProfileSince"></p>
        <button type="button" class="back-link" id="arcadeProfileClose">Close</button>
      </div>
    `;
    document.body.appendChild(profileOverlay);

    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'overlay';
    settingsOverlay.id = 'arcadeSettingsOverlay';
    const s = getSettings();
    const themeSwatches = ['gold', 'crimson', 'azure', 'emerald'].map(t =>
      `<button type="button" class="theme-swatch theme-${t}${s.theme === t ? ' active' : ''}" data-theme="${t}" aria-label="${t} theme"></button>`
    ).join('');
    const diffPills = ['easy', 'medium', 'hard'].map(d =>
      `<button type="button" class="diff-btn${s.difficulty === d ? ' active' : ''}" data-default-diff="${d}">${d}</button>`
    ).join('');
    settingsOverlay.innerHTML = `
      <div class="panel settings-panel">
        <div class="sub">Settings</div>
        <h1 style="font-size:1.9rem;">Tune it your way</h1>
        <div class="setting-row">
          <span>Sound Effects</span>
          <button type="button" class="switch${s.muted ? '' : ' on'}" id="arcadeMuteSwitch" role="switch" aria-checked="${!s.muted}"><span class="switch-knob"></span></button>
        </div>
        <div class="setting-row">
          <span>Fullscreen</span>
          <button type="button" class="switch" id="arcadeFullscreenSwitch" role="switch" aria-checked="false"><span class="switch-knob"></span></button>
        </div>
        <div class="setting-row">
          <span>Music</span>
          <button type="button" class="switch${s.musicOn ? ' on' : ''}" id="arcadeMusicSwitch" role="switch" aria-checked="${!!s.musicOn}"><span class="switch-knob"></span></button>
        </div>
        <div class="range-row">
          <div class="setting-row"><span>Master Volume</span><b style="color:var(--gold-light); font-family:var(--font-mono); font-size:11px;" id="arcadeVolumeLabel">${Math.round(s.masterVolume * 100)}%</b></div>
          <input type="range" min="0" max="100" step="5" value="${Math.round(s.masterVolume * 100)}" class="range-slider" id="arcadeVolumeSlider" aria-label="Master volume">
        </div>
        <div class="setting-row">
          <span>Particles</span>
          <button type="button" class="switch${s.particles !== false ? ' on' : ''}" id="arcadeParticlesSwitch" role="switch" aria-checked="${s.particles !== false}"><span class="switch-knob"></span></button>
        </div>
        <div class="setting-row">
          <span>Reduced motion</span>
          <button type="button" class="switch${s.reducedMotion ? ' on' : ''}" id="arcadeMotionSwitch" role="switch" aria-checked="${!!s.reducedMotion}"><span class="switch-knob"></span></button>
        </div>
        <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:0.7rem;">
          <span>Accent theme</span>
          <div class="theme-swatch-row">${themeSwatches}</div>
        </div>
        <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:0.7rem; border-bottom:none;">
          <span>Default Difficulty</span>
          <div class="diff-row" style="margin:0; width:100%;">${diffPills}</div>
        </div>
        <button type="button" class="btn-danger" id="arcadeResetBtn">Reset All Scores</button>
        <button type="button" class="back-link" id="arcadeSettingsClose">Close</button>
      </div>
    `;
    document.body.appendChild(settingsOverlay);

    const statsOverlay = document.createElement('div');
    statsOverlay.className = 'overlay';
    statsOverlay.id = 'arcadeStatsOverlay';
    statsOverlay.innerHTML = `
      <div class="panel stats-panel">
        <div class="sub">Your Progress</div>
        <h1 style="font-size:1.9rem;">Stats &amp; Trophies</h1>
        <div id="arcadeStatsBody"></div>
        <button type="button" class="back-link" id="arcadeStatsClose">Close</button>
      </div>
    `;
    document.body.appendChild(statsOverlay);

    function renderStats() {
      const body = statsOverlay.querySelector('#arcadeStatsBody');
      const unlocked = getUnlocked();
      const trophyList = ACHIEVEMENTS
        .slice()
        .sort((a, b) => {
          const au = !!unlocked[a.id], bu = !!unlocked[b.id];
          if (au !== bu) return au ? -1 : 1;
          return au && bu ? unlocked[b.id].date - unlocked[a.id].date : 0;
        })
        .map(a => {
          const isUnlocked = !!unlocked[a.id];
          return `<div class="ach-row${isUnlocked ? '' : ' locked'}" style="${isUnlocked ? '' : 'opacity:0.4;'}">
            <span class="ach-row-title">${isUnlocked ? a.title : '🔒 ' + a.title}</span>
            <span class="ach-row-desc">${a.desc}</span>
          </div>`;
        }).join('');

      const boardRows = GAMES.map(g => {
        const runs = getRuns(g.id);
        const best = runs.length ? runs[0].score : 0;
        return `<div class="stat-row"><span>${g.title}${g.id === currentGameId ? ' <b style="color:var(--gold)">(this game)</b>' : ''}</span><b>${best}</b></div>`;
      }).join('');

      body.innerHTML = `
        <div class="stat-row"><span>Games Played</span><b>${getGamesPlayedCount()} / ${GAMES.length}</b></div>
        <div class="stat-row"><span>Total Runs</span><b>${getTotalPlays()}</b></div>
        <div class="stat-row"><span>Est. Play Time</span><b>${formatDuration(getTotalPlayTimeSec())}</b></div>
        <div class="stat-row"><span>Average Score</span><b>${getAverageScoreOverall()}</b></div>
        <div class="stat-row"><span>Highest Score</span><b>${getHighestScoreOverall()}</b></div>
        <div class="stat-row"><span>Favorite Game</span><b>${getFavoriteGameLabel()}</b></div>
        <div class="stat-row"><span>Trophies Unlocked</span><b>${Object.keys(unlocked).length} / ${ACHIEVEMENTS.length} (${getCompletionPercent()}%)</b></div>
        <div class="stats-section-label">Best Scores</div>
        ${boardRows}
        <div class="stats-section-label">Trophies</div>
        <div class="ach-list">${trophyList}</div>
      `;
    }

    const statsBtn = document.getElementById('arcadeStatsBtn');
    const settingsBtn = document.getElementById('arcadeSettingsBtn');
    const profileBtn = document.getElementById('arcadeProfileBtn');
    statsBtn.addEventListener('click', () => { renderStats(); statsOverlay.classList.add('show'); });
    document.getElementById('arcadeStatsClose').addEventListener('click', () => statsOverlay.classList.remove('show'));
    statsOverlay.addEventListener('pointerdown', (e) => { if (e.target === statsOverlay) statsOverlay.classList.remove('show'); });

    settingsBtn.addEventListener('click', () => settingsOverlay.classList.add('show'));
    document.getElementById('arcadeSettingsClose').addEventListener('click', () => settingsOverlay.classList.remove('show'));
    settingsOverlay.addEventListener('pointerdown', (e) => { if (e.target === settingsOverlay) settingsOverlay.classList.remove('show'); });

    function refreshProfileSince() {
      const p = getProfile();
      const since = document.getElementById('arcadeProfileSince');
      since.textContent = p.createdAt ? 'Playing since ' + new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Just getting started.';
    }
    profileBtn.addEventListener('click', () => { refreshProfileSince(); profileOverlay.classList.add('show'); });
    document.getElementById('arcadeProfileClose').addEventListener('click', () => profileOverlay.classList.remove('show'));
    profileOverlay.addEventListener('pointerdown', (e) => { if (e.target === profileOverlay) profileOverlay.classList.remove('show'); });

    const avatarInput = document.getElementById('arcadeAvatarInput');
    document.getElementById('arcadeAvatarPreview').addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files && avatarInput.files[0];
      if (!file) return;
      readAvatarFile(file, (dataUrl) => {
        if (!dataUrl) { toast('Could not read that image.'); return; }
        setProfile({ avatar: dataUrl });
        refreshAvatarUI();
      });
    });
    function refreshAvatarUI() {
      const p = getProfile();
      const preview = document.getElementById('arcadeAvatarPreview');
      const btn = document.getElementById('arcadeProfileBtn');
      const inner = p.avatar ? `<img src="${p.avatar}" alt="">` : AVATAR_FALLBACK_ICON;
      preview.innerHTML = inner + `<span class="avatar-edit-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span>`;
      btn.innerHTML = p.avatar ? `<img src="${p.avatar}" alt="">` : AVATAR_FALLBACK_ICON;
    }
    document.getElementById('arcadeProfileSave').addEventListener('click', () => {
      const nameInput = document.getElementById('arcadeUsernameInput');
      const name = (nameInput.value || '').trim() || 'Player One';
      setProfile({ username: name });
      refreshAvatarUI();
      toast('Profile saved.');
      profileOverlay.classList.remove('show');
    });

    const muteSwitch = document.getElementById('arcadeMuteSwitch');
    muteSwitch.addEventListener('click', () => {
      const next = !getSettings().muted;
      setSetting('muted', next);
      muteSwitch.classList.toggle('on', !next);
      muteSwitch.setAttribute('aria-checked', String(!next));
    });
    const fsSwitch = document.getElementById('arcadeFullscreenSwitch');
    function syncFsSwitch() {
      const isFs = !!document.fullscreenElement;
      fsSwitch.classList.toggle('on', isFs);
      fsSwitch.setAttribute('aria-checked', String(isFs));
    }
    if (!document.fullscreenEnabled) { fsSwitch.disabled = true; fsSwitch.style.opacity = '0.4'; }
    syncFsSwitch();
    document.addEventListener('fullscreenchange', syncFsSwitch);
    fsSwitch.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen().catch(() => toast('Fullscreen isn\u2019t available right now.'));
    });
    const musicSwitch = document.getElementById('arcadeMusicSwitch');
    musicSwitch.addEventListener('click', () => {
      const next = !getSettings().musicOn;
      setSetting('musicOn', next);
      musicSwitch.classList.toggle('on', next);
      musicSwitch.setAttribute('aria-checked', String(next));
    });
    const volumeSlider = document.getElementById('arcadeVolumeSlider');
    const volumeLabel = document.getElementById('arcadeVolumeLabel');
    volumeSlider.addEventListener('input', () => {
      const v = Number(volumeSlider.value) / 100;
      volumeLabel.textContent = volumeSlider.value + '%';
      setSetting('masterVolume', v);
    });
    const particlesSwitch = document.getElementById('arcadeParticlesSwitch');
    particlesSwitch.addEventListener('click', () => {
      const next = !(getSettings().particles !== false);
      setSetting('particles', next);
      particlesSwitch.classList.toggle('on', next);
      particlesSwitch.setAttribute('aria-checked', String(next));
    });
    const motionSwitch = document.getElementById('arcadeMotionSwitch');
    motionSwitch.addEventListener('click', () => {
      const next = !getSettings().reducedMotion;
      setSetting('reducedMotion', next);
      motionSwitch.classList.toggle('on', next);
      motionSwitch.setAttribute('aria-checked', String(next));
    });
    settingsOverlay.querySelectorAll('.theme-swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        setSetting('theme', sw.getAttribute('data-theme'));
        settingsOverlay.querySelectorAll('.theme-swatch').forEach(function (x) { x.classList.remove('active'); });
        sw.classList.add('active');
      });
    });
    settingsOverlay.querySelectorAll('[data-default-diff]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSetting('difficulty', btn.getAttribute('data-default-diff'));
        settingsOverlay.querySelectorAll('[data-default-diff]').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const resetBtn = document.getElementById('arcadeResetBtn');
    let resetArmed = false;
    let resetArmTimer = null;
    resetBtn.addEventListener('click', () => {
      if (!resetArmed) {
        resetArmed = true;
        resetBtn.textContent = 'Tap again to confirm';
        resetBtn.classList.add('confirm');
        clearTimeout(resetArmTimer);
        resetArmTimer = setTimeout(() => {
          resetArmed = false;
          resetBtn.textContent = 'Reset All Scores';
          resetBtn.classList.remove('confirm');
        }, 3200);
        return;
      }
      resetAllProgress();
      resetArmed = false;
      resetBtn.textContent = 'Reset All Scores';
      resetBtn.classList.remove('confirm');
      renderStats();
      toast('All scores and trophies reset.');
    });
  }

  /* ---- In-game pause menu ----
     Every game page has a plain "← Hub" link in its nav. This swaps that
     link, in place, for a Pause button that opens a small dropdown
     (Resume / Mute / Exit), and gates the game's own loop via
     Arcade.isPaused(). Exiting always asks for confirmation first, so a
     mis-tap mid-run doesn't throw the game away. */
  let paused = false;
  function isPaused() { return paused; }

  function mountPauseMenu() {
    try {
      const homeBtn = document.querySelector('.nav-home-btn');
      if (!homeBtn) return;
      const hubHref = homeBtn.getAttribute('href') || '../index.html';

      const wrap = document.createElement('div');
      wrap.className = 'pause-wrap';
      wrap.innerHTML = `
        <button type="button" class="nav-home-btn" id="arcadePauseBtn" aria-haspopup="true" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          <span>Pause</span>
        </button>
        <div class="pause-dropdown" id="arcadePauseDropdown">
          <button type="button" class="pause-dd-item" id="arcadeResumeBtn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Resume
          </button>
          <button type="button" class="pause-dd-item" id="arcadeMuteToggleBtn"></button>
          <button type="button" class="pause-dd-item danger" id="arcadeExitBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg> Exit to Hub
          </button>
        </div>`;
      homeBtn.replaceWith(wrap);

      const confirmOverlay = document.createElement('div');
      confirmOverlay.className = 'overlay';
      confirmOverlay.id = 'arcadeExitConfirmOverlay';
      confirmOverlay.innerHTML = `
        <div class="panel" style="text-align:center;">
          <div class="sub">Exit Game</div>
          <h1 style="font-size:1.8rem;">Are you sure?</h1>
          <p class="hint">Leaving now ends your current run.</p>
          <button type="button" class="btn-primary" id="arcadeExitConfirmYes">Exit to Hub</button>
          <button type="button" class="back-link" id="arcadeExitConfirmNo" style="margin-top:0.8rem;">Keep Playing</button>
        </div>`;
      document.body.appendChild(confirmOverlay);

      const pauseBtn = document.getElementById('arcadePauseBtn');
      const dropdown = document.getElementById('arcadePauseDropdown');
      const muteBtn = document.getElementById('arcadeMuteToggleBtn');

      function refreshMuteLabel() {
        const muted = getSettings().muted;
        muteBtn.innerHTML = muted
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M23 9l-6 6M17 9l6 6"/></svg> Play Sound'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Stop Sound';
      }
      refreshMuteLabel();

      function openMenu() {
        paused = true;
        dropdown.classList.add('show');
        pauseBtn.setAttribute('aria-expanded', 'true');
        try { window.dispatchEvent(new CustomEvent('arcade:pause')); } catch (e) {}
      }
      function closeMenu(resume) {
        dropdown.classList.remove('show');
        pauseBtn.setAttribute('aria-expanded', 'false');
        if (resume) {
          paused = false;
          try { window.dispatchEvent(new CustomEvent('arcade:resume')); } catch (e) {}
        }
      }

      pauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropdown.classList.contains('show')) closeMenu(true);
        else openMenu();
      });
      document.getElementById('arcadeResumeBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu(true);
      });
      // Click-outside-to-close, using the click event (not pointerdown) so it
      // fires strictly after the pause button's own click has already been
      // processed — pointerdown fires earlier in the sequence and can race
      // with the button's own toggle logic on some browsers/devices.
      document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('show') && !wrap.contains(e.target)) closeMenu(true);
      });
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setSetting('muted', !getSettings().muted);
        refreshMuteLabel();
      });
      document.getElementById('arcadeExitBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.remove('show');
        confirmOverlay.classList.add('show');
      });
      confirmOverlay.addEventListener('click', (e) => { if (e.target === confirmOverlay) { confirmOverlay.classList.remove('show'); closeMenu(true); } });
      document.getElementById('arcadeExitConfirmNo').addEventListener('click', () => {
        confirmOverlay.classList.remove('show');
        closeMenu(true);
      });
      document.getElementById('arcadeExitConfirmYes').addEventListener('click', () => {
        window.location.href = hubHref;
      });

      // The very first screen a player sees (difficulty picker, or the
      // mode menu in tic-tac-toe) gets its own direct Exit link too — no
      // confirmation needed since no run is in progress yet. Where a
      // difficulty/option list already exists, this becomes a matching
      // 4th card in that same list rather than a separate small link.
      const introOverlay = document.querySelector('.overlay.show');
      if (introOverlay) {
        const introPanel = introOverlay.querySelector('.panel');
        const optionList = introOverlay.querySelector('.option-list');
        if (introPanel && !introPanel.querySelector('.intro-exit-btn')) {
          if (optionList) {
            const homeCard = document.createElement('button');
            homeCard.type = 'button';
            homeCard.className = 'option-btn intro-exit-btn';
            homeCard.innerHTML = `
              <div class="opt-title">Home</div>
              <div class="opt-desc">Head back to the Game Hub instead.</div>`;
            homeCard.addEventListener('click', () => { window.location.href = hubHref; });
            optionList.appendChild(homeCard);
          } else {
            const introExit = document.createElement('button');
            introExit.type = 'button';
            introExit.className = 'back-link intro-exit-btn';
            introExit.textContent = 'Exit to Hub';
            introExit.addEventListener('click', () => { window.location.href = hubHref; });
            introPanel.appendChild(introExit);
          }
        }
      }
    } catch (err) {
      console.error('Arcade.mountPauseMenu failed:', err);
    }
  }

  return {
    GAMES: GAMES, ACHIEVEMENTS: ACHIEVEMENTS, tone: tone, noiseBurst: noiseBurst, audioCtx: audioCtx,
    getBest: getBest, setBest: setBest, wireDifficulty: wireDifficulty, toast: toast,
    registerServiceWorker: registerServiceWorker, unlock: unlock, isUnlocked: isUnlocked,
    getUnlocked: getUnlocked, logRun: logRun, getRuns: getRuns, getTotalPlays: getTotalPlays,
    getGamePlays: getGamePlays, getLastPlayed: getLastPlayed, getTotalPlayTimeSec: getTotalPlayTimeSec,
    formatDuration: formatDuration, getGamesPlayedCount: getGamesPlayedCount,
    getFavoriteGameLabel: getFavoriteGameLabel, getHighestScoreOverall: getHighestScoreOverall,
    getAverageScoreOverall: getAverageScoreOverall, getCompletionPercent: getCompletionPercent,
    resetAllProgress: resetAllProgress,
    getFavorites: getFavorites, isFavorite: isFavorite, toggleFavorite: toggleFavorite,
    celebrate: celebrate, celebrateHaptic: celebrateHaptic,
    getProfile: getProfile, setProfile: setProfile, readAvatarFile: readAvatarFile, initials: initials,
    getSettings: getSettings, setSetting: setSetting, applySettings: applySettings, mountPanels: mountPanels,
    mountPauseMenu: mountPauseMenu, isPaused: isPaused
  };
})();
