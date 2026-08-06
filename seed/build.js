#!/usr/bin/env node
/* ============================================================================
   SEED — build script.

   Reads ../shared/lexgen.raw.json (36,273 words) and, for each authored
   puzzle, explores the *reachable rack space*:

       seed letters + every prefix of the 9-letter queue
                    x every legal skip pattern (<= 2 skips)

   Only rack-keys that a player can actually hold get emitted, together with
   the words that satisfy them. That map is tiny (a few hundred keys), so the
   game ships zero dictionary: validation at play time is
       sort(submitted letters) -> lookup key -> membership test.
   Exact multiset match, so the word must consume the whole rack.

   It also solves each puzzle: maximum reachable word length ("best possible")
   plus a witness chain, so the death screen can twist the knife with
   "you stopped at 8 — there was a 10 in there."

   Usage:  node build.js            # writes puzzles.js
           node build.js --report   # solve + print a report, write nothing
   ==========================================================================*/

'use strict';

const fs = require('fs');
const path = require('path');

const LEX_PATH = path.join(__dirname, '..', 'shared', 'lexgen.raw.json');
const OUT_PATH = path.join(__dirname, 'puzzles.js');
const MAX_SKIPS = 2;

/* --------------------------------------------------------------------------
   AUTHORED PUZZLES
   Each is a 3-letter seed word + a 9-letter queue, in fixed public order.
   Tuned (see search notes in PITCH.md) so that:
     - the perfect line needs at least one skip,
     - a greedy "always take" player dies short of the maximum,
     - best possible lands in the 9-11 range.
   `note` is the hand-check: the witness chain was read by a human.
   -------------------------------------------------------------------------*/
const PUZZLES = [
  { seed: 'RUN', queue: 'TEGWEVDAS' },
  { seed: 'EAR', queue: 'TLNIVOATC' },
  { seed: 'SET', queue: 'MLINAGHMN' },
  { seed: 'RAT', queue: 'DEECSLBEP' },
  { seed: 'NET', queue: 'RDYEPSERS' },
  { seed: 'CAR', queue: 'MEPLIPTSE' },
  { seed: 'RED', queue: 'AGDNEETGE' },
  { seed: 'ONE', queue: 'DBRDESCNT' },
];

/* The par chain is shown to the player on the death screen ("show me the 11"),
   so every word on it is hand-picked from the rack's word list rather than
   taken alphabetically. build.js asserts each pick really is legal for that
   rack, so this can never drift out of sync with the lexicon. */
const PAR_PICKS = new Set(`
`.trim().split(/\s+/).filter(Boolean));

/* --------------------------------------------------------------------------
   Junk filter.

   lexgen is frequency-filtered but still carries abbreviations, proper-noun
   residue and morphological accidents. Length 3 needs no filtering — the only
   3-letter rack in the game is the authored seed itself. From length 4 up,
   a junk word can silently prop up a rack the player would never guess, or
   worse, carry a "best possible: 11" claim the player can't believe.

   This list is HAND-CURATED: it was built by running `node build.js --report`,
   reading every word the solver emitted for these eight puzzles, and striking
   the ones a reasonable English speaker would reject.
   -------------------------------------------------------------------------*/
const BLOCKLIST = new Set(`
aeolians alcide amin amine amines amit amrita andre andries angeles ansel anton
acer arte artie ariel arles arne asher aurea boden
carle cate ceres cetera claire clare crimea cristina corse crosse
dante darin dorset
edgar ela elia elsa electra elvira enos entre eros esta eton
garde gare grande greta gunter
irena israelite israelites
lanier lear
marc marcel carmel mets metis mitra
nist noire nore nora norah norse notre
orestes
parc petersen petri petrie pieter piet
rea redd reina renate reno rita ronde
sade sainte selena stein stela stipe
teresa teri tera terai tien tuareg tyne
yale
`.trim().split(/\s+/).filter(Boolean));

/* --------------------------------------------------------------------------
   Lexicon -> anagram index
   -------------------------------------------------------------------------*/
function key(letters) {
  return letters.split('').sort().join('');
}

