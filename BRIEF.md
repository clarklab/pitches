# SUPERFUN DAILY — shared build brief

Five pitches for a daily word game worthy of a major games lineup.
Every builder follows this brief so the five read as one suite.

## The bar

The reason people post Wordle every day is **one of two feelings**:

1. **"I was clever."** A non-obvious solution they found and want credit for.
2. **"I was SO close."** A near-miss that stings enough to need witnesses.

A pitch that produces neither is dead. Every mechanic below must reliably
manufacture at least one of them, every single day, and leave behind a
**shareable artifact** that encodes the story without spoiling the answer.

## Non-negotiables

- **Mobile first.** Thumb-reachable, no hover dependencies, no drag where a tap
  will do, 44px minimum touch targets. Then make it good on desktop too.
- **A puzzle a day, but never a lockout.** Ships with 6+ hand-authored puzzles.
  The local date sets which one you *open* on, so everyone alive today starts
  on the same board and the share number means something — but finishing one,
  won or lost, hands you the next one immediately. Use `Kit.puzzleNo(ns)` for
  the number, the share line and the save key; `Kit.pick(list, ns)` to select;
  and end every result with `Kit.nextButton(ns)`. `?d=N` pins one for review.
  **No countdown-to-midnight, no "come back tomorrow", anywhere.** A reviewer
  has to be able to play four in a row, and a player who just lost has to be
  able to see the result and immediately play on.
- **Under 3 minutes** to play. Daily habits die on 20-minute puzzles.
- **No dead ends without drama.** Losing must feel like a near miss, not a wall.
  A loss shows its result screen straight away — never on the next visit.
- **Zero build step.** Static HTML/CSS/JS. Must work opened from `file://`
  and served over http. No CDNs, no frameworks, no fetch() of local files
  (that breaks `file://` — inline data or use a `<script>` data file).
- **Self-explanatory.** A first-timer plays without reading rules. The help
  sheet auto-opens on first visit only.

## Shared kit (use it, don't reinvent it)

`../shared/kit.css` — design tokens, light/dark, buttons, tiles, sheets,
toasts, share grid, on-screen keyboard, stat rows.
`../shared/kit.js` — `Kit.dayNumber() pick() dateLabel() countdown() rng()
store() toast() sheet() share() keyboard() haptic() flash() esc() helpButton()`

Set your accent on `:root` in your own `<style>`:
```css
:root { --accent: #1f7a63; --accent-soft: #d9ece5; --accent-ink: #fff; }
```

Structure every demo the same way:
```html
<div class="app">
  <div class="bar">…back · TITLE · help…</div>
  <div class="prompt"><span class="k">Objective</span><span class="v">…</span></div>
  <div class="stage">…the board…</div>
  <div id="kbd"></div>
</div>
```

## Data available in `shared/`

- `lex4.js` — `window.LEX4`, a Set of 2,824 common 4-letter words.
- `lexgen.raw.json` — 36,273 common English words, 3–12 letters, frequency
  filtered. **Build-time raw material.** Do not ship the whole thing; derive
  the subset your puzzles actually need and inline it.
- `compounds.raw.json` — `{firstWord: [secondWord, …]}`, ~4,000 auto-derived
  closed compounds. **Noisy** — contains morphological accidents (`pen`+`chant`,
  `sun`+`ken`, `star`+`ter`). Mine it, then hand-curate. Never ship it raw.

Hand-authored content beats generated content. Generated content that has been
hand-checked is fine. Unchecked generated content will fail review.

## The share artifact

Every game ends with a copyable block. Format:

```
GAMENAME #128
<emoji story of how it went>
sfun.games/gamename
```

Rules: no answer leakage, tells a story at a glance, ≤6 lines, renders in a
tweet and in iMessage. Use `Kit.share()`.

## Definition of done

- [ ] Playable start to finish on a 390×844 phone viewport, thumb only.
- [ ] Playable on desktop with a physical keyboard.
- [ ] Win state AND lose state both implemented, both feel good.
- [ ] Share artifact copies to clipboard.
- [ ] Progress persists on reload (`Kit.store`); a finished puzzle reopens its
      result rather than restarting — and offers the next puzzle immediately.
- [ ] No lockout: from a finished board, win or lose, you can play on at once.
- [ ] 6+ puzzles, every one solved and verified by you before you claim done.
- [ ] Light and dark both look deliberate.
- [ ] No console errors.
- [ ] `PITCH.md` written (see template in your task).
