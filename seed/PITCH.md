# SEED — a three-letter word, nine letters coming, and you can see all of them.

## The 10-second pitch

You start with a three-letter word. Every turn, one letter drops into your rack
and you must play a word that uses **every letter you're holding**. Three,
four, five, six… Your score is the longest word you reach.

The twist is that **the queue is public and in fixed order**. Everyone on earth
gets the same nine letters in the same sequence, printed across the top of the
screen before you make a single move. So this isn't anagramming. It's
anagramming *with a weather forecast*. You have two skips. Spending them in the
right place is the whole game.

---

## How it plays

This is puzzle #4, verbatim from the shipped set. Seed **RAT**, queue
`D E E C S L B E P`.

The first letter to land is `D`. `RATD` is nothing, but `DART` is obviously
something — so you play it, because of course you do.

```
RAT                                          3
 ↳ DART        take D                        4
   ↳ TRADE      take E                       5
     ✕ E        nothing fits — burn a skip   —
     ↳ TRACED   take C                       6
       ✕ S      nothing fits — burn the last —
```

…and then `L` arrives. `ACDELRST` is not a word, you have no skips left, and
you are finished. **Six letters.** That is the greedy line, and it is the line
almost everyone plays the first time.

Here is the line that was actually there:

```
RAT                                          3
 ✕ D           throw the D away              —
 ↳ RATE        take E                        4
   ↳ EATER     take E                        5
     ↳ CREATE  take C                        6
       ↳ CREATES     take S                  7
         ↳ CLEAREST  take L                  8
           ↳ BRACELETS   take B              9
             ↳ CELEBRATES   take E          10
               ↳ RESPECTABLE  take P        11
```

One decision. Move one. You gave up a free four-letter word and got seven more
letters for it. The result screen tells you there was an 11 in there and offers
to show you the line. You take the offer. You always take the offer. That's
the wound.

**The actual loop, per turn:**
1. The next queue letter drops into your rack with a thud.
2. Tap letters in order to spell your word (tap again to take one back).
3. Hit **Enter**. The word joins your staircase and the rack grows by one.
4. Or hit **Skip** and throw the letter away — you get exactly two, ever.

If nothing in English uses all your letters and you have no skips left, the run
is over. The letter that killed you turns red in the queue, the rack shudders,
and a banner tells you exactly what happened before the result opens. You never
lose to a mystery.

---

## The daily hook

One seed, one queue, one worldwide answer set, rotating at local midnight.
Under three minutes if you're decisive; the shipped puzzles are 8–10 moves.

The habit-forming part isn't the win, it's the *number*. Every result screen
ends with three digits side by side:

> **9** letters · **1** skip used · **11** best possible

You did not get the 11. You almost never get the 11. And unlike a Wordle fail,
you can see precisely how much room there was — and the game will show you the
exact line if you dare open the accordion. That's a reason to come back
tomorrow that has nothing to do with streaks.

---

## Why it goes viral

**1. The public queue converts a skill nobody can brag about into one they can.**

Anagramming is a talent, but it's an opaque one. "I saw ORATES in AEORST" is
not a story; either you see it or you don't, and telling someone about it is
just telling them you know a word. Wordle went global because its skill —
narrowing a space with evidence — is *legible*. You can explain your third
guess to your mother.

SEED does the same trick for word puzzles. Because the whole queue is visible
from move one, every decision is a **plan**, and plans are narratable. "I gave
up a letter on turn three to keep a vowel slot open for the O" is a sentence a
human being will actually say out loud. The skip is the load-bearing invention
here: it turns a reflex game into a resource-management game, and resource
management is the thing people argue about in group chats.

That also means SEED has a genuine **skill ceiling that is not vocabulary
size**. A better vocabulary helps. Looking three letters ahead helps more. Our
own solver proves it: in all ten shipped puzzles, a player who simply grabs
every letter they can absorb dies *before* the maximum, every time — the greedy
line tops out between 6 and 8 letters against maxima of 10 and 11 — and
`verify.js` refuses to ship a puzzle where that isn't true. It has already
thrown one out for exactly this reason (see the rejection notes in
`build.js`). The greedy player is not merely worse. The greedy player is dead.

