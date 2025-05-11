import random
import csv

def get_all_combinations(array, size):
    from itertools import combinations
    return list(combinations(array, size))

def combination(n, k):
    from math import comb
    return comb(n, k)

def generate_lotto_reference(
    total_numbers=39,
    set_size=5,
    num_sets=1000000,
    output_file='lotto_10mcols.csv'
):
    results = []

    for _ in range(num_sets):
        numbers = sorted(random.sample(range(1, total_numbers + 1), set_size))

        sum_numbers = sum(numbers)
        range_numbers = numbers[-1] - numbers[0]
        odd_count = sum(1 for n in numbers if n % 2 == 1)
        low_half = total_numbers // 2
        low_count = sum(1 for n in numbers if n <= low_half)

        consecutive_pairs = 0
        for i in range(len(numbers) - 1):
            if numbers[i] + 1 == numbers[i+1]:
                consecutive_pairs += 1

        results.append([
            sum_numbers,
            range_numbers,
            odd_count,
            low_count,
            consecutive_pairs
        ])

    # Write to CSV
    headers = ['Sum', 'Range', 'Odd Count', 'Low Half Count', 'Consecutive Pairs']
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(results)

    print(f"✅ Generated {num_sets} random sets into {output_file}")

if __name__ == "__main__":
    generate_lotto_reference()

