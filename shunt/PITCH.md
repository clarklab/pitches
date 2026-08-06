# SHUNT — a 4×4 of loose letters on rails. Push them until every row is a word.

## The 10-second pitch

Sixteen letters sit in a shallow tray, four by four. Any row slides left or
right. Any column slides up or down. Everything wraps: what leaves the right
edge arrives on the left. Win when **all four rows spell words at once**.

There is no typing, no keyboard, no guessing. You push letters with your thumb
and the rows light up when they're right. It is the only game in the lineup
you can play one-handed on a train without looking clever, and the only one
where the answer is not a word you have to *know* — it's a word you have to
*uncover*.

Par is the true minimum number of pushes, proven by exhaustive search of the
slide group. Beat par and you didn't get lucky; nobody could have done better.

## How it plays

Here is puzzle #1. Sixteen letters, nothing lit.

```
      S W V E
      D I U F
      R R F S
      A I T M
```

Row 4 is close. `A I T M` — push it right once and it's `M A I T`, no. Push it
left once: `I T M A`, no. Dead end. But look down column 3: `V U F T`. If that
column comes up one, row 4's third letter becomes an `M`... and row 1's becomes
a `U`.

**Push column 3 up.** Watch what it costs you:

```
   before          after col3 ↑
   S W V E         S W U E
   D I U F   →     D I F F
   R R F S         R R T S
   A I T M         A I V M
```

Nothing lit either way. That is the entire game in one picture: a column push
touches **all four rows at once**. You cannot fix one row without reaching into
the other three.

Now the trade-off that actually stings. Suppose you've got here:

```
      S W I M   ✓ lit
      D I V E   ✓ lit
      R U F F   ✓ lit
      A R T S   ✓ lit          ← that's the win
```

but on the way you were here:

```
      S W I M   ✓ lit
      D I V E   ✓ lit
      U F F R
      A R T S   ✓ lit
```

Three rows lit, one row of garbage. But `UFFR` is a rotation of `RUFF` — one
push right and it's home. **Row pushes cost nothing but the move: a row slide
only touches its own row.** So this one is safe.

But get here instead:

```
      S W I M   ✓ lit
      D I V E   ✓ lit
      R U F F   ✓ lit
      A T R S
```

Row 4 needs its `T` and `R` swapped, and no amount of sliding row 4 will swap
two letters — a slide is a rotation, not a swap. The only way to change the
*order* inside a row is to send letters through it vertically. Which means
breaking one of the three rows above it and rebuilding. That's the moment
players scream. Three rows lit, and the fix costs you two of them.

**Three inputs, all shipped:** swipe the grid with a thumb, drag it with a
mouse, or tap a tile and use the arrow keys (shift+arrows moves the lane
cursor without spending a move). The chevrons around the grid work too, for
anyone who'd rather tap than drag.

## The daily hook

One grid a day, rotating by local date. Under three minutes. Par is 6 pushes
on every shipped puzzle; the hard cap is par + 8, so you have room to flail and
still finish — and flailing is the fun part, not the failure state.

The retention argument is not the puzzle, it's the **object**. The board is
draggable at all times. Letters follow your thumb continuously, light up mid-
drag before you commit, and snap with a physical settle. People will open
SHUNT and push letters around for ten seconds while waiting for a lift, the way
they click a pen. That's a materially different habit loop from "sit down and
solve the Wordle", and it produces repeat opens *within* a day, not just across
days.

## Why it goes viral

**1. "There were four solutions and I found the rarest one."**

This is the headline, and no other daily word game can make this claim.

Wordle has one answer. Connections has one grouping. Spelling Bee has a list
you're all working down. Their share artifacts can only say *how* you got to
the single known destination. SHUNT's grids genuinely have several distinct
winning boards — puzzle #1 has four, and they are different sets of words
(`SWIM/DIVE/RUFF/ARTS` and `WITS/DIVE/RUFF/MARS` among them). We know all of
them, because `verify.js` enumerates every way to partition the sixteen letters
into four dictionary words in every row order, then measures the exact slide
distance to each.

