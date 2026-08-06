/* ============================================================
   SUPERFUN DAILY — shared kit
   Daily rotation, persistence, toasts, sheets, share, keyboard.
   Every demo uses these so the suite behaves identically.
   ============================================================ */
(function (global) {
  'use strict';

  const EPOCH = Date.UTC(2026, 0, 1); // Jan 1 2026 = puzzle #1
  const DAY = 86400000;

  /* ---- rotation ---------------------------------------------------------
     The day still sets which puzzle you OPEN on, so everyone alive today
     starts on the same one and the share number means something. What the
     day does not do any more is lock you out: finishing a puzzle — won or
     lost — hands you the next one immediately.

     `advance(ns)` steps a per-game cursor forward, which is why puzzleNo()
     and not dayNumber() is what a game should use for its number, its share
     line and its save key. Step it and you get tomorrow's puzzle today; the
     numbering stays honest because it is literally the next day's index.
     `?d=N` still pins one absolutely and ignores the cursor, for review.  */
  function dayNumber() {
    const now = new Date();
    const local = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.round((local - EPOCH) / DAY)) + 1;
  }
  function pinned() {
    const q = new URLSearchParams(location.search).get('d');
    return (q !== null && q !== '' && !isNaN(+q)) ? Math.max(1, Math.floor(+q)) : null;
  }
  const cursor = (ns) => store('cursor:' + (ns || 'default'));

  function puzzleNo(ns) {
    const p = pinned();
    if (p !== null) return p;
    return dayNumber() + (cursor(ns).get() || 0);
  }
  function advance(ns, by) {
    // A pinned ?d= URL would otherwise swallow the step and look broken.
    if (pinned() !== null) {
      const url = new URL(location.href);
      url.searchParams.set('d', pinned() + (by || 1));
      location.href = url.toString();
      return;
    }
    cursor(ns).set((cursor(ns).get() || 0) + (by || 1));
    location.reload();
  }
  function resetCursor(ns) { cursor(ns).clear(); }

  // pick(list) keeps working for anything that has not been given a
  // namespace yet; pass one and the puzzle follows that game's cursor.
  function pick(list, ns) { return list[(puzzleNo(ns) - 1) % list.length]; }
  function dateLabel() {
    return new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }
  function msToMidnight() {
    const n = new Date(), t = new Date(n);
    t.setHours(24, 0, 0, 0);
    return t - n;
  }
  function countdown(el) {
    const tick = () => {
      let s = Math.floor(msToMidnight() / 1000);
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      el.textContent = `${h}:${m}:${ss}`;
    };
    tick();
    return setInterval(tick, 1000);
  }

  /* ---- deterministic RNG (seeded, so everyone sees the same board) ------ */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ---- storage --------------------------------------------------------- */
  function store(ns) {
    const key = 'sfd:' + ns;
    let mem = null; // fallback when localStorage is unavailable (private mode)
    return {
      get() {
        try { return JSON.parse(localStorage.getItem(key) || 'null') || mem; }
        catch (e) { return mem; }
      },
      set(v) {
        mem = v;
        try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* memory only */ }
      },
      clear() {
        mem = null;
        try { localStorage.removeItem(key); } catch (e) { /* noop */ }
      }
    };
  }

  /* ---- toast ----------------------------------------------------------- */
  let layer;
  function toast(msg, ms) {
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'toast-layer';
      document.body.appendChild(layer);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    layer.appendChild(t);
    setTimeout(() => t.remove(), ms || 1900);
  }

  /* ---- sheet -----------------------------------------------------------
     One dialog for all five games: a bottom sheet on a phone, a centred card
     on a desktop. Everything a modal owes you is handled here once — focus
     capture, focus restore, Escape, scrim tap, swipe-to-dismiss, and an exit
     animation — so no demo has to reimplement any of it and none of them can
     get it subtly different from the others.
     `sticky: true` removes every casual way out; the sheet then has to be
     dismissed through a button you put in it. Used for "next hole" style
     hand-offs where closing by accident would lose the thread.             */
  function sheet(html, opts) {
    opts = opts || {};
    const prevFocus = document.activeElement;
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    const chrome = opts.sticky ? '' :
      '<div class="grab" aria-hidden="true"></div>' +
      '<button class="sheet-x" type="button" data-close aria-label="Close">' +
      '<span class="ms" aria-hidden="true">close</span></button>';
    scrim.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" tabindex="-1">${chrome}${html}</div>`;
    const el = scrim.querySelector('.sheet');

    let gone = false;
    function close() {
      if (gone) return;
      gone = true;
      document.removeEventListener('keydown', onKeydown);
      scrim.classList.add('leaving');
      const done = () => { scrim.remove(); try { prevFocus && prevFocus.focus(); } catch (e) {} };
      // never strand the sheet if the animation is suppressed (reduced motion)
      setTimeout(done, 210);
    }

    function onKeydown(e) {
      if (e.key === 'Escape' && !opts.sticky) { close(); return; }
      if (e.key !== 'Tab') return;
      // trap: tab must not walk out of the dialog into the board behind it
      const f = [...el.querySelectorAll('button:not([disabled]), [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
        .filter(n => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }

    scrim.addEventListener('click', (e) => { if (e.target === scrim && !opts.sticky) close(); });
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(scrim);
    scrim.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));

    /* swipe the sheet away, the way every native one does. Only from the top
       of its own scroll, or a flick while reading a long result would fire. */
    if (!opts.sticky) {
      let y0 = null;
      el.addEventListener('touchstart', (e) => {
        y0 = el.scrollTop <= 0 && e.touches.length === 1 ? e.touches[0].clientY : null;
      }, { passive: true });
      el.addEventListener('touchmove', (e) => {
        if (y0 === null) return;
        const d = e.touches[0].clientY - y0;
        el.style.transition = 'none';
        el.style.transform = d > 0 ? `translateY(${d}px)` : '';
      }, { passive: true });
      el.addEventListener('touchend', (e) => {
        if (y0 === null) return;
        const d = (e.changedTouches[0].clientY - y0);
        el.style.transition = 'transform .22s ' + 'cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        y0 = null;
        if (d > 95) close();
      });
    }

    // Always open at the top. Focusing a button first (the old behaviour)
    // scrolled the title and any diagram off a tall sheet before it was read.
    el.scrollTop = 0;
    el.focus({ preventScroll: true });
    requestAnimationFrame(() => { el.scrollTop = 0; });
    if (opts.onOpen) opts.onOpen(el, close);
    return { el, close };
  }

  /* ---- material symbols ------------------------------------------------
     Returns markup, not a node, because nearly every call site is building an
     HTML string. `ms` is always aria-hidden: the ligature text ("close") is
     real text in the DOM and a screen reader would otherwise read it out.  */
  function icon(name, opts) {
    opts = opts || {};
    const style = [
      opts.size ? `--ms-size:${opts.size}px` : '',
      opts.fill != null ? `--ms-fill:${opts.fill}` : '',
      opts.wght ? `--ms-wght:${opts.wght}` : '',
      opts.grad ? `--ms-grad:${opts.grad}` : '',
      opts.style || ''
    ].filter(Boolean).join(';');
    return `<span class="ms${opts.cls ? ' ' + opts.cls : ''}"${style ? ` style="${style}"` : ''} aria-hidden="true">${name}</span>`;
  }

  /* ---- theme ------------------------------------------------------------
     Every demo gets the same switch in the same corner, and the choice is
     shared across the suite — flipping Shunt to dark flips all five.       */
  const themeStore = store('theme');
  function applyTheme(v) {
    if (v) document.documentElement.dataset.theme = v;
    else delete document.documentElement.dataset.theme;
  }
  applyTheme(themeStore.get());
  function currentTheme() {
    return document.documentElement.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function themeToggle(btn) {
    if (!btn) return;
    const paint = () => {
      const dark = currentTheme() === 'dark';
      btn.innerHTML = icon(dark ? 'light_mode' : 'dark_mode');
      btn.setAttribute('aria-label', dark ? 'Switch to light' : 'Switch to dark');
      btn.title = dark ? 'Light mode' : 'Dark mode';
    };
    paint();
    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next); themeStore.set(next); paint(); haptic(6);
    });
    return { paint };
  }

  /* ---- count-up ---------------------------------------------------------
     A score that lands as a number nobody watched arrive is a number nobody
     feels. Short, and it always finishes on the exact value.               */
  function count(el, to, opts) {
    if (!el) return;
    opts = opts || {};
    const from = opts.from != null ? opts.from : 0;
    const ms = opts.ms || 700;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) {
      el.textContent = (opts.fmt || String)(to); return;
    }
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (opts.fmt || String)(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
      else { el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 320); }
    })(t0);
  }

  /* ---- celebration ------------------------------------------------------
     Deliberately unshared in tone: each game passes its own colours, so a
     Chains birdie and a Seed max don't celebrate identically.              */
  function burst(opts) {
    opts = opts || {};
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let layer = document.getElementById('burst-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'burst-layer';
      document.body.appendChild(layer);
    }
    const colors = opts.colors || ['#f0b429', '#2e7d4f', '#5b46c9', '#c2410c'];
    const n = opts.n || 46;
    const ox = opts.x != null ? opts.x : innerWidth / 2;
    const oy = opts.y != null ? opts.y : innerHeight * 0.34;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const v = 90 + Math.random() * 190;
      p.style.left = ox + 'px';
      p.style.top = oy + 'px';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dx', Math.cos(a) * v + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * v + 260 + Math.random() * 220) + 'px');
      p.style.setProperty('--rot', (Math.random() * 1080 - 540) + 'deg');
      p.style.setProperty('--fall', (1.1 + Math.random() * 0.9) + 's');
      if (i % 3 === 0) { p.style.borderRadius = '50%'; p.style.width = '7px'; p.style.height = '7px'; }
      layer.appendChild(p);
      setTimeout(() => p.remove(), 2200);
    }
  }

  /* ---- coach marks ------------------------------------------------------
     The brief says a first-timer plays without reading rules. A wall of text
     on first load is the opposite of that, so every demo now opens with two
     or three of these instead: one spotlight, one sentence, one tap.
     steps: [{ el|sel, text, place:'above'|'below', pad, round }]           */
  function tour(steps, opts) {
    opts = opts || {};
    steps = (steps || []).filter(s => {
      const n = s.el || (s.sel && document.querySelector(s.sel));
      return n && n.getBoundingClientRect().width > 0;
    });
    if (!steps.length) { opts.onDone && opts.onDone(); return { close() {} }; }

    const layer = document.createElement('div');
    layer.id = 'tour-layer';
    layer.innerHTML = '<div class="spot"></div><div class="bub" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(layer);
    const spot = layer.querySelector('.spot'), bub = layer.querySelector('.bub');
    let i = 0, gone = false;

    function done() {
      if (gone) return;
      gone = true;
      removeEventListener('resize', place);
      removeEventListener('scroll', place, true);
      layer.style.opacity = '0';
      layer.style.transition = 'opacity .2s';
      setTimeout(() => layer.remove(), 220);
      opts.onDone && opts.onDone();
    }

    function place() {
      const s = steps[i];
      const node = s.el || document.querySelector(s.sel);
      if (!node) { done(); return; }
      const r = node.getBoundingClientRect();
      const pad = s.pad != null ? s.pad : 7;
      spot.style.left = (r.left - pad) + 'px';
      spot.style.top = (r.top - pad) + 'px';
      spot.style.width = (r.width + pad * 2) + 'px';
      spot.style.height = (r.height + pad * 2) + 'px';
      spot.style.borderRadius = (s.round != null ? s.round : 14) + 'px';

      const below = s.place ? s.place === 'below' : (r.top < innerHeight * 0.55);
      bub.style.visibility = 'hidden';
      bub.style.top = '0px';
      requestAnimationFrame(() => {
        const bh = bub.offsetHeight, bw = bub.offsetWidth;
        let top = below ? r.bottom + pad + 14 : r.top - pad - 14 - bh;
        top = Math.max(12, Math.min(innerHeight - bh - 12, top));
        let left = r.left + r.width / 2 - bw / 2;
        left = Math.max(16, Math.min(innerWidth - bw - 16, left));
        bub.style.top = top + 'px';
        bub.style.left = left + 'px';
        bub.style.visibility = '';
      });
    }

    function paint() {
      const s = steps[i], last = i === steps.length - 1;
      bub.innerHTML =
        `<p>${s.text}</p><div class="row">` +
        `<span class="dots">${steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span>` +
        (last ? '' : '<button class="btn ghost sm" type="button" data-skip>Skip</button>') +
        `<button class="btn primary sm" type="button" data-next>${last ? (opts.doneLabel || 'Play') : 'Next'}</button>` +
        '</div>';
      bub.querySelector('[data-next]').addEventListener('click', () => {
        haptic(6);
        if (i === steps.length - 1) { done(); return; }
        i++; paint(); place();
      });
      const sk = bub.querySelector('[data-skip]');
      if (sk) sk.addEventListener('click', done);
      // re-run once the bubble has its real height
      requestAnimationFrame(place);
    }

    layer.addEventListener('click', (e) => { if (e.target === layer) done(); });
    addEventListener('resize', place);
    addEventListener('scroll', place, true);
    paint(); place();
    return { close: done };
  }

  /* ---- share ----------------------------------------------------------- */
  async function share(text, btn) {
    const label = btn && btn.textContent;
    try {
      if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard');
    } catch (e) {
      // clipboard blocked (insecure origin, permissions) — fall back to a
      // selectable textarea so the result is never trapped in the page.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:80vw;max-width:420px;height:180px;z-index:200;font:14px monospace;padding:12px;border-radius:12px;';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      if (ok) { ta.remove(); toast('Copied to clipboard'); }
      else { toast('Select and copy', 3000); ta.addEventListener('blur', () => ta.remove()); }
    } finally {
      if (btn && label) btn.textContent = label;
    }
  }

  /* ---- on-screen keyboard --------------------------------------------- */
  // rows: array of strings; specials passed as {key,label,flex}
  function keyboard(mount, onKey, opts) {
    opts = opts || {};
    const rows = opts.rows || ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
    mount.className = 'kbd';
    mount.innerHTML = '';
    rows.forEach((row, i) => {
      const r = document.createElement('div');
      r.className = 'kbd-row';
      if (i === rows.length - 1) {
        r.appendChild(mkKey(opts.enterLabel || 'ENTER', 'ENTER', 'wide act'));
      }
      row.split('').forEach(ch => r.appendChild(mkKey(ch, ch, '')));
      if (i === rows.length - 1) {
        r.appendChild(mkKey('⌫', 'BACK', 'wide'));
      }
      mount.appendChild(r);
    });
    function mkKey(label, key, cls) {
      const b = document.createElement('button');
      b.className = 'key ' + cls;
      b.textContent = label;
      b.dataset.key = key;
      b.type = 'button';
      b.setAttribute('aria-label', key === 'BACK' ? 'Backspace' : key);
      b.addEventListener('click', (e) => { e.preventDefault(); onKey(key); });
      return b;
    }
    const handler = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Enter') { onKey('ENTER'); e.preventDefault(); }
      else if (e.key === 'Backspace') { onKey('BACK'); e.preventDefault(); }
      else if (/^[a-zA-Z]$/.test(e.key)) { onKey(e.key.toUpperCase()); e.preventDefault(); }
    };
    document.addEventListener('keydown', handler);
    return {
      setState(map) { // {A:'dim'|'act'|''}
        mount.querySelectorAll('.key').forEach(k => {
          const s = map[k.dataset.key];
          k.classList.toggle('dim', s === 'dim');
        });
      },
      destroy() { document.removeEventListener('keydown', handler); }
    };
  }

  /* ---- misc ------------------------------------------------------------ */
  function haptic(ms) { try { navigator.vibrate && navigator.vibrate(ms || 8); } catch (e) {} }
  function flash(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 600);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function helpButton(html, title) {
    return () => sheet(`<h2>${title}</h2><div class="rules">${html}</div>
      <button class="btn primary wide" data-close style="margin-top:18px">Got it</button>`);
  }

  /* Play once per browser, keyed by name. Used for the coach tour and the
     one-off nudges, so a returning player is never taught twice. */
  function once(name) {
    const s = store('once:' + name);
    if (s.get()) return false;
    s.set(1);
    return true;
  }

  /* The one way out of a finished puzzle. Every result sheet ends with this
     exact control so the gesture is the same in all five games — and so no
     demo can quietly reintroduce a "come back tomorrow" wall. */
  function nextButton(ns, label) {
    return `<button class="btn primary wide" type="button" data-next-puzzle="${esc(ns)}">` +
           icon('play_arrow', { fill: 1 }) + (label || 'Next puzzle') + '</button>';
  }
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest && e.target.closest('[data-next-puzzle]');
    if (!b) return;
    e.preventDefault();
    b.disabled = true;
    haptic(12);
    advance(b.getAttribute('data-next-puzzle'));
  });

  global.Kit = {
    dayNumber, puzzleNo, advance, resetCursor, pinned, nextButton,
    pick, dateLabel, countdown, msToMidnight, rng,
    store, toast, sheet, share, keyboard, haptic, flash, esc, helpButton,
    icon, themeToggle, currentTheme, count, burst, tour, once
  };
})(window);
