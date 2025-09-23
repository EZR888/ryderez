# Backtest and 12-pick recommender for Fantasy-5 (39) and Powerball whites (69)
# - Strict walk-forward (no peeking)
# - Frequency-based "Hot-W" selector to pick K=12 numbers from the prior W draws
# - Evaluates against hypergeometric baseline and a permutation (random-pool) test
# - Produces:
#     1) CSV per game with per-target overlaps
#     2) Summary table
#     3) "Next-draw" 12-number recommendation per game (based on most recent W draws)
#
# Assumptions:
#   Files are CSV-like with rows: draw_index,n1,n2,n3,n4,n5 (ascending index older->newer or vice versa allowed)
#   Uploaded paths: /mnt/data/lotto_39.txt, /mnt/data/lotto_69.txt
#
# You can tweak params below.

from collections import Counter, defaultdict
import math, random, statistics, os, sys, csv
from pathlib import Path

import pandas as pd
import numpy as np

DATA_39 = "/mnt/data/lotto_39.txt"
DATA_69 = "/mnt/data/lotto_69.txt"

# ---------- parameters (you can adjust) ----------
WINDOW_W = 7           # "Hot last W draws"
PICKS_K  = 12          # numbers to pick
EVAL_DRAWS_39 = 1200   # how many most-recent draws to evaluate (cap for runtime)
EVAL_DRAWS_69 = 1500
PERMUTATIONS = 2000    # permutation test iterations at aggregate level
SEED = 42              # reproducibility

random.seed(SEED)
np.random.seed(SEED)

def read_draws(path):
    rows = []
    with open(path, "r") as f:
        for line in f:
            line=line.strip()
            if not line: 
                continue
            parts = [p.strip() for p in line.split(",")]
            if len(parts) < 6:
                # some files may have header/truncated tail; skip bad lines
                continue
            try:
                idx = int(parts[0])
                nums = list(map(int, parts[1:6]))
                rows.append((idx, nums))
            except:
                # skip malformed
                continue
    # Determine chronological order: many files list newest first. We enforce oldest->newest.
    # Sort by the first column (draw index) ascending.
    rows.sort(key=lambda x: x[0])
    # Return numbers only in chronological order
    draw_ids = [r[0] for r in rows]
    draws = [r[1] for r in rows]
    return draw_ids, draws

def hot_selector(draws_prior, pool_size, universe_N):
    """Select pool_size numbers by simple frequency over the given prior window (draws_prior). Tie-break by most recent hit recency (shorter is 'hotter')."""
    if not draws_prior:
        # first few draws edge-case: fallback to random
        return set(random.sample(range(1, universe_N+1), pool_size))
    # frequency over prior window
    freq = Counter()
    for d in draws_prior:
        freq.update(d)
    # compute most-recent hit recency per number
    recency = {n: math.inf for n in range(1, universe_N+1)}
    for step_back, d in enumerate(reversed(draws_prior), start=1):
        for n in d:
            if recency[n] == math.inf:
                recency[n] = step_back
    # rank: higher freq first, then lower recency, then lower number
    scored = []
    for n in range(1, universe_N+1):
        scored.append(( -freq[n], recency[n], n ))
    scored.sort()
    picks = [n for _,_,n in scored[:pool_size]]
    return set(picks)

def hypergeom_pmf(N, K, n, k):
    # combinations helper
    from math import comb
    if k<0 or k>min(K,n): return 0.0
    return comb(K, k)*comb(N-K, n-k)/comb(N, n)

def hypergeom_tail_ge(N, K, n, k0):
    return sum(hypergeom_pmf(N, K, n, k) for k in range(k0, n+1))

