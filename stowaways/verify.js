#!/usr/bin/env node
/* ============================================================
   STOWAWAYS — puzzle verifier.   Run:  node verify.js
   ------------------------------------------------------------
   An unverified passage is a broken puzzle. This asserts, for
   every puzzle, every property the mechanic depends on:

     1  each hidden word occurs in the letters-only string
     2  it occurs EXACTLY ONCE (two occurrences = ambiguous tap)
     3  its letter range crosses at least one word boundary
     4  it is not a visible standalone word in the passage
     5  no two hidden words' ranges overlap
     6  the keystone is strictly the longest word and names the theme
     7  ids/clues unique, word list is 6 long, no duplicate words
     8  passage length stays inside the mobile budget

   Warnings (not failures) flag same-theme decoys that sneak into
   the letters-only string and would read as false positives.
   ============================================================ */
'use strict';

const path = require('path');

// puzzles.js is a browser file; give it a window to attach to.
global.window = global;
require(path.join(__dirname, 'puzzles.js'));
const PUZZLES = global.STOWAWAY_PUZZLES;

const MAX_LETTERS = 260;
const MIN_WORD = 4;

let failures = 0;
let warnings = 0;
const line = (s) => console.log(s);

function fail(pz, msg) {
  failures++;
  line(`   \x1b[31mFAIL\x1b[0m  [${pz.id}] ${msg}`);
}
function warn(pz, msg) {
  warnings++;
  line(`   \x1b[33mWARN\x1b[0m  [${pz.id}] ${msg}`);
}

/* Build the letters-only string plus, for every letter, which
   whitespace-delimited token of the original passage it came from. */
function index(text) {
  const letters = [];   // uppercase letters only
  const tokenOf = [];   // token number for each letter
  const charOf = [];    // original char offset for each letter
  let token = 0, inGap = true;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/\s/.test(c)) { inGap = true; continue; }
    if (inGap) { if (letters.length || charOf.length) token++; inGap = false; }
    if (/[A-Za-z]/.test(c)) {
      letters.push(c.toUpperCase());
      tokenOf.push(token);
      charOf.push(i);
    }
  }
  return { s: letters.join(''), tokenOf, charOf };
}

function allIndexes(hay, needle) {
  const out = [];
  let i = hay.indexOf(needle);
  while (i !== -1) { out.push(i); i = hay.indexOf(needle, i + 1); }
  return out;
}

/* Show the passage fragment a word hides in, with the stowaway
   in caps — this doubles as a proof-of-work readout. */
function fragment(text, ix, start, end) {
  const t0 = ix.tokenOf[start], t1 = ix.tokenOf[end];
  let from = ix.charOf[start], to = ix.charOf[end];
  // widen to whole tokens
  while (from > 0 && !/\s/.test(text[from - 1])) from--;
  while (to < text.length - 1 && !/\s/.test(text[to + 1])) to++;
  const a = ix.charOf[start], b = ix.charOf[end];
  return text.slice(from, a) +
         '[' + text.slice(a, b + 1).toUpperCase() + ']' +
         text.slice(b + 1, to + 1) +
         `  (${t1 - t0 + 1} words)`;
}

line('\n\x1b[1mSTOWAWAYS — puzzle verification\x1b[0m');
line('='.repeat(66));

if (!Array.isArray(PUZZLES) || PUZZLES.length < 6) {
  console.error('FAIL  need at least 6 puzzles, got ' + (PUZZLES || []).length);
  process.exit(1);
}

const seenIds = new Set();
const seenClues = new Set();

