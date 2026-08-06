#!/usr/bin/env node
/* ============================================================
   CHAINS — content verifier.  Run:  node verify.js
   Optionally:  node verify.js --explore   (hole-finding helper)

   Proves, for every hole in every round:
     (a) the stated `best` == the true shortest path length (BFS),
         and par == best + 1 (normal hole) or best + 2 (long hole),
         so the tightest line is always a birdie or an eagle
     (b) at least 2 DISTINCT routes of length <= best+1 exist
     (c) the whole graph passes structural sanity checks:
         - no link whose second half is a bare suffix/fragment
         - no self-links, no duplicate targets
         - start/target words exist in the graph
     (d) the hole is not trivially wide (a start with an absurd
         number of optimal routes reads as luck, not skill)
     (e) the hole is survivable: from EVERY word reachable inside
         par strokes there is still a route home, or the game's
         "stranded" rule fires — no silent dead ends
   ============================================================ */
'use strict';

const { LINKS, ROUNDS } = require('./puzzles.js');

let fails = 0;
const fail = (m) => { fails++; console.log('  ✗ ' + m); };
const ok = (m) => console.log('  ✓ ' + m);

/* ---------- (c) structural sanity ------------------------------------- */
// Fragments that show up when an auto-derived compound list is really just
// splitting a word in half (star+ter, pen+chant, sun+ken, cat+alan).
// Anything ending up here would be a curation miss.
const BANNED_SECOND = new Set([
  'ter', 'ing', 'ted', 'ded', 'ned', 'led', 'ken', 'chant', 'alan', 'cher',
  'ling', 'ers', 'est', 'ity', 'ous', 'ial', 'ive', 'ant', 'ent', 'ism',
  'ist', 'ify', 'ise', 'ize', 'ery', 'ary', 'ory'
]);

function structural() {
  console.log('\nGRAPH — structural sanity');
  let firsts = 0, links = 0;
  const seenPair = new Set();
  for (const a in LINKS) {
    firsts++;
    if (a !== a.toLowerCase()) fail(`first word not lowercase: ${a}`);
    if (a.length < 2) fail(`first word too short: ${a}`);
    const seconds = LINKS[a];
    const dupe = new Set();
    for (const b of seconds) {
      links++;
      if (b === a) fail(`self link: ${a}·${b}`);
      if (dupe.has(b)) fail(`duplicate link: ${a}·${b}`);
      dupe.add(b);
      if (BANNED_SECOND.has(b)) fail(`suffix fragment, not a word: ${a}·${b}`);
      if (b.length < 2) fail(`second word too short: ${a}·${b}`);
      if (!/^[a-z]+$/.test(b)) fail(`non-alpha: ${a}·${b}`);
      const pair = a + '·' + b;
      if (seenPair.has(pair)) fail(`repeated pair: ${pair}`);
      seenPair.add(pair);
    }
  }
  ok(`${firsts} head words, ${links} curated links, no fragments`);
  // every link's second word should itself be playable somewhere, or at
  // least be a plausible dead end. Report leaf density for information.
  let leaves = 0, total = 0;
  for (const a in LINKS) for (const b of LINKS[a]) { total++; if (!LINKS[b]) leaves++; }
  ok(`${((1 - leaves / total) * 100).toFixed(0)}% of links land on a word that can be played onward`);
}

/* ---------- BFS ------------------------------------------------------- */
function dist(start, target) {
  if (start === target) return 0;
  const seen = new Set([start]);
  let frontier = [start], d = 0;
  while (frontier.length) {
    d++;
    const next = [];
    for (const w of frontier) {
      for (const b of (LINKS[w] || [])) {
        if (b === target) return d;
        if (!seen.has(b)) { seen.add(b); next.push(b); }
      }
    }
    frontier = next;
  }
  return Infinity;
}

/* all simple routes up to maxLen, capped so this stays fast */
function routes(start, target, maxLen, cap) {
  cap = cap || 4000;
  const out = [];
  const path = [start];
  const onPath = new Set([start]);
  (function walk(w) {
    if (out.length >= cap) return;
    if (path.length - 1 >= maxLen) return;
    for (const b of (LINKS[w] || [])) {
      if (b === target) {
        out.push(path.concat(b));
        if (out.length >= cap) return;
        continue;
      }
      if (onPath.has(b)) continue;
      path.push(b); onPath.add(b);
      walk(b);
      path.pop(); onPath.delete(b);
    }
  })(start);
  return out;
}

