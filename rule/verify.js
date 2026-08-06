#!/usr/bin/env node
/* ============================================================
   THE RULE — puzzle verifier.   run:  node rule/verify.js
   Asserts, for every shipped puzzle:
     1. every PASS starter satisfies the predicate
     2. every FAIL starter does not
     3. the call set is exactly 8 words with exactly 3 passers
     4. no word is duplicated inside a puzzle
     5. every word is plain A-Z uppercase
     6. FAIRNESS: every hand-written decoy hypothesis is classified —
          LIVE     consistent with all 6 opening starters, so a player
                   could reasonably hold it after seeing the board;
          REFUTED  the call set disagrees with it somewhere, so acting
                   on it busts you.
        Required: at least one LIVE + REFUTED decoy per puzzle (that is
        the check that separates a real puzzle from a trivial one), and
        ZERO decoys that are LIVE and survive the call set (that would
        mean a player with the wrong theory still wins).
        Decoys killed by the opening board itself are reported, not
        failed — they are evidence the six starters are pulling weight.
     7. every decoy is genuinely different from the true rule
     8. the reveal renderer ev() returns sane highlight indices
     9. predicates survive junk probes (empty, 1 letter, AAAA, 40 chars)
   ============================================================ */
'use strict';

var PUZZLES = require('./puzzles.js');

var fails = 0, checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { fails++; console.log('  FAIL  ' + msg); }
  return cond;
}

var JUNK = ['', 'A', 'AA', 'AAAA', 'ZZZZZZ', 'QQ', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'ZYXWVUTSRQPONMLKJIHGFEDCBA', 'XKCDQ', 'AEIOU', 'BCDFG',
            new Array(41).join('Q')];

console.log('THE RULE — verifying ' + PUZZLES.length + ' puzzles\n');

PUZZLES.forEach(function (p, idx) {
  console.log('#' + (idx + 1) + '  ' + p.id + '  —  "' + p.short + '"');

  /* ---- 5. shape of the data ---- */
  var all = p.pass.concat(p.fail, p.call);
  all.forEach(function (w) {
    ok(/^[A-Z]{3,}$/.test(w), p.id + ': "' + w + '" is not 3+ plain uppercase letters');
  });
  ok(p.pass.length === 3, p.id + ': needs exactly 3 PASS starters, has ' + p.pass.length);
  ok(p.fail.length === 3, p.id + ': needs exactly 3 FAIL starters, has ' + p.fail.length);
  ok(p.call.length === 8, p.id + ': call set must be 8 words, has ' + p.call.length);
  ok(typeof p.rule === 'string' && p.rule.length > 12, p.id + ': missing plain-English rule');
  ok(typeof p.detail === 'string' && p.detail.length > 12, p.id + ': missing reveal detail');

  /* ---- 4. no duplicates within a puzzle ---- */
  var seen = {};
  all.forEach(function (w) {
    ok(!seen[w], p.id + ': "' + w + '" appears twice in the same puzzle');
    seen[w] = 1;
  });

  /* ---- 1 & 2. starters classify correctly ---- */
  p.pass.forEach(function (w) { ok(p.pred(w) === true, p.id + ': PASS starter ' + w + ' does not pass'); });
  p.fail.forEach(function (w) { ok(p.pred(w) === false, p.id + ': FAIL starter ' + w + ' actually passes'); });

  /* ---- 3. call set holds exactly 3 passers ---- */
  var passers = p.call.filter(p.pred);
  ok(passers.length === 3, p.id + ': call set has ' + passers.length + ' passers, needs exactly 3');
  console.log('     answer: ' + passers.join(', '));

  /* ---- 6 & 7. the fairness check ---- */
  var live = 0;
  p.decoys.forEach(function (d) {
    var openers = p.pass.map(function (w) { return [w, true]; })
                  .concat(p.fail.map(function (w) { return [w, false]; }));
    var killedBy = openers.filter(function (r) { return !!d.fn(r[0]) !== r[1]; })
                          .map(function (r) { return r[0]; });
    var refutedBy = p.call.filter(function (w) { return !!d.fn(w) !== !!p.pred(w); });

    if (killedBy.length) {
      // the opening board already disproves this theory — good, the
      // starters are doing work. Report it, don't fail it.
      console.log('     decoy "' + d.label + '" is dead on arrival: ' + killedBy.join(', '));
    } else {
      // LIVE theory: the player can hold it all the way to the call.
      // The call set MUST punish it.
      ok(refutedBy.length > 0, p.id + ': LIVE decoy "' + d.label + '" survives the call set — ' +
         'a player holding this wrong theory would still pick correctly. Puzzle is too easy.');
      if (refutedBy.length) {
        live++;
        console.log('     LIVE decoy "' + d.label + '" busts on: ' + refutedBy.join(', '));
      }
    }

    // a decoy that agrees with the truth everywhere we test is not a decoy
    var differs = all.concat(JUNK).some(function (w) { return !!d.fn(w) !== !!p.pred(w); });
    ok(differs, p.id + ': decoy "' + d.label + '" is indistinguishable from the real rule');
  });
  ok(live >= 1, p.id + ': needs at least one decoy that is consistent with the opening board ' +
     'AND refuted by the call set');

  /* ---- 8. reveal renderer ---- */
  all.forEach(function (w) {
    var e = p.ev(w);
    ok(e && Array.isArray(e.hits) && typeof e.tag === 'string', p.id + ': ev("' + w + '") malformed');
    if (e && e.hits) e.hits.forEach(function (i) {
      ok(i >= 0 && i < w.length, p.id + ': ev("' + w + '") highlights out-of-range index ' + i);
    });
  });

  /* ---- 9. junk probes must not explode ---- */
  JUNK.forEach(function (w) {
    var r;
    try { r = p.pred(w); } catch (e) { r = 'THREW: ' + e.message; }
    ok(r === true || r === false, p.id + ': pred("' + w + '") returned ' + r);
    try { p.ev(w); } catch (e) { ok(false, p.id + ': ev("' + w + '") threw ' + e.message); }
  });

  console.log('');
});

/* ---- cross-puzzle sanity: ids unique, enough puzzles to rotate ---- */
var ids = {};
PUZZLES.forEach(function (p) {
  ok(!ids[p.id], 'duplicate puzzle id: ' + p.id);
  ids[p.id] = 1;
});
ok(PUZZLES.length >= 8, 'need at least 8 puzzles, have ' + PUZZLES.length);

console.log('----------------------------------------');
console.log(checks + ' checks, ' + fails + ' failures');
if (fails) { console.log('NOT SHIPPABLE'); process.exit(1); }
console.log('all good.');
