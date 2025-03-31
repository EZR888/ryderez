import numpy as np
import pandas as pd

# Constants
NUM_RUNS = 10_000_000
NUM_SPINS = 38

# Grouped definitions
group_indices = {
    "Top - Bottom": ([5,22,34,15,3,24,36,13,1,37,27,10,25,29,12,8,19,31,18],
                     [17,32,20,7,11,30,26,9,28,0,2,14,35,23,4,16,33,21,6]),
    "Left - Right": ([5,22,34,15,3,24,36,13,1,17,32,20,7,11,30,26,9,28],
                     [27,10,25,29,12,8,19,31,18,2,14,35,23,4,16,33,21,6]),
    "Center 9 Top - Bottom": ([24,36,13,1,37,27,10,25,29],
                              [30,26,9,28,0,2,14,35,23]),
    "00 - 0": ([13,1,37,27,10], [9,28,0,2,14]),
    "Top Ends - Center": ([5,22,34,15,3,12,8,19,31,18],
                          [24,36,13,1,37,27,10,25,29]),
    "Bottom Ends - Center": ([17,32,20,7,11,4,16,3,21,6],
                             [30,26,9,28,0,2,14,35,23])
}

single_groups = {
    "Top": [5,22,34,15,3,24,36,13,1,37,27,10,25,29,12,8,19,31,18],
    "Bottom": [17,32,20,7,11,30,26,9,28,0,2,14,35,23,4,16,33,21,6],
    "Left Top": [5,22,34,15,3],
    "Left Bottom": [17,32,20,7,11],
    "Right Top": [12,8,19,31,18],
    "Right Bottom": [4,16,33,21,6],
    "Center Top": [24,36,13,1,37,27,10,25,29],
    "Center Bottom": [30,26,9,28,0,2,14,35,23],
    "Left": [5,22,34,15,3,24,36,13,1,17,32,20,7,11,30,26,9,28],
    "Right": [27,10,25,29,12,8,19,31,18,2,14,35,23,4,16,33,21,6],
    "Top Ends": [5,22,34,15,3,12,8,19,31,18],
    "Bottom Ends": [17,32,20,7,11,4,16,3,21,6],
    "Top Center": [24,36,13,1,37,27,10,25,29],
    "Bottom Center": [30,26,9,28,0,2,14,35,23],
    "Zero Sums Total": [13,1,37,27,10,9,28,0,2,14],
    "Upper Left": [5,22,34,15,3,24,36,13,1],
    "Upper Right": [27,10,25,29,12,8,19,31,18],
    "Lower Left": [28,9,26,30,11,7,20,32,17],
    "Lower Right": [6,21,33,16,4,23,35,14,2],
    "Sum 00": [13,1,37,27,10],
    "Sum 0": [9,28,0,2,14]
}

def generate_spin_results(num_runs, num_spins):
    return np.random.randint(0, num_spins, size=(num_runs, num_spins))

def calculate_differences(spins):
    results = []
    counts = np.apply_along_axis(lambda x: np.bincount(x, minlength=38), axis=1, arr=spins)

    for category, (group1, group2) in group_indices.items():
        sum1 = np.sum(counts[:, group1], axis=1)
        sum2 = np.sum(counts[:, group2], axis=1)
        diff = sum1 - sum2
        unique_diffs, freq_counts = np.unique(diff, return_counts=True)
        for d, count in zip(unique_diffs, freq_counts):
            results.append((category, d, count))

    for category, indices in single_groups.items():
        sums = np.sum(counts[:, indices], axis=1)
        unique_sums, freq_counts = np.unique(sums, return_counts=True)
        for val, count in zip(unique_sums, freq_counts):
            results.append((category, val, count))
    
    return pd.DataFrame(results, columns=["Category", "Difference", "Observed Frequency"])

# Main Execution
print("Generating spin data...")
spins = generate_spin_results(NUM_RUNS, NUM_SPINS)

df = calculate_differences(spins)
print("Saving to CSV...")
df.to_csv("10mcols_new.csv", index=False)
print("10mcols_new.csv generated successfully!")
