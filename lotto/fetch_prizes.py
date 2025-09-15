import os
import re
import subprocess
from datetime import datetime
import warnings

import requests
from bs4 import BeautifulSoup
from urllib3.exceptions import NotOpenSSLWarning

# Silence LibreSSL warning (harmless here)
warnings.filterwarnings("ignore", category=NotOpenSSLWarning)

# ===================== Config =====================

OUTPUT_DIR = "/Volumes/2TBExt/Documents/GitHub/ryderez/lotto"

LOTTO_69 = os.path.join(OUTPUT_DIR, "lotto_69.txt")  # Powerball main 5
LOTTO_1  = os.path.join(OUTPUT_DIR, "lotto_1.txt")   # Powerball PB
LOTTO_39 = os.path.join(OUTPUT_DIR, "lotto_39.txt")  # Fantasy 5

GAME_CONFIG = {
    "powerball": {
        "url": "https://www.calottery.com/en/draw-games/powerball#section-content-2-3",
        "prefix": "pwb_",
        "main_range": (1, 69),
        "bonus_range": (1, 26),
        "main_count": 5,
        "total_count": 6,
        "numbers_file": (LOTTO_69, LOTTO_1),
    },
    "fantasy5": {
        "url": "https://www.calottery.com/en/draw-games/fantasy-5",
        "prefix": "f5_",
        "main_range": (1, 39),
        "bonus_range": None,
        "main_count": 5,
        "total_count": 5,
        "numbers_file": (LOTTO_39, None),
    },
}

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36"
)

# ===================== Small file helpers =====================

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def prepend_line(filepath: str, line: str):
    """Prepend a single line to a text file (create if missing)."""
    ensure_dir(os.path.dirname(filepath))
    old = ""
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            old = f.read().rstrip("\n")
    with open(filepath, "w", encoding="utf-8") as f:
        if old:
            f.write(line.rstrip("\n") + "\n" + old + "\n")
        else:
            f.write(line.rstrip("\n") + "\n")

def read_top_record(filepath: str):
    """
    Return (draw_number:str, numbers:list[int]) from the FIRST line of lotto_*.txt.
    If file or line missing, return (None, []).
    """
    if not os.path.exists(filepath):
        return None, []
    with open(filepath, "r", encoding="utf-8") as f:
        first = f.readline().strip()
    if not first:
        return None, []
    parts = [p.strip() for p in first.split(",") if p.strip()]
    if not parts or not parts[0].isdigit():
        return None, []
    draw = parts[0]
    nums = []
    for token in parts[1:]:
        if token.isdigit():
            nums.append(int(token))
    return draw, nums

def first_line_startswith_draw(filepath: str, draw_number: str) -> bool:
    d, _ = read_top_record(filepath)
    return d == draw_number

# ===================== Network & parsing helpers =====================

def fetch_page(url: str) -> str:
    resp = requests.get(
        url,
        headers={
            "User-Agent": UA,
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Cache-Control": "no-cache",
        },
        timeout=(12, 25),
    )
    resp.raise_for_status()
    return resp.text

DRAW_RE = re.compile(r"Draw\s*#\s*(\d+)", re.I)
JSON_DRAW_RE = re.compile(r'"drawNumber"\s*:\s*(\d+)', re.I)

def extract_draw_number(html: str, soup: BeautifulSoup):
    # 1) Original DOM hook
    el = soup.find("p", class_="draw-cards--draw-number")
    if el:
        m = DRAW_RE.search(el.get_text(" ", strip=True))
        if m:
            return m.group(1)

    # 2) Any text node with "Draw #"
    for node in soup.find_all(string=DRAW_RE):
        m = DRAW_RE.search(str(node))
        if m:
            return m.group(1)

    # 3) Prize table / caption area
    table = soup.find("table", class_="table-last-draw")
    if table:
        cap = getattr(table, "caption", None)
        if cap:
            m = DRAW_RE.search(cap.get_text(" ", strip=True))
            if m:
                return m.group(1)
        m = DRAW_RE.search(table.get_text(" ", strip=True))
        if m:
            return m.group(1)

    # 4) JSON blob fallback
    m = JSON_DRAW_RE.search(html)
    if m:
        return m.group(1)

    # 5) Whole-page text fallback
    m = DRAW_RE.search(soup.get_text(" ", strip=True))
    if m:
        return m.group(1)

    return None

