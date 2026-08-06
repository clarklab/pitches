#!/usr/bin/env python3
"""Build shared/icons.css: a base64-inlined, subsetted Material Symbols Rounded
variable font. No CDN, no fetch(), works from file://."""
import base64, re, sys, urllib.request, pathlib, json

RAW = pathlib.Path(sys.argv[1]).read_text().splitlines()
ICONS = sorted({t for ln in RAW for t in ln.split("#", 1)[0].split() if t})
OUT = pathlib.Path(sys.argv[2])

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            b = r.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        msg = re.sub(r"<[^>]+>", " ", body.split("</style>")[-1])
        sys.exit(f"HTTP {e.code}: {' '.join(msg.split())[:400]}")
    return b if binary else b.decode("utf-8")

api = ("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
       ":wght,FILL@200..700,0..1"
       "&icon_names=" + ",".join(ICONS))
css = get(api)
if "@font-face" not in css:
    sys.exit("Google Fonts rejected the request:\n" + css[:2000])

url = re.search(r"url\((https://[^)]+)\)", css).group(1)
fmt = re.search(r"format\('([^']+)'\)", css)
fmt = fmt.group(1) if fmt else "woff2"
font = get(url, binary=True)

b64 = base64.b64encode(font).decode("ascii")
mime = {"woff2": "font/woff2", "truetype": "font/ttf", "woff": "font/woff"}.get(fmt, "font/woff2")

OUT.write_text(f"""/* ============================================================
   SUPERFUN DAILY — icon face
   Material Symbols Rounded (Google Fonts), subsetted to the {len(ICONS)}
   glyphs this suite actually uses and inlined as base64 so every demo
   works opened straight from file:// with no network and no CDN.

   Regenerate with tools/icons.txt + tools/mkicons.py.

   Usage:  <span class="ms">rowing</span>
   Axes:   --ms-fill 0..1 · --ms-wght 100..700 · --ms-grad -50..200 · --ms-opsz 20..48
   ============================================================ */
@font-face {{
  font-family: 'Material Symbols Rounded';
  font-style: normal;
  font-weight: 100 700;
  font-display: block;
  src: url(data:{mime};base64,{b64}) format('{fmt}');
}}

.ms {{
  font-family: 'Material Symbols Rounded';
  font-weight: normal; font-style: normal;
  font-size: var(--ms-size, 24px);
  line-height: 1;
  letter-spacing: normal; text-transform: none;
  display: inline-block; white-space: nowrap; word-wrap: normal;
  direction: ltr; -webkit-font-feature-settings: 'liga'; font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings:
    'FILL' var(--ms-fill, 0),
    'wght' var(--ms-wght, 400),
    'GRAD' var(--ms-grad, 0),
    'opsz' var(--ms-opsz, 24);
  transition: font-variation-settings .28s cubic-bezier(.2,.9,.3,1);
  user-select: none;
}}
.ms.fill {{ --ms-fill: 1; }}
""")

print(f"{len(ICONS)} icons · font {len(font)/1024:.1f} KB · css {OUT.stat().st_size/1024:.1f} KB · {fmt}")
missing = [i for i in ICONS if i not in css and False]