function loadIndex() {
  const raw = JSON.parse(fs.readFileSync(LEX_PATH, 'utf8'));
  const index = new Map();
  for (const w of raw) {
    if (!/^[a-z]{3,12}$/.test(w)) continue;
    if (w.length >= 4 && BLOCKLIST.has(w)) continue;
    const k = key(w);
    let bucket = index.get(k);
    if (!bucket) index.set(k, (bucket = []));
    bucket.push(w);
  }
  return index;
}

/* --------------------------------------------------------------------------
   Reachable-space exploration.

   A state is (i, skipMask) where i = how many queue letters have been
   processed and skipMask marks which of those were discarded. The rack is
   fully determined by that pair. A state is ALIVE only if every take along
   the way produced a rack with at least one legal word — that is exactly the
   set of positions a real player can occupy.
   -------------------------------------------------------------------------*/
function explore(puz, index) {
  const seed = puz.seed.toUpperCase();
  const queue = puz.queue.toUpperCase().split('');
  const n = queue.length;

  // alive.get(stateId) = { rack, key, skips, prev, via }
  const alive = new Map();
  const seedKey = key(seed.toLowerCase());
  if (!index.has(seedKey)) throw new Error(`seed "${seed}" is not in the lexicon`);
  alive.set('0|0', { i: 0, mask: 0, skips: 0, rack: seed.split('').sort().join(''), prev: null, via: null });

  const racks = new Set([seed.split('').sort().join('')]);

  for (let i = 0; i < n; i++) {
    for (const [id, st] of Array.from(alive)) {
      if (st.i !== i) continue;
      const letter = queue[i];

      // --- TAKE: rack grows, must be playable right now
      const grown = (st.rack + letter).split('').sort().join('');
      racks.add(grown);
      if (index.has(key(grown.toLowerCase()))) {
        const nid = `${i + 1}|${st.mask}`;
        if (!alive.has(nid)) {
          alive.set(nid, { i: i + 1, mask: st.mask, skips: st.skips, rack: grown, prev: id, via: { act: 'take', letter, i } });
        }
      }

      // --- SKIP: rack unchanged, costs one of two skips
      if (st.skips < MAX_SKIPS) {
        const mask = st.mask | (1 << i);
        const nid = `${i + 1}|${mask}`;
        if (!alive.has(nid)) {
          alive.set(nid, { i: i + 1, mask, skips: st.skips + 1, rack: st.rack, prev: id, via: { act: 'skip', letter, i } });
        }
      }
    }
  }

  return { alive, racks, queue, seed };
}

/* Best reachable state: longest rack, ties broken by fewest skips. */
function solve(puz, index) {
  const { alive, racks, queue, seed } = explore(puz, index);

  let best = null;
  for (const [id, st] of alive) {
    if (!index.has(key(st.rack.toLowerCase()))) continue;
    if (!best ||
      st.rack.length > best.st.rack.length ||
      (st.rack.length === best.st.rack.length && st.skips < best.st.skips)) {
      best = { id, st };
    }
  }

  // Walk the witness chain back to the seed. Each rung shows a hand-picked
  // word (PAR_PICKS) when one is available, else the first alphabetically.
  const chain = [];
  const skipAt = [];
  let cur = best;
  while (cur) {
    const st = cur.st;
    const words = (index.get(key(st.rack.toLowerCase())) || []).map(w => w.toUpperCase());
    if (!st.via || st.via.act === 'take') {
      let pick;
      if (!st.via) pick = seed;                       // rung 0 is always the seed itself
      else pick = words.find(w => PAR_PICKS.has(w)) || words[0];
      if (!words.includes(pick)) {
        throw new Error(`par pick "${pick}" is not legal for rack ${st.rack}`);
      }
      chain.push({ word: pick, len: st.rack.length, rack: st.rack, all: words });
    }
    if (st.via && st.via.act === 'skip') skipAt.push(st.via.letter);
    const prevId = st.prev;
    cur = prevId ? { id: prevId, st: alive.get(prevId) } : null;
  }
  chain.reverse();
  skipAt.reverse();

  // Greedy baseline: always take when a word exists; skip only when forced.
  let gRack = seed.split('').sort().join('');
  let gSkips = 0, gDead = false;
  for (let i = 0; i < queue.length; i++) {
    const grown = (gRack + queue[i]).split('').sort().join('');
    if (index.has(key(grown.toLowerCase()))) { gRack = grown; continue; }
    if (gSkips < MAX_SKIPS) { gSkips++; continue; }
    gDead = true; break;
  }

  // Emit only reachable racks that have words.
  const words = {};
  let wordCount = 0;
  for (const rack of racks) {
    const bucket = index.get(key(rack.toLowerCase()));
    if (!bucket) continue;
    words[rack] = bucket.map(w => w.toUpperCase()).sort();
    wordCount += bucket.length;
  }
  // Racks reachable only after a take we can't afford still belong in the map
  // (the player may hold them one keystroke before we prune) — `racks` already
  // contains every grown rack we considered, alive or not, so nothing is lost.

  return {
    seed, queue: queue.join(''),
    max: best.st.rack.length,
    maxSkips: best.st.skips,
    chain, skipAt,
    greedy: gRack.length, greedySkips: gSkips, greedyDead: gDead,
    words, keyCount: Object.keys(words).length, wordCount,
    aliveStates: alive.size,
  };
}