def walk_forward_eval(draw_ids, draws, universe_N, window_W, pool_K, eval_cap=None, out_csv_path=None):
    """
    For each target t, build pool from the prior W draws (strictly before t), then compute overlap k with draw t.
    Returns DataFrame of per-draw results and a summary dict.
    """
    total = len(draws)
    # evaluation range: last eval_cap draws (exclude first W because no prior window)
    start_idx = max(0, total - (eval_cap if eval_cap else total))
    start_idx = max(start_idx, window_W)  # ensure window available
    records = []
    # base hypergeom parameters
    N, K, n = universe_N, pool_K, 5
    hg_probs = [hypergeom_pmf(N,K,n,k) for k in range(0, n+1)]
    hg_ge3 = sum(hg_probs[3:])
    expected_k = sum(k*hg_probs[k] for k in range(0, n+1))
    for t in range(start_idx, total):
        prior = draws[t-window_W:t]
        pool = hot_selector(prior, pool_K, universe_N)
        target = set(draws[t])
        k = len(pool.intersection(target))
        rec = {
            "draw_id": draw_ids[t],
            "k_overlap": k,
            "pool": sorted(pool),
            "target": sorted(target)
        }
        records.append(rec)
    df = pd.DataFrame(records)
    # summary vs baseline
    mean_k = df["k_overlap"].mean()
    frac_ge3 = (df["k_overlap"]>=3).mean()
    # Binomial std for ≥3 fraction baseline
    D = len(df)
    base_ge3 = hg_ge3
    base_mean_k = expected_k
    # z-scores
    z_mean = (mean_k - base_mean_k) / (math.sqrt(n*(K/N)*(1-K/N)*(1 - (n-1)/(N-1))) / math.sqrt(D)) if D>0 else float('nan')
    # For frac ≥3, binomial SE: sqrt(p*(1-p)/D)
    z_ge3 = (frac_ge3 - base_ge3) / math.sqrt(base_ge3*(1-base_ge3)/D) if D>0 else float('nan')
    summary = dict(
        draws_evaluated=int(D),
        window_W=window_W,
        picks_K=pool_K,
        universe_N=universe_N,
        baseline_mean_k=base_mean_k,
        observed_mean_k=float(mean_k),
        z_mean=float(z_mean),
        baseline_frac_ge3=base_ge3,
        observed_frac_ge3=float(frac_ge3),
        z_ge3=float(z_ge3)
    )
    if out_csv_path:
        # Save compact per-draw CSV
        out_df = df.copy()
        out_df["pool"] = out_df["pool"].apply(lambda xs: " ".join(map(str,xs)))
        out_df["target"] = out_df["target"].apply(lambda xs: " ".join(map(str,xs)))
        out_df.to_csv(out_csv_path, index=False)
    # next-draw recommendation (based on last W draws)
    next_pool = hot_selector(draws[-window_W:], pool_K, universe_N)
    return df, summary, sorted(next_pool)

# Permutation test at aggregate level: simulate D draws where pool is random K, measure mean k and frac ≥3
def permutation_null(D, universe_N, pool_K, n, iters=1000, rng=np.random):
    # Hypergeometric sampling per-draw is identical, so we can draw overlaps directly
    # But to account for finite D variance, we simulate D overlaps per iteration from Hypergeom(N,K,n)
    from math import comb
    # Precompute PMF and CDF for speed
    pmf = np.array([hypergeom_pmf(universe_N, pool_K, n, k) for k in range(n+1)])
    cdf = np.cumsum(pmf)
    means = []
    fr_ge3 = []
    for _ in range(iters):
        # inverse CDF sampling
        u = rng.random(size=D)
        ks = np.searchsorted(cdf, u, side="right")
        means.append(np.mean(ks))
        fr_ge3.append(np.mean(ks>=3))
    return np.array(means), np.array(fr_ge3)

# ------------- Run for both games -------------
games = [
    ("Fantasy5_39", DATA_39, 39, EVAL_DRAWS_39),
    ("Powerball69_white", DATA_69, 69, EVAL_DRAWS_69)
]

summaries = []
recs = {}

for name, path, N, cap in games:
    if not os.path.exists(path):
        continue
    draw_ids, draws = read_draws(path)
    df, summary, rec12 = walk_forward_eval(draw_ids, draws, N, WINDOW_W, PICKS_K, eval_cap=cap, 
                                           out_csv_path=f"/mnt/data/{name}_walkforward_W{WINDOW_W}_K{PICKS_K}.csv")
    # permutation test
    D = summary["draws_evaluated"]
    means_null, fr_ge3_null = permutation_null(D, N, PICKS_K, 5, iters=PERMUTATIONS, rng=np.random.RandomState(SEED))
    # empirical p-values
    p_mean = float(np.mean(means_null >= summary["observed_mean_k"]))
    p_ge3  = float(np.mean(fr_ge3_null >= summary["observed_frac_ge3"]))
    summary.update(dict(
        perm_iters=PERMUTATIONS,
        perm_p_mean=p_mean,
        perm_p_frac_ge3=p_ge3,
        next_recommendation=" ".join(map(str, rec12))
    ))
    summaries.append(summary)
    recs[name] = rec12

summary_df = pd.DataFrame(summaries)

from caas_jupyter_tools import display_dataframe_to_user
display_dataframe_to_user("Backtest summary (walk-forward Hot-W)", summary_df)

# Save summary CSV
summary_path = f"/mnt/data/summary_W{WINDOW_W}_K{PICKS_K}.csv"
summary_df.to_csv(summary_path, index=False)

summary_path, recs

