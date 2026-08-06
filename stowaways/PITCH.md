# STOWAWAYS — six words are hiding in a perfectly ordinary sentence, and you have read past every one of them

## The 10-second pitch

Here are two sentences about a village fete going badly:

> Uncle Ray's turn at the samba contest ended in heartbreak, fast. He reeled
> into a stone planter, flattened the cabbage leaves on the produce table, and
> fed some lettuce to the judge's whippet.

There are six breakfast foods in there. Spaces don't count.

That's the whole game. Drag across the letters you think spell one, and if
you're right it locks shut in a wash of colour that runs straight through the
gaps it was hiding in. Six finds and the day is done, usually inside two
minutes.

No grid. No keyboard. No guessing. **Just looking** — at prose that has been
sitting there in plain English the entire time, being read and not seen.

---

## How it plays

**What you're given.** A clue ("First things first"), a row of six blank chips,
and the passage. Nothing else. The clue names the *theme* obliquely; it never
names a word.

**Before** — this is exactly what ships as puzzle #1:

```
Uncle Ray's turn at the samba contest ended in heartbreak, fast.
He reeled into a stone planter, flattened the cabbage leaves on the
produce table, and fed some lettuce to the judge's whippet. Everyone
agreed it was nice, really, that he had tried at all.

                    ? ? ? ? ?  ★
```

Read it twice. Read it a third time. It is a completely unremarkable paragraph
about a man ruining a village show.

**After:**

```
Uncle Ray's turn at the samBA CONtest ended in heartBREAK, FAST.
He reeled inTO A STone planter, flattened the cabBAGE Leaves on the
produce table, and fed sOME LETtuce to the judge's whippet. Everyone
agreed it was niCE, REALly, that he had tried at all.

              BACON  TOAST  BAGEL  OMELET  CEREAL  ★BREAKFAST
```

That is the pitch. Not a description of the pitch — that literal pair of
blocks. Show someone the top one, let them fail, show them the bottom one, and
they make a noise. Nobody has to explain the rules.

**Four things make it a game and not a curiosity:**

1. **Every stowaway straddles a gap.** None of them sit inside a single word —
   that would be free. `TOAST` is spread across three words (`inTO A STone`).
   This is enforced by `verify.js`, not by hope, so the search is always
   "read across the spaces," never "scan for a word inside a word."
2. **One find is the keystone ★** — the longest, and it *names the theme*.
   `BREAKFAST` is hiding in `heartbreak, fast`. Find it early and the other five
   collapse in thirty seconds. Find it last and you spend the whole game
   guessing at what connects `TOAST` and `BACON`. The same puzzle is a
   completely different experience depending on the order you crack it in, and
   that variance is where the shareable story comes from.
3. **Wrong guesses cost nothing.** Nothing. Guess constantly. But near misses
   are called out — mark the right first letter with the wrong length and the
   game tells you so. That is the "SO close" engine, and it fires ten times a
   game rather than once.
4. **Three hints,** each one flashing the first letter of a word you haven't
   found. Enough to guarantee nobody hits a wall; few enough that spending one
   costs you a clean sweep, and it shows in your share as 🟡.

**Both input paths work, everywhere.** Drag across the letters, or tap the
first letter and then the last. The tap path is the primary one on a phone —
44px-equivalent targets with 90px of nearest-neighbour slop, so a fat thumb
between two lines still snaps to the letter you meant. On desktop, arrows move
a caret and Enter marks each end.

---

## The daily hook

One passage a day, rotating by local date, identical for everyone. Two minutes,
maybe three on a hard one.

The hook is not "did you finish" — most people will. **The hook is how long
you stared.** Stowaways produces a very specific and very repeatable feeling:
you read a sentence nine times, gave up, took a hint, and the hint pointed at a
letter you had looked directly at nine times. That is not frustration, it is
*delight at your own blindness*, and it is the single most tellable thing a
word game can manufacture.

It also has something no other daily has: **the passage itself is content.**
Wordle's board is the same board every day. Stowaways' board is a new joke every
day. Today it's a wedding going wrong; tomorrow it's a house move during a power
cut; the day after it's a school trip. The game gets to have a *voice*, and a
voice is a reason to come back that has nothing to do with the mechanic.

---

## Why it goes viral

**1. The revealed passage is the most screenshot-able artifact in the genre,
and it isn't close.**

A Wordle grid is a picture of a score. It is meaningless to anyone who didn't
play, and it's meaningless to *you* a day later. It has no content.

