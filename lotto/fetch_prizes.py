import os
import re
import csv
import subprocess
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Output directory
OUTPUT_DIR = "/Volumes/2TBExt/Documents/GitHub/ryderez/lotto"

# File paths for lotto data
LOTTO_69 = os.path.join(OUTPUT_DIR, "lotto_69.txt")
LOTTO_1 = os.path.join(OUTPUT_DIR, "lotto_1.txt")
LOTTO_39 = os.path.join(OUTPUT_DIR, "lotto_39.txt")

# Game URLs and filename prefixes
GAME_CONFIG = {
    "powerball": {
        "url": "https://www.calottery.com/en/draw-games/powerball",
        "prefix": "pwb_"
    },
    "fantasy5": {
        "url": "https://www.calottery.com/en/draw-games/fantasy-5",
        "prefix": "f5_"
    }
}

def prepend_line_to_file(filepath, line):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            existing = f.read()
    else:
        existing = ""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(line.strip() + "\n" + existing.strip() + "\n")

def fetch_lotto_data(game_key):
    config = GAME_CONFIG[game_key]
    url = config["url"]
    prefix = config["prefix"]

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Error fetching {game_key} page: {e}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    # Get draw number
    draw_tag = soup.find("p", class_="draw-cards--draw-number")
    match = re.search(r"Draw #(\d+)", draw_tag.text if draw_tag else "")
    if not match:
        print(f"❌ Could not extract draw number for {game_key}")
        return
    draw_number = match.group(1)

    # Extract winning numbers
    number_spans = soup.select("ul.draw-cards--winning-numbers span.draw-cards--winning-numbers-inner-wrapper")
    winning_numbers = [span.text.strip() for span in number_spans]

    if not winning_numbers:
        print(f"❌ No winning numbers found for {game_key}")
        return

    # Write to lotto_*.txt
    if game_key == "powerball":
        if len(winning_numbers) != 6:
            print("❌ Expected 6 Powerball numbers but got:", winning_numbers)
            return
        main_numbers = winning_numbers[:5]
        powerball = winning_numbers[5]
        prepend_line_to_file(LOTTO_69, f"{draw_number}," + ",".join(main_numbers))
        prepend_line_to_file(LOTTO_1, f"{draw_number},{powerball}")
    elif game_key == "fantasy5":
        if len(winning_numbers) != 5:
            print("❌ Expected 5 Fantasy 5 numbers but got:", winning_numbers)
            return
        prepend_line_to_file(LOTTO_39, f"{draw_number}," + ",".join(winning_numbers))

    # Extract table
    table = soup.find("table", class_="table-last-draw")
    if not table:
        print(f"❌ Could not find prize table for {game_key}")
        return

    rows = []
    header_row = table.find("thead")
    if header_row:
        headers = [th.text.strip() for th in header_row.find_all("th")]
        rows.append(headers)

    body_rows = table.find("tbody").find_all("tr")
    for tr in body_rows:
        cells = [td.text.strip() for td in tr.find_all("td")]
        if cells:
            rows.append(cells)

    # Save to CSV
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"{prefix}{draw_number}.csv"
    filepath = os.path.join(OUTPUT_DIR, filename)
    # Save to tab-delimited TXT
    filepath = os.path.join(OUTPUT_DIR, filename.replace(".csv", ".txt"))
    with open(filepath, "w", encoding="utf-8") as f:
        for row in rows:
            f.write("\t".join(row) + "\n")

    print(f"✅ Saved {game_key.title()} results to {filepath}")

# Run both games
for game in GAME_CONFIG:
    fetch_lotto_data(game)

def git_upload():
    try:
        os.chdir(OUTPUT_DIR)
        subprocess.run(["git", "add", "lotto_*.txt", "pwb_*.txt", "f5_*.txt"], check=True, shell=True)
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        subprocess.run(f'git commit -m "🤖 Auto-update on {now}"', check=True, shell=True)
        subprocess.run("git push origin main", check=True, shell=True)
        print("✅ Changes pushed to GitHub.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git error: {e}")

git_upload()

