/* ============================================================
   SUPERFUN DAILY — shared kit
   Daily rotation, persistence, toasts, sheets, share, keyboard.
   Every demo uses these so the suite behaves identically.
   ============================================================ */
(function (global) {
  'use strict';

  const EPOCH = Date.UTC(2026, 0, 1); // Jan 1 2026 = puzzle #1
  const DAY = 86400000;

  /* ---- daily rotation -------------------------------------------------- */
  // Demos ship a handful of hand-authored puzzles; index rotates by local day
  // so "come back tomorrow" is real, and ?d=N pins one for review.
  function dayNumber() {
    const q = new URLSearchParams(location.search).get('d');
    if (q !== null && q !== '' && !isNaN(+q)) return Math.max(0, Math.floor(+q));
    const now = new Date();
    const local = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.round((local - EPOCH) / DAY)) + 1;
  }
  function pick(list) { return list[(dayNumber() - 1) % list.length]; }
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

  /* ---- sheet ----------------------------------------------------------- */
  function sheet(html, opts) {
    opts = opts || {};
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
    const close = () => { scrim.remove(); document.removeEventListener('keydown', esc); };
    const esc = (e) => { if (e.key === 'Escape' && !opts.sticky) close(); };
    scrim.addEventListener('click', (e) => { if (e.target === scrim && !opts.sticky) close(); });
    document.addEventListener('keydown', esc);
    document.body.appendChild(scrim);
    scrim.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
    const el = scrim.querySelector('.sheet');
    const focusable = el.querySelector('button, [href], input');
    if (focusable) focusable.focus();
    if (opts.onOpen) opts.onOpen(el, close);
    return { el, close };
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

  global.Kit = {
    dayNumber, pick, dateLabel, countdown, msToMidnight, rng,
    store, toast, sheet, share, keyboard, haptic, flash, esc, helpButton
  };
})(window);
