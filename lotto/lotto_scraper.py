import requests
from bs4 import BeautifulSoup
import csv
import os

def fetch_and_process(url, prefix, lotto_file, bonus_file=None):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Get draw number
    draw_tag = soup.find('p', class_='draw-cards--draw-number')
    draw_number = draw_tag.text.strip().replace("Draw #", "") if draw_tag else "unknown"

    # Get winning numbers
    number_spans = soup.select('ul.draw-cards--winning-numbers span.draw-cards--winning-numbers-inner-wrapper')
    numbers = [span.text.strip() for span in number_spans]
    if not numbers:
        print(f"⚠️ Could not find numbers for {prefix.upper()} draw #{draw_number}")
        return

    # Build output line and filenames
    csv_filename = f"/Volumes/2TBExt/Documents/GitHub/ryderez/lotto/{prefix}{draw_number}.csv"
    numbers_row = [draw_number] + numbers

    # Write prize table CSV
    table = soup.find('table', class_='table-last-draw')
    if table:
        tbody = table.find('tbody')
        if tbody:
            rows = []
            for tr in tbody.find_all('tr'):
                cols = [td.get_text(strip=True) for td in tr.find_all('td')]
                rows.append(cols)

            with open(csv_filename, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerows(rows)
            print(f"✅ Saved prize table: {csv_filename}")
        else:
            print(f"⚠️ No tbody found in table for {prefix.upper()}")
    else:
        print(f"⚠️ No prize table found for {prefix.upper()}")

    # Write draw numbers to appropriate files
    lotto_path = f"/Volumes/2TBExt/Documents/GitHub/ryderez/lotto/{lotto_file}"
    if prefix == 'pwb' and bonus_file:
        base_nums = numbers_row[:6]  # first 6 values
        bonus_num = [numbers_row[6]] # Powerball
        prepend_line(lotto_path, ','.join(base_nums))
        prepend_line(f"/Volumes/2TBExt/Documents/GitHub/ryderez/lotto/{bonus_file}", bonus_num[0])
    else:
        prepend_line(lotto_path, ','.join(numbers_row))

def prepend_line(file_path, line):
    if not os.path.exists(file_path):
        open(file_path, 'w').close()
    with open(file_path, 'r') as f:
        existing = f.read()
    with open(file_path, 'w') as f:
        f.write(line + '\n' + existing)
    print(f"✅ Updated {os.path.basename(file_path)} with: {line}")

# ── MAIN ───────────────────────────────────────
fetch_and_process(
    url="https://www.calottery.com/en/draw-games/powerball",
    prefix="pwb",
    lotto_file="lotto_69.txt",
    bonus_file="lotto_1.txt"
)

fetch_and_process(
    url="https://www.calottery.com/en/draw-games/fantasy-5",
    prefix="f5",
    lotto_file="lotto_39.txt"
)

