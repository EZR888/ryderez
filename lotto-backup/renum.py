#!/usr/bin/env python3
"""
renumber_csv.py
Renumber the first column of a CSV so that it starts at a given value
and decrements by 1 for each subsequent row.

Example:
    11422,1,6,16,19,20     ->   11492,1,6,16,19,20
    11421,4,27,28,30,34    ->   11491,4,27,28,30,34
"""

import csv
from pathlib import Path

# ─── CONFIGURATION ──────────────────────────────────────────────────────────
INPUT_FILE   = Path("lotto_1.csv")    # the file you already have
OUTPUT_FILE  = Path("lotto_1-fixed.csv")   # file to create
FIRST_NUMBER = 1450               # what the *first* row number should be
# ────────────────────────────────────────────────────────────────────────────

def renumber_csv(in_path: Path, out_path: Path, first_num: int) -> None:
    """Read *in_path*, renumber first column starting at *first_num*, save to *out_path*."""
    
    # 1) read the whole file
    with in_path.open(newline='', encoding='utf-8') as f:
        rows = list(csv.reader(f))
    
    # 2) determine new numbers (working backwards)
    new_num = first_num
    for row in rows:
        row[0] = str(new_num)
        new_num -= 1
    
    # 3) write out the renumbered file
    with out_path.open('w', newline='', encoding='utf-8') as f:
        csv.writer(f).writerows(rows)
    
    print(f"✅  {len(rows)} rows processed.")
    print(f"👉 First row now numbered {first_num}")
    print(f"👉 Last  row now numbered {first_num - len(rows) + 1}")
    print(f"💾 Output written to {out_path}")

if __name__ == "__main__":
    if not INPUT_FILE.exists():
        print(f"Error: {INPUT_FILE} does not exist.")
    else:
        renumber_csv(INPUT_FILE, OUTPUT_FILE, FIRST_NUMBER)

