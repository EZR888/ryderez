#!/usr/bin/env python3
import os
import re
import sys
import subprocess
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import warnings
from urllib3.exceptions import NotOpenSSLWarning

warnings.filterwarnings("ignore", category=NotOpenSSLWarning)

# ===================== Config =====================
OUTPUT_DIR = "/Volumes/2TBExt/Documents/GitHub/ryderez/lotto"

LOTTO_69 = os.path.join(OUTPUT_DIR, "lotto_69.txt")
LOTTO_1  = os.path.join(OUTPUT_DIR, "lotto_1.txt")
LOTTO_39 = os.path.join(OUTPUT_DIR, "lotto_39.txt")
PALM5_TXT   = os.path.join(OUTPUT_DIR, "palm5.txt")
PALM5_DATES = os.path.join(OUTPUT_DIR, "palm5-dates.txt")

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36"
)

# ===================== Helpers =====================

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def prepend_line(filepath, line):
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

def read_top_record(filepath):
    if not os.path.exists(filepath):
        return None, []
    with open(filepath, "r", encoding="utf-8") as f:
        first = f.readline().strip()
    if not first:
        return None, []
    parts = [p.strip() for p in first.split(",") if p.strip()]
    if len(parts) < 2:
        return None, []
    draw = parts[0]
    nums = [int(x) for x in parts[1:] if x.isdigit()]
    return draw, nums

def fetch_page(url):
    resp = requests.get(f"{url}?_={int(time.time())}", headers={"User-Agent": UA}, timeout=(10, 20))
    resp.raise_for_status()
    return resp.text

# ===================== Scrapers =====================

def fetch_calottery(game_name, url, lotto_file, pb_file=None, debug=False):
    html = fetch_page(url)
    soup = BeautifulSoup(html, "html.parser")

    # Scrape numbers
    spans = soup.select("span.draw-cards--winning-numbers-inner-wrapper")
    nums = [int(s.get_text(strip=True)) for s in spans if s.get_text(strip=True).isdigit()]

    if not nums:
        print(f"❌ No winning numbers found for {game_name}.")
        return

    # Compare to existing file
    top_draw, top_nums = read_top_record(lotto_file)
    if not top_nums:
        print(f"⚠️ {game_name}: no existing record found, adding first entry.")
    elif sorted(nums[:5]) == sorted(top_nums[:5]):
        print(f"⚠️ {game_name} {nums} already exists in {os.path.basename(lotto_file)}.")
        return

    if debug:
        print(f"[DEBUG] {game_name}: {nums}")
        return

    # Write
    if pb_file and len(nums) == 6:
        pb = nums[5]
        prepend_line(lotto_file, f"{int(top_draw)+1 if top_draw and top_draw.isdigit() else 1},{','.join(map(str, nums[:5]))}")
        prepend_line(pb_file, f"{int(top_draw)+1 if top_draw and top_draw.isdigit() else 1},{pb}")
    elif len(nums) == 5:
        prepend_line(lotto_file, f"{int(top_draw)+1 if top_draw and top_draw.isdigit() else 1},{','.join(map(str, nums))}")
    else:
        print(f"❌ Unexpected number count for {game_name}: {nums}")
        return

    print(f"✅ {game_name} new draw: {nums}")

def fetch_palmetto5(debug=False):
    url = "https://sceducationlottery.com/Games/PalmettoCash5"
    try:
        html = fetch_page(url)
    except Exception as e:
        print(f"❌ Error fetching Palmetto 5: {e}")
        return

    soup = BeautifulSoup(html, "html.parser")

    # --- Extract the main numbers from <div class="darkblue-bg numbers"> ---
    num_div = soup.find("div", class_="darkblue-bg numbers")
    if not num_div:
        print("❌ Could not find Palmetto 5 number block.")
        return

    # Extract text like: "12 - 26 - 30 - 32 - 39"
    raw_text = num_div.get_text(strip=True)
    nums = [int(x) for x in re.findall(r"\d{1,2}", raw_text)]

    if len(nums) != 5:
        print(f"❌ Found {len(nums)} Palmetto 5 numbers, expected 5 → skipping.")
        return

    # Extract draw date (e.g., <p class="numbers-date">9/26/2025 Winning Numbers</p>)
    date_block = soup.find("p", class_="numbers-date")
    draw_date = None
    if date_block:
        m = re.search(r"(\d{1,2}/\d{1,2}/\d{4})", date_block.get_text(strip=True))
        if m:
            draw_date = m.group(1)

    # Compare with top record in palm5.txt
    top_draw, top_nums = read_top_record(PALM5_TXT)
    if top_nums and sorted(nums) == sorted(top_nums):
        print(f"⚠️ Palmetto 5 {nums} already exists in palm5.txt.")
        return

    if debug:
        print(f"[DEBUG] Palmetto 5 {draw_date}: {nums}")
        return

    next_draw = int(top_draw) + 1 if top_draw and top_draw.isdigit() else 1
    prepend_line(PALM5_TXT, f"{next_draw},{','.join(map(str, nums))}")
    if draw_date:
        prepend_line(PALM5_DATES, f"{next_draw},{draw_date}")

    print(f"✅ Palmetto 5 draw #{next_draw} ({draw_date}): {nums}")

# ===================== Git Upload =====================

def git_upload():
    os.chdir(OUTPUT_DIR)
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    subprocess.run("git add lotto_*.txt pwb_*.txt f5_*.txt palm5*.txt", shell=True)
    result = subprocess.run("git diff --cached --quiet", shell=True)
    if result.returncode == 0:
        print("⚠️ No changes to commit.")
        return
    subprocess.run(f'git commit -m "🤖 Auto-update on {now}"', shell=True)
    subprocess.run("git push", shell=True)
    print("🚀 Changes pushed to GitHub.")

# ===================== Main =====================

if __name__ == "__main__":
    debug = "--debug" in sys.argv
    print("🔹 Fetching latest lottery results...\n")

    fetch_calottery("Powerball", "https://www.calottery.com/en/draw-games/powerball", LOTTO_69, LOTTO_1, debug)
    fetch_calottery("Fantasy 5", "https://www.calottery.com/en/draw-games/fantasy-5", LOTTO_39, None, debug)
    fetch_palmetto5(debug)

    if not debug:
        git_upload()
