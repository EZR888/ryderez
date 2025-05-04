import random

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

def generate_wheel(numbers, set_size=5, num_sets=6):
    wheel = []
    used = set()

    # Try to ensure each number is used fairly
    distribution = {n: 0 for n in numbers}
    attempts = 0

    while len(wheel) < num_sets and attempts < 10000:
        combo = tuple(sorted(random.sample(numbers, set_size)))
        if combo in used:
            attempts += 1
            continue
        used.add(combo)
        wheel.append(combo)
        for n in combo:
            distribution[n] += 1
    return wheel, distribution

def main():
    numbers = get_user_numbers()
    wheel, distribution = generate_wheel(numbers)

    print("\nGenerated 6 sets of 5 numbers each:")
    for i, line in enumerate(wheel, 1):
        print(f"Set {i}: {', '.join(str(n) for n in line)}")

    print("\nNumber Usage Frequency:")
    for num in sorted(distribution):
        print(f"{num:2d}: {distribution[num]} times")

if __name__ == "__main__":
    main()
