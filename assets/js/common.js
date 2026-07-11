/* ==========================================
   GAME HUB — shared game helpers
   Loaded by every game page (and the hub) so
   new games can reuse the same building blocks
   instead of re-implementing them per-file.
   ========================================== */
window.Arcade = (function () {

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
    const ac = audioCtx();
    if (!ac) return;
    opts = opts || {};
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.sweepTo), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(startGain, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  function noiseBurst(duration, startGain, lowpassFreq) {
    const ac = audioCtx();
    if (!ac) return;
    const t0 = ac.currentTime;
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(startGain, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(lowpassFreq || 1200, t0);
    noise.connect(filter).connect(gain).connect(ac.destination);
    noise.start(t0);
  }

  /* ---- Best-score storage ---- */
  function getBest(key) {
    return parseInt(localStorage.getItem(key) || '0', 10);
  }
  function setBest(key, value) {
    localStorage.setItem(key, String(value));
  }

  /* ---- Difficulty pill wiring (Easy / Medium / Hard) ---- */
  // Wires up `.diff-btn[data-diff]` buttons, persists the choice, and
  // keeps the `.active` class in sync. Returns a getter for the current value.
  function wireDifficulty(rowSelector, storageKey, defaultValue, onChange) {
    let current = localStorage.getItem(storageKey) || defaultValue;
    const buttons = Array.from(document.querySelectorAll(rowSelector + ' .diff-btn'));
    function applyUI() {
      buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-diff') === current));
    }
    buttons.forEach(b => {
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

  /* ---- Offline / PWA support ---- */
  // Registers the shared service worker (a no-op if unsupported or already
  // registered) so games keep working once assets are cached.
  function registerServiceWorker(swPath) {
    if (!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register(swPath || '/sw.js').catch(() => null);
  }

  return { tone, noiseBurst, audioCtx, getBest, setBest, wireDifficulty, toast, registerServiceWorker };
})();
