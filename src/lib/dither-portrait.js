/**
 * DitherPortrait: 1-bit ordered-dither portrait effect (canvas, zero dependencies).
 * Effect only: no texts, no layout, no styles beyond one absolutely-positioned canvas.
 *
 *   const fx = new DitherPortrait(containerEl, { src: '/dither-portrait.png' });
 *   // later: fx.destroy();
 *
 * Tone map (PNG, 768x768): R = main tone, G = "lifted shadows" revealed by the cursor flashlight.
 *
 * Облегчённая версия оригинала (визуально тот же эффект):
 *  - ближайший сосед вместо билинейной выборки, индексы столбцов/строк считаются один раз;
 *  - пустой фон (R и G почти 0) пропускается без вычислений, это около половины клеток;
 *  - запись пикселя одним 32-битным числом, а не четырьмя байтами;
 *  - холст в 1x (CSS-пиксели), на ретине его растягивает браузер без сглаживания;
 *  - клетка крупнее (~S/300 вместо S/400), примерно в 2 раза меньше клеток;
 *  - в покое (интро закончилось, курсор вне портрета, нет прокрутки) перерисовка 20 кадров/с;
 *  - при prefers-reduced-motion рисуем один кадр и останавливаемся.
 */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Bayer 4x4 threshold matrix
