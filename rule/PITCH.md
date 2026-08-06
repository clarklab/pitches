# THE RULE — a daily word game where you're not guessing a word, you're guessing the law that governs it

## The 10-second pitch

Six words. Three obey a hidden rule, three break it. That's all you get.

You have six **probes**: type *any* string of letters — a real word, or
deliberate nonsense — and the lab instantly stamps it ✅ or ❌. When you think
you've got it, you **CALL IT**: eight fresh words appear and you tap the three
that follow the rule. Exactly three. No more, no fewer.

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
> **Probe 4: `PHANTOM`** → ✅
> *"PHANTOM. ANT. So it isn't only mammals — anything alive counts."*
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
survives the entire opening board without a scratch. The call set is built to
punish it: MOTHER hides a MOTH and VACANT hides an ANT, so a mammal-hunter finds
exactly one answer (SCOWL/COW) and has to invent two more. That player walks
into the call screen feeling certain and walks out busted. It isn't an accident,
it's the authoring standard — and `verify.js` mechanically enforces it for all
ten puzzles: *every wrong theory a real player could still be holding at the
moment they call must be contradicted by the call set, or the build fails.*

**The bench log.** Probes land in a six-line lab notebook — numbered `01`–`06`,
unwritten lines already ruled in so the cost of a probe is always visible. You
hit PROBE, the row goes live with a pulse, and after a beat the ✅ or ❌ chip
lands. That pause is deliberate. It converts a lookup into a result, and it is
the difference between a form field and an experiment.

**Nonsense probes are the good stuff.** Typing `AAAA` to test "does it need a
doubled letter?" is the move that teaches a player what this game actually is.
It's not Wordle with extra steps — it's a bench experiment, and the input slot
says so out loud: **TYPE ANYTHING — EVEN NONSENSE.** Nothing you type is ever
rejected, because the puzzle is a predicate rather than a word list. No lexicon,
no "not in word list," no dead end, no red shake for a word the dictionary
happens not to know. That one property is what makes the loop feel like science
instead of vocabulary, and it is why the game will never tell a player they are
wrong about a word they are right about.

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

The nightly reset matters too: today's rule is one category of thought
("something is hiding inside the word") and tomorrow's is a different one
("the letters are in alphabetical order"). Experienced players do develop an
opening — see the risks section, where I argue that's both the marketing and
the long-term threat — but an opening only ever narrows the field. It never
hands you the answer. Every morning still ends with a leap you have to take
yourself, which is what keeps day 300 feeling like day 3.

---

## Why it goes viral

**1. The answer is a *sentence*, and sentences travel. Grids don't.**

Wordle's answer is CRANE. There is nothing to say about CRANE. The Rule's answer
is a claim about the world: *"today's rule was — the word contains a hidden body
part."* That is a thing a human being says out loud to whoever is in the room,
unprompted, and the other person immediately says "wait, say them again." Try
that with CRANE.

This is the rarest property a daily game can have: **it manufactures content
that is interesting to people who did not play it.** A Wordle grid is
meaningless to a non-player — it's a barcode. "TYPEWRITER is the longest common
English word you can type entirely on the top row of a keyboard" is interesting
to literally everyone, forever, and it arrives with a game attached. The game is
a delivery mechanism for a fun fact, and fun facts have been the most reliably
viral unit of content since before the internet.

The reveal screen is built as a single screenshot for exactly this. The rule
sits at the top in a heavy display sans, one line, no hedging. Under it, every
word the day showed you — the six openers, whatever you probed, all eight from
the call — re-sorted into ✅ and ❌ with the hidden fragment picked out in accent
purple, and the fragment named in a column down the right edge. The evidence is
re-ordered so words that pass for the same reason sit next to each other, which
means the column reads `ANT · BEAR · COW · MOTH · PIG · RAT · RAT` and the
answer becomes humiliatingly obvious in hindsight. Where every failing word
fails for the same dull reason, the ❌ list collapses into a single line of
muted chips so it never competes with the payoff. One screen. One punchline.
Send.

**2. "Cracked it in 2" is a competence flex with no luck defence.**

In Wordle you can always protest that you got a bad start word, and everyone
does. Here there is nothing to blame. Every player on earth saw the same six
words in the same order. If you called it on two and I called it on five, you
out-thought me — that's the whole sentence, there is no second clause. It is a
direct, unambiguous, unarguable measure of how fast one specific brain moved
this morning, and that is precisely the number people cannot resist posting.

