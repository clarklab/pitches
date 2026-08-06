#!/usr/bin/env node
/* ============================================================================
   SHUNT — build-time verifier and solution enumerator.
       node verify.js            verify every shipped puzzle
       node verify.js --emit     re-emit puzzles.js from first principles
       node verify.js --search hawk,dove,crow,wren 6 [tries]

   What it proves, per puzzle, by exhaustive search — not by sampling:

   1. The scrambled start is NOT already solved, and NO row of the start is
      accidentally a valid word (a lit row at move zero misleads the player).
   2. `par` is the TRUE minimum number of slides from the start to ANY board
      whose four rows are all in LEX4 — not just to the authored words.
      Proven by a complete bidirectional breadth-first search of the slide
      space: every board at distance <= par+1 is examined.
   3. The complete list of par-length solutions, found by enumerating every
      way to partition the grid's 16 letters into four LEX4 words (in every
      row order), then measuring the exact slide distance to each one.
   4. For each of those solutions, the number of distinct shortest routes that
      end on it -> the "% of par routes" rarity figure the endgame reports.

   Why bidirectional: the slide group on a 4x4 torus is enormous (a single
   plain BFS to depth 7 exceeds 24M states and blows past the JS Set limit).
   We meet in the middle: BFS forward from the start to depth f = par-1, and
   expand a small neighbourhood of radius b around every *candidate solution
   board*. Any board at distance d <= f+b is guaranteed to be found with its
   exact distance, because a shortest path of length d must contain a node at
   forward-depth min(f,d) whose remaining tail is at most b.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

global.window = global.window || {};
require(path.join(__dirname, '..', 'shared', 'lex4.js'));
const LEX = global.window.LEX4;
const WORDS = [...LEX].filter(w => /^[a-z]{4}$/.test(w));
const A = 'a'.charCodeAt(0);

/* ---------------------------------------------------------------- moves --- */
/* 0..7 rows (r*2 + 0=left,1=right)   8..15 cols (c*2 + 0=up,1=down) */
const PERM = [];
for (let m = 0; m < 16; m++) {
  const p = new Array(16), isRow = m < 8, idx = (m >> 1) & 3, back = (m & 1) === 1;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    let sr = r, sc = c;
    if (isRow && r === idx) sc = (c + (back ? 3 : 1)) % 4;
    if (!isRow && c === idx) sr = (r + (back ? 3 : 1)) % 4;
    p[r * 4 + c] = sr * 4 + sc;
  }
  PERM.push(p);
}
const INV = m => (m % 2 === 0 ? m + 1 : m - 1);
function apply(b, m) { const p = PERM[m]; let o = ''; for (let i = 0; i < 16; i++) o += b[p[i]]; return o; }
function moveName(m) {
  return m < 8 ? `row${((m >> 1) & 3) + 1}${m & 1 ? '→' : '←'}`
               : `col${((m >> 1) & 3) + 1}${m & 1 ? '↓' : '↑'}`;
}
const rows = b => [b.slice(0, 4), b.slice(4, 8), b.slice(8, 12), b.slice(12, 16)];
const litRows = b => rows(b).filter(r => LEX.has(r));
const solved = b => litRows(b).length === 4;

/* --------------------------------------------- candidate solution boards --- */
function sig(s) { const a = new Int8Array(26); for (const ch of s) a[ch.charCodeAt(0) - A]++; return a; }
const WSIG = new Map(WORDS.map(w => [w, sig(w)]));
const BYLETTER = Array.from({ length: 26 }, () => []);
for (const w of WORDS) for (const ch of new Set(w)) BYLETTER[ch.charCodeAt(0) - A].push(w);

/* every multiset of 4 LEX4 words that uses exactly these 16 letters */
function wordPartitions(counts) {
  const out = [], rem = Int8Array.from(counts), chosen = [];
  (function rec(depth) {
    if (depth === 4) { out.push(chosen.slice()); return; }
    let best = -1, bestLen = Infinity;      // cover the scarcest letter first
    for (let l = 0; l < 26; l++) if (rem[l] > 0 && BYLETTER[l].length < bestLen) { bestLen = BYLETTER[l].length; best = l; }
    if (best < 0) return;
    for (const w of BYLETTER[best]) {
      const s = WSIG.get(w);
      let ok = true;
      for (let l = 0; l < 26; l++) if (s[l] > rem[l]) { ok = false; break; }
      if (!ok) continue;
      for (let l = 0; l < 26; l++) rem[l] -= s[l];
      chosen.push(w); rec(depth + 1); chosen.pop();
      for (let l = 0; l < 26; l++) rem[l] += s[l];
    }
  })(0);
  const seen = new Set(), res = [];
  for (const c of out) { const k = c.slice().sort().join(' '); if (!seen.has(k)) { seen.add(k); res.push(c.slice().sort()); } }
  return res;
}
/* every ROW ORDERING of every such partition = every solved board */
function allSolutionBoards(board) {
  const out = new Set();
  for (const p of wordPartitions(sig(board))) {
    (function perm(pool, acc) {
      if (!pool.length) { out.add(acc.join('')); return; }
      const used = new Set();
      for (let i = 0; i < pool.length; i++) {
        if (used.has(pool[i])) continue; used.add(pool[i]);
        const next = pool.slice(); next.splice(i, 1);
        perm(next, acc.concat(pool[i]));
      }
    })(p, []);
  }
  return [...out];
}