const BAYER = new Float32Array(16);
[0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].forEach((v, i) => (BAYER[i] = (v + 0.5) / 16));

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >>> 13)) * 1274126177) | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function parseColor(css) {
  const c = document.createElement('canvas').getContext('2d');
  c.fillStyle = css;
  c.fillRect(0, 0, 1, 1);
  const d = c.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

const IDLE_MS = 50; // в покое перерисовываем не чаще, чем раз в 50 мс (20 кадров/с)

export class DitherPortrait {
  /**
   * @param {HTMLElement} container  positioned element the canvas fills (position is set to relative if static)
   * @param {object} options
   * @param {string}  options.src            URL of the tone-map PNG (required)
   * @param {string}  [options.color='#fff'] colour of the lit pixels (background stays transparent)
   * @param {'auto'|'right'|'left'|'center'} [options.align='auto']  auto = right on wide containers, center on narrow
   * @param {number}  [options.scale=1]      portrait size multiplier
   * @param {number}  [options.offsetX=0]    px shift
   * @param {number}  [options.offsetY=0]    px shift
   * @param {number}  [options.pixel=0]      dither pixel size in CSS px (0 = automatic)
   * @param {HTMLElement} [options.scrollTarget]  element whose scroll-through drives the dissolve (default: container)
   * @param {number}  [options.scrollRange=0.7]   dissolve completes after scrolling this fraction of scrollTarget's height
   * @param {boolean} [options.autoScroll=true]   false = drive it yourself via setProgress(0..1)
   * @param {boolean} [options.intro=true]        play the "light enters from the right" intro
   * @param {number}  [options.introDuration=3]   seconds
   * @param {boolean} [options.flashlight=true]   cursor lights up the shadow side
   * @param {Function} [options.onReady]
   */
  constructor(container, options = {}) {
    if (!container) throw new Error('DitherPortrait: container is required');
    if (!options.src) throw new Error('DitherPortrait: options.src (tone map URL) is required');
    this.o = Object.assign(
      { color: '#ffffff', align: 'auto', scale: 1, offsetX: 0, offsetY: 0, pixel: 0, scrollTarget: null,
        scrollRange: 0.7, autoScroll: true, intro: true, introDuration: 3, flashlight: true, onReady: null },
      options
    );
    this.el = container;
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    const [r, g, b] = parseColor(this.o.color);
    this.col32 = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0; // little-endian RGBA, как у ImageData
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cv = (this.cv = document.createElement('canvas'));
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;image-rendering:pixelated;';
    container.insertBefore(cv, container.firstChild);
    this.ctx = cv.getContext('2d');
    this.oc = document.createElement('canvas');
    this.octx = this.oc.getContext('2d');

    this.RES = 768;
    this.T = this.L = null;
    this.n = 0; this.imgd = null; this.px32 = null;
    this.W = this.H = this.S = this.OX = this.OY = 0; this.baseCell = 3;
    this.progress = 0; this.manualProgress = null; this._pDrawn = -1; this._full = false;
    this.mouse = { u: -9, v: -9, on: false, sm: 0 };
    this.pulses = [];
    this.t0 = null; this.visible = true; this.destroyed = false; this.raf = 0; this._last = 0;

    this._onMove = this._onMove.bind(this);
    this._onDown = this._onDown.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onVis = this._onVis.bind(this);
    this._frame = this._frame.bind(this);

    this.ro = new ResizeObserver(() => { this._layout(); this._onScroll(); });
    this.ro.observe(container);
    this.io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; this._sync(); });
    this.io.observe(container);
    addEventListener('pointermove', this._onMove, { passive: true });
    addEventListener('pointerdown', this._onDown, { passive: true });
    addEventListener('scroll', this._onScroll, { passive: true });
    document.addEventListener('visibilitychange', this._onVis);

    this._load();
  }

  /** Replay the intro animation. */
  replay() { this.t0 = null; this._full = false; this._sync(); }
  /** Drive the dissolve manually (0 = full portrait, 1 = gone). Pass null to return to scroll control. */
  setProgress(p) { this.manualProgress = p == null ? null : clamp01(p); this._onScroll(); }
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect(); this.io.disconnect();
    removeEventListener('pointermove', this._onMove);
    removeEventListener('pointerdown', this._onDown);
    removeEventListener('scroll', this._onScroll);
    document.removeEventListener('visibilitychange', this._onVis);
    this.cv.remove();
  }

  // ---------- internals
  _load() {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => {
      if (this.destroyed) return;
      const RES = this.RES, c = document.createElement('canvas');
      c.width = c.height = RES;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(im, 0, 0, RES, RES);
      const d = g.getImageData(0, 0, RES, RES).data;
      this.T = new Float32Array(RES * RES); this.L = new Float32Array(RES * RES);
      for (let i = 0; i < RES * RES; i++) { this.T[i] = d[i * 4] / 255; this.L[i] = d[i * 4 + 1] / 255; }
      this._layout(); this._onScroll(); this._sync();
      if (this.o.onReady) this.o.onReady(this);
    };
    im.onerror = () => console.error('DitherPortrait: failed to load', this.o.src);
    im.src = this.o.src;
  }

  _layout() {
    const r = this.el.getBoundingClientRect();
    this.W = r.width; this.H = r.height;
    this.cv.width = Math.max(1, Math.round(this.W));
    this.cv.height = Math.max(1, Math.round(this.H));
    const { W, H } = this, wide = W > 760, o = this.o;
    const S = (wide ? Math.min(H * 0.98, W * 0.62) : Math.min(W * 1.15, H * 0.78)) * o.scale;
    const align = o.align === 'auto' ? (wide ? 'right' : 'center') : o.align;
    this.S = S;
    this.OX = (align === 'right' ? W - S * 0.94 : align === 'left' ? -S * 0.06 : (W - S) / 2) + o.offsetX;
    this.OY = (wide ? (H - S) / 2 + H * 0.05 : H * 0.08) + o.offsetY;
    this.baseCell = o.pixel || Math.max(2, Math.round(S / 300));
    this._pDrawn = -1; // размер сменился: нужен перерисованный кадр
    this._sync();
  }

  _local(e) {
    const r = this.el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
  }
  _onMove(e) {
    if (!this.o.flashlight || this.reduce || !this.visible) return;
    const p = this._local(e);
    this.mouse.on = p.inside;
    if (p.inside) { this.mouse.u = (p.x - this.OX) / this.S; this.mouse.v = (p.y - this.OY) / this.S; }
  }
  _onDown(e) {
    if (!this.o.flashlight || this.reduce || !this.visible) return;
    const p = this._local(e);
    if (!p.inside) return;
    this.pulses.push({ u: (p.x - this.OX) / this.S, v: (p.y - this.OY) / this.S, t: performance.now() });
    if (this.pulses.length > 3) this.pulses.shift();
  }
  _onScroll() {
    if (this.manualProgress != null) this.progress = this.manualProgress;
    else if (this.o.autoScroll) {
      const el = this.o.scrollTarget || this.el, r = el.getBoundingClientRect();
      this.progress = clamp01(-r.top / (r.height * this.o.scrollRange));
    }
    this._sync();
  }
  _onVis() { this._sync(); }
  _sync() {
    const run = this.T && this.visible && !document.hidden && !this.destroyed;
    if (run && !this.raf) this.raf = requestAnimationFrame(this._frame);
    if (!run && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  }

  /** Таблицы под текущую сетку n×n: считаются один раз, пока n не изменился. */
  _grid(n) {
    const RES = this.RES;
    this.n = n;
    this.oc.width = this.oc.height = n;
    this.imgd = this.octx.createImageData(n, n);
    this.px32 = new Uint32Array(this.imgd.data.buffer);
    this.us = new Float32Array(n); this.ix = new Int32Array(n); this.rb = new Int32Array(n);
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) / n;
      this.us[k] = c;
      const i = Math.min(RES - 1, (c * RES) | 0);
      this.ix[k] = i; this.rb[k] = i * RES;
    }
    this.hs = new Float32Array(n * n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) this.hs[y * n + x] = hash(x, y);
  }

  _frame(now) {
    this.raf = 0;
    if (this.destroyed || !this.T || !this.visible || document.hidden) return;
    if (this.t0 == null) this.t0 = now;
    const t = (now - this.t0) / 1000, p = this.progress, o = this.o, m = this.mouse;
    const introDur = !o.intro || this.reduce ? 0.001 : o.introDuration, prog = Math.min(1, t / introDur);
    const nowMs = performance.now();
    this.pulses = this.pulses.filter((q) => nowMs - q.t < 1800);
    const pl = this.pulses, np = pl.length;

    // В покое рисуем реже: движется только медленное «дыхание»
    const idle = this._full && !m.on && m.sm < 0.01 && np === 0 && p === this._pDrawn;
    if (idle) {
      if (this.reduce) return; // статичный кадр уже нарисован; _sync() разбудит при прокрутке/ресайзе
      if (now - this._last < IDLE_MS) { this.raf = requestAnimationFrame(this._frame); return; }
    }
    this._last = now; this._pDrawn = p; if (prog >= 1) this._full = true;

    const cell = Math.max(this.baseCell, Math.round(this.baseCell * (1 + p * p * 14)));
    const nn = Math.max(1, Math.ceil(this.S / cell));
    if (nn !== this.n) this._grid(nn);
    const n = this.n, px32 = this.px32, col32 = this.col32, us = this.us, ix = this.ix, rb = this.rb, hs = this.hs;
    const fade = Math.pow(1 - p, 1.3);
    m.sm += ((m.on ? 1 : 0) - m.sm) * 0.09;
    const mu = m.u, mv = m.v, ms = m.sm, R2 = 0.17 * 0.17;
    const breathe = this.reduce ? 1 : 1 + 0.035 * Math.sin(t * 0.9);
    const T = this.T, L = this.L;

    if (fade <= 0.002) {
      this.ctx.clearRect(0, 0, this.W, this.H); // портрет полностью растворился
    } else {
      for (let cy = 0; cy < n; cy++) {
        const v = us[cy], base = rb[cy], bayerRow = (cy & 3) << 2;
        let i = cy * n;
        for (let cx = 0; cx < n; cx++, i++) {
          const idx = base + ix[cx];
          let val = T[idx];
          const lit = L[idx];
          // пустой фон: ни основной тон, ни «поднятые тени»; светиться может только кольцо от клика
          if (val < 0.004 && lit < 0.004 && np === 0) { px32[i] = 0; continue; }
          const u = us[cx];
          if (ms > 0.01) {
            const dx = u - mu, dy = v - mv, r2 = (dx * dx + dy * dy) / R2;
            if (r2 < 5) {
              const f = Math.exp(-r2 * 1.1) * ms;
              val = val + (Math.max(lit, val) - val) * f + 0.18 * f * (lit > 0.03 ? 1 : 0);
            }
          }
          for (let k = 0; k < np; k++) {
            const q = pl[k], age = (nowMs - q.t) / 1000, dx = u - q.u, dy = v - q.v, d = Math.sqrt(dx * dx + dy * dy);
            const ring = Math.exp(-Math.pow((d - age * 0.55) / 0.035, 2)) * Math.exp(-age * 1.7);
            if (ring > 0.01) val += ring * (0.25 + lit * 0.9);
          }
          val *= breathe;
          if (prog < 1) { const rr = prog * 1.75 - ((1 - u) * 0.85 + hs[i] * 0.3); val *= rr <= 0 ? 0 : rr >= 0.3334 ? 1 : rr * 3; }
          val *= fade;
          px32[i] = val > BAYER[bayerRow | (cx & 3)] ? col32 : 0;
        }
      }
      this.octx.putImageData(this.imgd, 0, 0);
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.W, this.H);
      ctx.imageSmoothingEnabled = false;
      const sz = n * cell, ox = this.OX + (this.S - sz) / 2, oy = this.OY + (this.S - sz) / 2;
      ctx.drawImage(this.oc, 0, 0, n, n, Math.round(ox), Math.round(oy), sz, sz);
    }
    this._sync();
  }
}

export default DitherPortrait;
