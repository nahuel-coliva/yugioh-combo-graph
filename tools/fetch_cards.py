"""Scarica testi e immagini delle carte dall'API pubblica di YGOPRODeck.

Genera cards.js (nomi e testi italiani dove disponibili) e riempie img/ con le
immagini piccole. Le immagini non stanno nel repository: questo script le
riscarica sia in locale sia durante la pubblicazione su GitHub Pages.

Uso:  python tools/fetch_cards.py            (salta le immagini gia' presenti)
      python tools/fetch_cards.py --force    (riscarica tutto)
"""
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
SETS = ["Structure Deck: Blue-Eyes White Destiny"]  # un set per ogni mazzo modellato
UA = {"User-Agent": "combo-graph-script/0.1"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


def cards_of(cardset, language=None):
    q = {"cardset": cardset}
    if language:
        q["language"] = language
    return json.loads(get(API + "?" + urllib.parse.urlencode(q)))["data"]


def main():
    force = "--force" in sys.argv
    out, images = {}, {}
    for cardset in SETS:
        italian = {c["id"]: c for c in cards_of(cardset, "it")}
        for c in cards_of(cardset):
            it = italian.get(c["id"], {})
            out[c["name"]] = {
                "id": c["id"],
                "it": it.get("name") or c["name"],
                "desc": it.get("desc") or c["desc"],
                "type": c["type"],
                "atk": c.get("atk"),
                "def": c.get("def"),
                "level": c.get("level"),
            }
            images[c["id"]] = c["card_images"][0]["image_url_small"]

    text = "window.CARD_INFO = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
    (ROOT / "cards.js").write_text(text, encoding="utf-8", newline="\n")
    print(f"cards.js: {len(out)} carte")

    img = ROOT / "img"
    img.mkdir(exist_ok=True)
    done = 0
    for cid, url in images.items():
        dest = img / f"{cid}.jpg"
        if dest.exists() and not force:
            continue
        dest.write_bytes(get(url))
        done += 1
        time.sleep(0.1)  # resta ben sotto il limite di richieste dell'API
    print(f"img/: {done} scaricate, {len(images) - done} gia' presenti")


if __name__ == "__main__":
    main()
