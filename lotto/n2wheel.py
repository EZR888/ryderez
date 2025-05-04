import random
import csv
from collections import defaultdict

def get_user_numbers():
    print("Enter 18 unique numbers between 1 and 39 (separated by spaces):")
    while True:
        try:
            user_input = input("> ")
            numbers = sorted(set(int(x) for x in user_input.strip().split()))
            if len(numbers) != 18 or any(n < 1 or n > 39 for n in numbers):
                raise ValueError
            return numbers
        except ValueError:
            print("Invalid input. Please enter exactly 18 unique numbers between 1 and 39.")

def load_past_drawings(filename="all_drawings.csv"):
    past_sets = set()
    try:
        with open(filename, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 6:
                    numbers = tuple(sorted(int(n) for n in row[1:6]))  # Ignore drawing number
                    past_sets.add(numbers)
    except FileNotFoundError:
        print(f"⚠️ Warning: File '{filename}' not found. Skipping comparison with past drawings.")
    return past_sets

def generate_wheel(numbers, past_drawings, set_size=5, num_sets=6):
    wheel = []
    used = set()
    skipped_matches = []
    overlaps_4of5 = defaultdict(list)

    distribution = {n: 0 for n in numbers}
    attempts = 0

    while len(wheel) < num_sets and attempts < 10000:
        combo = tuple(sorted(random.sample(numbers, set_size)))
        if combo in used or combo in past_drawings:
            if combo in past_drawings:
                skipped_matches.append(combo)
            attempts += 1
            continue

        # Check for 4-of-5 overlaps with past drawings
        for past in past_drawings:
            overlap = set(combo) & set(past)
            if len(overlap) == 4:
                overlaps_4of5[combo].append(past)

        used.add(combo)
        wheel.append(combo)
        for n in combo:
            distribution[n] += 1

    return wheel, distribution, skipped_matches, overlaps_4of5

def main():
    numbers = get_user_numbers()
    past_drawings = load_past_drawings()
    wheel, distribution, skipped_matches, overlaps_4of5 = generate_wheel(numbers, past_drawings)

    print("\nGenerated 6 sets of 5 numbers each (excluding past winning sets):")
    for i, line in enumerate(wheel, 1):
        print(f"Set {i}: {', '.join(str(n) for n in line)}")

    print("\nNumber Usage Frequency:")
    for num in sorted(distribution):
        print(f"{num:2d}: {distribution[num]} times")

    if skipped_matches:
        print("\n⚠️ Skipped due to full match with past winning sets:")
        for s in skipped_matches:
            print(f" - {', '.join(str(n) for n in s)}")

    if overlaps_4of5:
        print("\n🔎 4-of-5 overlaps with past drawings:")
        for new_set, matches in overlaps_4of5.items():
            new_str = ', '.join(str(n) for n in new_set)
            print(f"New set: {new_str}")
            for match in matches:
                match_str = ', '.join(str(n) for n in match)
                print(f"   Overlaps with: {match_str}")

if __name__ == "__main__":
    main()