We also know, exactly, **what fraction of all shortest routes land on each
one**. So the endgame can say: *62% of every optimal line ends on the board you
found. 8% end on the one you didn't.* And if you're in that 8%, the share block
says **"the rare one"** and your friends can check their own block against it.

That is a genuinely new social object: not "did you get it" but "did you get
the *same* one". Two people who both shot par have something to argue about.
Wordle can never manufacture that.

**2. Three rows lit is the cruellest near-miss in the category.**

Wordle's near-miss is abstract — a row of yellow. SHUNT's is *visible*. Three
rows are glowing, one row is nonsense, and you can see the letters you need
sitting one column away in the wrong place. You know exactly what you need. You
just can't get it without breaking something you already earned.

The share artifact encodes this per move, so the story is legible at a glance:

```
⬜🟨🟨🟧🟥🟥│🟥🟩
```

Six moves of climbing, hitting three-of-four, then *sitting on three-of-four
for three more pushes* before finally getting home two over par. Anyone who has
played that grid reads that line and winces. The `│` marks where par ran out.

**3. It is the most fidget-able game in the lineup, and that drives opens.**

Every other pitch here is a thing you finish. SHUNT is a thing you *hold*. The
tactility isn't decoration — the beads follow your thumb with no lag, rows light
live while you're still moving, the wrap is drawn so the tile leaving the right
edge is visibly the same tile arriving on the left, and every commit snaps and
buzzes. This is the only one of the five that survives being opened with no
intention of playing, which is exactly the behaviour that turns a daily into a
habit.

**4. Par is a real number, not a vibe.**

"6 moves (par 6)" is verifiable, and beating it is impossible. That makes a par
finish an actual accomplishment rather than a participation trophy, and makes
the golf language honest. Bogey means bogey.

## The share artifact

```
SHUNT #128 · 8 moves (par 6)
⬜🟨🟨🟧🟥🟥│🟥🟩
Solution 4 of 4 · 8% of par routes · the rare one
sfun.games/shunt
```

Four lines. Reads in a tweet, reads in iMessage.

- **Line 1** — moves against par. Golf framing, instantly legible.
- **Line 2** — one square per push, coloured by how many rows were spelling
  words after it. `⬜`0 `🟨`1 `🟧`2 `🟥`3 (the agonising one) `🟩`4. The `│`
  drops in where par ran out, so "went long" is visible without a word of copy.
  It is a *narrative*, not a scorecard: you can see the climb, the stall, the
  finish.
- **Line 3** — the money line. Which of the day's solutions you landed on and
  how rare that route is. On a loss it becomes
  `Closest approach 2 moves · 4 solutions were there`, which is its own kind of
  brag-adjacent pain.

No letter, word, or grid position ever appears. Two people can compare blocks
in full before either has played.

Lose block, for contrast:

```
SHUNT #128 · out of moves (par 6)
⬜🟨🟧🟥🟥🟥│🟥🟥🟧🟥🟥🟥🟥🟥
Closest approach 1 move · 4 solutions were there
sfun.games/shunt
```

Eight consecutive pushes at three-of-four, and at one point one push from
finishing. That is a person who needs witnesses.

## Difficulty & content pipeline

`verify.js` is the whole pipeline, and it already runs both directions.

**Generation** (`node verify.js --search hawk,dove,crow,wren 6 200`): take a
hand-chosen set of four themed 4-letter words, scramble the board with N random
non-cancelling pushes, and keep the scrambles that survive the filters below.
At 200 tries per word set it yields a handful of usable grids in a few minutes.

**Verification** (`node verify.js`) proves, per grid, by exhaustive search
rather than sampling:

1. The start is not already solved, and **no row of the start is accidentally a
   word** — a lit row at move zero misleads a first-timer into thinking they
   have something.
2. `par` is the **true minimum** number of pushes to *any* all-words board, not
   just to the words we authored. This uses a bidirectional search: forward BFS
   to depth par−1, then a radius-2 expansion around every candidate solved
   board. Plain BFS to depth 7 blows past 24M states; this meets in the middle
   and stays under 300k.
3. The **complete** list of par-length solutions, found by enumerating every
   partition of the 16 letters into four LEX4 words in every row order (2–15k
   candidate boards per grid) and measuring the exact distance to each.