The Stowaways reveal is a picture of a **sentence with six words lit up inside
it**, and it is legible, funny and complete to a total stranger. It needs no
caption. It needs no explanation of the rules. It works in a group chat, on a
feed, on a slide, in a newspaper. It is the only daily-game artifact that
carries its own punchline.

And crucially: **the reveal is interesting to people who did not play.** Show a
non-player a Wordle grid and they see six rows of squares. Show a non-player
`heartBREAK, FAST` and they immediately want to know what else is in there.
That single asymmetry is the entire difference between a game that spreads
through its players and a game that spreads through everyone its players talk
to.

**2. Prose gives the game a voice — no other daily word game has one.**

Every competitor in this category is a lattice. Grids, tiles, letter banks,
connection boxes. They are all, by construction, *tone-free*. They cannot be
funny. They cannot be sad. They cannot be about anything.

A passage can be all three. Stowaways is the only format in the genre where the
puzzle can be topical, seasonal, or a running joke — a Christmas passage that is
about Christmas, a passage on the day of a big final that is about the final, a
recurring cast (Uncle Ray is going to ruin more than one village fete). That is
an editorial surface, and editorial surfaces are how puzzle brands become
*institutions* rather than apps. The crossword did not become a cultural fixture
because of the grid.

It also means the game can be *good writing*, and good writing gets quoted. A
line like "Everyone agreed it was nice, really, that he had tried at all"
travels on its own merits with the puzzle attached to it.

**3. "I read that sentence nine times" is peak near-miss.**

The brief asks for "I was clever" or "I was SO close." Stowaways manufactures a
third thing that is stronger than either: **"I was looking straight at it."**

That is a confession, and confessions get replies. It's self-deprecating, so
posting it costs you nothing socially — unlike a bragged score, which invites
someone to beat it. And it is *universal*: everybody has the experience of
missing the obvious, so everybody who reads the post has a version of the same
story. The reply to a Wordle score is "nice." The reply to "OMELET was in *some
lettuce*, I read it four times" is everyone else in the chat opening the game to
see whether they'd have got it.

The keystone sharpens this to a point. Because `BREAKFAST` is hiding in
`heartbreak, fast`, the moment you see it you realise the answer was not just
present, it was the loudest word in the sentence. Missing the keystone is the
most annoying possible way to lose, which is exactly why it is the most posted.

**4. The mechanic is one sentence long.** "Six themed words are hiding in that
paragraph, ignoring the spaces." Nobody needs a tutorial, and a format nobody
needs to explain is a format that spreads by demonstration.

---

## The share artifact

```
STOWAWAYS #128
“First things first”
🔵🔵🟡⭐🔵⬜
keystone found 4th · 1 hint
sfun.games/stowaways
```

Five lines, no answer leakage, renders identically in a tweet and in iMessage.

**The clue line is deliberate and it is doing more work than it looks.** It is
the prompt every player sees *before* they start, so it gives away nothing —
but it means every day's share reads differently. `"First things first"`,
`"Back of the cupboard"`, `"Take the floor"`. A feed of Wordle grids is
identical from January to December; a feed of these is a different tiny riddle
every morning, and it is the only text share in the genre that a non-player can
find intriguing. That is the voice argument, made concrete in four words.

The emoji row is **your finds in the order you found them**, which is a much
richer story than a count:

- `🔵` a word you found cold
- `🟡` a word you needed a hint for
- `⭐` the keystone
- `⬜` one that got away

So the row above says: two clean, then a hint, then the keystone (which
presumably cracked it open), one more clean, and one you never saw. That is a
narrative arc in six characters.

The variants are visually distinct at a glance in a feed:

```
🔵🔵⭐🔵🔵🔵          ← clean sweep, keystone third. The flex.
⭐🔵🔵🔵🔵🔵          ← keystone FIRST. Showing off.
🟡🟡🟡🔵⬜⬜          ← a long, painful morning.
🔵🔵🔵🔵🔵⬜          ← five of six. The one that stings.
```

`⬜` at the end is doing the heavy lifting. A single trailing white square means
someone missed exactly one word, and everyone who sees it knows the person is
still thinking about it. It's bait, and the reply is always "which one?" — which
is a question you can only answer by making the other person play.

---

## Difficulty & content pipeline

Seven passages ship, hand-authored and machine-verified. I want to be straight
about this: **authoring is by far the most expensive thing about this format**,
and any pitch that pretends otherwise is lying to you. Here is the real plan.

