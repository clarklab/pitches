# CHAINS — golf, played on compound words: get from FIRE to CAR in as few links as you dare

## The 10-second pitch

Three holes a day. Each hole gives you a **tee word** and a **pin**, and you
walk between them one compound word at a time. FIRE → HOUSE, because
*firehouse*. HOUSE → BOAT, because *houseboat*. Keep going until you land on
the pin.

Par is one stroke more than the tightest line anyone has found, so **the perfect
route is a birdie**, and there is more than one perfect route. There is no undo:
a word that doesn't link just bounces off, but a word that *does* link is
played, and you carry on from wherever it dropped you. Run out of swings and you
pick up for par + 4 and walk to the next tee with that on your card.

You finish with a golf scorecard. Everyone already knows how to read one.

---

## How it plays

**The board is a single vertical chain.** The tee word sits at the top in a
dashed box, your played words stack underneath it, and the pin waits at the
bottom behind a dashed connector — the ground you haven't covered yet. Between
every pair of words, a small pill shows the compound you just made. That pill is
the whole feedback loop: it flashes accent green the moment it lands, then
settles into the record of your line.

**A worked example — round 1's closing hole. FIRE to CAR, par 6.**

```
              FIRE          ← the tee
        —  firehouse  —
              HOUSE         stroke 1
        —  houseboat  —
              BOAT          stroke 2
        —  boat race  —
              RACE          stroke 3
        —  race car   —
              CAR  ⛳        stroke 4 — holed out
```

Four strokes on a par 6. **Eagle.**

Now look at what else was on the table. From that same tee you could have
played FIRE → HOUSE → CALL → BOX → CAR (*firehouse, house call, call box,
boxcar*) for the same four strokes. Or you could have opened with FIRE →
WORKS — *fireworks*, a lovely word, an instant cul-de-sac, and the round is
effectively over on stroke one. There are **thirteen** four-stroke lines
through this hole and eighty-nine more that come home in five, and no two
players in a group chat will take the same one.

That is the design target, and `verify.js` enforces it hole by hole: every hole
must have **at least two distinct optimal routes** (or it's a riddle with one
answer, not a golf hole) and **no more than forty** (or reaching the pin feels
like luck rather than a line you chose).

**The no-undo rule is where the game gets its teeth.** Typing QUARTZ from FIRE
does nothing — it bounces with a shake and costs you nothing at all. But typing
WOOD works (*firewood*), and now you have spent a stroke to stand somewhere
that is still **four** links from CAR, when HOUSE would have left you three.
WOOD's onward links are WORK, LAND, PECKER, SHED, PILE, CHIP, CUT, BLOCK,
BURNER, WIND, SMOKE — a fine set of words, none of them pointing at a car. You
did not make a mistake. You made *a choice*, and it was worse than the one
sitting next to it.

