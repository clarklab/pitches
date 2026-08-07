# Superfun Daily — five daily word games

Five finished, playable pitches for a daily word game. Open
[`index.html`](index.html) and play them.

No build step, no dependencies, no network. Every one of them runs opened
straight from `file://` or served over http. Together they are about 1.2 MB,
most of which is inlined typography.

| | | |
|---|---|---|
| [**Chains**](chains/) | Compound-word golf | Three holes, a par, no undo. Every word must form a compound with the last. |
| [**The Rule**](rule/) | Deduction | Six words: three obey a hidden law, three break it. Six probes. One call. |
| [**Shunt**](shunt/) | Sliding grid | Push rows and columns of a 4×4 tray until all four rows spell words. |
| [**Seed**](seed/) | Anagram planning | A letter arrives each turn from a queue everyone can see coming. Use them all. |
| [**Stowaways**](stowaways/) | Hidden in prose | Six themed words hide across the gaps in two ordinary sentences. |

The argument for all five is in [`BRIEF.md`](BRIEF.md): a daily puzzle earns a
share only if it reliably manufactures one of two feelings — *I was clever* or
*I was SO close* — and leaves behind an artifact that tells that story without
spoiling the answer.

## Playing and reviewing

- The local date picks which puzzle you **open** on, so everyone starts the day
  on the same board and the share number means something.
- **There is no lockout.** Finishing a puzzle — won or lost — hands you the next
  one immediately. A loss shows its result screen straight away.
- `?d=N` pins a specific puzzle, for review or for reproducing a bug.
- Every game ships 6+ hand-authored, machine-verified puzzles.

## Layout

```
index.html          the pitch cover
BRIEF.md            the shared build brief every game is held to
<game>/index.html   one self-contained game — markup, styles and logic
<game>/puzzles.js   its hand-authored puzzle data
<game>/verify.js    proves every shipped puzzle is solvable  (node <game>/verify.js)
<game>/font.css     that game's display face, inlined
<game>/PITCH.md     the case for that game
shared/kit.css      design tokens, layout, motion vocabulary, components
shared/kit.js       rotation, persistence, sheets, toasts, share, coach marks
shared/fonts.css    Google Sans Flex + Google Sans Code, inlined
shared/icons.css    Material Symbols Rounded, subsetted and inlined
tools/              regenerate the inlined fonts and the icon subset
```

## One kit, five products

The five share a kit so they read as one publisher's lineup: the same app bar,
the same result-sheet anatomy, the same share format, the same motion tokens,
one light/dark theme shared across all five.

What is deliberately *not* shared is identity. Each game has its own display
face, colour world, surface language, board metaphor and motion signature —
Fraunces for a golf club's scorecard, Space Grotesk for a lab bench, Archivo
Expanded for a machine panel, Instrument Serif for a botanical plate, and
Newsreader for a newspaper column. Cover any two screenshots and swap them and
it should be obvious.

### Typography and icons are inlined on purpose

The brief requires these to run from `file://`. A CDN `@import` breaks that
silently: offline the type falls back to system sans and every tracking value
in the kit becomes wrong. So the faces are fetched once at build time, cut to
the latin subset, and shipped as base64 inside the stylesheet. Icons are
[Material Symbols](https://fonts.google.com/icons) Rounded, subsetted to the
132 glyphs the suite actually uses (58 KB) with the `FILL` and `wght` axes live
— which is how an icon can interpolate between its outlined and solid drawing
when you press it.

Regenerate either after changing what is used:

```bash
python3 tools/mkicons.py tools/icons.txt shared/icons.css
```

```bash
python3 tools/mkfonts.py shared/fonts.css "family=Google+Sans+Code:wght@400..700&family=Google+Sans+Flex:wght@300..800" "suite type"
```

`tools/icons.txt` must stay alphabetically sorted — the Google Fonts API
rejects the request otherwise.

## Verifying

Every game's puzzle data is machine-checked. Run them from the repo root:

```bash
for g in chains rule shunt seed stowaways; do node $g/verify.js; done
```

## Bar

Held to the checklist at the end of [`BRIEF.md`](BRIEF.md): playable thumb-only
on a 390×844 phone and with a physical keyboard on desktop; win and lose states
both implemented and both worth the screenshot; progress persists; light and
dark both deliberate; no console errors; every puzzle solved and verified
before it shipped.