**The cost is not the theme, it's the carrier.** Coming up with six-word themed
sets is nearly free — spices, planets, dances, metals, breeds of dog, Bond
films, London stations. There are thousands. The expensive part is finding a
piece of *natural English* that happens to contain `URANUS` across a word gap.
That is a needle-in-haystack search, and it's the one thing a human is bad at
and a machine is good at.

**So the tool is a carrier-phrase search, and it is the whole pipeline.**

Given a target word, enumerate every way to split it across a gap, then look up
each half in a precomputed index built from `shared/lexgen.raw.json`:

```
target: FROST
  F | ROST     words ending "f"      × words starting "rost"
  FR | OST     words ending "fr"     × words starting "ost"
  FRO | ST     words ending "fro"    × words starting "st"
  FROS | T     words ending "fros"   × words starting "t"
```

Score every resulting pair by how often that bigram actually occurs in ordinary
prose, and print the top candidates:

```
FROST
  ★ brief roster        common · both words high-frequency
    chief rostrum       ok
    scarf, Rostock      proper noun — flagged, deprioritised
    afro studded        awkward · "afro" is a low-frequency carrier
```

`brief roster` is at the top, so the constructor writes a wedding around a brief
roster of aisle etiquette and the sentence sounds like a sentence. This is not
theoretical — puzzle #2 shipped with `afro studded` in an early draft, it read
like a puzzle constraint, and the fix was exactly this: go back to the ranked
list and take a better carrier.

The search also runs the **three-token** splits (`yoU RAN US` for `URANUS`,
`inTO A STone` for `TOAST`), which are where the best carriers live because they
are the hardest for a human to see and the most natural to write around.

**The full authoring loop:**

1. Pick a theme and six words; the longest becomes the keystone and must be the
   theme name itself.
2. Run the carrier search on all six. Reject the theme if any word's best
   carrier is ugly — swapping `OMELET` for a different breakfast is free at this
   stage and impossible later.
3. Write a scene that can plausibly contain all six carriers. This is the human
   part and it is genuinely writing, not puzzle-filling: the passage has to be
   *about something*, with a shape and preferably a joke at the end.
4. Run `verify.js`. It is a hard gate on every property the mechanic needs:
   each word present exactly once (two occurrences = an ambiguous tap), each one
   crossing at least one word boundary, no two ranges overlapping, none visible
   as a plain word, keystone strictly longest and equal to the theme, passage
   under 260 letters, and a **decoy sweep** that warns if a same-theme word the
   player might reasonably try (`PEPPER`, `SAGE`, `NUTMEG` on a spices day) has
   snuck in and would read as a false positive.
5. Read it aloud. If it sounds like a constraint, it is one. Go back to step 3.

**Realistic throughput.** With the search tool, a competent constructor gets a
publishable passage in 25–40 minutes, and roughly one in four attempts gets
thrown away at step 5. Call it 45 minutes of writer time per shipped day. 365
days is about 275 hours plus editing — roughly one full-time constructor and a
part-time editor, which is precisely the shape of a newspaper crossword desk and
is a known, fundable cost. It is not cheap. It is also the moat: a format whose
content cannot be generated is a format nobody clones in a weekend.

**Two things make year two cheaper than year one.** First, a **carrier bank** —
every good carrier the search or a constructor finds gets banked with a
last-used date, so `given us` for `VENUS` is reusable in eighteen months but not
in eight weeks. Second, **recurring cast and settings**. Once Uncle Ray exists,
writing the next Uncle Ray passage is faster and better than writing a cold one,
and readers start looking forward to him.

**Difficulty is tuned by four dials,** and it should ramp across the week:

| Dial | Easier | Harder |
|---|---|---|
| Carrier obviousness | `samBA CONtest` — 2 tokens, clean split | `yoU RAN US` — 3 tokens, split at 1 and 4 |
| Keystone visibility | `heartBREAK, FAST` — reads as itself | `hoSPICE, Somehow` — buried in a long word |
| Theme breadth | BREAKFAST — six obvious members | SPICES — dozens of candidates, most wrong |
| Decoy pressure | few plausible near-members | many (`SAMBA` sitting in a DANCES puzzle text) |

Monday is a breakfast. Saturday is a spices puzzle where half the shelf would
have been a valid answer and only five are actually aboard.

---

## Open risks

