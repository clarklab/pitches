#!/usr/bin/env node
/* ============================================================================
   SEED — verifier.        run:  node verify.js       (exit 0 = shippable)

   This file exists to be paranoid about puzzles.js. It deliberately does NOT
   import build.js's explorer or solver — if build.js has a bug in how it walks
   the rack space, importing that walk to check itself would prove nothing.
   Everything below (reachability, the maximum, the witness replay, the greedy
   trap) is re-derived from first principles against the raw lexicon.

   The only thing shared with build.js is the hand-curated BLOCKLIST, because
   "which junk words a human struck" is authored data, not derived data — and
   we separately assert every blocklist entry is real (no rotted entries) and
   that no blocklisted word survived into the shipped file.

   What is asserted, for every shipped puzzle:
     1  structure     — seed is a real 3-letter word, queue is 9 A-Z letters
     2  keys          — every shipped key is sorted, and is a rack a player can
                        actually hold; no unreachable filler
     3  words         — every shipped word is in the source lexicon, is an
                        exact anagram of its key, and no legal word is missing
     4  max           — the recorded maximum is re-derived by exhaustive search
                        and matches; maxSkips is the cheapest way to get there
     5  witness       — `par` / `path` replay legally, letter by letter, against
                        the real queue with <= 2 skips, and land on the maximum
     6  the trap      — a greedy player (take whenever a word exists) provably
                        dead-ends, and there is a named decision point where
                        taking kills you and skipping survives
     7  range         — the maximum lands in 9..11
   ==========================================================================*/

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { BLOCKLIST } = require('./build.js');

const LEX_PATH = path.join(__dirname, '..', 'shared', 'lexgen.raw.json');
const PUZ_PATH = path.join(__dirname, 'puzzles.js');
const MAX_SKIPS = 2;
const QUEUE_LEN = 9;
const MIN_MAX = 9;
const MAX_MAX = 11;

