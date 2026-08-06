/* ============================================================
   THE RULE — puzzle data
   Every puzzle is a PREDICATE, so any string a player types can be
   judged instantly. Zero lexicon, zero data dependencies.

   Each puzzle ships:
     pred(w)    -> boolean, the hidden rule (w is A-Z uppercase)
     rule       -> plain-English reveal
     detail     -> the "oh, of COURSE" line
     pass/fail  -> 3 + 3 opening evidence, chosen to be ambiguous
     call       -> 8 candidates containing exactly 3 passers,
                   the 5 failers being near-misses
     decoys     -> plausible WRONG hypotheses that survive the opening
                   evidence and get refuted by the call set (verify.js
                   asserts this; it is what makes the puzzle non-trivial)
     ev(w)      -> {hits:[letter indices to highlight], tag:'why'}
                   used by the reveal screen

   Loadable in the browser (window.PUZZLES) and in node (module.exports)
   so verify.js tests exactly what ships.
   ============================================================ */
(function (root, factory) {
  var P = factory();
  if (typeof module === 'object' && module.exports) module.exports = P;
  else root.PUZZLES = P;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- shared helpers ---------- */
  var VOWELS = 'AEIOU';
  var TOPROW = 'QWERTYUIOP';
  var LEFTHAND = 'QWERTASDFGZXCVB';

  var ANIMALS = [
    'ELEPHANT', 'HAMSTER', 'GIRAFFE', 'DONKEY', 'MONKEY', 'RABBIT', 'BEAVER',
    'FERRET', 'WEASEL', 'BADGER', 'TURTLE', 'SALMON', 'OYSTER', 'SPIDER',
    'HORSE', 'SHEEP', 'MOUSE', 'SNAKE', 'TIGER', 'ZEBRA', 'CAMEL', 'KOALA',
    'LLAMA', 'MOOSE', 'RAVEN', 'ROBIN', 'SHARK', 'SLOTH', 'WHALE', 'GOOSE',
    'SKUNK', 'STOAT', 'TROUT', 'BISON', 'OTTER', 'HYENA', 'LEMUR', 'PUPPY',
    'BEAR', 'BOAR', 'CRAB', 'CROW', 'DEER', 'DOVE', 'DUCK', 'FROG', 'GOAT',
    'HARE', 'HAWK', 'LAMB', 'LION', 'MOLE', 'MOTH', 'MULE', 'NEWT', 'PONY',
    'PUMA', 'SEAL', 'SWAN', 'TOAD', 'WASP', 'WOLF', 'WORM', 'FOAL', 'CALF',
    'ANT', 'APE', 'BAT', 'BEE', 'CAT', 'COW', 'DOG', 'ELK', 'FOX', 'HEN',
    'OWL', 'PIG', 'RAT', 'EEL', 'RAM', 'SOW', 'CUB', 'PUP'
  ];

  var PARTS = [
    'KNUCKLE', 'SHOULDER', 'STOMACH', 'KIDNEY', 'TONGUE', 'THROAT', 'FINGER',
    'ELBOW', 'ANKLE', 'WRIST', 'CHEST', 'SKULL', 'SPINE', 'THIGH', 'LIVER',
    'THUMB', 'HEART', 'BRAIN', 'SHIN', 'CHIN', 'HEEL', 'KNEE', 'NECK', 'LUNG',
    'HAND', 'FOOT', 'HEAD', 'HAIR', 'SKIN', 'NOSE', 'PALM', 'BACK',
    'EAR', 'EYE', 'HIP', 'RIB', 'ARM', 'LEG', 'LIP', 'JAW', 'GUM', 'TOE'
  ];

  var NUMBERS = [
    'SEVENTEEN', 'THIRTEEN', 'FOURTEEN', 'NINETEEN', 'EIGHTEEN', 'FIFTEEN',
    'SIXTEEN', 'TWELVE', 'ELEVEN', 'TWENTY', 'THIRTY', 'EIGHTY', 'NINETY',
    'SEVEN', 'EIGHT', 'THREE', 'FORTY', 'FIFTY', 'SIXTY', 'FOUR', 'FIVE',
    'NINE', 'ZERO', 'ONE', 'TWO', 'SIX', 'TEN'
  ];

  // longest match first, so BEARD reads as BEAR (not EAR-nothing) and
  // SEVENTEEN reads as SEVENTEEN (not SEVEN)
  function byLen(list) { return list.slice().sort(function (a, b) { return b.length - a.length; }); }
  var A_SORTED = byLen(ANIMALS), P_SORTED = byLen(PARTS), N_SORTED = byLen(NUMBERS);

  function findIn(list) {
    return function (w) {
      for (var i = 0; i < list.length; i++) {
        var at = w.indexOf(list[i]);
        if (at >= 0) return { sub: list[i], at: at };
      }
      return null;
    };
  }
  var findAnimal = findIn(A_SORTED), findPart = findIn(P_SORTED), findNum = findIn(N_SORTED);

  function range(at, len) { var a = []; for (var i = 0; i < len; i++) a.push(at + i); return a; }

  // evidence renderer for the three "hidden word" puzzles
  function hiddenEv(finder) {
    return function (w) {
      var f = finder(w);
      return f ? { hits: range(f.at, f.sub.length), tag: f.sub }
               : { hits: [], tag: 'nothing hiding' };
    };
  }

  function onlyFrom(set) {
    return function (w) {
      for (var i = 0; i < w.length; i++) if (set.indexOf(w[i]) < 0) return false;
      return w.length > 0;
    };
  }
  function strayEv(set, label) {
    return function (w) {
      var hits = [], stray = '';
      for (var i = 0; i < w.length; i++) {
        if (set.indexOf(w[i]) < 0) { hits.push(i); if (stray.indexOf(w[i]) < 0) stray += w[i]; }
      }
      return hits.length ? { hits: hits, tag: stray.split('').join(' ') + ' — off limits' }
                         : { hits: [], tag: label };
    };
  }

  function nonDecreasing(w) {
    for (var i = 1; i < w.length; i++) if (w[i] < w[i - 1]) return false;
    return w.length > 0;
  }
  function strictlyIncreasing(w) {
    for (var i = 1; i < w.length; i++) if (w[i] <= w[i - 1]) return false;
    return w.length > 0;
  }
  function doubleAt(w) {
    for (var i = 1; i < w.length; i++) if (w[i] === w[i - 1]) return i - 1;
    return -1;
  }
  function counts(w) {
    var c = {};
    for (var i = 0; i < w.length; i++) c[w[i]] = (c[w[i]] || 0) + 1;
    return c;
  }
  function isIsogram(w) {
    var c = counts(w);
    for (var k in c) if (c[k] > 1) return false;
    return w.length > 0;
  }
  function vowelsOf(w) { return w.split('').filter(function (ch) { return VOWELS.indexOf(ch) >= 0; }); }
  function distinctVowels(w) {
    var s = {}, v = vowelsOf(w);
    v.forEach(function (ch) { s[ch] = 1; });
    return Object.keys(s);
  }

  /* ---------- the puzzles ---------- */
  var PUZZLES = [

    /* ---------------------------------------------------------- 1 */
    {
      id: 'twins',
      rule: 'The word contains a doubled letter — the same letter twice in a row.',
      detail: 'vacUUm. agREE. shuFFle. Vowels count too, which is where most people fall over.',
      short: 'double letter',
      pred: function (w) { return doubleAt(w) >= 0; },
      pass: ['COMMIT', 'ADDRESS', 'BALLOT'],
      fail: ['BANANA', 'MONITOR', 'SEVERE'],
      call: ['VACUUM', 'AGREE', 'SHUFFLE', 'MEMENTO', 'TITANIC', 'ONIONS', 'HAZARD', 'ALFALFA'],
      decoys: [
        { label: 'a doubled CONSONANT', fn: function (w) { var i = doubleAt(w); return i >= 0 && VOWELS.indexOf(w[i]) < 0; } },
        { label: 'at least six letters with a repeat somewhere', fn: function (w) { return w.length >= 6 && !isIsogram(w); } }
      ],
      ev: function (w) {
        var i = doubleAt(w);
        return i >= 0 ? { hits: [i, i + 1], tag: w[i] + w[i] } : { hits: [], tag: 'no twins' };
      }
    },

    /* ---------------------------------------------------------- 2 */
    {
      id: 'menagerie',
      rule: 'An animal is hiding inside the word.',
      detail: 'bEARd. cRATe. sPIGot. Once you see them you cannot unsee them.',
      short: 'hidden animal',
      pred: function (w) { return !!findAnimal(w); },
      pass: ['BEARD', 'CRATE', 'SPIGOT'],
      fail: ['BLADE', 'THRONE', 'GARNET'],
      call: ['SCOWL', 'VACANT', 'MOTHER', 'TOWER', 'BEACON', 'CHARIOT', 'TRAWLER', 'MEADOW'],
      decoys: [
        { label: 'a hidden MAMMAL', fn: function (w) { var f = findAnimal(w); return !!f && ['BEAR', 'RAT', 'PIG', 'COW', 'DOG', 'CAT', 'FOX', 'MOLE', 'MULE', 'HARE', 'LAMB', 'LION', 'BOAR', 'DEER', 'GOAT', 'PONY', 'SEAL', 'WOLF', 'HORSE', 'MOUSE', 'TIGER', 'ZEBRA', 'CAMEL', 'MOOSE', 'SHEEP'].indexOf(f.sub) >= 0; } },
        { label: 'a hidden animal starting at the second letter', fn: function (w) { var f = findAnimal(w); return !!f && f.at === 1; } },
        { label: 'a hidden three-letter animal', fn: function (w) { var f = findAnimal(w); return !!f && f.sub.length === 3; } }
      ],
      ev: hiddenEv(findAnimal)
    },

    /* ---------------------------------------------------------- 3 */
    {
      id: 'bookends',
      rule: 'The word starts and ends with the same letter.',
      detail: 'Level. Depend. Serious. TormenT. Every failing word had a repeat somewhere — just not at both ends.',
      short: 'first letter = last letter',
      pred: function (w) { return w.length > 1 && w[0] === w[w.length - 1]; },
      pass: ['LEVEL', 'DEPEND', 'SERIOUS'],
      fail: ['DENIAL', 'MOISTEN', 'PARSLEY'],
      call: ['TORMENT', 'ANTENNA', 'SPARKS', 'LADDER', 'BALLOON', 'MIRROR', 'TATTOO', 'LEVELS'],
      decoys: [
        { label: 'any repeated letter', fn: function (w) { return !isIsogram(w); } },
        { label: 'a doubled letter', fn: function (w) { return doubleAt(w) >= 0; } }
      ],
      ev: function (w) {
        if (w.length < 2) return { hits: [], tag: 'too short' };
        return { hits: [0, w.length - 1], tag: w[0] + ' … ' + w[w.length - 1] };
      }
    },

    /* ---------------------------------------------------------- 4 */
    {
      id: 'topshelf',
      rule: 'Every letter lives on the top row of the keyboard: Q W E R T Y U I O P.',
      detail: 'TYPEWRITER is the famous one. PIROUETTE, TERRITORY, PEWTER — all typed without your fingers ever leaving the top row.',
      short: 'top keyboard row only',
      pred: onlyFrom(TOPROW),
      pass: ['POTTERY', 'REPORT', 'QUIET'],
      fail: ['PROTEST', 'PARROT', 'REVOLT'],
      call: ['PEWTER', 'TIPTOE', 'TERRITORY', 'TREMOR', 'PROVEN', 'POTTERS', 'PORTRAY', 'TERRIFY'],
      decoys: [
        { label: 'no letters from the home row (ASDFGHJKL)', fn: onlyFrom('QWERTYUIOPZXCVBNM') },
        { label: 'no A and no S', fn: function (w) { return w.indexOf('A') < 0 && w.indexOf('S') < 0 && w.length > 0; } }
      ],
      ev: strayEv(TOPROW, 'all top row')
    },

    /* ---------------------------------------------------------- 5 */
    {
      id: 'countem',
      rule: 'A number is hiding inside the word.',
      detail: 'neTWOrk. caNINE. wEIGHT. lisTEN. Not just the numbers you happened to spot first.',
      short: 'hidden number',
      pred: function (w) { return !!findNum(w); },
      pass: ['NETWORK', 'CANINE', 'WEIGHT'],
      fail: ['NETTLE', 'CANDID', 'WREATH'],
      call: ['LISTEN', 'ATONE', 'FREIGHT', 'LISTED', 'ATOMIC', 'FRIGHT', 'MACHINE', 'CANOPY'],
      decoys: [
        { label: 'a hidden TWO, NINE or EIGHT — the three you saw', fn: function (w) { return /TWO|NINE|EIGHT/.test(w); } },
        { label: 'a hidden number of four letters or more', fn: function (w) { var f = findNum(w); return !!f && f.sub.length >= 4; } }
      ],
      ev: hiddenEv(findNum)
    },

    /* ---------------------------------------------------------- 6 */
    {
      id: 'inorder',
      rule: 'The letters run in alphabetical order from front to back.',
      detail: 'A-L-M-O-S-T. E-M-P-T-Y. And repeats are fine: bi-L-L-owy, a-C-C-ent. Nothing ever steps backwards.',
      short: 'letters in alphabetical order',
      pred: nonDecreasing,
      pass: ['ALMOST', 'DIRTY', 'GHOST'],
      fail: ['BEHIND', 'CRISP', 'MOIST'],
      call: ['BILLOWY', 'ACCENT', 'EMPTY', 'ADMITS', 'BEHOLD', 'CHOSEN', 'EMPTIER', 'BILLOWS'],
      decoys: [
        { label: 'strictly ascending — no letter may repeat', fn: strictlyIncreasing },
        { label: 'every letter is different', fn: isIsogram }
      ],
      ev: function (w) {
        for (var i = 1; i < w.length; i++) {
          if (w[i] < w[i - 1]) return { hits: [i - 1, i], tag: w[i - 1] + ' → ' + w[i] + ' steps back' };
        }
        return { hits: [], tag: 'A → Z, no going back' };
      }
    },

    /* ---------------------------------------------------------- 7 */
    {
      id: 'allnew',
      rule: 'No letter is used twice. Every letter in the word is different.',
      detail: 'DIALOGUE, FLAMINGO, JUKEBOX — not one letter repeats. CANNON and TRACTOR look innocent until you count the consonants.',
      short: 'no repeated letters',
      pred: isIsogram,
      pass: ['DIALOGUE', 'PROBLEM', 'HUSTLE'],
      fail: ['DIAGRAM', 'ELEPHANT', 'PENDULUM'],
      call: ['FLAMINGO', 'JUKEBOX', 'CUSTARD', 'CANNON', 'TRACTOR', 'SPARROW', 'PUMPKIN', 'BASKETS'],
      decoys: [
        { label: 'no repeated VOWEL', fn: function (w) { return distinctVowels(w).length === vowelsOf(w).length && w.length > 0; } },
        { label: 'no doubled letter', fn: function (w) { return doubleAt(w) < 0 && w.length > 0; } }
      ],
      ev: function (w) {
        var c = counts(w), hits = [], reps = '';
        for (var i = 0; i < w.length; i++) if (c[w[i]] > 1) { hits.push(i); if (reps.indexOf(w[i]) < 0) reps += w[i]; }
        return hits.length ? { hits: hits, tag: reps.split('').join(' ') + ' used twice' }
                           : { hits: [], tag: 'all different' };
      }
    },

    /* ---------------------------------------------------------- 8 */
    {
      id: 'anatomy',
      rule: 'A body part is hiding inside the word.',
      detail: 'chARMing. sHINgle. scRIBble. whIPlash — no wait, wHIPlash. There it is.',
      short: 'hidden body part',
      pred: function (w) { return !!findPart(w); },
      pass: ['CHARMING', 'SHINGLE', 'SCRIBBLE'],
      fail: ['CHAMPION', 'SHUTTLE', 'STUBBLE'],
      call: ['WHIPLASH', 'RESEARCH', 'FLIPPANT', 'WHIRLPOOL', 'RESOURCE', 'FLAGRANT', 'SHAMPOO', 'CLAMBER'],
      decoys: [
        { label: 'a hidden BONE or limb — arm, shin, rib, hip, knee…', fn: function (w) { var f = findPart(w); return !!f && ['SKULL', 'SPINE', 'THIGH', 'ELBOW', 'ANKLE', 'WRIST', 'CHEST', 'SHIN', 'KNEE', 'HEEL', 'THUMB', 'ARM', 'LEG', 'RIB', 'HIP', 'JAW'].indexOf(f.sub) >= 0; } },
        { label: 'a hidden ARM, SHIN or RIB — the three you saw', fn: function (w) { return /ARM|SHIN|RIB/.test(w); } },
        { label: 'a hidden animal', fn: function (w) { return !!findAnimal(w); } }
      ],
      ev: hiddenEv(findPart)
    },

    /* ---------------------------------------------------------- 9 */
    {
      id: 'monotone',
      rule: 'Only ONE vowel is used — and it is used more than once. (Y does not count.)',
      detail: 'hUmdrUm. mIsfIts. prOtOcOl. bANANA. One vowel, on repeat. SPLASH gets close and fails: one A, only once.',
      short: 'one vowel, used twice or more',
      pred: function (w) { return distinctVowels(w).length === 1 && vowelsOf(w).length >= 2; },
      pass: ['LEGEND', 'MONSOON', 'BANANA'],
      fail: ['LEGION', 'MONSTER', 'BANDIT'],
      call: ['HUMDRUM', 'MISFITS', 'PROTOCOL', 'SPLASH', 'STRENGTH', 'SHRIMP', 'THRUST', 'PROTEIN'],
      decoys: [
        { label: 'only one KIND of vowel (however many times)', fn: function (w) { return distinctVowels(w).length === 1; } },
        { label: 'no I and no U', fn: function (w) { return w.indexOf('I') < 0 && w.indexOf('U') < 0 && w.length > 0; } }
      ],
      ev: function (w) {
        var hits = [], seen = [];
        for (var i = 0; i < w.length; i++) {
          if (VOWELS.indexOf(w[i]) >= 0) { hits.push(i); seen.push(w[i]); }
        }
        if (!seen.length) return { hits: [], tag: 'no vowels at all' };
        return { hits: hits, tag: seen.join(' · ') };
      }
    },

    /* ---------------------------------------------------------- 10 */
    {
      id: 'southpaw',
      rule: 'The whole word is typed with your LEFT hand: Q W E R T / A S D F G / Z X C V B.',
      detail: 'STEWARDESSES is the long one — twelve letters, one hand, never crossing the middle of the keyboard.',
      short: 'left hand only',
      pred: onlyFrom(LEFTHAND),
      pass: ['STEWARDS', 'CABBAGE', 'REVERSE'],
      fail: ['CARPETS', 'REVENUE', 'CABINET'],
      call: ['STEWARDESSES', 'AFTERWARDS', 'EXCESS', 'AFTERWORD', 'EXCESSIVE', 'CHEATERS', 'DECAYED', 'DEBACLE'],
      decoys: [
        { label: 'no I, N, U or P — the letters the losers had', fn: function (w) { return !/[INUP]/.test(w) && w.length > 0; } },
        { label: 'only A and E for vowels', fn: function (w) { return !/[IOU]/.test(w) && w.length > 0; } }
      ],
      ev: strayEv(LEFTHAND, 'all left hand')
    }
  ];

  PUZZLES.helpers = {
    VOWELS: VOWELS, TOPROW: TOPROW, LEFTHAND: LEFTHAND,
    ANIMALS: ANIMALS, PARTS: PARTS, NUMBERS: NUMBERS,
    isIsogram: isIsogram, doubleAt: doubleAt, nonDecreasing: nonDecreasing
  };

  return PUZZLES;
});
