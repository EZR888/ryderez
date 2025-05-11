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

# Extract drawing lines
all_drawings = []

for _, filename in input_files:
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if re.match(r"^\d{2},&nbsp;", line):
                numbers = line.replace("&nbsp;", "").split(",")
                all_drawings.append(numbers)

# Assign drawing numbers (starting with most recent = largest number)
starting_number = len(all_drawings)
print(f"📦 Total drawings found: {starting_number}")

with open(output_filename, "w", encoding="utf-8") as f_out:
    for i, nums in enumerate(all_drawings):
        draw_number = starting_number - i
        output_line = ",".join([str(draw_number)] + nums)
        f_out.write(output_line + "\n")

print(f"✅ Saved {starting_number} drawings to {output_filename}")

