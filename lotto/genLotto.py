import numpy as np
import pandas as pd

# ===== Constants =====
NUM_RUNS = 10_000_000
NUMBERS_IN_DRAW = 5
TOTAL_NUMBERS = 39  # Change to 69 if needed

# ===== Helper Functions =====

def generate_lotto_draws(num_runs, numbers_in_draw, total_numbers):
    draws = []
    for _ in range(num_runs):
        draw = np.random.choice(np.arange(1, total_numbers + 1), size=numbers_in_draw, replace=False)
        draws.append(np.sort(draw))  # Sorted for consistency
    return np.array(draws)

def get_odd_even_diff(draw):
    odds = np.sum(draw % 2 == 1)
    evens = np.sum(draw % 2 == 0)
    return odds - evens

def get_low_high_diff(draw):
    midpoint = TOTAL_NUMBERS // 2
    lows = np.sum(draw <= midpoint)
    highs = np.sum(draw > midpoint)
    return lows - highs

def get_spread(draw):
    return np.max(draw) - np.min(draw)

def count_consecutive_pairs(draw):
    return np.sum(np.diff(draw) == 1)

def analyze_draws(draws):
    results = []

    for i, draw in enumerate(draws):
        row = []
        row.append((i, "Sum", np.sum(draw)))
        row.append((i, "Odd - Even", get_odd_even_diff(draw)))
        row.append((i, "Low - High", get_low_high_diff(draw)))
        row.append((i, "Spread", get_spread(draw)))
        row.append((i, "Consecutive Pairs", count_consecutive_pairs(draw)))
        results.extend(row)

    return pd.DataFrame(results, columns=["Run", "Category", "Difference"])

def calculate_cumulative_pvalues(df):
    df["pValue"] = df["Observed Frequency"] / NUM_RUNS
    cumulative_frames = []

    for category, group in df.groupby("Category"):
        group = group.sort_values("Difference").copy()
        center = group["Difference"].mean()

        below = group[group["Difference"] < center].copy()
        above = group[group["Difference"] > center].copy()
        center_row = group[np.isclose(group["Difference"], center)].copy()

        if not center_row.empty:
            center_row["Cumulative"] = 0.0

        below["Cumulative"] = below["pValue"].cumsum()
        above["Cumulative"] = above["pValue"][::-1].cumsum()[::-1]

        combined = pd.concat([below, center_row, above])
        cumulative_frames.append(combined)

    return pd.concat(cumulative_frames).reset_index(drop=True)

def create_rawpoints(per_run_df, pval_df):
    merge_df = pd.merge(per_run_df, pval_df[["Category", "Difference", "Cumulative"]],
                        on=["Category", "Difference"], how="left")
    merge_df["Inv"] = merge_df["Cumulative"].apply(lambda p: 1 / p if p > 0 else 0)
    rawpoints = merge_df.groupby("Run")["Inv"].sum().reset_index(name="RawPoints")
    return rawpoints

# ===== Main Program =====

print("🎯 Generating random lotto draws...")
draws = generate_lotto_draws(NUM_RUNS, NUMBERS_IN_DRAW, TOTAL_NUMBERS)

print("📊 Analyzing each draw...")
per_run_df = analyze_draws(draws)

print("📈 Building frequency tables...")
freq_df = per_run_df.groupby(["Category", "Difference"]).size().reset_index(name="Observed Frequency")

print("🔁 Calculating cumulative p-values...")
pval_df = calculate_cumulative_pvalues(freq_df)

print("➕ Calculating raw point scores...")
rawpoints_df = create_rawpoints(per_run_df, pval_df)

mean_points = rawpoints_df["RawPoints"].mean()
var_points = rawpoints_df["RawPoints"].var()

print(f"✅ Done! Mean RawPoints = {mean_points:.6f}, Variance = {var_points:.6f}")

print("💾 Saving results...")
pval_df.to_csv("lotto10mcols.csv", index=False)
rawpoints_df.to_csv("lotto_rawpoints.csv", index=False)

print("🎉 Files saved: lotto10mcols.csv + lotto_rawpoints.csv")