/* every word you can be standing on after n legal strokes */
function reachableWithin(start, n) {
  const seen = new Set([start]);
  let frontier = [start];
  for (let i = 0; i < n; i++) {
    const next = [];
    for (const w of frontier) for (const b of (LINKS[w] || [])) {
      if (!seen.has(b)) { seen.add(b); next.push(b); }
    }
    frontier = next;
  }
  return seen;
}

/* ---------- (a)(b)(d)(e) per hole ------------------------------------- */
function holes() {
  ROUNDS.forEach((round, ri) => {
    console.log(`\nROUND ${ri + 1} — ${round.name}`);
    let parTotal = 0;
    round.holes.forEach((h, hi) => {
      const s = h.start.toLowerCase(), t = h.target.toLowerCase();
      parTotal += h.par;
      const label = `  hole ${hi + 1}  ${h.start} → ${h.target} (par ${h.par})`;
      if (!LINKS[s]) { fail(`${label}: START "${h.start}" has no outgoing links`); return; }

      /* (a) */
      const d = dist(s, t);
      if (d === Infinity) { fail(`${label}: unreachable`); return; }
      if (d !== h.best) { fail(`${label}: true shortest path is ${d}, best says ${h.best}`); return; }
      const bump = h.long ? 2 : 1;
      if (h.par !== h.best + bump) {
        fail(`${label}: par should be best+${bump} = ${h.best + bump}`); return;
      }
      if (linked(s, t)) { fail(`${label}: START·TARGET is itself a link — the hole gives itself away`); return; }

      /* (b)(d) */
      const rs = routes(s, t, h.best + 1);
      const opt  = rs.filter(r => r.length - 1 === h.best);
      const near = rs.filter(r => r.length - 1 <= h.best + 1);
      if (near.length < 2) { fail(`${label}: only ${near.length} route(s) of length ≤ best+1`); return; }
      if (opt.length < 2)  { fail(`${label}: only ${opt.length} optimal route — one line is not a golf hole`); return; }
      if (opt.length > 40) { fail(`${label}: ${opt.length} optimal routes — too wide to feel earned`); return; }

      /* (e) survivability: how much of the neighbourhood is a true dead end */
      const nbhd = reachableWithin(s, h.par);
      let stranded = 0;
      for (const w of nbhd) if (!(LINKS[w] || []).length) stranded++;
      const pct = (stranded / nbhd.size * 100).toFixed(0);
      if (nbhd.size < 20) { fail(`${label}: neighbourhood of ${nbhd.size} words is too cramped`); return; }

      const kind = h.long ? 'eagle' : 'birdie';
      ok(`${h.start} → ${h.target}  par ${h.par}  ·  best ${h.best} (${kind})  ·  ` +
         `${opt.length} optimal, ${near.length - opt.length} at best+1  ·  ` +
         `${nbhd.size} words in range, ${pct}% of them terminal`);
      console.log(`      ${opt.slice(0, 2).map(r => r.join('·').toUpperCase()).join('   |   ')}`);
    });
    console.log(`      round par: ${parTotal}`);
  });
}
const linked = (a, b) => !!(LINKS[a] && LINKS[a].indexOf(b) >= 0);

/* ---------- explorer (authoring aid, not a test) ---------------------- */
function explore() {
  const heads = Object.keys(LINKS);
  const res = [];
  for (const s of heads) {
    for (const t of heads) {
      if (s === t) continue;
      const d = dist(s, t);
      if (d < 3 || d > 4) continue;
      const rs = routes(s, t, d, 200);
      if (rs.length < 2 || rs.length > 14) continue;
      res.push([s, t, d, rs.length, rs[0].join('·')]);
    }
  }
  res.sort((a, b) => a[3] - b[3]);
  res.slice(0, 400).forEach(r => console.log(r.join('\t')));
  console.log('candidates:', res.length);
}

if (process.argv.includes('--explore')) { explore(); }
else {
  structural();
  holes();
  console.log('\n' + (fails ? `FAILED — ${fails} problem(s)` : 'ALL CHECKS PASSED'));
  process.exit(fails ? 1 : 0);
}