/* ------------------------------------------------------------ search ------ */
/* forward BFS: state -> depth, and state -> number of shortest routes */
function forward(start, f) {
  const dep = new Map([[start, 0]]), cnt = new Map([[start, 1]]);
  let front = [start];
  for (let d = 1; d <= f; d++) {
    const nf = [];
    for (const s of front) {
      const cs = cnt.get(s);
      for (let m = 0; m < 16; m++) {
        const n = apply(s, m), have = dep.get(n);
        if (have === undefined) { dep.set(n, d); cnt.set(n, cs); nf.push(n); }
        else if (have === d) cnt.set(n, cnt.get(n) + cs);
      }
    }
    front = nf;
  }
  return { dep, cnt };
}
/* outward BFS from one goal: state -> [backDepth, shortest route count] */
function around(goal, b) {
  const dep = new Map([[goal, 0]]), cnt = new Map([[goal, 1]]);
  let front = [goal];
  for (let d = 1; d <= b; d++) {
    const nf = [];
    for (const s of front) {
      const cs = cnt.get(s);
      for (let m = 0; m < 16; m++) {
        const n = apply(s, m), have = dep.get(n);
        if (have === undefined) { dep.set(n, d); cnt.set(n, cs); nf.push(n); }
        else if (have === d) cnt.set(n, cnt.get(n) + cs);
      }
    }
    front = nf;
  }
  return { dep, cnt };
}
/* exact distance start -> every goal, for all distances <= f + b */
function distanceMap(fdep, f, goals, b) {
  const res = new Map();
  for (const g of goals) {
    let best = Infinity;
    const seen = new Set([g]);
    const d0 = fdep.get(g); if (d0 !== undefined) best = d0;
    let front = [g];
    for (let d = 1; d <= b && best === Infinity; d++) {
      const nf = [];
      for (const s of front) for (let m = 0; m < 16; m++) {
        const n = apply(s, m);
        if (seen.has(n)) continue; seen.add(n);
        const fd = fdep.get(n);
        if (fd !== undefined && fd + d < best) best = fd + d;
        nf.push(n);
      }
      front = nf;
    }
    if (best <= f + b) res.set(g, best);
  }
  return res;
}
/* number of distinct shortest routes from start to goal (length par) */
function routeCount(fw, f, goal, par) {
  const tail = par - f;                      // 1 when f = par - 1
  const { dep: bd, cnt: bc } = around(goal, tail);
  let total = 0;
  for (const [st, d] of bd) {
    if (d !== tail) continue;
    const fd = fw.dep.get(st);
    if (fd === f) total += fw.cnt.get(st) * bc.get(st);
  }
  return total;
}
/* one concrete optimal line, for the log */
function optimalLine(start, goal, par) {
  const par_ = new Map([[start, null]]);
  let front = [start];
  for (let d = 1; d <= par; d++) {
    const nf = [];
    for (const s of front) for (let m = 0; m < 16; m++) {
      const n = apply(s, m);
      if (par_.has(n)) continue;
      par_.set(n, [s, m]);
      if (n === goal) { const out = []; let cur = n; while (par_.get(cur)) { const [p, mm] = par_.get(cur); out.push(mm); cur = p; } return out.reverse().map(moveName); }
      nf.push(n);
    }
    front = nf;
  }
  return null;
}

/* --------------------------------------------------------- the analysis --- */
function analyse(p, opts) {
  opts = opts || {};
  const start = p.start, par = p.par;
  const t0 = Date.now();
  const goals = allSolutionBoards(start);
  const f = par - 1, b = 2;                  // guarantees exact d for all d <= par+1
  const fw = forward(start, f);
  const dm = distanceMap(fw.dep, f, goals, b);

  let min = Infinity;
  for (const d of dm.values()) if (d < min) min = d;
  const atPar = [...dm].filter(([, d]) => d === min).map(([g]) => g);
  const atPar1 = [...dm].filter(([, d]) => d === min + 1).length;

  const routes = atPar.map(g => routeCount(fw, f, g, min));
  const totalRoutes = routes.reduce((a, x) => a + x, 0);
  const order = atPar.map((g, i) => ({ b: g, routes: routes[i] }))
    .sort((x, y) => y.routes - x.routes || (x.b < y.b ? -1 : 1));
  order.forEach(o => { o.pct = Math.max(1, Math.round(100 * o.routes / totalRoutes)); });

  return {
    start, par, min, goals: goals.length, searched: fw.dep.size,
    atPar: order, atPar1, totalRoutes, ms: Date.now() - t0,
    line: opts.line ? optimalLine(start, order[0].b, min) : null
  };
}

