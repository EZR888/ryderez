import csv
import sys
from itertools import combinations

def load_csv(filename):
    """Load CSV and return a list of rows (as lists of ints)."""
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        data = []
        for row in reader:
            try:
                numbers = [int(x.strip()) for x in row if x.strip().isdigit()]
                data.append(numbers)
            except ValueError:
                continue  # skip rows with invalid data
    return data

def find_matches(rows, input_numbers):
    """Find rows with 3, 4, or 5 number matches."""
    matches = []

    # Precompute all 3-, 4-, and 5-number subsets of input_numbers
    subsets = []
    for size in range(3, 6):
        subsets.extend(combinations(sorted(input_numbers), size))

    for idx, row in enumerate(rows):
        row_set = set(row)
        for subset in subsets:
            if set(subset).issubset(row_set):
                matches.append((idx + 1, row, subset))  # idx+1 for human row numbering
                break  # Only report first matching subset

    return matches

def main():
    if len(sys.argv) != 2:
        print("Usage: python find_matches.py yourfile.csv")
        sys.exit(1)

    filename = sys.argv[1]
    rows = load_csv(filename)

    user_input = input("Enter 5 comma-separated numbers: ").strip()
    try:
        input_numbers = [int(x.strip()) for x in user_input.split(',')]
        if len(input_numbers) != 5:
            print("❌ Please enter exactly 5 numbers.")
            sys.exit(1)
    except ValueError:
        print("❌ Invalid input format. Please enter integers separated by commas.")
        sys.exit(1)

    matches = find_matches(rows, input_numbers)

    if not matches:
        print("No matches found.")
    else:
        print(f"✅ Found {len(matches)} matching rows:")
        for row_num, row_data, matching_subset in matches:
            print(f"Row {row_num}: {row_data} (matched {list(matching_subset)})")

if __name__ == "__main__":
    main()

