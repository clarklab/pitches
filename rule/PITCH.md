# THE RULE — a daily word game where you're not guessing a word, you're guessing the law that governs it

## The 10-second pitch

Six words. Three obey a hidden rule, three break it. That's all you get.

You have six **probes**: type *any* string of letters — a real word, or
deliberate nonsense — and the lab instantly stamps it ✅ or ❌. When you think
you've got it, you **CALL IT**: eight fresh words appear and you tap the exactly
three that follow the rule.

You get one call. Your score is how many probes you spent. Calling on two is a
flex. Calling on zero is a legend. Getting it wrong is a public execution.

Then comes the reveal — *"every word had an animal hiding in it"* — with all
your evidence re-sorted so the answer is humiliatingly obvious in hindsight.

That reveal is the product. Everything else is the setup for it.

---

## How it plays

**The board.**

```
✅ FOLLOWS THE RULE        ❌ BREAKS IT
   BEARD                      BLADE
   CRATE                      THRONE
   SPIGOT                     GARNET
```

Six words, deliberately chosen so nothing jumps out. Same rough lengths, same
letter families, no freebies. GARNET and CRATE are cousins. One passes.

**A worked example — a real player cracking case #2.**

> *"BEARD, CRATE, SPIGOT pass. BLADE, THRONE, GARNET fail. All six letters-ish,
> nothing obvious. BEARD and BLADE both start with B, so it's not the first
> letter."*
>
> **Probe 1: `AAAA`** → ❌
> *"Right, so it's not just 'contains a vowel' or anything that cheap. And
> repeated letters alone don't do it."*
>
> **Probe 2: `CRATER`** → ✅
> *"Interesting — CRATE passes and CRATER still passes, so it's not about how
> the word ends. Whatever it is, it survives adding a letter. It's something
> **inside** the word."*
>
> **Probe 3: `RATE`** → ✅
> *"RATE passes. CRATE passes. GARNET fails. RAT… wait."*
> *"BEARD — BEAR. SPIGOT — PIG. Oh, come ON."*
>
> **Probe 4: `TOWER`** → ❌
> *"No animal in TOWER. Consistent."*
>
> **CALL IT on 4.** Eight new words:
>
> ```
> BEACON   CHARIOT   MOTHER   TOWER
> TRAWLER  SCOWL     VACANT   MEADOW
> ```
>
> *"MOTHER has MOTH. VACANT has ANT. SCOWL has… OWL. And COW, actually.
> BEACON looks like BEAR but isn't. TRAWLER — RAW, AWL, no. CHARIOT, nothing."*
>
> **MOTHER, VACANT, SCOWL.** ✅✅✅
>
> **CRACKED IT on 4 probes.**

Note what happened there. The player's *first* real hypothesis was almost
certainly "hidden **mammal**" — BEAR, RAT, PIG are all mammals, and that theory
survives the entire opening board. The call set is built to kill it: not one of
the three answers is a mammal. A sloppy hypothesis gets you to the call screen
feeling confident and then destroys you. That's not an accident, it's the
authoring standard — and `verify.js` mechanically enforces it for all ten
puzzles.

**Nonsense probes are the good stuff.** Typing `AAAA` to test "does it need a
double letter?" is the single most satisfying move in the game, and it's the
move that teaches players what the game actually is. It's not Wordle with extra
steps — it's a bench experiment. Because every puzzle is a JS predicate rather
than a word list, the game can judge literally any string a player types. No
lexicon, no "not in word list" rejection, no dead end. You are never told your
input was invalid. That single property is what makes the loop feel like
science instead of vocabulary.

---

## The daily hook

One rule per day, rotating by local date, same for everyone. It runs about 90
seconds — 60 if you're sharp — which is exactly the length of a habit.

The hook isn't "did you solve it," because most people will. **The hook is your
number.** Wordle gives you a 1-in-6; The Rule gives you a 0-in-6, and the
distribution is much wider because probes are voluntary. Two people who both
solved it did not have the same day. "Cracked it in 1" is a genuinely different
morning to "squeaked it on 6," and both of those are different again from the
person who called it cold on zero and got vaporised.

Because the score is *self-imposed risk* rather than luck, the daily
conversation is about nerve, not vocabulary. That's a better conversation, and
it's one that repeats forever.

The nightly reset matters too: today's rule is a category of thought
("something is hiding inside the word") and tomorrow's is a different one
("the letters are in alphabetical order"). You never get to grind a strategy.
Every day you start from nothing, which keeps day 300 as fresh as day 3.

---

## Why it goes viral

**1. The rule reveal is inherently quotable — it's a *fact*, not a score.**