def extract_numbers_sequence(text, main_range, main_count, bonus_range=None):
    cand = [int(x) for x in re.findall(r"\b\d{1,2}\b", text)]
    if not cand:
        return []
    lo_main, hi_main = main_range
    if bonus_range:
        lo_b, hi_b = bonus_range
        need = main_count + 1
        for i in range(0, len(cand) - need + 1):
            main = cand[i:i+main_count]
            bonus = cand[i+main_count]
            if (len(set(main)) == main_count and
                all(lo_main <= v <= hi_main for v in main) and
                lo_b <= bonus <= hi_b):
                return [*(str(v) for v in main), str(bonus)]
        return []
    else:
        for i in range(0, len(cand) - main_count + 1):
            main = cand[i:i+main_count]
            if len(set(main)) == main_count and all(lo_main <= v <= hi_main for v in main):
                return [str(v) for v in main]
        return []

def extract_winning_numbers(html: str, soup: BeautifulSoup, cfg):
    main_range  = cfg["main_range"]
    bonus_range = cfg["bonus_range"]
    main_count  = cfg["main_count"]
    total_count = cfg["total_count"]

    # 1) Their UL structure
    root = soup.select_one("ul.draw-cards--winning-numbers")
    if root:
        spans = root.select("span.draw-cards--winning-numbers-inner-wrapper") or root.find_all("span")
        texts = [s.get_text(strip=True) for s in spans]
        nums  = [int(x) for x in texts if re.fullmatch(r"\d{1,2}", x)]
        if bonus_range and len(nums) >= total_count:
            main = nums[:main_count]
            bonus = nums[main_count]
            if (len(set(main)) == main_count and
                all(main_range[0] <= n <= main_range[1] for n in main) and
                bonus_range[0] <= bonus <= bonus_range[1]):
                return [*(str(v) for v in main), str(bonus)]
        elif not bonus_range and len(nums) >= main_count:
            main = nums[:main_count]
            if len(set(main)) == main_count and all(main_range[0] <= n <= main_range[1] for n in main):
                return [str(v) for v in main]

    # 2) Any element mentioning "Winning Numbers"
    anchors = []
    for tag in soup.find_all(True):
        txt = tag.get_text(" ", strip=True)
        if txt and "winning numbers" in txt.lower():
            anchors.append(tag)
    for tag in anchors:
        seq = extract_numbers_sequence(tag.get_text(" ", strip=True), main_range, main_count, bonus_range)
        if seq:
            return seq

    # 3) Page text fallback
    seq = extract_numbers_sequence(soup.get_text(" ", strip=True), main_range, main_count, bonus_range)
    if seq:
        return seq

    # 4) Raw HTML fallback
    seq = extract_numbers_sequence(html, main_range, main_count, bonus_range)
    return seq

def save_prize_table_txt(rows, out_path):
    ensure_dir(OUTPUT_DIR)
    with open(out_path, "w", encoding="utf-8") as f:
        for row in rows:
            f.write("\t".join(row) + "\n")

def extract_prize_rows(soup: BeautifulSoup):
    table = soup.find("table", class_="table-last-draw")
    if not table:
        return []
    rows = []
    thead = table.find("thead")
    if thead:
        headers = [th.get_text(strip=True) for th in thead.find_all("th")]
        if headers:
            rows.append(headers)
    tbody = table.find("tbody")
    if tbody:
        for tr in tbody.find_all("tr"):
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if cells:
                rows.append(cells)
    return rows

# ===================== Core =====================

