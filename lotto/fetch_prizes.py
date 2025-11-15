#!/usr/bin/env python3
from pathlib import Path
import os
import re
import sys
import time
import subprocess
from datetime import datetime
import warnings

import requests
from bs4 import BeautifulSoup
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

def ensure_dir(path: str):
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
    """
    Returns (draw_number_str, [nums...]) from the first line of a lotto file,
    or (None, []) if file missing/empty/malformed.
    """
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
    nums = []
    for x in parts[1:]:
        try:
            nums.append(int(x))
        except ValueError:
            pass
    return draw, nums

def fetch_page(url: str) -> str:
    resp = requests.get(f"{url}?_={int(time.time())}", headers={"User-Agent": UA}, timeout=(10, 20))
    resp.raise_for_status()
    return resp.text

# ========= Prize table extraction & saving (helpers) =========

def prize_out_path(game_key: str, draw_number: str) -> Path:
    """
    Where to save the TSV (tab-separated) prize table. Filenames match the front-end:
    e.g., pwb_12345.txt or f5_12345.txt
    """
    game_key = (game_key or "").lower()
    return Path(OUTPUT_DIR) / f"{game_key}_{draw_number}.txt"

def pending_flag_path(game_key: str, draw_number: str) -> Path:
    """
    Sidecar file indicating prizes not yet posted; allows a later retry.
    """
    game_key = (game_key or "").lower()
    return Path(OUTPUT_DIR) / f"{game_key}_{draw_number}.pending"

def save_prize_table_txt(rows, out_path: Path) -> None:
    """
    Save rows (list of list[str]) to a TSV file with a header row included.
    """
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8", newline="") as f:
        for row in rows:
            f.write("\t".join([str(c).strip() for c in row]) + "\n")

def looks_like_prize_table(rows) -> bool:
    """
    True only for real draw prize tables (with winners + dollar/payout column).
    Rejects static 'Odds' tables.
    """
    if not rows or len(rows) < 2:
        return False

    header = [str(h).strip().lower() for h in rows[0]]
    body   = rows[1:]

    has_winners   = any(re.search(r"winner|winning tickets?|tickets?", h) for h in header)
    has_prize_col = any(re.search(r"prize|payout|amount|cash", h) for h in header)
    has_odds      = any("odd" in h for h in header)

    # Extra hint from body: money amounts or "Free Play"
    body_has_money = any(
        any("$" in str(c) or re.search(r"\d[\d,]*\.\d{2}", str(c)) or "free" in str(c).lower() for c in row)
        for row in body
    )

    return (has_winners and (has_prize_col or body_has_money)) and not has_odds

def extract_prize_rows(soup: BeautifulSoup):
    """
    Find a prize table on the page and return it as rows (list of cells per row).
    Heuristic: a table with a 'winners' column and prize $ amounts, not an 'odds' table.
    Scans all <table> elements and picks the first that passes looks_like_prize_table.
    """
    tables = soup.find_all("table")

    for tbl in tables:
        rows = []

        # header
        thead = tbl.find("thead")
        if thead:
            hdr = [th.get_text(strip=True) for th in thead.find_all(["th","td"])]
            if hdr:
                rows.append(hdr)

        # body
        tbodies = tbl.find_all("tbody") or [tbl]
        body_rows = []
        for body in tbodies:
            for tr in body.find_all("tr"):
                cells = tr.find_all(["td", "th"])
                if not cells:
                    continue
                body_rows.append([c.get_text(strip=True) for c in cells])

        if not rows and body_rows:
            # Treat the first TR as header if it looks like one
            rows = [body_rows[0]] + body_rows[1:]
        else:
            rows.extend(body_rows)

        if looks_like_prize_table(rows):
            return rows

    # fallback: try sections/divs with prize-ish class names
    prize_sections = soup.find_all(
        lambda tag: tag.name in ("section","div") and "priz" in " ".join(tag.get("class", [])).lower()
    )
    for sec in prize_sections:
        header = [b.get_text(strip=True) for b in sec.find_all("b")]
        rows = [header] if header else []

        for tr in sec.find_all(["tr","li","p","div"]):
            tds = tr.find_all(["td","span","div"])
            if not tds:
                continue
            row = [td.get_text(strip=True) for td in tds]
            if any(row):
                rows.append(row)
        if looks_like_prize_table(rows):
            return rows

    return []