**Authoring cost is the existential one.** Everything above is a plan to manage
it, not a plan to avoid it. If the constructor pipeline slips, the game degrades
in the worst possible way: not into an unfair puzzle, but into a *badly written*
one, and this format lives or dies on the passage reading like prose. A grid
game with a mediocre puzzle is still a game. Stowaways with a contorted passage
is just a wordsearch with extra steps. There is no graceful degradation here and
I would not pretend there is.

**There is no lose state, and a committee could kill it for that alone.** This
is the structural objection and I want it on the record before anyone else
raises it. You cannot fail Stowaways. There is no clock, no guess limit, no
score to protect — you either find all six or you press *Give up*. Wrong
guesses costing nothing is the soul of the mechanic (it is a game about
*looking*, not about *risking*, and a guess limit would turn a delightful
free-form search into an anxious one), but it means the only tension the game
has is the tension you bring to it. Compare The Rule, where a wrong call is a
guillotine. Stowaways' answer is that its drama is in the *reveal* rather than
the *outcome* — the sting is "it was in `heartbreak, fast` and I read it nine
times," not "I lost." I believe that is a real and durable feeling. I also
accept that it is a softer engine than a loss condition, and if the retention
data disagrees, the honest fix is a Hard Mode with a guess budget rather than
pretending the base game has stakes it doesn't.

**A hint is worth more than one sixth of a puzzle.** Hints flash the first
letter of an unfound word, and the near-miss feedback then tells you when your
start letter is right and only the length is wrong. Combined, a hint plus four
brute-force taps is close to a guaranteed word. The price — losing the clean
sweep, and a 🟡 in your share forever — is real but soft. Three hints may
therefore be one too many. I have deliberately not nerfed the near-miss
messages to fix it, because they are the best thing in the game; the cheaper
lever is dropping to two hints, and that is a number I would tune on data
rather than on instinct.

**Drag-select on a phone is genuinely fiddly and I don't fully trust it.**
Dragging across 9pt text with a thumb over the letters you're trying to see is
an awkward gesture, and it fights the browser's own text selection and scroll.
The mitigations shipped — tap-first-letter-then-last as a fully equal path,
nearest-neighbour hit testing with generous slop, `touch-action: none` on the
passage plus an autofit that guarantees the page never needs to scroll — and in
testing tap-tap is the faster input even for people who started out dragging. But
"we built a second input because the first one is uncomfortable" is a real
finding, and I'd want to watch whether anyone actually drags after day three. If
they don't, drag should probably go.

**A player can find a real word that isn't on the manifest and be told
"Nothing there."** If today's theme is SPICES and the passage happens to contain
`SAGE` across a gap, the player is *right* and the game says no. That's the most
unfair-feeling failure state available, and it's why `verify.js` sweeps a
hand-written decoy list per puzzle. But the decoy list is only as good as the
constructor's imagination, and the real fix is to sweep the full 36k lexicon at
build time and flag every incidental crossing word, then either rewrite or
accept it and add a softer response ("that's a word, but not one of today's
six"). Currently unbuilt. It should be built before launch.

**The keystone is a difficulty cliff, not a slope.** Finding it first turns a
four-minute puzzle into a ninety-second one, because it hands you the theme.
That's great for the share story — the variance is the story — but it means the
same puzzle is genuinely easy for some players and genuinely hard for others,
purely on the order they happened to look. I think that's a feature. I can also
see a version of the data where it reads as "inconsistent difficulty" and people
churn on the days they got unlucky.

**It's the most reading of any daily game, by a lot.** Two hundred and thirty
letters of prose before you can make a single move. Wordle asks for zero. Some
meaningful fraction of people will bounce off a paragraph on principle, and
that's a top-of-funnel cost the grid games simply don't pay. The counter is that
the people who *don't* bounce are exactly the people who buy puzzle
subscriptions, but I'd want the first-run experience to be a deliberately short,
deliberately funny passage rather than a hard one.

**Topicality is a trap as well as an asset.** A passage about a news event is
the most shareable thing this game can produce and also the thing most likely to
age badly, misfire, or need pulling at 6am. If the format leans on topicality it
needs an editor with a kill switch, which is a staffing commitment, not a
feature flag.

**One accessibility gap I haven't solved.** The passage is a field of
individually targetable letter spans; a screen reader user gets the text and the
live-region announcements but not a good way to *mark a range*. Arrow-key and
Enter navigation exists and works, and every find is announced, but reading
letter-by-letter through 230 characters to locate a word is not a real
experience. A "spell the word you found" text input would fix it outright and
should probably ship as an alternate input for everyone, not just as an
accessibility affordance.