/* ------------------------------------------------------------- reporting -- */
const RED = s => `\x1b[31m${s}\x1b[0m`, GRN = s => `\x1b[32m${s}\x1b[0m`, DIM = s => `\x1b[2m${s}\x1b[0m`;
let failures = 0;
function check(ok, msg) { console.log(`   ${ok ? GRN('PASS') : RED('FAIL')}  ${msg}`); if (!ok) failures++; }

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--search') { search(args[1].split(','), +args[2], +(args[3] || 60)); return; }

  require(path.join(__dirname, 'puzzles.js'));
  const P = global.window.SHUNT_PUZZLES;
  const emit = args.includes('--emit');
  const out = [];

  console.log(`\nSHUNT — verifying ${P.length} puzzles against ${WORDS.length} four-letter words\n`);

  P.forEach((p, i) => {
    const r = analyse(p, { line: true });
    console.log(`#${i + 1}  ${rows(p.start).join(' ')}   ${DIM(`(authored: ${p.words.join(' ')})`)}`);
    check(!solved(p.start), 'start is not already solved');
    check(litRows(p.start).length === 0, `start has no accidentally-lit row  ${litRows(p.start).length ? RED(litRows(p.start).join(',')) : ''}`);
    check(r.min === p.par, `par ${p.par} is the true minimum (search found ${r.min})`);
    check(r.atPar.length >= 2, `${r.atPar.length} distinct solutions at par  ${DIM('(want >= 2 for the share hook)')}`);
    check(r.atPar.length <= 8, `${r.atPar.length} solutions is a countable number`);

    const mine = JSON.stringify(p.sols.map(s => [s.b, s.pct]));
    const calc = JSON.stringify(r.atPar.map(s => [s.b, s.pct]));
    check(mine === calc, 'shipped solution table matches the exhaustive search');
    check(r.atPar.every(s => s.pct > 0) && Math.abs(r.atPar.reduce((a,s)=>a+s.pct,0) - 100) <= 3,
          'route shares are sane and sum to ~100%');

    console.log(`   ${DIM(`space: ${r.goals} candidate solved boards · ${r.searched} states expanded · ${r.ms}ms`)}`);
    console.log(`   ${DIM(`solutions at par ${r.min}: ${r.atPar.map(s => rows(s.b).join('/') + ' ' + s.pct + '%').join('  |  ')}`)}`);
    console.log(`   ${DIM(`also ${r.atPar1} solutions at par+1 · one optimal line: ${r.line.join(' ')}`)}\n`);

    out.push({ ...p, sols: r.atPar.map(s => ({ b: s.b, pct: s.pct })) });
  });

  if (emit) {
    const body = out.map(p =>
      `  { words:${JSON.stringify(p.words)}, start:${JSON.stringify(p.start)}, par:${p.par},\n` +
      `    sols:[${p.sols.map(s => `{b:${JSON.stringify(s.b)},pct:${s.pct}}`).join(',\n          ')}] }`
    ).join(',\n');
    const src = `/* SHUNT — daily puzzles.\n   GENERATED BY verify.js --emit. Every field below is proven by exhaustive\n   search: par is the true minimum slide count to ANY all-words board, and\n   sols[] is the complete list of par-length solutions with each one's share\n   of all shortest routes. Do not hand-edit; re-run \`node verify.js --emit\`.\n*/\nwindow.SHUNT_PUZZLES = [\n${body}\n];\n`;
    fs.writeFileSync(path.join(__dirname, 'puzzles.js'), src);
    console.log(GRN('wrote puzzles.js'));
  }

  console.log(failures ? RED(`\n${failures} check(s) failed\n`) : GRN('\nAll checks passed.\n'));
  process.exit(failures ? 1 : 0);
}

/* --------------------------------------------------- puzzle prospecting --- */
function search(words, N, tries) {
  const board = words.join('');
  if (!words.every(w => LEX.has(w))) { console.error('not all words are in LEX4'); process.exit(1); }
  const goals = allSolutionBoards(board);
  console.error(`# ${words.join(' ')}: ${goals.length} candidate solved boards`);
  const hits = [];
  for (let t = 0; t < tries; t++) {
    let s = board, last = -1;
    for (let i = 0; i < N; i++) {
      let m; do { m = Math.floor(Math.random() * 16); } while (m === INV(last) || m === last);
      last = m; s = apply(s, m);
    }
    if (s === board || litRows(s).length) continue;
    const r = analyse({ start: s, par: N });
    if (r.min !== N) continue;
    const distinctWordSets = new Set(r.atPar.map(x => rows(x.b).slice().sort().join(','))).size;
    hits.push({ start: s, n: r.atPar.length, ws: distinctWordSets, r });
  }
  hits.sort((x, y) => y.ws - x.ws || y.n - x.n);
  for (const h of hits.slice(0, 5)) {
    console.log(JSON.stringify({ words, start: h.start, par: N, n: h.n, ws: h.ws,
      sols: h.r.atPar.map(s => rows(s.b).join('/') + ':' + s.pct) }));
  }
  console.error(`# ${hits.length}/${tries} viable`);
}

main();