def handle_numbers_write(game_key, draw_number, winning_numbers):
    if game_key == "powerball":
        if len(winning_numbers) != 6:
            print("❌ Expected 6 Powerball numbers but got:", winning_numbers)
            return False

        # Duplicate guard by draw number
        if draw_number and first_line_startswith_draw(LOTTO_69, draw_number):
            print(f"⚠️ Draw #{draw_number} already in lotto_69.txt — skipping.")
            return False

        main = winning_numbers[:5]
        pb   = winning_numbers[5]

        # Duplicate guard by content
        top_draw, top_main = read_top_record(LOTTO_69)
        _, top_pb_only = read_top_record(LOTTO_1)
        top_pb = top_pb_only[0] if top_pb_only else None

        if top_main and top_pb is not None:
            if [int(x) for x in main] == top_main and int(pb) == top_pb:
                print("⚠️ Latest Powerball numbers match file top — skipping.")
                return False

        # Write
        prepend_line(LOTTO_69, f"{draw_number},{','.join(main)}")
        prepend_line(LOTTO_1,  f"{draw_number},{pb}")
        print(f"✅ Wrote lotto_69.txt and lotto_1.txt for draw #{draw_number}")
        return True

    else:  # fantasy5
        if len(winning_numbers) != 5:
            print("❌ Expected 5 Fantasy 5 numbers but got:", winning_numbers)
            return False

        if draw_number and first_line_startswith_draw(LOTTO_39, draw_number):
            print(f"⚠️ Draw #{draw_number} already in lotto_39.txt — skipping.")
            return False

        top_draw, top_main = read_top_record(LOTTO_39)
        if top_main:
            if [int(x) for x in winning_numbers] == top_main:
                print("⚠️ Latest Fantasy 5 numbers match file top — skipping.")
                return False

        prepend_line(LOTTO_39, f"{draw_number},{','.join(winning_numbers)}")
        print(f"✅ Wrote lotto_39.txt for draw #{draw_number}")
        return True

def fetch_lotto_data(game_key):
    cfg   = GAME_CONFIG[game_key]
    url   = cfg["url"]
    pref  = cfg["prefix"]

    # 1) Fetch page (with simple one-retry)
    try:
        html = fetch_page(url)
    except Exception as e:
        print(f"❌ Error fetching {game_key} page: {e}")
        return
    soup = BeautifulSoup(html, "html.parser")

    # 2) Extract numbers first
    numbers = extract_winning_numbers(html, soup, cfg)
    if not numbers:
        print(f"❌ No winning numbers found for {game_key}")
        return

    # 3) Extract or derive draw number
    draw_number = extract_draw_number(html, soup)
    derived = False
    if not draw_number:
        nums_file, _ = cfg["numbers_file"]
        top_draw, top_nums = read_top_record(nums_file)
        if top_nums and [int(x) for x in numbers[:len(top_nums)]] == top_nums:
            print(f"⚠️ {game_key}: numbers equal to file top and draw # unknown — skipping.")
            return
        if top_draw and top_draw.isdigit():
            draw_number = str(int(top_draw) + 1)
            derived = True
            print(f"ℹ️ {game_key}: draw # not found; derived next draw as #{draw_number}")
        else:
            print(f"❌ {game_key}: draw # not found and cannot derive — skipping.")
            return

    # 4) Write lotto_*.txts with guards
    wrote = handle_numbers_write(game_key, draw_number, numbers)

    # 5) Prize table
    if wrote:
        rows = extract_prize_rows(soup)
        if not rows:
            print(f"❌ Could not find prize table rows for {game_key}")
            return
        out = os.path.join(OUTPUT_DIR, f"{pref}{draw_number}.txt")
        save_prize_table_txt(rows, out)
        tag = " (derived draw #)" if derived else ""
        print(f"✅ Saved {game_key.title()} prize table to {out}{tag}")

def git_upload():
    try:
        os.chdir(OUTPUT_DIR)
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        subprocess.run("git add lotto_*.txt pwb_*.txt f5_*.txt", check=True, shell=True)
        result = subprocess.run("git diff --cached --quiet", shell=True)
        if result.returncode == 0:
            print("⚠️ No changes to commit.")
            return
        subprocess.run(f'git commit -m "🤖 Auto-update on {now}"', check=True, shell=True)
        print("✅ Changes committed.")
        subprocess.run("git push", check=True, shell=True)
        print("🚀 Changes pushed to GitHub.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git error: {e}")

# ===================== Run =====================

if __name__ == "__main__":
    for game in GAME_CONFIG:
        fetch_lotto_data(game)
    git_upload()