Wordle's answer is CRANE. There is nothing to say about CRANE. The Rule's
answer is *"every one of those words had a body part hidden in it — chARMing,
sHINgle, scRIBble, whIPlash"* — and that is a thing a person will say out loud
to someone in the room. The reveal screen is engineered for that moment: the
plain-English rule in big serif, then all fifteen words from the day re-sorted
into ✅ and ❌ with the hidden fragment highlighted in accent purple. It is a
screenshot with a punchline. Nobody screenshots a Wordle grid to explain
*something*; people screenshot this one to make someone else feel the click.

That's the rarest property in a daily game: **it produces content that is
interesting to people who did not play.** A Wordle grid is meaningless to a
non-player. "TYPEWRITER is the longest common word typed entirely on the top
row of a keyboard" is interesting to everyone, forever. The game is a delivery
mechanism for a fun fact, and fun facts have always travelled.

**2. "Cracked it in 2" is a pure flex with no luck defence.**

In Wordle you can protest that you got a bad start word. Here, there is nothing
to blame. Every player saw the same six words. If you called it on two and I
called it on five, you out-thought me, full stop. The score is a direct,
unambiguous measure of how fast a brain moved — and that is exactly the kind of
number people post.

It also creates a *deliberate risk ladder*, which is what actually generates
posts. Calling early isn't just faster, it's braver. Once you know your friend
called it on 3, calling on 4 feels like cowardice. Players will start calling
early **specifically to have something to post**, which means the game
manufactures its own drama, daily, without any live opponent or leaderboard.

**3. A bust is the most shareable failure in games.**

Losing Wordle is a slow, dull suffocation — six greying rows and a shrug.
Losing here is a **guillotine**. You committed. You looked at eight words, you
picked three, you locked it in, and one of them was wrong. `💀 BUSTED · 2/3 on
1 probe` is a *story* — it says "I was arrogant and I paid" in twelve
characters. People post that faster than they post wins, because it's funnier
and it invites a reply. Every bust is bait: someone will absolutely respond
"lol I got it in 2."

And the bust is always a near miss by construction. You never get 0 of 3 —
you'd have to actively try. The overwhelmingly common failure is 2 of 3: one
near-miss word that punished a hypothesis that was *nearly* right. That is the
"I was SO close" feeling, delivered with a hard edge, and it is the single most
reliable engine of shares in the entire genre.

**4. The mechanic is explainable in one sentence, which is how things spread.**

"There's a hidden rule, you get six guesses to test it, then you have to prove
you know it." Nobody needs a tutorial. The help sheet exists for politeness.

---

## The share artifact

```
THE RULE #128
🔬 ✅❌❌✅
🧠 CRACKED IT · 4 probes
sfun.games/rule
```

Four lines. Reads clean in a tweet and in iMessage.

The `🔬` line is the part that does the work. It's your **experiment log** —
which of your probes came back positive and which came back negative, in order.
It leaks nothing (nobody can reconstruct a rule from four booleans), but it
tells a story with real shape:

- `🔬 ❌❌❌❌❌✅` — five dead ends, then found it on the last one. Grind.
- `🔬 ✅✅` — two shots, both confirmed, called it. Surgical.
- *(no log line at all)* — they called it cold.

The variants:

```
👑 CRACKED IT COLD · 0 probes      ← no log line. The maximum flex.
💀 BUSTED · 2/3 on 6 probes        ← the guillotine.
```

`👑` with no experiment log above it is the trophy state, and it's visually
unmistakable in a feed of `🔬` lines — you can spot someone's zero-probe call
from across a group chat. That asymmetry is deliberate: the best possible
result is also the *shortest* message, which makes it look effortless. Which is
the whole brag.

---

## Difficulty & content pipeline

Ten puzzles ship, hand-authored and machine-verified. Here's how that scales to
365 without the quality falling off a cliff.

**The unit of authoring is a predicate, not a word list.** That's the whole
trick. A rule is ~5 lines of JavaScript, and once it exists the game can judge
any string in the language, so a "puzzle" costs almost nothing to store and
nothing at all to serve. `puzzles.js` is 250 lines for ten days.

**Rules come from families, and families are deep:**

| Family | Examples | Rough supply |
|---|---|---|
| Hidden word | animal, number, body part, colour, country, name, instrument | 20+ |
| Keyboard geometry | top row only, left hand only, home row, one row per word | 8 |
| Letter order | alphabetical, reverse alphabetical, vowels in order | 10 |
| Repetition | doubled letter, no repeats, same letter three times, one vowel repeated | 12 |
| Symmetry | first = last, palindromic pairs, word reversed is a word | 8 |
| Position | vowel in the middle, ends in a silent letter, third letter is a vowel | 15 |
| Counting | more consonants than vowels, exactly two vowels, even letter count | 10 |