**2. Everybody's chain is different, so the share is personal.**

Wordle's share grid is a shape everyone can produce. Two people who both got it
in four have functionally the same picture. In SEED, the branching factor at
every rung is real — puzzle #9 alone offers 57 legal words across 22 reachable
racks, and each choice changes what the next letter can attach to — so two
players who both reach a 9 almost certainly walked different roads to get
there. `verify.js` measures this per puzzle and refuses a rotation where fewer
than half the days offer real choice, because a puzzle with one line produces
one share. The artifact encodes *where* you spent your skips, which is the
interesting part, and the reply is always the same reply: "wait, you skipped
the **D**?"

That's the thing you want. A share artifact that provokes a specific question
rather than a thumbs-up.

**3. "You stopped at 8 — there was an 11 in there" is the cruellest line in the
lineup.**

Take the two feelings the brief demands. SEED manufactures the second one
industrially, and it does it with a *number*, which is the most portable form of
regret there is.

A Wordle loss tells you that you failed. It does not tell you how badly. A
crossword you can't finish just sits there. But SEED tells you, to the letter,
the size of the thing you walked past — and then it shows you the line, and the
line is always something you knew. You knew ALTERCATION. You've known
ALTERCATION since you were eleven. You had every letter of it in your hand and
you spent a skip on the wrong turn four moves earlier.

The gap is a scalar. Scalars get compared. "8" next to a friend's "10" in a
group chat is a fight, and fights are distribution. And critically, **the gap
does not spoil anything**: knowing an 11 exists tells you nothing about which
11, so the person you're taunting can still play.

---

## The share artifact

Four lines. One square per queue letter, all from the same emoji family so the
row never breaks alignment in iMessage, Slack or a tweet.

This is the real output of the greedy run through puzzle #4, copied out of the
game:

```
SEED #219 · RAT
🟪🟪🟨🟪🟨🟥⬜⬜⬜
3→6 · an 11 was in there
sfun.games/seed
```

- 🟪 — you absorbed that letter and played a word
- 🟨 — you skipped it
- 🟥 — that letter is what killed you
- ⬜ — you never got that far

And the brag version — the same puzzle, played properly:

```
SEED #219 · RAT
🟨🟪🟪🟪🟪🟪🟪🟪🟪
3→11 · MAXED IT 🏆
sfun.games/seed
```

Put those two side by side in a group chat and the whole game is legible
without a word of explanation. One person spent both skips flailing in the
middle and hit a wall on letter six. The other spent one skip, immediately, and
never needed another.

No word from the answer set appears anywhere. The seed word is public — it's on
everyone's screen — so printing it is free and it makes the line scan as a
sentence. The purple run reads left to right like a growth chart, the yellow
gaps are your decisions, and the red square is the exact moment it ended. You
can reconstruct someone's whole run from four lines and still have to play it
yourself.

---

## Difficulty & content pipeline

This is not a sketch. `search.js` is the generator, `build.js` is the solver,
`verify.js` is the gate, and three of the ten shipped puzzles came out of that
pipeline rather than out of a person's head.

**The generator.** For a candidate `(seed, queue)`, build.js explores the exact
space a player can occupy: a state is *(queue letters resolved, which ones were
skipped)*, and it is **alive** only if every take along the way produced a rack
that spells at least one real word. That's a few dozen states per puzzle — small
enough to solve exhaustively, which is why we can make a hard claim about the
maximum instead of a guess.

**The search.** Candidates come from the answer end, not the seed end:

1. Pick a target word of length 9–11 from `lexgen.raw.json` (36,273
   frequency-filtered words).
2. Enumerate its 3-letter sub-multisets and keep the ones on a hand-written
   whitelist of 265 everyday words. **The seed cannot come from the lexicon.**
   The 3-letter slice of any frequency-filtered word list is a swamp — the
   first run of this search happily proposed `OCA`, `NOA`, `AIT` and `ANS` as
   seeds. The seed is the most-read word in the game; it gets a whitelist.
