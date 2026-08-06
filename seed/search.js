#!/usr/bin/env node
/* ============================================================================
   SEED — candidate search.       node search.js [--n 40]

   This is the front half of the content pipeline described in PITCH.md, made
   real so the claim can be checked rather than believed. It works backwards
   from the answer:

     1  pick a target word of length 9-11
     2  every 3-letter word that is a sub-multiset of it is a candidate seed
     3  the remaining letters are the SPINE — order them so that every prefix,
        taken in order, spells something (DFS, first ordering wins)
     4  pad the spine to 9 with POISON letters: letters that are legal and
        tempting to take right now but strand you later. Poison is the craft.
     5  solve it and keep it only if it passes every tuning criterion

   It prints candidates sorted by BRANCHING — the number of alternative words
   available across the reachable racks — because branching is what makes two
   players' chains differ, and thin puzzles (one rack, one word, one line) are
   the weakest thing we ship.
   ==========================================================================*/

'use strict';

const { loadIndex, solve, key, MAX_SKIPS } = require('./build.js');

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const QUEUE_LEN = 9;
const WANT = +(process.argv[process.argv.indexOf('--n') + 1] || 40);
const PER_TARGET = 2;                          // don't let one long word flood the list

/* The seed is the most-read word in the game — it sits at the top of the
   staircase all round and it goes in the share text. The 3-letter slice of any
   frequency-filtered lexicon is a swamp of abbreviations and proper-noun
   residue (OCA, NOA, ANS, AIT...), so seeds come from a hand-written list of
   words no one will argue with rather than from the lexicon. */
const GOOD_SEEDS = new Set(`
ACE ACT ADD AGE AID AIM AIR ALL AND ANT ANY APE ARC ARM ART ASH ASK ATE
BAD BAG BAN BAR BAT BAY BED BEE BEG BET BID BIG BIN BIT BOX BOY BUD BUG BUS BUT BUY
CAB CAN CAP CAR CAT COW CRY CUP CUT DAM DAY DEN DIE DIG DIM DIP DOG DOT DRY DUE DUG
EAR EAT EGG EGO ELF END ERA EVE EYE FAN FAR FAT FEE FEW FIG FIN FIT FIX FLY FOG FOR
FOX FUN FUR GAP GAS GEM GET GOD GUM GUN GUT HAM HAT HEN HER HID HIP HIS HIT HOG HOP
HOT HUG HUT ICE ILL INK INN ION IVY JAM JAR JAW JET JOB JOG JOY JUG KEY KID KIN KIT
LAB LAD LAG LAP LAW LAY LEG LID LIE LIP LIT LOG LOT LOW MAD MAN MAP MAT MEN MET MIX
MOB MOP MUD MUG NET NEW NOD NOR NOT NOW NUT OAK OAR OAT ODD OIL OLD ONE OUR OUT OWE
OWL OWN PAD PAN PAR PAT PAW PAY PEA PEG PEN PET PIE PIG PIN PIT POD POT PUB PUP PUT
RAG RAM RAN RAT RAW RAY RED RIB RID RIM RIP ROB ROD ROT ROW RUB RUG RUM RUN SAD SAT
SAW SAY SEA SET SEW SHE SHY SIN SIP SIR SIT SIX SKI SKY SON SOW SPY SUM SUN TAB TAG
TAN TAP TAR TAX TEA TEN TIE TIN TIP TOE TON TOP TOW TOY TUB TUG USE VAN VAT VET VOW
WAR WAS WAX WAY WEB WED WET WIG WIN WIT WOK WON YES YET ZIP ZOO
`.trim().split(/\s+/));

const sortU = s => s.toUpperCase().split('').sort().join('');
const sub = (a, b) => {                       // is multiset a inside multiset b?
  const c = {};
  for (const ch of b) c[ch] = (c[ch] || 0) + 1;
  for (const ch of a) { if (!c[ch]) return false; c[ch]--; }
  return true;
};
const minus = (b, a) => {                     // multiset b - a, as a sorted array
  const c = {};
  for (const ch of b) c[ch] = (c[ch] || 0) + 1;
  for (const ch of a) c[ch]--;
  const out = [];
  for (const ch of Object.keys(c).sort()) for (let i = 0; i < c[ch]; i++) out.push(ch);
  return out;
};