PUZZLES.forEach((pz, n) => {
  line(`\n#${n + 1}  \x1b[36m${pz.id}\x1b[0m — "${pz.clue}"  → ${pz.theme}`);

  if (seenIds.has(pz.id)) fail(pz, 'duplicate id');
  seenIds.add(pz.id);
  if (seenClues.has(pz.clue)) fail(pz, 'duplicate clue');
  seenClues.add(pz.clue);

  const ix = index(pz.text);
  const S = ix.s;
  line(`   letters: ${S.length}   tokens: ${ix.tokenOf[ix.tokenOf.length - 1] + 1}`);

  if (S.length > MAX_LETTERS) {
    fail(pz, `passage is ${S.length} letters, budget is ${MAX_LETTERS}`);
  }

  /* --- word list shape ------------------------------------------------ */
  if (pz.words.length !== 6) fail(pz, `expected 6 hidden words, got ${pz.words.length}`);
  if (new Set(pz.words).size !== pz.words.length) fail(pz, 'duplicate word in list');
  if (!pz.words.includes(pz.keystone)) fail(pz, 'keystone is not in the word list');
  if (pz.keystone !== pz.theme) fail(pz, `keystone "${pz.keystone}" does not name theme "${pz.theme}"`);
  pz.words.forEach(w => {
    if (!/^[A-Z]+$/.test(w)) fail(pz, `"${w}" must be A-Z uppercase`);
    if (w.length < MIN_WORD) fail(pz, `"${w}" is shorter than ${MIN_WORD} letters`);
    if (w !== pz.keystone && w.length >= pz.keystone.length) {
      fail(pz, `"${w}" (${w.length}) is not shorter than keystone "${pz.keystone}" (${pz.keystone.length})`);
    }
  });

  /* --- visible-word check --------------------------------------------- */
  const visible = pz.text.toUpperCase().split(/[^A-Z]+/).filter(Boolean);
  pz.words.forEach(w => {
    if (visible.includes(w)) fail(pz, `"${w}" appears as a plain visible word — that is free`);
  });

  /* --- locate each word ----------------------------------------------- */
  const ranges = [];
  pz.words.forEach(w => {
    const hits = allIndexes(S, w);

    if (hits.length === 0) { fail(pz, `"${w}" is NOT in the passage at all`); return; }
    if (hits.length > 1) {
      fail(pz, `"${w}" occurs ${hits.length} times (ambiguous) at ${hits.join(', ')}`);
      return;
    }

    const start = hits[0], end = start + w.length - 1;
    const spans = ix.tokenOf[end] - ix.tokenOf[start];
    if (spans < 1) {
      fail(pz, `"${w}" sits inside a single word of the passage — must cross a boundary`);
      return;
    }

    ranges.push({ w, start, end });
    const star = w === pz.keystone ? '\x1b[33m*\x1b[0m' : ' ';
    line(`   ${star} \x1b[32mok\x1b[0m  ${w.padEnd(10)} ${String(start).padStart(3)}-${String(end).padStart(3)}  ${fragment(pz.text, ix, start, end)}`);
  });

  /* --- overlap check --------------------------------------------------- */
  ranges.sort((a, b) => a.start - b.start);
  for (let i = 1; i < ranges.length; i++) {
    const p = ranges[i - 1], q = ranges[i];
    if (q.start <= p.end) {
      fail(pz, `"${p.w}" (${p.start}-${p.end}) overlaps "${q.w}" (${q.start}-${q.end})`);
    }
  }

  /* --- coverage / spread ---------------------------------------------- */
  if (ranges.length === 6) {
    const covered = ranges.reduce((a, r) => a + (r.end - r.start + 1), 0);
    const pct = Math.round(covered / S.length * 100);
    line(`   coverage: ${covered}/${S.length} letters (${pct}%)`);
    if (pct > 45) warn(pz, `${pct}% of the passage is stowaway — it will read as a puzzle, not prose`);
    const firstEnd = ranges[0].end, lastStart = ranges[5].start;
    if (firstEnd > S.length * 0.5) warn(pz, 'no hidden word in the first half of the passage');
    if (lastStart < S.length * 0.5) warn(pz, 'no hidden word in the second half of the passage');
  }

  /* --- decoy sweep (warnings) ------------------------------------------ */
  (pz.decoys || []).forEach(d => {
    const hits = allIndexes(S, d);
    hits.forEach(h => {
      const spans = ix.tokenOf[h + d.length - 1] - ix.tokenOf[h];
      if (spans >= 1) {
        warn(pz, `same-theme decoy "${d}" is hidden at ${h} and is NOT a target — false positive`);
      }
    });
  });
});

/* --- cross-puzzle: keep the set varied ---------------------------------- */
const themes = PUZZLES.map(p => p.theme);
if (new Set(themes).size !== themes.length) {
  failures++;
  line('\n   \x1b[31mFAIL\x1b[0m  duplicate theme across puzzles');
}

line('\n' + '='.repeat(66));
const totalWords = PUZZLES.reduce((a, p) => a + p.words.length, 0);
line(`${PUZZLES.length} puzzles · ${totalWords} hidden words checked`);
if (failures) {
  line(`\x1b[31m${failures} FAILURE(S)\x1b[0m, ${warnings} warning(s)\n`);
  process.exit(1);
}
line(`\x1b[32mALL PASS\x1b[0m — ${warnings} warning(s)\n`);
