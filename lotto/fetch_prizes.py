import os
import re
import time
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

LOTTO_69 = os.path.join(OUTPUT_DIR, "lotto_69.txt")   # Powerball main 5
LOTTO_1  = os.path.join(OUTPUT_DIR, "lotto_1.txt")    # Powerball PB
LOTTO_39 = os.path.join(OUTPUT_DIR, "lotto_39.txt")   # Fantasy 5
PALM5    = os.path.join(OUTPUT_DIR, "palm5.txt")      # Palmetto Cash 5
PALM5_DATES = os.path.join(OUTPUT_DIR, "palm5-dates.txt")

GAME_CONFIG = {
    "powerball": {
        "url": "https://www.calottery.com/en/draw-games/powerball",
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

# ===================== Helpers =====================

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def prepend_line(filepath: str, line: str):
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
    nums = [int(p) for p in parts[1:] if p.isdigit()]
    return draw, nums

def first_line_startswith_draw(filepath: str, draw_number: str) -> bool:
    d, _ = read_top_record(filepath)
    return d == draw_number

def fetch_page(url: str) -> str:
    ts = int(time.time())
    sep = "&" if "?" in url else "?"
    busted = f"{url}{sep}_={ts}"
    resp = requests.get(busted, headers={"User-Agent": UA}, timeout=(12, 25))
    resp.raise_for_status()
    return resp.text

# ===================== Palmetto Cash 5 =====================

def fetch_palmetto5():
    """
    Fetches the latest Palmetto Cash 5 numbers and prepends them to palm5.txt,
    and logs the date to palm5-dates.txt.
    """
    url = "https://sceducationlottery.com/Games/PalmettoCash5"
    try:
        html = fetch_page(url)
    except Exception as e:
        print(f"❌ Error fetching Palmetto 5 page: {e}")
        return

    soup = BeautifulSoup(html, "html.parser")

    # Extract draw date
    date_tag = soup.find("p", class_="numbers-date")
    if not date_tag:
        print("❌ Could not find Palmetto 5 date.")
        return
    date_text = date_tag.get_text(strip=True).replace("Winning Numbers", "").strip()

    try:
        draw_date = datetime.strptime(date_text, "%m/%d/%Y").date()
    except ValueError:
        print(f"⚠️ Invalid date format for Palmetto 5: {date_text}")
        return

    # Extract 5 numbers
    num_tags = soup.find_all("span", class_="number-circle")
    if len(num_tags) < 5:
        print(f"❌ Found only {len(num_tags)} numbers for Palmetto 5.")
        return
    numbers = [int(tag.get_text(strip=True)) for tag in num_tags[:5]]

    # Determine next draw number
    try:
        last_draw, _ = read_top_record(PALM5)
        next_draw = str(int(last_draw) + 1) if last_draw else "1"
    except Exception:
        next_draw = "1"

    # Duplicate check
    if first_line_startswith_draw(PALM5, next_draw):
        print(f"⚠️ Palmetto 5 draw #{next_draw} already exists — skipping.")
        return

    # Write to palm5.txt
    prepend_line(PALM5, f"{next_draw},{','.join(map(str, numbers))}")
    prepend_line(PALM5_DATES, f"{next_draw},{date_text}")

    print(f"✅ Palmetto 5 draw #{next_draw} ({date_text}): {numbers}")

# ===================== Existing logic (unchanged) =====================

def fetch_lotto_data(game_key):
    cfg   = GAME_CONFIG[game_key]
    url   = cfg["url"]

    try:
        html = fetch_page(url)
    except Exception as e:
        print(f"❌ Error fetching {game_key} page: {e}")
        return

    soup = BeautifulSoup(html, "html.parser")

    # Extract numbers (existing helper functions still apply)
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
                if (
                    len(set(main)) == main_count
                    and all(lo_main <= v <= hi_main for v in main)
                    and lo_b <= bonus <= hi_b
                ):
                    return [*(str(v) for v in main), str(bonus)]
            return []
        else:
            for i in range(0, len(cand) - main_count + 1):
                main = cand[i:i+main_count]
                if len(set(main)) == main_count and all(lo_main <= v <= hi_main for v in main):
                    return [str(v) for v in main]
            return []

    # Try to find numbers directly from the page
    seq = extract_numbers_sequence(soup.get_text(" ", strip=True),
                                   cfg["main_range"],
                                   cfg["main_count"],
                                   cfg["bonus_range"])
    if not seq:
        print(f"❌ No numbers found for {game_key}")
        return

    draw_number = str(int(read_top_record(cfg["numbers_file"][0])[0]) + 1) if read_top_record(cfg["numbers_file"][0])[0] else "1"

    if game_key == "powerball":
        prepend_line(cfg["numbers_file"][0], f"{draw_number},{','.join(seq[:5])}")
        prepend_line(cfg["numbers_file"][1], f"{draw_number},{seq[5]}")
        print(f"✅ Powerball #{draw_number}: {seq}")
    elif game_key == "fantasy5":
        prepend_line(cfg["numbers_file"][0], f"{draw_number},{','.join(seq)}")
        print(f"✅ Fantasy 5 #{draw_number}: {seq}")

def git_upload():
    try:
        os.chdir(OUTPUT_DIR)
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # include Palmetto 5 files too
        subprocess.run(
            "git add lotto_*.txt pwb_*.txt f5_*.txt palm5.txt palm5-dates.txt",
            check=True,
            shell=True
        )

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

    # ✅ Add Palmetto 5 (new)
    fetch_palmetto5()

    git_upload()
