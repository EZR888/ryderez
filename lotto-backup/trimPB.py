import os
import re

output_filename = "all_drawings.csv"
input_prefix = "trimmed-"
input_suffix = ".txt"
input_files = []

# Collect files and ensure numeric sort
for filename in os.listdir("."):
    if filename.startswith(input_prefix) and filename.endswith(input_suffix):
        try:
            num = int(filename[len(input_prefix):-len(input_suffix)])
            input_files.append((num, filename))
        except ValueError:
            continue

# Sort by numeric part of filename
input_files.sort(key=lambda x: x[0])

# Extract single-line numbers between 01–26
all_numbers = []

for _, filename in input_files:
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if re.fullmatch(r"\d{2}", line) and 1 <= int(line) <= 26:
                all_numbers.append(str(int(line)))  # Remove leading zero

# Assign line numbers in reverse (most recent first)
starting_number = len(all_numbers)
print(f"📦 Total valid numbers found: {starting_number}")

with open(output_filename, "w", encoding="utf-8") as f_out:
    for i, num in enumerate(all_numbers):
        line_number = starting_number - i
        f_out.write(f"{line_number},{num}\n")

print(f"✅ Saved {starting_number} lines to {output_filename}")

