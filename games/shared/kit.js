/* Kit: small helper library shared by every game.
   Handles canvas scaling, the start/game-over card, saved best scores,
   sounds, swipes and keyboard state. */
(function () {
  'use strict';
  const Kit = (window.Kit = {});
  const PREFIX = 'pv:';

  /* ---------- saved data ---------- */
  Kit.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
    }
  };
  Kit.getBest = (id, fallback = 0) => Kit.store.get('best:' + id, fallback);
  /* Saves the score if it beats the old one. Returns true for a new record. */
  Kit.submitBest = (id, score, lowerIsBetter = false) => {
    const prev = Kit.store.get('best:' + id, null);
    const better = prev === null ? (lowerIsBetter || score > 0) : (lowerIsBetter ? score < prev : score > prev);
    if (better) Kit.store.set('best:' + id, score);
    return better;
  };

  /* ---------- maths ---------- */
  Kit.rand = (a, b) => a + Math.random() * (b - a);
  Kit.randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  Kit.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  Kit.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  Kit.lerp = (a, b, t) => a + (b - a) * t;
  Kit.shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  Kit.isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  Kit.fmtTime = (s) => {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  /* ---------- canvas that keeps its shape and fills the window ---------- */
  Kit.canvas = function (w, h, opts = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    (opts.parent || document.body).appendChild(canvas);
    const view = { canvas, ctx, w, h, scale: 1, onResize: null };
    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const margin = opts.margin != null ? opts.margin : 10;
      const aw = Math.max(60, window.innerWidth - margin * 2 - (opts.reserveX || 0));
      const ah = Math.max(60, window.innerHeight - margin * 2 - (opts.reserveY || 0));
      const s = Math.min(aw / w, ah / h);
      const cw = Math.floor(w * s), ch = Math.floor(h * s);
      canvas.style.width = cw + 'px';
      canvas.style.height = ch + 'px';
      canvas.width = Math.max(1, Math.round(cw * dpr));
      canvas.height = Math.max(1, Math.round(ch * dpr));
      ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
      view.scale = s;
      if (view.onResize) view.onResize();
    }
    view.fit = fit;
    view.toLocal = function (e) {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * h };
    };
    window.addEventListener('resize', fit);
    fit();
    return view;
  };

  /* ---------- game loop (dt in seconds) ---------- */
  Kit.loop = function (step) {
    let last = 0, running = false, id = 0;
    function frame(t) {
      if (!running) return;
      const dt = last ? Math.min((t - last) / 1000, 1 / 30) : 1 / 60;
      last = t;
      step(dt, t / 1000);
      id = requestAnimationFrame(frame);
    }
    const api = {
      start() { if (!running) { running = true; last = 0; id = requestAnimationFrame(frame); } return api; },
      stop() { running = false; cancelAnimationFrame(id); return api; },
      get running() { return running; }
    };
    return api;
  };

  /* ---------- drawing helpers ---------- */
  Kit.rr = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  Kit.text = function (ctx, str, x, y, o = {}) {
    ctx.save();
    ctx.font = (o.weight || 700) + ' ' + (o.size || 20) + 'px ' + (o.font || '"Segoe UI", system-ui, sans-serif');
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.blur || 8; }
    if (o.stroke) { ctx.lineWidth = o.strokeWidth || 4; ctx.strokeStyle = o.stroke; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
    ctx.fillStyle = o.color || '#fff';
    ctx.fillText(str, x, y);
    ctx.restore();
  };

  /* ---------- particles ---------- */
  Kit.Particles = class {
    constructor() { this.list = []; }
    burst(x, y, n, color, speed = 180, life = 0.6, size = 3, gravity = 0) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = speed * (0.3 + Math.random() * 0.7);
        this.list.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: life * (0.6 + Math.random() * 0.4),
          max: life, size: size * (0.6 + Math.random() * 0.8),
          color: Array.isArray(color) ? Kit.pick(color) : color, g: gravity
        });
      }
    }
    update(dt) {
      const l = this.list;
      for (let i = l.length - 1; i >= 0; i--) {
        const p = l[i];
        p.life -= dt;
        if (p.life <= 0) { l.splice(i, 1); continue; }
        p.vy += p.g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.985; p.vy *= 0.985;
      }
    }
    draw(ctx) {
      for (const p of this.list) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    }
    clear() { this.list.length = 0; }
  };

  /* ---------- start / pause / game-over card ---------- */
  let overlayEl = null, overlayBtns = [];
  Kit.overlayOpen = false;
  function make(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  Kit.overlay = function (o) {
    if (!overlayEl) {
      overlayEl = make('div', 'kit-overlay hidden');
      document.body.appendChild(overlayEl);
      // Clicks on the dim background must not reach the game underneath.
      ['pointerdown', 'pointerup', 'mousedown', 'touchstart'].forEach((ev) =>
        overlayEl.addEventListener(ev, (e) => e.stopPropagation()));
    }
    overlayEl.innerHTML = '';
    const card = make('div', 'kit-card');
    if (o.title) card.appendChild(make('h1', '', o.title));
    if (o.html) card.appendChild(make('div', 'kit-body', o.html));
    const btns = make('div', 'kit-btns');
    overlayBtns = (o.buttons || []).map((b) => {
      const btn = make('button', 'kit-btn' + (b.alt ? ' alt' : ''), b.label);
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (b.keepOpen !== true) Kit.hideOverlay();
        if (b.onClick) b.onClick();
      });
      btns.appendChild(btn);
      return btn;
    });
    if (overlayBtns.length) card.appendChild(btns);
    if (o.keys) card.appendChild(make('div', 'kit-keys', o.keys));
    overlayEl.appendChild(card);
    overlayEl.classList.remove('hidden');
    Kit.overlayOpen = true;
  };
  Kit.hideOverlay = function () {
    if (overlayEl) overlayEl.classList.add('hidden');
    Kit.overlayOpen = false;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  };
  // Space / Enter presses the first button while the card is showing.
  window.addEventListener('keydown', (e) => {
    if (!Kit.overlayOpen) return;
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!e.repeat && overlayBtns[0]) overlayBtns[0].click();
    }
  }, true);

  /* ---------- keyboard state ---------- */
  Kit.keys = Object.create(null);
  const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End']);
  window.addEventListener('keydown', (e) => {
    Kit.keys[e.code] = true;
    const tag = e.target && e.target.tagName;
    if (SCROLL_KEYS.has(e.code) && tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { Kit.keys[e.code] = false; });
  window.addEventListener('blur', () => { for (const k in Kit.keys) Kit.keys[k] = false; });
  Kit.down = (...codes) => codes.some((c) => Kit.keys[c]);

  /* ---------- swipe / tap ---------- */
  // cb(dir) where dir is 'up' | 'down' | 'left' | 'right' | 'tap'
  Kit.swipe = function (target, cb, opts = {}) {
    const min = opts.min || 24;
    let sx = 0, sy = 0, active = false, fired = false, pid = null;
    target.addEventListener('pointerdown', (e) => {
      if (Kit.overlayOpen) return;
      active = true; fired = false; pid = e.pointerId; sx = e.clientX; sy = e.clientY;
    });
    target.addEventListener('pointermove', (e) => {
      if (!active || e.pointerId !== pid) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < min) return;
      cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'), e);
      fired = true;
      if (opts.continuous) { sx = e.clientX; sy = e.clientY; } else active = false;
    });
    target.addEventListener('pointerup', (e) => {
      if (e.pointerId !== pid) return;
      if (active && !fired) cb('tap', e);
      active = false;
    });
    target.addEventListener('pointercancel', () => { active = false; });
  };

  /* ---------- on-screen buttons for touch devices ---------- */
  // defs: [{label, code, side:'left'|'right'}] — holding a button acts like holding that key.
  Kit.touchPad = function (defs) {
    if (!Kit.isTouch) return;
    const sides = {};
    defs.forEach((d) => {
      const side = d.side || 'right';
      if (!sides[side]) { sides[side] = make('div', 'kit-touch ' + side); document.body.appendChild(sides[side]); }
      const b = make('button', '', d.label);
      const on = (e) => { e.preventDefault(); e.stopPropagation(); b.classList.add('active'); Kit.keys[d.code] = true; if (d.onPress) d.onPress(); };
      const off = (e) => { e.preventDefault(); b.classList.remove('active'); Kit.keys[d.code] = false; };
      b.addEventListener('pointerdown', on);
      b.addEventListener('pointerup', off);
      b.addEventListener('pointerleave', off);
      b.addEventListener('pointercancel', off);
      sides[side].appendChild(b);
    });
  };

  /* ---------- sound (tiny synth, no files needed) ---------- */
  let actx = null;
  Kit.muted = Kit.store.get('muted', false);
  window.addEventListener('storage', (e) => { if (e.key === PREFIX + 'muted') Kit.muted = Kit.store.get('muted', false); });
  function audio() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { actx = new AC(); } catch (e) { return null; }
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  Kit.beep = function (freq = 440, dur = 0.08, type = 'square', vol = 0.05, slide = 0) {
    if (Kit.muted) return;
    const a = audio();
    if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  };
  Kit.noise = function (dur = 0.25, vol = 0.12) {
    if (Kit.muted) return;
    const a = audio();
    if (!a) return;
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(), g = a.createGain();
    src.buffer = buf;
    g.gain.value = vol;
    src.connect(g);
    g.connect(a.destination);
    src.start();
  };
})();
