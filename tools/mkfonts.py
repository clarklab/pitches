#!/usr/bin/env python3
"""Inline a Google Fonts css2 query as base64 @font-face rules.

The brief says the demos must run opened straight from file:// with no CDN.
An @import to fonts.googleapis.com breaks that: offline, the type silently
falls back to system sans and every carefully-tuned tracking value is wrong.
So we fetch once at build time, keep only the latin + latin-ext subsets, and
ship the bytes inside the stylesheet.

    python3 tools/mkfonts.py <out.css> "<css2 query string>" [banner]

Query string is everything after `css2?`, e.g.
    "family=Newsreader:opsz,wght@6..72,200..800"
"""
import base64, re, sys, pathlib, urllib.request, urllib.error

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
KEEP = ("latin", "latin-ext")   # display-only faces pass --latin to halve this


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            b = r.read()
    except urllib.error.HTTPError as e:
        body = re.sub(r"<[^>]+>", " ", e.read().decode("utf-8", "replace").split("</style>")[-1])
        sys.exit(f"HTTP {e.code}: {' '.join(body.split())[:400]}")
    return b if binary else b.decode("utf-8")


def main():
    argv = [a for a in sys.argv[1:] if a != "--latin"]
    keep = ("latin",) if "--latin" in sys.argv else KEEP
    out = pathlib.Path(argv[0])
    query = argv[1]
    banner = argv[2] if len(argv) > 2 else out.stem

    css = get("https://fonts.googleapis.com/css2?" + query)
    if "@font-face" not in css:
        sys.exit("Google Fonts rejected the request:\n" + css[:1500])

    chunks, total = [], 0
    for block in re.split(r"(?=/\*)", css):
        sub = re.search(r"/\*\s*([a-z0-9-]+)\s*\*/", block)
        face = re.search(r"@font-face\s*\{(.*?)\}", block, re.S)
        if not sub or not face or sub.group(1) not in keep:
            continue
        body = face.group(1)
        url = re.search(r"url\((https://[^)]+)\)", body).group(1)
        fmt = re.search(r"format\('([^']+)'\)", body)
        fmt = fmt.group(1) if fmt else "woff2"
        data = get(url, binary=True)
        total += len(data)
        mime = {"woff2": "font/woff2", "woff": "font/woff", "truetype": "font/ttf"}.get(fmt, "font/woff2")
        body = re.sub(r"src:\s*url\(https://[^)]+\)\s*format\('[^']+'\)",
                      f"src: url(data:{mime};base64,{base64.b64encode(data).decode()}) format('{fmt}')",
                      body)
        fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        chunks.append(f"/* {fam} · {sub.group(1)} */\n@font-face {{{body}}}")

    if not chunks:
        sys.exit("No latin subsets found in the returned CSS.")

    out.write_text(
        "/* ============================================================\n"
        f"   SUPERFUN DAILY — {banner}\n"
        "   Google Fonts, latin + latin-ext only, inlined as base64 so every\n"
        "   demo renders correctly opened straight from file:// with no\n"
        "   network and no CDN. Regenerate with tools/mkfonts.py.\n"
        f"   Source query: css2?{query}\n"
        "   ============================================================ */\n"
        + "\n\n".join(chunks) + "\n")
    print(f"{out}  {len(chunks)} faces · {total/1024:.1f} KB fonts · {out.stat().st_size/1024:.1f} KB css")


if __name__ == "__main__":
    main()
