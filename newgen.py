import numpy as np
import pandas as pd

# Constants
NUM_RUNS = 10_000_000  # Number of sets
NUM_SPINS = 38  # Spins per run

# Group definitions for analysis
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

# Single groups to sum without differences
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

def calculate_density(counts):
    return np.sum(np.sort(counts)[-5:])

def calculate_variance(counts):
    return np.var(counts)

def calculate_variance_difference(top_counts, bottom_counts):
    top_var = np.var(top_counts)
    bottom_var = np.var(bottom_counts)
    return top_var - bottom_var

def calculate_max_hits(counts):
    return np.max(counts, axis=1)

def calculate_max_counts(counts):
    max_count = np.max(counts, axis=1)
    return np.bincount(max_count)

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

    densities = np.apply_along_axis(calculate_density, 1, counts)
    for val, count in zip(*np.unique(densities, return_counts=True)):
        results.append(("Density (Top 5 Sum)", val, count))

    variances = np.apply_along_axis(calculate_variance, 1, counts)
    for val, count in zip(*np.unique(np.round(variances, 6), return_counts=True)):
        results.append(("Variance (Within-Run Spread)", val, count))

    top_counts = counts[:, single_groups["Top"]]
    bottom_counts = counts[:, single_groups["Bottom"]]
    var_diffs = np.array([calculate_variance_difference(t, b) for t, b in zip(top_counts, bottom_counts)])
    for val, count in zip(*np.unique(np.round(var_diffs, 6), return_counts=True)):
        results.append(("Variance Difference (Top - Bottom)", val, count))

    max_hits = np.max(counts, axis=1)
    unique_hits, freq_hits = np.unique(max_hits, return_counts=True)
    for val, count in zip(unique_hits, freq_hits):
        results.append(("Max Hits", val, count))

    value_counts = np.apply_along_axis(lambda row: np.max(np.bincount(row, minlength=38)), axis=1, arr=spins)
    unique_counts, freq_counts = np.unique(value_counts, return_counts=True)
    for val, count in zip(unique_counts, freq_counts):
        results.append(("Max Counts", val, count))

    return pd.DataFrame(results, columns=["Category", "Difference", "Observed Frequency"])

def calculate_p_values(df):
    df = df.groupby(["Category", "Difference"], as_index=False).sum()
    df["pValue"] = df["Observed Frequency"] / NUM_RUNS
    df["Difference"] = df["Difference"].astype(float).round(6)

    cumulative_p_values = []

    for category, group in df.groupby("Category"):
        group = group.sort_values("Difference")
        center = 0.0 if " - " in category or "Difference" in category else group["Difference"].mean()

        below = group[group["Difference"] < center].copy()
        above = group[group["Difference"] > center].copy()
        center_row = group[np.isclose(group["Difference"], center)].copy()

        below["Cumulative P-Value"] = below["pValue"].cumsum()
        above["Cumulative P-Value"] = above["pValue"][::-1].cumsum()[::-1]  # reverse for upper tail
        center_row["Cumulative P-Value"] = 0.0  # or np.nan if you prefer

        group = pd.concat([below, center_row, above]).sort_values("Difference")
        cumulative_p_values.append(group)

    final_df = pd.concat(cumulative_p_values).reset_index(drop=True)
    final_df["pValue"] = final_df["pValue"].astype(float).round(6)
    final_df["Cumulative P-Value"] = final_df["Cumulative P-Value"].astype(float).round(6)
    return final_df


# Main execution
print("🚀 Generating spin data...")
spins = generate_spin_results(NUM_RUNS, NUM_SPINS)

print("🔍 Calculating differences and new stats...")
df = calculate_differences(spins)

print("📊 Calculating p-values and cumulative p-values...")
df = calculate_p_values(df)

df = df[["Category", "Difference", "pValue", "Cumulative P-Value", "Observed Frequency"]]

output_file = "tesy10mcols.csv"
df.to_csv(output_file, index=False)
print(f"✅ {output_file} generated successfully!")