3. The target minus the seed is the *spine*. Order it so that every prefix, in
   order, spells something. Most candidates die here, and they die fast: index
   the lexicon by sorted-letter key once and each prefix test is a hash lookup.
4. Insert 1–2 **poison letters** — letters that produce a legal, tempting rack
   right now but strand you later. Poison is the entire craft of the puzzle.
5. Solve; keep it only if it survives the criteria below; sort what's left by
   **branching**, because that is the number that decides whether two players
   get different stories.

One run over the 10- and 11-letter targets: **4,774 candidates examined, 520
passed the automatic criteria**, top of the list scoring 27 spare words across
22 reachable racks. That yield is more than enough for 365 — the bottleneck is
review, not search.

**The tuning criteria** (all of them enforced by `verify.js`, all of them
currently passing on the ten shipped puzzles):

| Criterion | Why |
|---|---|
| Max reachable length in **9–11** | 12+ is unreachable for a human; 8 doesn't feel like an achievement worth a share. |
| A greedy player **actually dead-ends**, not just scores lower | The design claim. If greed survives, the puzzle is a vocabulary quiz. |
| At least one named **fork** where taking is strictly worse than skipping | Verify computes best-reachable-from-here after take vs. after skip and requires skip to win somewhere. This is the "aha". |
| The optimal line uses **≤ 2 skips** | More than two and planning collapses into "skip whatever's awkward". |
| The optimal line passes through **≥ 1 rack with a real choice** | A single-file rail produces one chain and therefore one share. |
| **Half the rotation** scores branching ≥ 10 | A couple of thin, gentle days make good Mondays. A rotation of them is a quiz. |
| Every reachable rack's full word list ships | Otherwise the game rejects a correct answer, which is unforgivable. |
| Zero blocklisted junk in the shipped set | Hand-curated; verify asserts every blocklist entry still exists in the lexicon so the list can't rot. |
| Zero common words missing from the shipped set | The mirror list. `ALLOWLIST` restores what the frequency cut dropped — participles, agent nouns, plain plurals — and verify asserts no entry there is redundant, so it can't rot either. |

**Difficulty curve.** Three dials, and they're independent, which is what makes
a year of content possible:
- *Poison count.* One poison letter is a Monday. Two is a Thursday.
- *Fork depth.* A trap on queue letter 0 (`RAT` + `D` → `DART`, and you're
  already dead) is harsh and memorable; a trap on letter 4 rewards players who
  are still paying attention late. Ship early traps on weekends when people
  have time to restart mentally.
- *Rack width.* Racks with many legal words are forgiving; racks with exactly
  one are a wall. `verify.js` reports the word count per rack, so this is a
  sortable number.

**Human review is not optional, and here is the proof.** The generator
proposes; a person reads the full `node build.js --dump` for every candidate —
every rack, every word the game will ever accept — and strikes the junk into
`BLOCKLIST`. Of the four highest-scoring candidates from the run above, **two
were killed by that reading**, and neither failure was visible to any automated
check:

- `TIE / DCSREONPP → PERCEPTIONS` scored branching 21 with a beautiful clean
  chain. But the *only* route to the 11 runs through the rack `CEIRST`, whose
  sole answer is `STERIC`. A daily puzzle may not gate its maximum behind a
  chemistry adjective. `ACE / DPRSDTIDH → DISPATCHER` died the same way, on
  `PRACTISE`.
- `ACE / DNRSAIOTN → CONTAINERS` scored branching 18 and a dead greedy player.
  Then the junk it was leaning on (`CADE`, `CARNE`, `CESAR`, `SARACEN`) went
  into the blocklist, and the greedy player *stopped dying*. `verify.js` caught
  it on the next run. A puzzle whose difficulty came from words nobody knows
  had no difficulty.

Both rejections are recorded in `build.js` so nobody re-proposes them. At ~20
racks per puzzle this is five minutes of reading per candidate; 365 days is
about a week of one person's attention. That is a completely reasonable price
for content that cannot embarrass you.