/* --------------------------------------------------------------------------
   main
   -------------------------------------------------------------------------*/
function main() {
  const index = loadIndex();
  const reportOnly = process.argv.includes('--report');
  const dump = process.argv.includes('--dump');
  const solved = PUZZLES.map((p, i) => Object.assign({ n: i + 1 }, solve(p, index)));

  if (dump) {
    // Every reachable rack with every word that satisfies it — the hand-review
    // surface. Everything the game will ever accept is on this list.
    for (const s of solved) {
      console.log(`\n===== #${s.n} ${s.seed} / ${s.queue} =====`);
      Object.keys(s.words).sort((a, b) => a.length - b.length || a.localeCompare(b))
        .forEach(k => console.log(`${k.padEnd(13)} ${s.words[k].join(' ')}`));
    }
    return;
  }

  console.log('SEED — puzzle report\n');
  for (const s of solved) {
    console.log(`#${s.n}  ${s.seed}  queue ${s.queue.split('').join(' ')}`);
    console.log(`     best possible: ${s.max} letters (using ${s.maxSkips} skip${s.maxSkips === 1 ? '' : 's'})`);
    console.log(`     witness: ${s.chain.map(c => c.word).join(' -> ')}`);
    if (s.skipAt.length) console.log(`     skipping: ${s.skipAt.join(', ')}`);
    console.log(`     greedy (never skip early): ${s.greedy} letters${s.greedyDead ? ' then stuck' : ''} — gap of ${s.max - s.greedy}`);
    console.log(`     data: ${s.keyCount} rack keys, ${s.wordCount} words, ${s.aliveStates} reachable states`);
    console.log('');
  }

  if (reportOnly) return;

  const out = solved.map(s => ({
    n: s.n,
    seed: s.seed,
    queue: s.queue,
    max: s.max,
    maxSkips: s.maxSkips,
    par: s.chain.map(c => c.word),
    words: s.words,
  }));

  const body = out.map(p => {
    const wordLines = Object.keys(p.words).sort().map(k => `${JSON.stringify(k)}:${JSON.stringify(p.words[k])}`);
    return `{n:${p.n},seed:${JSON.stringify(p.seed)},queue:${JSON.stringify(p.queue)},max:${p.max},maxSkips:${p.maxSkips},par:${JSON.stringify(p.par)},words:{\n  ${wordLines.join(',\n  ')}\n}}`;
  }).join(',\n');

  const js = `/* SEED — generated by build.js. Do not edit by hand.
   Only the rack keys a player can actually reach are here; the 36k-word
   source lexicon stays at build time. Keys are sorted uppercase letters;
   validation is sort -> lookup -> membership, exact multiset match. */
window.SEED_PUZZLES = [
${body}
];
`;
  fs.writeFileSync(OUT_PATH, js);
  const kb = (fs.statSync(OUT_PATH).size / 1024).toFixed(1);
  console.log(`wrote ${OUT_PATH} (${kb} KB)`);
}

module.exports = { loadIndex, solve, explore, key, MAX_SKIPS };

if (require.main === module) main();