/* ---- tiny assertion harness --------------------------------------------- */
let checks = 0;
const failures = [];
let scope = '';
function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(`${scope}${label}${detail ? ' — ' + detail : ''}`);
  return !!cond;
}
function eq(a, b, label) {
  return ok(a === b, label, a === b ? '' : `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);
}

/* ---- lexicon ------------------------------------------------------------- */
const sortKey = (s) => s.toUpperCase().split('').sort().join('');

function loadLexicon() {
  const raw = JSON.parse(fs.readFileSync(LEX_PATH, 'utf8'));
  const words = new Set();
  const byKey = new Map();
  let blocked = 0;
  for (const w of raw) {
    if (!/^[a-z]{3,12}$/.test(w)) continue;
    if (BLOCKLIST.has(w)) { blocked++; continue; }
    const W = w.toUpperCase();
    words.add(W);
    const k = sortKey(W);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(W);
  }
  for (const list of byKey.values()) list.sort();
  return { words, byKey, rawCount: raw.length, blocked };
}

/* ---- load the shipped file the way a browser would ----------------------- */
function loadShipped() {
  const src = fs.readFileSync(PUZ_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'puzzles.js' });
  return { puzzles: sandbox.window.SEED_PUZZLES, bytes: Buffer.byteLength(src) };
}

/* ==========================================================================
   Independent model of the game.

   A player state is (i, rack, skips): i queue letters resolved, `rack` the
   sorted letters currently owned (NOT counting the pending letter), `skips`
   spent. The player is only ever in a state whose rack spells a word — that is
   what "resolved" means. From (i, rack, skips) with i < 9:
       TAKE  -> rack+Q[i] must spell a word  -> (i+1, rack+Q[i], skips)
       SKIP  -> needs skips < 2              -> (i+1, rack,      skips+1)
   ========================================================================= */
function statesOf(seed, queue, byKey) {
  const layers = [];                      // layers[i] = Map(rackKey|skips -> state)
  const start = { rack: sortKey(seed), skips: 0, i: 0, from: null, via: null };
  layers[0] = new Map([[start.rack + '|0', start]]);

  for (let i = 0; i < queue.length; i++) {
    const next = new Map();
    for (const st of layers[i].values()) {
      const grown = sortKey(st.rack + queue[i]);
      if (byKey.has(grown)) {
        const id = grown + '|' + st.skips;
        if (!next.has(id)) next.set(id, { rack: grown, skips: st.skips, i: i + 1, from: st, via: 'take' });
      }
      if (st.skips < MAX_SKIPS) {
        const id = st.rack + '|' + (st.skips + 1);
        if (!next.has(id)) next.set(id, { rack: st.rack, skips: st.skips + 1, i: i + 1, from: st, via: 'skip' });
      }
    }
    layers[i + 1] = next;
  }
  return layers;
}

/* Every rack a player can ever be HOLDING (i.e. including the pending letter).
   This is exactly the key set puzzles.js is allowed to contain. */
function holdableRacks(seed, queue, byKey) {
  const layers = statesOf(seed, queue, byKey);
  const held = new Set([sortKey(seed)]);          // the seed rung itself
  for (let i = 0; i < queue.length; i++) {
    for (const st of layers[i].values()) held.add(sortKey(st.rack + queue[i]));
  }
  return held;
}

/* Longest word reachable from anywhere, brute-forced over the whole layer set. */
function trueMax(seed, queue, byKey) {
  const layers = statesOf(seed, queue, byKey);
  let best = { len: seed.length, skips: 0 };
  for (const layer of layers) {
    for (const st of layer.values()) {
      if (st.rack.length > best.len || (st.rack.length === best.len && st.skips < best.skips)) {
        best = { len: st.rack.length, skips: st.skips, st };
      }
    }
  }
  return best;
}

/* Best final length still achievable from a given position — the lookahead a
   perfect player has. Memoised over (i, rack, skips). */
function makeBestFrom(queue, byKey) {
  const memo = new Map();
  return function bestFrom(i, rack, skips) {
    if (i >= queue.length) return rack.length;
    const id = i + '|' + rack + '|' + skips;
    if (memo.has(id)) return memo.get(id);
    let best = rack.length;                       // stopping here is always legal
    const grown = sortKey(rack + queue[i]);
    if (byKey.has(grown)) best = Math.max(best, bestFrom(i + 1, grown, skips));
    if (skips < MAX_SKIPS) best = Math.max(best, bestFrom(i + 1, rack, skips + 1));
    memo.set(id, best);
    return best;
  };
}

/* The greedy player: swallow every letter you can, skip only when the rack
   would otherwise be unplayable. This is what a first-timer does. */
function greedyWalk(seed, queue, byKey) {
  let rack = sortKey(seed), skips = 0;
  const log = [];
  for (let i = 0; i < queue.length; i++) {
    const grown = sortKey(rack + queue[i]);
    if (byKey.has(grown)) { rack = grown; log.push({ i, act: 'take', letter: queue[i] }); continue; }
    if (skips < MAX_SKIPS) { skips++; log.push({ i, act: 'skip', letter: queue[i] }); continue; }
    return { len: rack.length, skips, dead: true, deadAt: i, deadLetter: queue[i], rack, log };
  }
  return { len: rack.length, skips, dead: false, rack, log };
}

/* ==========================================================================
   main
   ========================================================================= */
function main() {
  const lex = loadLexicon();
  const { puzzles, bytes } = loadShipped();

  console.log('SEED — verify');
  console.log('='.repeat(66));
  console.log(`lexicon      ${lex.rawCount} raw words -> ${lex.words.size} usable ` +
              `(${lex.blocked} struck by hand-curated blocklist)`);
  console.log(`shipped      puzzles.js is ${(bytes / 1024).toFixed(1)} KB, ${puzzles ? puzzles.length : 0} puzzles`);
  console.log('');

  scope = '[global] ';
  ok(Array.isArray(puzzles), 'window.SEED_PUZZLES is an array');
  ok(puzzles.length >= 6, 'ships at least 6 puzzles', `has ${puzzles.length}`);
  ok(bytes < 60 * 1024, 'shipped data stays small (no lexicon leak)', `${bytes} bytes`);

  // The blocklist must be live data, not rot: every entry must exist in the
  // raw lexicon (otherwise it is a typo silently protecting nothing).
  const rawSet = new Set(JSON.parse(fs.readFileSync(LEX_PATH, 'utf8')));
  const deadBlocks = [...BLOCKLIST].filter(w => !rawSet.has(w));
  ok(deadBlocks.length === 0, 'every blocklist entry exists in the lexicon',
     deadBlocks.length ? `dead entries: ${deadBlocks.slice(0, 8).join(' ')}` : '');

  const seenQueues = new Set();
  let trapCount = 0;

  for (const p of puzzles) {
    scope = `[#${p.n} ${p.seed}/${p.queue}] `;

    /* -- 1. structure --------------------------------------------------- */
    ok(/^[A-Z]{3}$/.test(p.seed), 'seed is 3 uppercase letters');
    ok(lex.words.has(p.seed), 'seed is a real word');
    ok(/^[A-Z]+$/.test(p.queue), 'queue is uppercase letters');
    eq(p.queue.length, QUEUE_LEN, 'queue is 9 letters long');
    ok(!seenQueues.has(p.seed + p.queue), 'puzzle is not a duplicate');
    seenQueues.add(p.seed + p.queue);

    const queue = p.queue.split('');
    const held = holdableRacks(p.seed, queue, lex.byKey);

    /* -- 2 + 3. keys and words ------------------------------------------ */
    const shippedKeys = Object.keys(p.words);
    let badKey = null, badWord = null, badAnagram = null, unreachable = null;
    for (const k of shippedKeys) {
      if (sortKey(k) !== k && !badKey) badKey = k;
      if (!held.has(k) && !unreachable) unreachable = k;
      for (const w of p.words[k]) {
        if (!lex.words.has(w) && !badWord) badWord = `${w} (rack ${k})`;
        if (sortKey(w) !== k && !badAnagram) badAnagram = `${w} does not spell ${k}`;
      }
    }
    ok(!badKey, 'every rack key is its own sorted letters', badKey);
    ok(!unreachable, 'no unreachable rack keys shipped', unreachable);
    ok(!badWord, 'every shipped word is in the source lexicon', badWord);
    ok(!badAnagram, 'every shipped word is an exact anagram of its rack', badAnagram);

    // Completeness in both directions: a rack the player can hold that has a
    // legal word MUST be listed (otherwise the game rejects a correct answer),
    // and the word list for it must be the full set (otherwise it rejects a
    // correct synonym anagram).
    let missingRack = null, missingWord = null;
    for (const rack of held) {
      const truth = lex.byKey.get(rack);
      if (!truth) continue;
      const shipped = p.words[rack];
      if (!shipped) { if (!missingRack) missingRack = rack; continue; }
      const a = shipped.slice().sort().join(' '), b = truth.join(' ');
      if (a !== b && !missingWord) missingWord = `${rack}: shipped [${a}] truth [${b}]`;
    }
    ok(!missingRack, 'every playable rack is shipped', missingRack);
    ok(!missingWord, 'every rack ships its complete word list', missingWord);

    /* -- 4. the maximum -------------------------------------------------- */
    const best = trueMax(p.seed, queue, lex.byKey);
    eq(p.max, best.len, 're-derived maximum matches the shipped maximum');
    eq(p.maxSkips, best.skips, 'maxSkips is the cheapest route to that maximum');
    ok(p.max >= MIN_MAX && p.max <= MAX_MAX, `maximum lands in ${MIN_MAX}..${MAX_MAX}`, `max=${p.max}`);

    /* -- 5. the witness replays legally ---------------------------------- */
    // Walk `path` exactly as the game would: seed rung, then one entry per
    // queue letter consumed, takes playing a word that uses the whole rack.
    ok(Array.isArray(p.path) && p.path.length > 0, 'path is present');
    let rack = sortKey(p.seed), qi = 0, skips = 0, replayErr = null;
    const takes = [];
    p.path.forEach((step, n) => {
      if (replayErr) return;
      const act = step[0], body = step.slice(1);
      if (n === 0) {
        if (act !== 'T' || body !== p.seed) replayErr = `path[0] must be the seed, got ${step}`;
        else takes.push(body);
        return;
      }
      if (qi >= queue.length) { replayErr = `path runs past the end of the queue at ${step}`; return; }
      if (act === 'S') {
        if (body !== queue[qi]) replayErr = `skip ${body} but queue[${qi}] is ${queue[qi]}`;
        else if (++skips > MAX_SKIPS) replayErr = `path spends ${skips} skips (max ${MAX_SKIPS})`;
        qi++;
        return;
      }
      if (act !== 'T') { replayErr = `unknown step ${step}`; return; }
      const want = sortKey(rack + queue[qi]);
      if (sortKey(body) !== want) {
        replayErr = `"${body}" does not use exactly the rack ${want} after taking ${queue[qi]}`;
      } else if (!(p.words[want] || []).includes(body)) {
        replayErr = `"${body}" is not in the shipped word list for ${want}`;
      } else {
        rack = want; takes.push(body);
      }
      qi++;
    });
    ok(!replayErr, 'witness path replays legally step by step', replayErr);
    eq(takes.join(' '), (p.par || []).join(' '), 'path takes match the shipped par chain');
    eq(rack.length, p.max, 'witness path actually reaches the maximum');
    ok(skips <= MAX_SKIPS, 'witness path stays inside the skip budget', `used ${skips}`);
    // every rung grows by exactly one letter
    let growth = true;
    for (let i = 1; i < takes.length; i++) if (takes[i].length !== takes[i - 1].length + 1) growth = false;
    ok(growth, 'every rung of the witness grows by exactly one letter');

    /* -- 6. the trap: greedy dies where planning survives ---------------- */
    const g = greedyWalk(p.seed, queue, lex.byKey);
    ok(g.dead, 'a greedy player actually dead-ends (not merely scores lower)',
       g.dead ? '' : `greedy survived to ${g.len}`);
    ok(g.len < p.max, 'greedy finishes strictly short of the maximum',
       `greedy ${g.len} vs max ${p.max}`);

    // Now name the fork. Replay greedy; at each TAKE, compare the best final
    // length still reachable after taking vs after skipping. A puzzle earns its
    // keep only if somewhere the greedy hand is strictly the worse hand.
    const bestFrom = makeBestFrom(queue, lex.byKey);
    let fork = null;
    let r = sortKey(p.seed), sk = 0;
    for (let i = 0; i < queue.length; i++) {
      const grown = sortKey(r + queue[i]);
      const canTake = lex.byKey.has(grown);
      const canSkip = sk < MAX_SKIPS;
      if (canTake && canSkip) {
        const takeVal = bestFrom(i + 1, grown, sk);
        const skipVal = bestFrom(i + 1, r, sk + 1);
        if (skipVal > takeVal && !fork) {
          fork = { i, letter: queue[i], takeVal, skipVal, word: lex.byKey.get(grown)[0] };
        }
      }
      if (canTake) { r = grown; continue; }
      if (canSkip) { sk++; continue; }
      break;
    }
    if (ok(!!fork, 'there is a fork where the greedy take is strictly worse')) trapCount++;

    /* -- report ---------------------------------------------------------- */
    const line = p.path.map(s => s[0] === 'S' ? '⨯' + s.slice(1) : s.slice(1)).join(' → ');
    console.log(`#${p.n}  ${p.seed}   queue ${queue.join(' ')}`);
    console.log(`     max ${p.max} (${p.maxSkips} skip${p.maxSkips === 1 ? '' : 's'})   ` +
                `${shippedKeys.length} racks, ${Object.values(p.words).reduce((a, l) => a + l.length, 0)} words`);
    console.log(`     line   ${line}`);
    console.log(`     greedy dies at ${g.len} letters — chokes on queue[${g.deadAt}] ` +
                `"${g.deadLetter}" with 0 skips left`);
    if (fork) {
      console.log(`     trap   at queue[${fork.i}] "${fork.letter}": taking it (${fork.word}) ` +
                  `caps you at ${fork.takeVal}; skipping it keeps ${fork.skipVal} alive`);
    }
    console.log('');
  }

  scope = '[global] ';
  ok(trapCount === puzzles.length, 'every puzzle demonstrates the planning trap',
     `${trapCount}/${puzzles.length}`);

  console.log('='.repeat(66));
  if (failures.length) {
    console.log(`FAIL — ${failures.length} of ${checks} assertions failed:\n`);
    failures.forEach(f => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log(`PASS — ${checks} assertions across ${puzzles.length} puzzles.`);
  console.log('Every shipped rack is reachable, every shipped word is real, every');
  console.log('maximum is re-derived, every witness replays, and every puzzle');
  console.log('punishes greed. Ship it.');
}

main();