It also builds a *risk ladder*, which is the part that actually generates
volume. Calling early isn't merely faster, it's **braver** — you're betting a
total loss against a better number. The moment you learn your friend called it
on 3, calling on 4 feels like cowardice. So players start calling early
specifically in order to have something worth posting. The game manufactures its
own drama, every day, with no opponent, no lobby, and no leaderboard.

The share line carries a tier word for exactly this reason — `CRACKED IT · 2
probes · CLEAN` — because "2" means nothing to someone who has never played, and
`SURGICAL` means something to everyone.

**3. A bust is the most shareable failure in games, and this one is engineered.**

Losing Wordle is a slow suffocation: six greying rows and a shrug. Nobody posts
it. Losing here is a **guillotine with a receipt**. You committed. You looked at
eight words, you picked three, you locked it in, and one of them was wrong.

`💀 BUSTED · 2/3 on 1 probe · TOO SOON` is a complete story in one line: *I was
arrogant and I paid for it.* That is funnier than any win, it's self-deprecating
rather than boastful — which is the single strongest predictor of whether
something gets posted to a group chat — and it is **bait**. Someone will
absolutely reply "lol got it in 2." That reply is a second post, from a second
player, for free.

And the bust is a near miss *by construction*, not by luck. You never score 0 of
3; you'd have to work at it. The overwhelmingly common failure is 2 of 3 — one
word that punished a theory which was *almost* right. The loss screen names it
in plain English: **"BEACON was never in it: nothing hiding. You walked straight
past VACANT — ANT."** That's the "I was SO close" feeling with a hard edge on
it, and it is the most reliable share engine in the genre.

**4. Nonsense-probing is a strategy players teach each other. That's free
marketing.**

Typing `AAAA` to test whether the rule cares about doubled letters is the single
most satisfying move in the game, and it is not obvious the first time. It has
to be *shown* to you. Which means the first thing an experienced player does to
a new player is explain their opening — "always burn one probe on `AAAA`, and
one on `ZZQQ`, and one on a top-row word like `POTTERY`; that kills half the
rule families before you've thought about anything."

That is a strategy conversation, unprompted, between two humans, about our game.
Wordle got this by accident with start words and it was worth an enormous amount
— every "is SLATE better than CRANE" argument was a free ad. The Rule has the
same property but stronger, because a probe strategy is *demonstrably* correct
or incorrect rather than a matter of taste, and because the moves look absurd.
Watching someone type `ZZQQ` into a word game and get a serious answer back is
the hook, and it survives being described secondhand.

None of this is possible if the game is a word list. It works because every
puzzle is a **predicate**, so the lab can judge any string a human can type. No
lexicon, no "not in word list," no dead end, no rejection. That one engineering
decision is what turns the loop from vocabulary into science.

**5. It's explainable in one sentence, which is how anything spreads.**

"There's a hidden rule, you get six experiments to work out what it is, then you
have to prove you know it." Nobody needs a tutorial. The help sheet exists out
of politeness and auto-opens exactly once, ever.

---

## The share artifact

```
THE RULE #128
🔬 ❌✅✅✅
🧠 CRACKED IT · 4 probes · SOLID
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
👑 CRACKED IT COLD · 0 probes         ← no log line. The maximum flex.
💀 BUSTED · 2/3 on 0 probes · PURE HUBRIS    ← called cold and paid for it.
💀 BUSTED · 2/3 on 6 probes · ALL SIX, STILL WRONG
```

The tier word on the end is doing real work. `4 probes` is a number a
non-player cannot rank; `SOLID` they can. And on a loss the tier stops being a
grade and becomes the punchline — `PURE HUBRIS` for a cold call that missed,
`TOO SOON` for a call on two, `ALL SIX, STILL WRONG` for the player who spent
every probe and blew it anyway. That last one is the funniest line in the game
and it writes itself.

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
nothing at all to serve. `puzzles.js` is 341 lines — data, helpers, decoys and
reveal renderers — for ten days. There is no word list anywhere in the build.

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
the script refuses to ship one. Current state: **900 assertions, 0 failures**,
and every one of the ten puzzles has at least one live-and-punished decoy.

On top of that, the build was driven end to end in a headless browser at
390×844 — all ten puzzles played to a win, a deliberate bust, a zero-probe cold
call, all six probes exhausted, and every input guard poked at (two-letter
probe, duplicate probe, a word already on the board, a seventh probe, a fourth
selection on the call screen, reload mid-game and reload after finishing).
**191 interaction assertions, 0 failures, no console errors, light and dark.**

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

**Is one wrong call too punishing?** This is the big one and it deserves a
straight answer rather than a defence, so here is the honest version.