def process_prize_table(game_key: str, draw_number: str, soup: BeautifulSoup) -> bool:
    """
    Try to extract + save the prize table for this draw.
    If already saved, return True.
    If not ready, create a .pending flag and return False.
    """
    out  = prize_out_path(game_key, draw_number)
    flag = pending_flag_path(game_key, draw_number)

    # 0) Already have a prize file? trust it and clear pending
    if out.exists() and out.stat().st_size > 20:
        if flag.exists():
            try:
                flag.unlink()
            except Exception:
                pass
        print(f"✅ {game_key.upper()} prize table already present: {out}")
        return True

    # 1) Try to find and save a fresh prize table
    rows = extract_prize_rows(soup)
    if looks_like_prize_table(rows):
        save_prize_table_txt(rows, out)
        if flag.exists():
            try:
                flag.unlink()
            except Exception:
                pass
        print(f"✅ Saved {game_key.upper()} prize table to {out}")
        return True

    # 2) Not ready yet → mark pending
    try:
        flag.write_text(datetime.now().isoformat(), encoding="utf-8")
    except Exception:
        pass
    print(f"⏳ {game_key.upper()} prize amounts not posted yet for draw #{draw_number}. Will retry later.")
    return False

def fetch_and_save_prizes(game_key: str, page_url: str, lotto_file: str):
    """
    Re-fetch the page HTML, infer the current draw from lotto_file,
    and attempt to extract & save prize table TSV.
    """
    try:
        html = fetch_page(page_url)
    except Exception as e:
        print(f"❌ Error fetching prize page for {game_key}: {e}")
        return False

    soup = BeautifulSoup(html, "html.parser")

    # infer current draw (top of lotto file after any updates)
    top_draw, _ = read_top_record(lotto_file)
    draw_number = str(top_draw or "").strip()
    if not draw_number:
        # Fallback: try to guess from page (look for '#12345' tokens)
        m = re.search(r"#\s*(\d{3,})", soup.get_text(" ", strip=True))
        if m:
            draw_number = m.group(1)

    if not draw_number:
        print(f"⚠️ Could not infer draw number for {game_key}; skipping prizes export.")
        return False

    return process_prize_table(game_key, draw_number, soup)

# ===================== Scrapers =====================

def fetch_calottery(game_name: str, url: str, lotto_file: str, pb_file: str = None, debug: bool = False):
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
    next_draw = int(top_draw) + 1 if top_draw and str(top_draw).isdigit() else 1
    if pb_file and len(nums) == 6:
        pb = nums[5]
        prepend_line(lotto_file, f"{next_draw},{','.join(map(str, nums[:5]))}")
        prepend_line(pb_file,    f"{next_draw},{pb}")
    elif len(nums) == 5:
        prepend_line(lotto_file, f"{next_draw},{','.join(map(str, nums))}")
    else:
        print(f"❌ Unexpected number count for {game_name}: {nums}")
        return

    print(f"✅ {game_name} new draw: {nums}")

def fetch_palmetto5(debug: bool = False):
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

    next_draw = int(top_draw) + 1 if top_draw and str(top_draw).isdigit() else 1
    prepend_line(PALM5_TXT,   f"{next_draw},{','.join(map(str, nums))}")
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

    # Pull latest numbers
    fetch_calottery("Powerball", "https://www.calottery.com/en/draw-games/powerball", LOTTO_69, LOTTO_1, debug)
    fetch_calottery("Fantasy 5", "https://www.calottery.com/en/draw-games/fantasy-5", LOTTO_39, None, debug)
    fetch_palmetto5(debug)

    # Export prize tables (Powerball + Fantasy 5) — run even if numbers didn't change
    try:
        fetch_and_save_prizes("pwb", "https://www.calottery.com/en/draw-games/powerball", LOTTO_69)
    except Exception as e:
        print(f"❌ Prize export failed for PWB: {e}")
    try:
        fetch_and_save_prizes("f5", "https://www.calottery.com/en/draw-games/fantasy-5", LOTTO_39)
    except Exception as e:
        print(f"❌ Prize export failed for F5: {e}")

    if not debug:
        git_upload()