4. For each solution, the **number of distinct shortest routes** ending on it —
   that's the `%` in the share line, and it's counted, not estimated.

**The filters that make 365 grids, in priority order:**

| Filter | Rule | Why |
|---|---|---|
| Solution count | 2 ≤ N ≤ 8 | 1 kills the share hook; >8 makes "solution 6 of 11" meaningless. |
| Distinct word sets | ≥ 2 different *sets* of words among the solutions | Four row-orderings of the same four words is not four solutions. The search tool already sorts candidates by this. |
| Par band | 5–7, distributed 6/6/6/5/7 across a week | Under 5 is over before the fidget starts; over 7 breaks the 3-minute rule. |
| Clean start | zero lit rows at move 0 | See above. |
| Word quality | every word in the *shipped* solutions hand-checked | This is the one that must stay manual. |
| Theme | the authored quartet shares a category | `swim/dive/surf/raft`, `hawk/dove/crow/wren`, `quiz/exam/test/grad`. Gives the reveal a payoff beyond "four words". |
| Near-miss density | ≥ 1 solution at par+1 preferred | Grids with par+1 solutions produce more three-rows-lit moments. |

**The word-quality problem is real and it is the manual gate.** LEX4 is 2,824
common words, and the solver will happily find `DIED/CARP/CHIC/ICON` as a valid
solution to the dice/card/chip/coin grid. That's fine — it's a legal board and
finding it earns you the 3% rarity tag — but the *authored* quartet has to be
the pretty one, and the alternates have to be words a normal person accepts.
Every shipped grid's full solution list is printed by the verifier and read by
a human. At roughly 30 seconds of reading per grid, 365 grids is a
two-afternoon job, done once, and re-runnable if the lexicon ever changes.

Seven grids ship here, all verified. The pipeline is not a plan; it's the
script that produced them.

## Open risks

**1. Does this read as a word game, or as a sliding puzzle?**

This is the one that could kill it. A committee looking at a 4×4 of letters on
rails will see Rush Hour or a fifteen-puzzle before they see Wordle, and the
audience for spatial puzzles is measurably smaller and skews differently from
the audience for daily word games. Every mitigation we have is presentational —
the rows light up, the endgame names the words, the share block talks about
solutions rather than moves — but none of that changes the fact that **the core
verb is push, not spell**. If the brief is "a daily *word* game", SHUNT is the
pitch most vulnerable to the charge that it merely has words in it.

Counter-argument, honestly held: the *reason* the mechanic works is vocabulary.
You have to see `RUFF` in `FFUR` before you can want to push it. Players who
can't read a scrambled row can't play. But that's an argument, not a
demonstration, and it needs a playtest to settle.

**2. Spatial reasoning is a harder sell than vocabulary at mass scale.**

Wordle's genius is that everyone believes they can play it. Knowing words feels
like a fair test; rotating a torus does not. Some fraction of players will bounce
off the wrap-around immediately — not because it's hard, but because it *looks*
hard. The first-run cue, the live row lighting and the generous par+8 cap are
all aimed at this, but the honest expectation is a steeper day-one drop-off
than a typing-based game.

**3. The rarity hook needs a live population to be fully true.**

"62% of par routes end here" is a statement about the *route space*, not about
other players. It is exactly true and exactly verifiable, and it is a better
number than a player-population percentage in one respect (it's stable on day
one, with no cold-start problem). But some people will read it as "62% of
players", and when we eventually have real player data we'll have two competing
percentages to explain. Pick one before launch. My vote is to keep the route
share — it's a fact about the puzzle, and it can't be gamed.

**4. Restarting.**

Reset returns the letters, not the moves. That's deliberate — "no undo" is the
whole cost structure and a free restart would hand everyone par — but it is
the least intuitive rule in the game and the one most likely to generate
complaints. It's currently behind a confirmation sheet that states the cost
plainly. It may still need to go.

**5. Seven grids is a demo, not a year.**

The pipeline above is real and runs, but 365 grids with hand-checked word
quality is a genuine content commitment before launch, and the themed-quartet
requirement makes it harder than it sounds. Assume a week of authoring.