Roughly 80 distinct rules before repeating a *family*, and each family supports
several sibling rules that feel completely different in play ("doubled letter"
and "one vowel used twice" are cousins nobody would connect). Add graduated
difficulty (Monday = doubled letter, Saturday = alphabetical-order-with-ties)
and 365 is comfortable.

**Fairness is enforced by a script, not by vibes.** `rule/verify.js` runs in
node and is a hard gate on every puzzle:

1. All three pass-starters satisfy the predicate; all three fail-starters don't.
2. The call set is exactly eight words with exactly three passers.
3. Predicates survive junk input — empty string, `AAAA`, 40 characters of Q —
   without throwing, because players *will* type that.
4. The reveal renderer highlights only in-range letters for every word.
5. **The decoy test.** Every puzzle ships hand-written *wrong* hypotheses. The
   script classifies each one:
   - *dead on arrival* — the six opening words already disprove it. Good; it
     proves the starters are pulling weight, and it's reported.
   - *live* — a player could still believe it at the moment they call. Every
     live decoy **must** be refuted by the call set, or the build fails.

That last check is the quality bar made executable. A puzzle where a wrong
theory still picks the right three words isn't a puzzle, it's a coin flip, and
the script refuses to ship one. Current state: 900 assertions, 0 failures, and
every one of the ten puzzles has at least one live-and-punished decoy.

```
#3  bookends  —  "first letter = last letter"
     answer: TORMENT, ANTENNA, SPARKS
     LIVE decoy "any repeated letter" busts on: LADDER, BALLOON, MIRROR, TATTOO, LEVELS
```

Every one of those five failers has a repeated letter. A player holding the
obvious wrong theory walks into a call screen where *all eight words* look
correct. That's the good stuff, and it was designed by asking the script.

**The authoring loop for a new rule** is: write the predicate → write the
reveal sentence → pick three passers and three failers that share surface
features → write eight candidates where the five wrong ones each defeat a
different sloppy reading → run `verify.js` → fix what it yells about. About
twenty minutes a puzzle, and the script catches the failure mode a human always
misses (a decoy that survives).

**Editorial rules I'd hold the line on:**
- Failers must be *near misses*, never random words. GRATE fails where CRATE
  passes only if the rule isn't about the letters they share.
- Reveal sentences must be sayable out loud in one breath.
- Never a rule that depends on obscure vocabulary. The rule must be about
  *shape*, so a player with a small vocabulary and a good eye beats a
  crossword veteran. This is the game's accessibility story and it's a real one.

---

## Open risks

**Is a wrong call too punishing?** This is the big one, and I want to be honest
rather than defensive. One call, no second chance, and 2-of-3 is a total loss —
that's harsh. The counter-arguments: the commitment is what makes the score
mean anything (if you got two calls, everyone would call on zero and the brag
evaporates), busts are near misses by construction, and the reveal fires on a
loss too, so you always get the payoff and never hit a wall. But I'd want this
A/B tested against a "you may re-call for +3 probes" variant early. My instinct
is the hard version is right and the data will hate it for a week and then
love it. **I could be wrong about that.**

**The call screen leaks a mercy.** If your theory is badly wrong you'll often
find fewer than three matching words in the call set and realise something's
off before locking in. That's an accidental safety net that softens some busts.
It's arguably good UX and arguably takes the edge off. Currently unresolved.

**Puzzle 1 is a slow reveal.** "Contains a doubled letter" is the gentlest rule
we ship and its reveal is a shrug, not a gasp. It's there as an on-ramp, but
the first day is the worst possible time to show someone the least interesting
version of your best feature. Might swap day one to the hidden-animal puzzle
and accept a slightly higher first-day bust rate.

**Skill ceiling arrives fast.** A regular player learns the *families*, and
"probe AAAA, probe ZZZZ, probe a top-row word" becomes a rote opening that
cracks a third of puzzles in two probes. Mitigations exist (rules that cut
across families, rules about position rather than content) but a genuinely
expert player may end up calling on 1 most days, and a compressed score
distribution is a weaker share. Needs a "hard mode" answer eventually.

**Some rules are culturally loaded.** Keyboard-geometry rules assume QWERTY.
Hidden-number and hidden-animal rules assume English spelling. This game
localises badly — the predicates are language-specific in a way Wordle's aren't.
For an English-first launch that's fine; it's a real ceiling on international
rollout and I'd rather flag it now than discover it in year two.

**Y is a vowel and people will be angry.** The one-vowel rule declares Y a
consonant. Somebody's going to lose a day to RHYTHM and post about it. I think
the reveal handles it (it says so explicitly) but it's a paper cut.
