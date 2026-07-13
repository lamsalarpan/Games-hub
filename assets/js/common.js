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
    }
  ];

  /* ---- Avatar registry (local profile picker — simple original line-icon
     glyphs, 24x24, stroke=currentColor so they inherit the active theme
     accent automatically). ---- */
  const AVATARS = [
    { id: 'rocket', label: 'Rocket', svg: '<path d="M12 2c2 2 3 5 3 8 0 2-1 4-3 6-2-2-3-4-3-6 0-3 1-6 3-8Z"/><circle cx="12" cy="9" r="1.3"/><path d="M9 14l-3 3M15 14l3 3M10 19l2 2 2-2"/>' },
    { id: 'star', label: 'Star', svg: '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"/>' },
    { id: 'bolt', label: 'Bolt', svg: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>' },
    { id: 'flame', label: 'Flame', svg: '<path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-2 1 2 2 3 2 5a5 5 0 0 1-10 0c0-5 4-6 6-11Z"/>' },
    { id: 'ghost', label: 'Ghost', svg: '<path d="M12 3a7 7 0 0 0-7 7v9l2.5-2 2 2 2.5-2.5L14.5 19l2-2 2.5 2v-9a7 7 0 0 0-7-7Z"/><circle cx="9.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10" r="1" fill="currentColor" stroke="none"/>' },
    { id: 'skull', label: 'Skull', svg: '<path d="M12 3a7 7 0 0 0-7 7v3l1.5 2v3h3v-2h1v2h3v-2h1v2h3v-3l1.5-2v-3a7 7 0 0 0-7-7Z"/><circle cx="9" cy="10" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.3" fill="currentColor" stroke="none"/><path d="M11 13.2h2"/>' },
    { id: 'crown', label: 'Crown', svg: '<path d="M3 18h18l-1.5-9-4 4-2.5-6-2.5 6-4-4L3 18Z"/><path d="M5 21h14"/>' },
    { id: 'gem', label: 'Gem', svg: '<path d="M6 3h12l3 6-9 12L3 9l3-6Z"/><path d="M3 9h18M9 3l3 6 3-6M9 9l3 12 3-12"/>' },
    { id: 'moon', label: 'Moon', svg: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>' },
    { id: 'dice', label: 'Dice', svg: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>' }
  ];
  function avatarSvg(id) {
    const a = AVATARS.find(x => x.id === id) || AVATARS[0];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + a.svg + '</svg>';
  }

  /* ---- Local profile (name + avatar — no accounts, no server) ---- */
  const PROFILE_KEY = 'arcade_profile_v1';
  function getProfile() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch (e) {}
    return Object.assign({ name: 'Player One', avatar: 'rocket', createdAt: Date.now() }, p);
  }
  function saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
  function setProfileName(name) {
    const p = getProfile();
    p.name = String(name || 'Player One').slice(0, 24).trim() || 'Player One';
    saveProfile(p);
    return p;
  }
  function setProfileAvatar(avatarId) {
    const p = getProfile();
    p.avatar = AVATARS.some(a => a.id === avatarId) ? avatarId : p.avatar;
    saveProfile(p);
    return p;
  }

  /* ---- XP / Level system ----
     Every logged run and every achievement unlock feeds XP. Levels use a
     gently increasing curve (each level costs a bit more than the last)
     so early levels come quickly and it stays meaningful long-term. */
  const XP_KEY = 'arcade_xp_v1';
  const LEVEL_TITLES = [
    [1, 'Newcomer'], [3, 'Rookie'], [5, 'Regular'], [8, 'Skilled Player'],
    [11, 'Arcade Expert'], [14, 'Veteran'], [18, 'Master'], [22, 'Champion'],
    [27, 'Legend'], [33, 'Grandmaster'], [40, 'Arcade Icon']
  ];
  function getXP() { return parseInt(localStorage.getItem(XP_KEY) || '0', 10); }
  function xpForLevel(level) { return Math.round(90 * Math.pow(level - 1, 1.32)); }
  function getLevelInfo(xpOverride) {
    const xp = typeof xpOverride === 'number' ? xpOverride : getXP();
    let level = 1;
    while (xp >= xpForLevel(level + 1)) level++;
    const floor = xpForLevel(level);
    const ceil = xpForLevel(level + 1);
    let title = LEVEL_TITLES[0][1];
    for (const [lvl, t] of LEVEL_TITLES) { if (level >= lvl) title = t; }
    return {
      level: level, title: title, xp: xp,
      xpIntoLevel: xp - floor, xpForNext: ceil - floor,
      progress: Math.max(0, Math.min(1, (xp - floor) / Math.max(1, ceil - floor)))
    };
  }
  function addXP(amount, reason) {
    if (!amount || amount <= 0) return getLevelInfo();
    const before = getLevelInfo();
    const xp = getXP() + Math.round(amount);
    localStorage.setItem(XP_KEY, String(xp));
    const after = getLevelInfo(xp);
    if (after.level > before.level) showLevelUpToast(after);
    return after;
  }
  let levelToastTimer = null;
  function showLevelUpToast(info) {
    let el = document.getElementById('arcadeLevelToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'arcadeLevelToast';
      el.className = 'ach-toast level-toast';
      el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"/></svg>
        <span class="ach-toast-body"><b>Level Up</b><span id="arcadeLevelTitle"></span></span>
      `;
      document.body.appendChild(el);
    }
    el.querySelector('#arcadeLevelTitle').textContent = 'Level ' + info.level + ' — ' + info.title;
    el.classList.remove('show'); void el.offsetWidth;
    el.classList.add('show');
    tone(520, 0.12, 'triangle', 0.17, { sweepTo: 780 });
    setTimeout(() => tone(780, 0.12, 'triangle', 0.15, { sweepTo: 1160 }), 100);
    setTimeout(() => tone(1160, 0.18, 'triangle', 0.13, { sweepTo: 1560 }), 200);
    clearTimeout(levelToastTimer);
    levelToastTimer = setTimeout(() => el.classList.remove('show'), 3800);
  }

  /* ---- Customizable controls ----
     Each game declares its rebindable actions here. A custom key is an
     ADDITION, not a replacement — the shipped defaults (arrows/space/WASD)
     always keep working, so nobody can rebind themselves into a game they
     can't play. Stored per game as { action: 'KeyCode' }. */
  const CONTROL_ACTIONS = {
    flappy: [{ action: 'flap', label: 'Flap / Jump', hint: 'Space always works too' }],
    dino: [
      { action: 'jump', label: 'Jump', hint: 'Space always works too' },
      { action: 'duck', label: 'Duck', hint: '↓ always works too' }
    ],
    snake: [
      { action: 'up', label: 'Move Up', hint: '↑ / W always works too' },
      { action: 'down', label: 'Move Down', hint: '↓ / S always works too' },
      { action: 'left', label: 'Move Left', hint: '← / A always works too' },
      { action: 'right', label: 'Move Right', hint: '→ / D always works too' }
    ],
    roadfighter: [
      { action: 'left', label: 'Steer Left', hint: '← / A always works too' },
      { action: 'right', label: 'Steer Right', hint: '→ / D always works too' }
    ]
  };
  function controlsKey(gameId) { return 'arcade_controls_' + gameId; }
  function getControls(gameId) {
    try { return JSON.parse(localStorage.getItem(controlsKey(gameId)) || '{}'); }
    catch (e) { return {}; }
  }
  function getCustomKey(gameId, action) { return getControls(gameId)[action] || null; }
  function setCustomKey(gameId, action, code) {
    const c = getControls(gameId);
    c[action] = code;
    localStorage.setItem(controlsKey(gameId), JSON.stringify(c));
  }
  function resetControls(gameId) { localStorage.removeItem(controlsKey(gameId)); }
  function matchControl(gameId, action, e) {
    const custom = getCustomKey(gameId, action);
    return !!custom && e.code === custom;
  }
  function prettyKeyName(code) {
    if (!code) return '—';
    if (code === 'Space') return 'Space';
    if (code.indexOf('Arrow') === 0) return code.replace('Arrow', '') + ' Arrow';
    if (code.indexOf('Key') === 0) return code.replace('Key', '');
    if (code.indexOf('Digit') === 0) return code.replace('Digit', '');
    return code;
  }

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
    { id: 'hard_try_tictactoe', title: 'Hard Mode', desc: 'Play Tic Tac Toe on Hard' }
  ];

  /* ---- Estimated per-session seconds, used until a game passes a real
     durationSec into logRun() — keeps "Total Play Time" meaningful from
     day one instead of reading 0 until every game is wired for timing. */
  const AVG_SESSION_SECONDS = { flappy: 150, dino: 210, tictactoe: 45, roadfighter: 240, snake: 180 };
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
    addXP(30, 'achievement:' + id);
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

    // XP: a flat per-run base, plus a score-scaled bonus (capped so no
    // single run dominates), plus a difficulty multiplier so Hard runs
    // meaningfully outpace Easy ones.
    const diffMult = difficulty === 'hard' ? 1.5 : (difficulty === 'easy' ? 0.8 : 1);
    const scoreBonus = Math.min(45, Math.round((score || 0) / 6));
    addXP(Math.round((10 + scoreBonus) * diffMult), 'run:' + gameId);

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
    flappy: 'flappy_al_best', dino: 'dino_al_best', snake: 'snake_al_best', roadfighter: 'roadfighter_al_best'
  };
  const EXTRA_SCORE_KEYS = ['ttt_al_pvc_scores', 'ttt_al_pvp_scores'];
  function resetAllProgress() {
    GAMES.forEach(g => {
      localStorage.removeItem(RUNS_PREFIX + g.id);
      localStorage.removeItem(GAME_PLAYS_PREFIX + g.id);
      localStorage.removeItem(LAST_PLAYED_PREFIX + g.id);
      if (GAME_BEST_KEYS[g.id]) localStorage.removeItem(GAME_BEST_KEYS[g.id]);
    });
    EXTRA_SCORE_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(ACH_KEY);
    localStorage.removeItem(PLAYS_KEY);
    localStorage.removeItem(PLAYTIME_KEY);
    localStorage.removeItem(XP_KEY);
    try { window.dispatchEvent(new CustomEvent('arcade:reset')); } catch (e) {}
  }

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
  const DEFAULT_SETTINGS = {
    muted: false, musicOn: false, masterVolume: 0.6, particles: true, reducedMotion: false,
    theme: 'gold', difficulty: 'medium', colorblind: 'off', contrast: 'normal', textSize: 'normal'
  };
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
  // Injects the SVG colour-matrix filters used by the colourblind modes,
  // once per page. CSS then just references url(#arcade-cb-xxx).
  function ensureColorblindFilters() {
    if (document.getElementById('arcadeCbFilters')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'arcadeCbFilters');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    svg.innerHTML = `
      <defs>
        <filter id="arcade-cb-protanopia"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/></filter>
        <filter id="arcade-cb-deuteranopia"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/></filter>
        <filter id="arcade-cb-tritanopia"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/></filter>
      </defs>`;
    document.body ? document.body.appendChild(svg) : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(svg));
  }
  function applySettings(s) {
    s = s || getSettings();
    document.documentElement.setAttribute('data-theme', s.theme || 'gold');
    document.documentElement.classList.toggle('reduced-motion', !!s.reducedMotion);
    document.documentElement.classList.toggle('no-particles', s.particles === false);
    document.documentElement.setAttribute('data-colorblind', s.colorblind || 'off');
    document.documentElement.setAttribute('data-contrast', s.contrast || 'normal');
    document.documentElement.setAttribute('data-textsize', s.textSize || 'normal');
    if ((s.colorblind || 'off') !== 'off') ensureColorblindFilters();
    syncMusic();
  }
  // Apply immediately on script load so there's no flash of the wrong theme.
  applySettings();

  /* ---- Offline / PWA support ---- */
  function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return Promise.resolve(null);
    return navigator.serviceWorker.register(swPath || '/sw.js').catch(() => null);
  }

  /* ---- Global UI: injects the Settings + Stats/Leaderboard buttons and
     panels into any page that calls Arcade.mountPanels(). Keeps every game
     page's own HTML tiny — the actual panel markup lives here, once. ---- */
  let panelsMounted = false;
  function wireTabs(panelEl) {
    const tabs = Array.from(panelEl.querySelectorAll('.panel-tab'));
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        panelEl.querySelectorAll('.panel-tab-pane').forEach(p => p.classList.toggle('active', p.getAttribute('data-pane') === target));
      });
    });
  }

  function mountPanels(opts) {
    if (panelsMounted) return;
    panelsMounted = true;
    opts = opts || {};
    const currentGameId = opts.gameId || null;

    const nav = document.querySelector('.nav');
    if (!nav) return;

    const profile = getProfile();
    const lvl = getLevelInfo();

    const group = document.createElement('div');
    group.className = 'nav-icon-group';
    group.innerHTML = `
      <button type="button" class="nav-profile-btn" id="arcadeProfileBtn" aria-label="Your profile">
        <span class="avatar-circle" id="navAvatarWrap">${avatarSvg(profile.avatar)}</span>
        <span class="level-badge" id="navLevelBadge">${lvl.level}</span>
      </button>
      <button type="button" class="nav-icon-btn" id="arcadeSettingsBtn" aria-label="Settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.65 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.65a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.35 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.04Z"/></svg>
      </button>
    `;
    nav.appendChild(group);

    /* ================= PROFILE PANEL ================= */
    const profileOverlay = document.createElement('div');
    profileOverlay.className = 'overlay';
    profileOverlay.id = 'arcadeProfileOverlay';
    const avatarGridHTML = AVATARS.map(a =>
      `<button type="button" class="avatar-pick${profile.avatar === a.id ? ' active' : ''}" data-avatar="${a.id}" aria-label="${a.label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a.svg}</svg></button>`
    ).join('');
    profileOverlay.innerHTML = `
      <div class="panel profile-panel" style="max-width:400px;">
        <div class="panel-tabs">
          <button type="button" class="panel-tab active" data-tab="overview">Overview</button>
          <button type="button" class="panel-tab" data-tab="leaderboard">Leaderboard</button>
          <button type="button" class="panel-tab" data-tab="trophies">Trophies</button>
        </div>
        <div class="panel-tab-body">
          <div class="panel-tab-pane active" data-pane="overview">
            <div class="profile-head">
              <span class="avatar-circle profile-avatar-big" id="profileAvatarBig">${avatarSvg(profile.avatar)}</span>
              <input type="text" class="profile-name-input" id="profileNameInput" value="${escapeHtml(profile.name)}" maxlength="24" aria-label="Your display name">
              <div class="profile-level-line" id="profileLevelLine">Level ${lvl.level} — ${lvl.title}</div>
              <div class="xp-bar-track"><div class="xp-bar-fill" id="profileXpFill" style="width:${Math.round(lvl.progress * 100)}%"></div></div>
              <div class="xp-bar-label" id="profileXpLabel">${lvl.xpIntoLevel} / ${lvl.xpForNext} XP to next level</div>
            </div>
            <div id="profileQuickStats"></div>
            <div class="stats-section-label">Choose an avatar</div>
            <div class="avatar-grid">${avatarGridHTML}</div>
          </div>
          <div class="panel-tab-pane" data-pane="leaderboard">
            <div class="sub" style="margin-bottom:1rem;">Your personal best runs, on this device — not a global/online leaderboard.</div>
            <div id="profileLeaderboardBody"></div>
          </div>
          <div class="panel-tab-pane" data-pane="trophies">
            <div id="profileTrophiesBody"></div>
          </div>
        </div>
        <button type="button" class="back-link" id="arcadeProfileClose">Close</button>
      </div>
    `;
    document.body.appendChild(profileOverlay);
    wireTabs(profileOverlay);

    function renderProfileOverview() {
      const p = getProfile();
      const info = getLevelInfo();
      profileOverlay.querySelector('#profileAvatarBig').innerHTML = avatarSvg(p.avatar);
      profileOverlay.querySelector('#profileLevelLine').textContent = `Level ${info.level} — ${info.title}`;
      profileOverlay.querySelector('#profileXpFill').style.width = Math.round(info.progress * 100) + '%';
      profileOverlay.querySelector('#profileXpLabel').textContent = `${info.xpIntoLevel} / ${info.xpForNext} XP to next level`;
      profileOverlay.querySelector('#profileQuickStats').innerHTML = `
        <div class="stat-row"><span>Games Played</span><b>${getGamesPlayedCount()} / ${GAMES.length}</b></div>
        <div class="stat-row"><span>Total Runs</span><b>${getTotalPlays()}</b></div>
        <div class="stat-row"><span>Est. Play Time</span><b>${formatDuration(getTotalPlayTimeSec())}</b></div>
        <div class="stat-row"><span>Favorite Game</span><b>${getFavoriteGameLabel()}</b></div>
        <div class="stat-row" style="border-bottom:none;"><span>Total XP Earned</span><b>${info.xp}</b></div>
      `;
      profileOverlay.querySelectorAll('.avatar-pick').forEach(el => el.classList.toggle('active', el.getAttribute('data-avatar') === p.avatar));
      // Nav chip + level badge stay in sync everywhere the panel is mounted.
      const navWrap = document.getElementById('navAvatarWrap');
      if (navWrap) navWrap.innerHTML = avatarSvg(p.avatar);
      const navBadge = document.getElementById('navLevelBadge');
      if (navBadge) navBadge.textContent = info.level;
    }

    function renderLeaderboard() {
      const body = profileOverlay.querySelector('#profileLeaderboardBody');
      body.innerHTML = GAMES.map(g => {
        const runs = getRuns(g.id).slice(0, 5);
        const rows = runs.length
          ? runs.map((r, i) => `
              <div class="lb-row">
                <span class="lb-rank${i === 0 ? ' top' : ''}">${i + 1}</span>
                <span class="lb-score">${r.score}</span>
                <span class="lb-diff">${r.difficulty || 'medium'}</span>
                <span class="lb-date">${new Date(r.date).toLocaleDateString()}</span>
              </div>`).join('')
          : `<div class="lb-empty">No runs yet — go set one.</div>`;
        return `
          <div class="lb-game-block">
            <div class="lb-game-title"><span>${g.title}${g.id === currentGameId ? ' <b>(this game)</b>' : ''}</span></div>
            ${rows}
          </div>`;
      }).join('');
    }

    function renderTrophies() {
      const body = profileOverlay.querySelector('#profileTrophiesBody');
      const unlocked = getUnlocked();
      body.innerHTML = `
        <div class="stat-row"><span>Trophies Unlocked</span><b>${Object.keys(unlocked).length} / ${ACHIEVEMENTS.length} (${getCompletionPercent()}%)</b></div>
        <div class="ach-list">${ACHIEVEMENTS
          .slice()
          .sort((a, b) => {
            const au = !!unlocked[a.id], bu = !!unlocked[b.id];
            if (au !== bu) return au ? -1 : 1;
            return au && bu ? unlocked[b.id].date - unlocked[a.id].date : 0;
          })
          .map(a => {
            const isUnlocked = !!unlocked[a.id];
            return `<div class="ach-row" style="${isUnlocked ? '' : 'opacity:0.4;'}">
              <span class="ach-row-title">${isUnlocked ? a.title : '🔒 ' + a.title}</span>
              <span class="ach-row-desc">${a.desc}</span>
            </div>`;
          }).join('')}</div>
      `;
    }

    function refreshProfilePanel() { renderProfileOverview(); renderLeaderboard(); renderTrophies(); }

    const profileBtn = document.getElementById('arcadeProfileBtn');
    profileBtn.addEventListener('click', () => { refreshProfilePanel(); profileOverlay.classList.add('show'); });
    document.getElementById('arcadeProfileClose').addEventListener('click', () => profileOverlay.classList.remove('show'));
    profileOverlay.addEventListener('pointerdown', (e) => { if (e.target === profileOverlay) profileOverlay.classList.remove('show'); });

    const nameInput = profileOverlay.querySelector('#profileNameInput');
    nameInput.addEventListener('change', () => { setProfileName(nameInput.value); nameInput.value = getProfile().name; });
    nameInput.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') nameInput.blur(); });
    profileOverlay.querySelectorAll('.avatar-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        setProfileAvatar(btn.getAttribute('data-avatar'));
        renderProfileOverview();
      });
    });

    /* ================= SETTINGS PANEL ================= */
    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'overlay';
    settingsOverlay.id = 'arcadeSettingsOverlay';
    const s = getSettings();
    const themeSwatches = ['gold', 'crimson', 'azure', 'emerald', 'violet', 'rose', 'ocean', 'mono'].map(t =>
      `<button type="button" class="theme-swatch theme-${t}${s.theme === t ? ' active' : ''}" data-theme="${t}" aria-label="${t} theme"></button>`
    ).join('');
    const diffPills = ['easy', 'medium', 'hard'].map(d =>
      `<button type="button" class="diff-btn${s.difficulty === d ? ' active' : ''}" data-default-diff="${d}">${d}</button>`
    ).join('');
    const cbOptions = [['off', 'Off'], ['protanopia', 'Protanopia'], ['deuteranopia', 'Deuteranopia'], ['tritanopia', 'Tritanopia']];
    const cbPills = cbOptions.map(([id, label]) =>
      `<button type="button" class="diff-btn${s.colorblind === id ? ' active' : ''}" data-colorblind-mode="${id}" style="flex:none; padding:0.55rem 0.8rem;">${label}</button>`
    ).join('');
    const controlActions = CONTROL_ACTIONS[currentGameId] || [];
    const controlsHTML = controlActions.length
      ? controlActions.map(a => {
          const custom = getCustomKey(currentGameId, a.action);
          return `
            <div class="control-row" data-action="${a.action}">
              <div class="control-row-label"><span>${a.label}</span><small>${a.hint || ''}</small></div>
              <button type="button" class="control-key-btn" data-rebind="${a.action}">${custom ? prettyKeyName(custom) : 'Set Key'}</button>
            </div>`;
        }).join('') + `<button type="button" class="back-link" id="arcadeControlsReset" style="margin-top:0.9rem;">Reset This Game's Keys</button>`
      : `<div class="controls-empty">${currentGameId ? 'This game uses arrow keys / space / WASD only — nothing to remap.' : 'Open a game to customize its keyboard controls.'}</div>`;

    settingsOverlay.innerHTML = `
      <div class="panel settings-panel">
        <div class="sub">Settings</div>
        <h1 style="font-size:1.9rem;">Tune it your way</h1>
        <div class="panel-tabs">
          <button type="button" class="panel-tab active" data-tab="general">General</button>
          <button type="button" class="panel-tab" data-tab="appearance">Appearance</button>
          <button type="button" class="panel-tab" data-tab="controls">Controls</button>
        </div>
        <div class="panel-tab-body">
          <div class="panel-tab-pane active" data-pane="general">
            <div class="setting-row">
              <span>Sound Effects</span>
              <button type="button" class="switch${s.muted ? '' : ' on'}" id="arcadeMuteSwitch" role="switch" aria-checked="${!s.muted}"><span class="switch-knob"></span></button>
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
            <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:0.7rem; border-bottom:none;">
              <span>Default Difficulty</span>
              <div class="diff-row" style="margin:0; width:100%;">${diffPills}</div>
            </div>
            <button type="button" class="btn-danger" id="arcadeResetBtn">Reset All Scores</button>
          </div>
          <div class="panel-tab-pane" data-pane="appearance">
            <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:0.7rem;">
              <span>Accent theme</span>
              <div class="theme-swatch-row">${themeSwatches}</div>
            </div>
            <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:0.7rem;">
              <span>Colorblind mode</span>
              <div class="diff-row" style="margin:0; width:100%; flex-wrap:wrap;">${cbPills}</div>
            </div>
            <div class="setting-row">
              <span>High contrast</span>
              <button type="button" class="switch${s.contrast === 'high' ? ' on' : ''}" id="arcadeContrastSwitch" role="switch" aria-checked="${s.contrast === 'high'}"><span class="switch-knob"></span></button>
            </div>
            <div class="setting-row" style="border-bottom:none;">
              <span>Larger UI text</span>
              <button type="button" class="switch${s.textSize === 'large' ? ' on' : ''}" id="arcadeTextSizeSwitch" role="switch" aria-checked="${s.textSize === 'large'}"><span class="switch-knob"></span></button>
            </div>
          </div>
          <div class="panel-tab-pane" data-pane="controls">
            ${controlsHTML}
          </div>
        </div>
        <button type="button" class="back-link" id="arcadeSettingsClose">Close</button>
      </div>
    `;
    document.body.appendChild(settingsOverlay);
    wireTabs(settingsOverlay);

    const settingsBtn = document.getElementById('arcadeSettingsBtn');
    settingsBtn.addEventListener('click', () => settingsOverlay.classList.add('show'));
    document.getElementById('arcadeSettingsClose').addEventListener('click', () => settingsOverlay.classList.remove('show'));
    settingsOverlay.addEventListener('pointerdown', (e) => { if (e.target === settingsOverlay) settingsOverlay.classList.remove('show'); });

    const muteSwitch = document.getElementById('arcadeMuteSwitch');
    muteSwitch.addEventListener('click', () => {
      const next = !getSettings().muted;
      setSetting('muted', next);
      muteSwitch.classList.toggle('on', !next);
      muteSwitch.setAttribute('aria-checked', String(!next));
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
    const contrastSwitch = document.getElementById('arcadeContrastSwitch');
    contrastSwitch.addEventListener('click', () => {
      const next = getSettings().contrast === 'high' ? 'normal' : 'high';
      setSetting('contrast', next);
      contrastSwitch.classList.toggle('on', next === 'high');
      contrastSwitch.setAttribute('aria-checked', String(next === 'high'));
    });
    const textSizeSwitch = document.getElementById('arcadeTextSizeSwitch');
    textSizeSwitch.addEventListener('click', () => {
      const next = getSettings().textSize === 'large' ? 'normal' : 'large';
      setSetting('textSize', next);
      textSizeSwitch.classList.toggle('on', next === 'large');
      textSizeSwitch.setAttribute('aria-checked', String(next === 'large'));
    });
    settingsOverlay.querySelectorAll('.theme-swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        setSetting('theme', sw.getAttribute('data-theme'));
        settingsOverlay.querySelectorAll('.theme-swatch').forEach(function (x) { x.classList.remove('active'); });
        sw.classList.add('active');
      });
    });
    settingsOverlay.querySelectorAll('[data-colorblind-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSetting('colorblind', btn.getAttribute('data-colorblind-mode'));
        settingsOverlay.querySelectorAll('[data-colorblind-mode]').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    settingsOverlay.querySelectorAll('[data-default-diff]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSetting('difficulty', btn.getAttribute('data-default-diff'));
        settingsOverlay.querySelectorAll('[data-default-diff]').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // ---- Key rebinding: click "Set Key", press any key, done. ----
    settingsOverlay.querySelectorAll('[data-rebind]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('listening')) return;
        const action = btn.getAttribute('data-rebind');
        const original = btn.textContent;
        btn.textContent = 'Press a key…';
        btn.classList.add('listening');
        function onKey(e) {
          e.preventDefault(); e.stopPropagation();
          if (e.code !== 'Escape') {
            setCustomKey(currentGameId, action, e.code);
            btn.textContent = prettyKeyName(e.code);
          } else {
            btn.textContent = original;
          }
          btn.classList.remove('listening');
          window.removeEventListener('keydown', onKey, true);
        }
        window.addEventListener('keydown', onKey, true);
      });
    });
    const controlsResetBtn = document.getElementById('arcadeControlsReset');
    if (controlsResetBtn) {
      controlsResetBtn.addEventListener('click', () => {
        resetControls(currentGameId);
        settingsOverlay.querySelectorAll('[data-rebind]').forEach(btn => { btn.textContent = 'Set Key'; });
        toast('Controls reset to defaults for this game.');
      });
    }

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
      refreshProfilePanel();
      toast('All scores and trophies reset.');
    });
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
    getSettings: getSettings, setSetting: setSetting, applySettings: applySettings, mountPanels: mountPanels,
    AVATARS: AVATARS, avatarSvg: avatarSvg,
    getProfile: getProfile, setProfileName: setProfileName, setProfileAvatar: setProfileAvatar,
    getXP: getXP, addXP: addXP, getLevelInfo: getLevelInfo,
    CONTROL_ACTIONS: CONTROL_ACTIONS, getControls: getControls, getCustomKey: getCustomKey,
    setCustomKey: setCustomKey, resetControls: resetControls, matchControl: matchControl, prettyKeyName: prettyKeyName
  };
})();