*The case that it's too harsh.* You can play well for three minutes, hold a
theory that is 90% correct, miss one word, and get a screen that says BUSTED
with a red chip reading "Called it far too soon." There is no partial credit:
2-of-3 and 0-of-3 produce the same verdict. A daily habit is fragile in week
one, and "I got it nearly right and the game called me a failure" is a
plausible reason to not come back on day three. Wordle is famously generous —
you have to be *wrong six times* to lose — and Wordle is the one that worked.

*The case that it's right.* The score is the entire product, and the score is
only meaningful because it is risked. Give a player two calls and the optimal
line is to call on zero every single day, burn the first call as
reconnaissance, and the number stops measuring anything. "Cracked it in 2"
means "I was confident enough to bet the day on it in 2" — delete the bet and
you delete the brag, and with the brag goes the share, and with the share goes
the game. The harshness *is* the feature; it's the same reason a poker all-in
is interesting and a free re-deal isn't.

*Why I think it lands anyway.* Four things blunt the sting deliberately:
the loss is always a **near miss** by construction (2-of-3 is the standard
failure; you cannot really score 0); the reveal fires **identically on a loss**,
so you always get the payoff and never hit a wall; the bust screen names the
exact word that killed you and the exact word you walked past, which converts
"I failed" into "*of course*, VACANT — ANT"; and the share line turns the loss
into the funnier post. The design goal is that a bust feels like a bad beat you
want to tell someone about, not a door closing.

*Where I'd give ground.* If retention data says the bust is churning week-one
players, the change I'd make is **not** a second call — it's a softer verdict
for 2-of-3 (`SO CLOSE` rather than `BUSTED`) plus keeping the streak alive on a
near miss. That preserves the bet while removing the insult. I'd ship the hard
version, instrument day-3 return rate against bust rate, and hold my nerve for
two weeks before touching it. **I could be wrong, and this is the number I'd
watch first.**

**The call screen leaks a mercy, and I've stopped pretending otherwise.** If
your theory is badly wrong you will usually find zero, one, five or six matching
words among the eight rather than exactly three — and that count tells you your
theory is broken *before* you lock in. So the guillotine is, in practice, often
a nudge. Worse, a player with no theory at all can hunt for whichever
three-of-eight subset looks most coherent and sometimes get there. This is the
most honest weakness in the design: the "one shot" framing is stronger than the
mechanic actually is. The fix, if it needs one, is to make the call set have a
variable number of passers (2–4) and tell the player the count only for that
day — which restores the commitment but costs the clean "name the three"
instruction. Not obviously worth it. Currently unresolved, and deliberately so.

**Puzzle 1 is a slow reveal.** "Contains a doubled letter" is the gentlest rule
we ship and its reveal is a shrug, not a gasp. It's there as an on-ramp, but
the first day is the worst possible time to show someone the least interesting
version of your best feature. Might swap day one to the hidden-animal puzzle
and accept a slightly higher first-day bust rate.

**The score distribution may collapse, and that is the risk that could
actually kill this.** Everything above rests on the daily number being
*interesting* — on your 2 meaning something because my 5 exists. But the same
property that makes probing shareable makes it learnable. A regular player
learns the families, and "probe `AAAA`, probe `ZZQQ`, probe a top-row word"
becomes a rote opening that cracks a third of puzzles in two. If a year in
everyone is posting `CRACKED IT · 2 probes` every day, there is no
conversation, no ladder, and no reason to look at your friend's post. Wordle's
distribution stays wide because it is partly *luck*, and luck does not get
better with practice. Skill does. A pure-skill daily is a genuinely harder
retention problem than a partly-luck daily, and I do not have a complete answer
to it. The partial answers: rules that cut across families rather than sitting
inside one; rules about position and counting, which the rote opening cannot
touch; graduated difficulty across the week; and eventually a hard mode with
three probes instead of six. Whether that is enough is an empirical question I
cannot settle from here, and it is the first thing I would measure after day-3
retention.

**Some rules are culturally loaded.** Keyboard-geometry rules assume QWERTY.
Hidden-number and hidden-animal rules assume English spelling. This game
localises badly — the predicates are language-specific in a way Wordle's aren't.
For an English-first launch that's fine; it's a real ceiling on international
rollout and I'd rather flag it now than discover it in year two.

**Y is a vowel and people will be angry.** The one-vowel rule declares Y a
consonant. Somebody's going to lose a day to RHYTHM and post about it. I think
the reveal handles it (it says so explicitly) but it's a paper cut.