**The three ways a hole ends.** You hole out. You run out of swings (par + 3
and you're done — pick up for par + 4). Or you strand yourself: play a word with
no onward links at all, and the game tells you immediately rather than letting
you flail. STAR·GAZER is a legal link and a complete cul-de-sac. That sheet is
titled **Stranded**, and it is the single most painful screen in the game,
which is exactly what it's for.

**One caddie per round — not per hole.** She names one word that keeps you
alive, and she costs you a stroke. You get one. Spending her on hole 1 because
you panicked means playing the closing hole alone. That decision is its own
small drama, and the glove shows up on your scorecard and in your share, so
everyone knows.

**And then, when the hole is dead, the game shows you what was there.** The
result sheet prints your line and — only if you didn't find a tightest one —
the line you missed, in accent green, directly underneath:

```
YOUR LINE
STAR · LIGHT · HOUSE · HOLD · ALL · TIME · FRAME · WORK

THERE WAS A 3-STROKE LINE — BIRDIE
STAR · FISH · NET · WORK
```

Eight strokes against three. It cannot help you — the hole is over — and it can
only sting. It is also the only way anyone learns the dictionary, because it is
the one moment where the graph is visible. Do that eighteen times a week and by
day 40 you know which words are motorways and which are cul-de-sacs. That is
the retention mechanism, and it is disguised as a punishment.

---

## The daily hook

One course a day, three holes, rotating by local date so everybody in a group
chat plays the same round. Two to three minutes, played entirely with a thumb.

The hook is **not** "did you finish" — almost everyone finishes. The hook is
**your number**, and unlike a guessing game, that number is not noise. Nobody
gets a lucky tee word. Everybody starts on the same square, sees the same pin,
and every stroke is a decision they made with full information. If you shot −3
and I shot +2, you played better. There's no start-word excuse, no "the answer
was obscure," no letter-frequency luck. That is a much better argument to have
over coffee than "what was your Wordle."

And the score has range. Wordle gives you a number from 1 to 6, and half the
world lands on 4. A CHAINS round is played against a par of 14 or 15, and the
scale runs from **−4** (every hole taken on the tightest known line — the
perfect round, and the same number on every course we ship, which makes it a
real target) all the way to **+12** if you pick up on all three. Two people who
both "finished" did not have the same morning.

There is also a slow-burn hook the genre mostly lacks: **the dictionary is
learnable**. Day 40 you know that OUT, FIRE, HEAD, BACK and WATER are the
motorways — twenty-four to twenty-eight onward links apiece — that NET is a
three-link cul-de-sac dressed up as a hub, and that anything ending in a
suffix-ish word is a trap. That is real, accumulating skill, and skill
games retain in a way that pure-luck games don't.

---

## Why it goes viral

**1. Many valid routes means everybody's line is personal — and comparable.**

This is the argument. Wordle's shareable is a record of how a *fixed* answer was
approached; two people who both got it in four have essentially the same story.
CHAINS has no fixed answer. On a single hole there are dozens of legal lines
home, and the one you took is a fingerprint of how your particular brain
associates words. Someone got from GOLD to STOP through GOLDFISH·FISH FOOD·FOOD
TRUCK·TRUCK STOP. Someone else went GOLD DUST·DUST STORM·STORM DOOR·DOOR STOP.
Same par, same score, completely different journey — and both of them want to
tell you about it.

Crucially the two things are **both** true: the routes are personal *and* the
scores are directly comparable. Most games give you one or the other. A pure
creativity game (write the funniest sentence) is personal but unscoreable. A
pure optimisation game is scoreable but everyone's answer is identical. CHAINS
scores you on a shared axis while leaving the content of your round unique,
which is the exact combination that makes people say "wait, how did *you* get
there?" — the highest-value message in any daily game, because it demands a
reply.

**2. No undo manufactures the "so close" post, on purpose and on schedule.**

The brief says a pitch has to reliably produce either "I was clever" or "I was
SO close." Most games get the first for free and have to engineer the second.
CHAINS engineers it structurally.

Because a legal-but-wrong link is *played*, the failure mode isn't "I couldn't
think of anything," it's "**I had it and I threw it away.**" You were two links
from the pin, you played a word that felt right, and it dropped you somewhere
with no road home. The game then tells you exactly that, by name: *"There is no
line from GAZER back to WORK — not in one more link, not in a hundred."*

That specific sting is what gets posted. It's not a shrug, it's a grievance, and
grievances travel. And it is a genuine near-miss every time by construction: the
verifier proves that at least two optimal lines existed from the tee, so the
player who blew it knows the good line was *right there*. Nobody ever loses this
game because it was unfair. They lose because they chose badly, in public, and
that is the most postable failure there is.

The reveal seals it. Losing quietly is forgettable; being shown the four-word
line you walked straight past, immediately, is not. STAR·FISH·NET·WORK is
*embarrassingly* obvious in hindsight — that's the point, and hindsight is the
most reliably shareable emotion in the genre. Wordle's answer screen tells you a
word. Ours tells you what you should have thought of.

**3. Golf scorecards are a share format people already know how to read.**

This is an unfair advantage and we should just take it. Wordle had to teach the
world what a grid of yellow squares meant. Golf scoring is already ambient
literacy: **birdie, bogey, eagle, −3, picked up** — these words carry precise
emotional weight to hundreds of millions of people who have never held a club.
"Eagled the last" needs no explanation and no legend. The share artifact is
legible to non-players *on first contact*, which is the bottleneck every daily
game dies at.

It also gives us a vocabulary ladder that scales the whole emotional range with
zero design work. An eagle sounds like an achievement because it is one. A
triple bogey is funny. "Picked up" is *humiliating* in a way that "X/6" never
manages, because in golf it means you gave up on the hole and walked. We inherit
a century of connotation for free, and the ladder has room above it — the code
already scores an albatross, we simply haven't cut a hole loose enough to allow
one yet.

**4. Three holes means three stories per share, not one.**

A Wordle share is a single verdict. A CHAINS share is a round: a birdie, a
disaster, a comeback. The shape of the emoji block tells you the arc at a
glance — a short green run, a long red run, a blue flash at the end. That's a
narrative with a beginning and an end, in five lines.

---

## The share artifact

```
CHAINS #218 · −3 (12 strokes)
⛳ 🟩🟩🟩 birdie
⛳ 🟨🟨🟨🟨🟨 par
⛳ 🟦🟦🟦🟦 eagle
sfun.games/chains
```

Five lines. Renders in a tweet, renders in iMessage, no answer leakage — the
squares encode **how many strokes** each hole took and **how that compared to
par**, never which words you played.

One square per stroke, coloured by the result: 🟦 eagle or better · 🟩 birdie ·
🟨 par · 🟧 bogey · 🟥 worse · ⬛ picked up. So the block is legible two ways at
once: the *length* of each row is how long you took, and the *colour* is whether
that was good. A long row of yellow is a grind that came good. A short row of
blue is a smash.

The variants that do the work:

```
CHAINS #218 · +4 (19 strokes)
⛳ 🟩🟩🟩 birdie
⛳ ⬛⬛⬛⬛⬛⬛⬛⬛ picked up      ← the blow-up hole, eight black squares wide
⛳ 🟧🟧🟧🟧🟧🟧🟧 bogey
sfun.games/chains
```

```
CHAINS #218 · −4 (11 strokes)
⛳ 🟩🟩🟩 birdie
⛳ 🟩🟩🟩🟩 birdie
⛳ 🟦🟦🟦🟦 eagle                ← the long hole, taken on the tightest line
sfun.games/chains               ← a perfect round. −4 is the ceiling.
```

That black row is the money. It is visually unmistakable in a feed of green, it
is wide in exact proportion to how badly it went, and it invites precisely one
reply: *"what happened on 2?"* — which is an invitation to tell the story, which
is the entire point.

The 🧤 is a small, deliberate confession. You can't hide the caddie, so taking
her is a real choice with a real social cost, and a clean card without one is
worth more.

---

## Difficulty & content pipeline

**What ships today.** A hand-curated link dictionary — 421 head words, 2,459
links — and six full rounds of three holes each, all eighteen holes proved by
`node verify.js`. The verifier is not decoration; it mechanically asserts, per
hole:

- the stated `best` is the **true BFS shortest path** through the graph, and
  `par = best + 1` (or `+ 2` on the round's long hole), so the tightest line is
  always a birdie or an eagle — never merely par;
- **at least two distinct optimal routes** exist, and no more than forty;
- the tee word and the pin are **not directly linked** (the hole can't give
  itself away);
- the graph contains no morphological garbage — a `BANNED_SECOND` list rejects
  suffix fragments like `pen`+`chant`, `star`+`ter`, `sun`+`ken`, `tea`+`cher`;
- the neighbourhood reachable inside par is large enough (≥ 20 words) that the
  hole doesn't feel like a corridor.

Three of the original holes failed that first check during this build — the
stated par disagreed with the true shortest path, because a legitimate short
line existed that the author hadn't seen (SNOW·FALL·BACK·GROUND, three strokes,
not four). Those holes were re-cut against the real graph rather than having
their pars fudged. That is the process working.

**Scaling to 365.** The pipeline is three stages, and I want to be honest that
only two of them are automatable.

1. **Mine.** `shared/compounds.raw.json` gives ~4,000 auto-derived closed
   compounds. That's the seed corpus and it is *noisy* — it cannot tell
   `firehouse` from `penchant`, because both are a word followed by a word.
2. **Curate — by hand, and there is no way around it.** Every link in the
   shipped dictionary was read by a human and kept or killed. This is the
   expensive step and the one that determines whether the game feels fair. The
   automated screens (banned suffix list, minimum length, alphabetic-only) catch
   maybe 60% of the junk; the rest is judgement — is `sunken` a compound of SUN
   and KEN? No. Is `boat race` a legitimate open phrase? Yes. A trained editor
   can process roughly 400–600 candidate links an hour. Getting to a 5,000-link
   dictionary is on the order of **two person-weeks**, once, up front.
3. **Generate and audition holes.** With a clean graph, `verify.js --explore`
   enumerates every (tee, pin) pair at distance 3–4 that has between 2 and 14
   optimal routes, and prints them ranked by how tight they are. On the current
   421-word graph that is **29,569 candidate holes** in about ten seconds — far
   more raw material than 365 days needs, from a dictionary a fraction of the
   target size. The machine proposes, and a human picks **three per day** for
   flavour and shape — a wintry course, a seaside course, a course that's all
   colours — and checks that the routes read like English rather than like graph
   traversal. Call it 20 minutes of human time per week of content once the
   dictionary is clean, which is a genuinely sustainable rate.

**Difficulty curve within a round** is fixed and deliberate: hole 1 is a par 4
you can birdie in three, hole 2 is longer, and hole 3 is flagged `long` — its
par is `best + 2`, so the tightest line there is an **eagle** and the closing
hole is where rounds are won or thrown away. Across the week, the knob we turn
is not path length but **branching factor**: an easy day routes through hub
words (HOUSE, BACK, WATER); a hard day routes through words with four onward
links, three of which are dead ends.

---

## Open risks

**1. Rejecting a compound the player knows is real. This is the one that can
kill the game.**

Every "isn't in today's dictionary" toast for a word that *is* obviously a
compound is a small betrayal, and unlike a Scrabble dictionary there's no
authority to appeal to. WATER·BOTTLE is in. WATER·BALLOON isn't — and a player
who types WATER·BALLOON is right and we are wrong. Worse, because the link
graph is finite and hand-made, a player who has internalised "compound = legal"
will hit this wall several times a round, and each one erodes trust in the
whole scoring system. Once someone believes the game is arbitrary, the score
stops meaning anything and the share stops being worth posting.

Mitigations, in order of how much I believe in them:

- **Make the dictionary much bigger than the puzzles need.** The holes only need
  a few hundred words; the dictionary should have thousands, so the common case
  is that the player's word works even when it's off-route. Coverage is the
  actual fix and everything else is a patch.
- **Log every rejection.** A rejected word that fifty players tried on the same
  day is not a player error, it's a curation bug, and it should be a work queue.
  This is cheap and it converts the failure mode into a content pipeline.
- **Never say "not a word."** The current copy is `FIRE · QUARTZ isn't in
  today's dictionary` — it blames the dictionary, not the player, and it's
  scoped to *today*. Small, but it's the difference between "I'm wrong" and
  "this list is incomplete."
- **Rejections cost nothing.** No stroke, no penalty, no limit on attempts. The
  failure is friction, never damage. That caps the blast radius.
- **Point at the exit.** After three rejections on one hole the game says
  "Stuck? The caddie is one tap away," which converts the moment where a player
  starts blaming the dictionary into a moment where they use a mechanic.

I don't think this risk goes away. I think it gets managed down to an
irritation, the way "not in word list" is an irritation in Wordle rather than a
dealbreaker — and note that Wordle ships that exact failure mode and survived it.

**2. The one-true-answer trap in reverse: too many routes and nothing feels
earned.** A hole where forty different lines all get home in four strokes isn't
a puzzle, it's a formality. The verifier caps optimal routes at forty for
exactly this reason, but "forty" is a guess, not a measured number. Real
playtesting will move it, and it may need to be a function of path length.

**3. Vocabulary bias.** Compound words skew heavily Anglo-American and heavily
domestic — HOUSE, YARD, DOG, TRUCK. That's a warm, accessible register, but it
means a non-native speaker faces a much steeper hill than they do in a
letter game, and some links (SIDECAR, BOXCAR, BANDSTAND) are generationally
dated. Any international version is a re-authoring job, not a translation.

**4. The skill ceiling arrives, and −4 is a hard ceiling.** Because par is
defined as `best + 1` (or `+ 2`), the perfect round is exactly **−4 on every
course we ship**. That's a clean target and a bad long-term score distribution:
once a committed player is reliably shooting −4, the daily number stops carrying
information and every share looks identical — two rows of green, one of blue.
Golf's own answer is the handicap and we may need ours (score against your own
rolling average, not against par), or a tiebreak below par — time-to-hole-out,
or a bonus for a line nobody else found that day.

There is a real tension here with the reveal, too. Showing "there was a
3-stroke line" quietly implies there is a *right* answer, which cuts against
the "everyone's route is personal" pitch. The honest framing is that CHAINS has
one best **score** and many best **lines** — the reveal shows *a* tightest line,
not *the* one — but if players read it as a solution the game shrinks to
optimisation. Wording it as "a 3-stroke line" rather than "the answer" is a
patch, not a fix.

**5. "Golf" might be a barrier to precisely the people it's meant to charm.**
The vocabulary is ambient in the US, UK and Japan; it is much less so elsewhere,
and a non-trivial number of people have a mild allergy to the sport's
associations. The scorecard does most of the explaining, but the framing is a
bet.
