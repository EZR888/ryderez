import os
import re
import csv
import requests
from bs4 import BeautifulSoup

# Output directory
OUTPUT_DIR = "/Volumes/2TBExt/Documents/GitHub/ryderez/lotto"

# Game URLs and filename prefixes
GAME_CONFIG = {
    "powerball": {
        "url": "https://www.calottery.com/en/draw-games/powerball",
        "prefix": "pwb"
    },
    "fantasy5": {
        "url": "https://www.calottery.com/en/draw-games/fantasy-5",
        "prefix": "f5"
    }
}

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
    filename = f"{prefix}{draw_number}.csv"
    filepath = os.path.join(OUTPUT_DIR, filename)

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
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print(f"✅ Saved {game_key.title()} results to {filepath}")

# Run both
for game in GAME_CONFIG:
    fetch_lotto_data(game)