function main() {
  const index = loadIndex();

  // playable(rackKey) — does any real word use exactly these letters?
  const playable = k => index.has(key(k.toLowerCase()));

  // Index keys are lowercase sorted letters; everything downstream is upper.
  const byLen = new Map();
  const seedByKey = new Map();           // sorted 3 letters -> a real 3-letter word
  for (const [k, bucket] of index) {
    const L = k.length;
    const K = k.toUpperCase();
    if (!byLen.has(L)) byLen.set(L, []);
    byLen.get(L).push(K);
    if (L === 3) seedByKey.set(K, bucket.map(w => w.toUpperCase()).filter(w => GOOD_SEEDS.has(w)));
  }

  /* Every distinct 3-letter sub-multiset of a target that is itself a word. */
  function seedsIn(targetKey) {
    const L = targetKey.length, out = [], seen = new Set();
    for (let a = 0; a < L; a++) for (let b = a + 1; b < L; b++) for (let c = b + 1; c < L; c++) {
      const k = [targetKey[a], targetKey[b], targetKey[c]].sort().join('');
      if (seen.has(k)) continue;
      seen.add(k);
      for (const w of (seedByKey.get(k) || [])) out.push(w);
    }
    return out;
  }

  /* Order the spine so every prefix is playable. Returns one ordering or null. */
  function orderSpine(seedKey, spine) {
    const n = spine.length;
    const seen = new Set();
    function go(cur, remaining, acc) {
      if (!remaining.length) return acc;
      const tried = new Set();
      for (let i = 0; i < remaining.length; i++) {
        const ch = remaining[i];
        if (tried.has(ch)) continue;
        tried.add(ch);
        const nxt = sortU(cur + ch);
        if (!playable(nxt)) continue;
        const id = nxt + '|' + acc.length;
        if (seen.has(id)) continue;
        seen.add(id);
        const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));
        const got = go(nxt, rest, acc.concat(ch));
        if (got) return got;
      }
      return null;
    }
    return go(seedKey, spine, []);
  }

  /* Poison: a letter dropped in at position p that IS absorbable right there
     (so a greedy player takes it) but that costs them the target. */
  function poisonAt(seedKey, spine, p) {
    let rack = seedKey;
    for (let i = 0; i < p; i++) rack = sortU(rack + spine[i]);
    const out = [];
    for (const ch of ALPHA) {
      if (playable(sortU(rack + ch))) out.push(ch);   // tempting: it plays
    }
    return out;
  }

  const results = [];
  const targets = [];
  for (const L of [11, 10, 9]) for (const k of (byLen.get(L) || [])) targets.push(k);

  let tried = 0;
  outer:
  for (const target of targets) {
    let fromTarget = 0;
    for (const seed of seedsIn(target)) {
      if (fromTarget >= PER_TARGET) break;
      if (!sub(seed, target)) continue;
      const spine = minus(target, seed);
      if (spine.length > QUEUE_LEN - 1) continue;      // need room for >=1 poison
      const need = QUEUE_LEN - spine.length;           // poison letters required
      if (need < 1 || need > MAX_SKIPS) continue;

      const ordered = orderSpine(sortU(seed), spine);
      if (!ordered) continue;

      // Drop poison letters in. Try early positions first — an early fork is
      // the most memorable, a late one rewards sustained attention.
      pos:
      for (let p = 0; p <= Math.min(4, ordered.length); p++) {
        const cands = poisonAt(sortU(seed), ordered, p);
        for (const ch of cands) {
          if (need === 2 && ordered.length + 2 !== QUEUE_LEN) continue;
          let queue;
          if (need === 1) queue = ordered.slice(0, p).concat([ch], ordered.slice(p));
          else {
            const p2 = Math.min(p + 3, ordered.length);
            const c2 = poisonAt(sortU(seed), ordered, p2);
            if (!c2.length) continue;
            queue = ordered.slice(0, p).concat([ch], ordered.slice(p, p2), [c2[0]], ordered.slice(p2));
          }
          if (queue.length !== QUEUE_LEN) continue;

          tried++;
          let s;
          try { s = solve({ seed, queue: queue.join('') }, index); } catch (e) { continue; }

          if (s.max < 9 || s.max > 11) continue;
          if (!s.greedyDead) continue;                 // greed must actually die
          if (s.greedy >= s.max) continue;
          if (s.maxSkips > MAX_SKIPS) continue;
          const branching = s.wordCount - s.keyCount;  // spare words across racks
          if (branching < 8) continue;                 // thin puzzles are boring

          results.push({ seed, queue: queue.join(''), max: s.max, maxSkips: s.maxSkips,
                         greedy: s.greedy, branching, keys: s.keyCount, words: s.wordCount,
                         chain: s.chain.map(c => c.word) });
          fromTarget++;
          if (results.length >= WANT * 20) break outer;
          break pos;                              // one queue per (target, seed)
        }
      }
    }
  }

  results.sort((a, b) => b.branching - a.branching || b.max - a.max || a.greedy - b.greedy);
  const seenSeed = new Map();
  const picked = [];
  for (const r of results) {                          // spread the seeds out
    const c = seenSeed.get(r.seed) || 0;
    if (c >= 2) continue;
    seenSeed.set(r.seed, c + 1);
    picked.push(r);
    if (picked.length >= WANT) break;
  }

  console.log(`searched ${tried} candidates, ${results.length} passed, showing ${picked.length}\n`);
  for (const r of picked) {
    console.log(`{ seed: '${r.seed}', queue: '${r.queue}' },`.padEnd(42) +
      `// max ${r.max}/${r.maxSkips}sk  greedy ${r.greedy}  branch ${r.branching} ` +
      `(${r.keys} racks/${r.words} words)`);
    console.log(`      ${r.chain.join(' -> ')}`);
  }
}

if (require.main === module) main();