**Shipping cost.** The game ships **zero dictionary**. `build.js` emits only the
rack keys a player can physically reach and the words that satisfy them —
7.4 KB for ten puzzles, roughly 0.75 KB per day. A year is under 275 KB, still
inlineable, still `file://`-safe. Validation at play time is
`sort(letters) → key → membership`, an exact multiset match, so the word must
consume the entire rack by construction.

---

## Open risks

**1. Anagramming an 11-letter rack on a phone may simply be too hard, and the
share publishes a number that correlates with vocabulary.**
This is the real one, and it has two halves. The mechanical half: by turn eight
you're staring at eleven tiles and the answer is RESPECTABLE, and tapping
eleven letters in the right order without a fumble is fiddly even when you
*know* the word. The social half is worse — Wordle's floor is near zero
(anyone can type a word), while SEED's floor is your vocabulary, and the
artifact broadcasts a scalar that tracks it. "You stopped at 8" is a great
taunt between equals and a quiet reason to delete the app between unequals.

Mitigations shipped: shuffle (reorders only the letters you haven't committed);
a dedicated backspace beside the tray; a wrong-but-complete attempt says "not a
word — *but something fits*", which distinguishes "you're wrong" from "there's
nothing here"; and the stuck sheet now escalates — it tells you **how many**
words fit the rack, then offers the **first letter**, and only then offers you
the door. Not shipped, probably needed: an easier weekday tier where the
maximum is 8–9, so the number a beginner posts is not always a losing one.

**2. Players may just play greedily and never discover the plan.**
Every puzzle punishes greed — but punishment only teaches if the player
connects the death to the decision. A first-timer who dies at 6 might conclude
the game is unfair rather than that they blew turn one. Three things push
against that: the dead-end names the letter that killed you and turns it red in
the queue; the result screen names the resource you failed to spend ("You never
spent a skip."); and "show me the 11" replays the optimal line *as decisions*,
with thrown-away letters shown as `✕ D`, not as a word list. Whether one
viewing of that flips someone from reflex to planning is an open empirical
question. If it doesn't, the fix is a day-one tutorial puzzle where the trap is
on turn one and unmissable.

**3. The skip is the best idea in the game and it is still not loud enough.**
It lives as a button between shuffle and enter, carrying a small counter. The
queue now gives the next two letters a hairline accent border to pull the eye
forward, and the skip button glows when nothing fits — but "you have two of
these, ever" is the sentence that makes the whole game make sense, and it is
currently a 21-pixel badge. This wants a real onboarding beat.

**4. Ten puzzles is a demo, and the pipeline's yield is measured over one run,
not a year.** 4,774 candidates in, 520 through the automatic gate, and then
*half the shortlist died in human review* — for reasons no automated check
could have caught (a maximum gated behind `STERIC`; difficulty that evaporated
when junk words were struck). Extrapolating that to 365 days is an assumption,
not a result. If the human-rejection rate is really 50%, the search must run
much wider than it did here, and the reviewer is the bottleneck for a year of
content.

**5. "Best possible" is a claim, and claims can be wrong.** If a player finds a
12 the game doesn't know about, the whole near-miss mechanic reads as a bug.
This is why `verify.js` re-derives the maximum from the raw lexicon rather than
trusting build.js — but it is only ever as right as the lexicon. A word the
lexicon doesn't have is a word the game will reject, and rejecting someone's
correct answer is the fastest way to lose them. A frequency filter cuts
inflections before it cuts stems, so the shipped lexicon knew `erasing` but not
`searing`: every rack across all ten puzzles was swept for that class of hole
and the 52 words it had dropped are hand-restored in `ALLOWLIST`. The risk is
bounded by that sweep and by the blocklist, not by the frequency filter alone.

---

## Verify it yourself

```
node search.js --n 26    # propose new (seed, queue) pairs, ranked by branching
node build.js            # regenerate puzzles.js from the raw lexicon
node build.js --dump     # every rack, every word the game will ever accept
node verify.js           # 248 assertions; exit 0 means shippable
```

`verify.js` shares nothing with `build.js` except the two hand-curated word
lists (blocklist and allowlist) —
reachability, the maximum, the witness replay and the greedy trap are all
re-derived from the raw lexicon, because importing build's own walk to check
build's own output would prove nothing.
