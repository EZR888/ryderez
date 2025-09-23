# Create a practical, no-magic lotto helper:
# - Option A: Build a 12-number pool by exponential-decay from history (no claim of edge).
# - Option B: Accept a user-provided 12-number pool.
# - Given a pool and a ticket budget T, pick T tickets (size=5) from the pool to maximize
#   weighted coverage of 4-subsets and 3-subsets (greedy max-coverage).
# - Optional fast Monte Carlo to estimate odds of hitting prize tiers with the constructed wheel.
#
# CLI examples:
#   python wheel_picker.py --game 39 --history /mnt/data/lotto_39.txt --tau 20 --tickets 42 --simulate 20000
#   python wheel_picker.py --game 69 --pool 3 15 23 28 29 40 42 50 53 61 62 64 --tickets 42 --simulate 20000
#
# Notes:
# - For Powerball, this builds the *white-ball* tickets (5 numbers). Pick the Powerball separately (uniformly random is fine).
# - This script does NOT claim predictive edge; it optimizes coverage given your chosen pool and budget.

from __future__ import annotations
import argparse, math, random, sys
from collections import Counter, defaultdict
from itertools import combinations
from pathlib import Path
import csv
import time

def read_draws_csvlike(path: str):
    "Reads lines: draw_id,n1,n2,n3,n4,n5 (may have extra cols; ignores malformed). Returns list of 5-number lists in chronological order."
    rows=[]
    with open(path,'r') as f:
        for line in f:
            parts=[p.strip() for p in line.strip().split(",")]
            if len(parts)<6: 
                continue
            try:
                idx=int(parts[0]); nums=list(map(int, parts[1:6]))
            except:
                continue
            rows.append((idx, nums))
    rows.sort(key=lambda x:x[0])
    return [nums for _,nums in rows]

def expdecay_pool(draws: list[list[int]], universe_N: int, K: int=12, tau: float=20.0, h_max: int=300) -> list[int]:
    "Exp-decay weighted frequency across all prior draws; tie-break by recency then by number."
    if not draws:
        return sorted(random.sample(range(1, universe_N+1), K))
    use = draws[-h_max:] if len(draws)>h_max else draws
    weights=Counter()
    recency={n: math.inf for n in range(1, universe_N+1)}
    for lag, d in enumerate(reversed(use), start=1):
        w=math.exp(-lag/float(tau))
        for n in d:
            weights[n]+=w
            if recency[n]==math.inf:
                recency[n]=lag
    ranked=sorted(range(1, universe_N+1), key=lambda n:(-weights[n], recency[n], n))
    return sorted(ranked[:K])

def greedy_wheel(pool: list[int], tickets: int, size: int=5, w4: float=1.0, w3: float=0.05, seed: int=42):
    "Greedy max-coverage of 4-subsets (weight w4) + 3-subsets (weight w3) within chosen pool."
    rng=random.Random(seed)
    pool=sorted(pool)
    all_candidates=list(combinations(pool, size))
    covered3=set(); covered4=set()
    chosen=[]
    # Pre-index candidates' subset contributions for speed
    cand3=[set(combinations(c,3)) for c in all_candidates]
    cand4=[set(combinations(c,4)) for c in all_candidates]
    used=[False]*len(all_candidates)
    for _ in range(min(tickets, len(all_candidates))):
        best_i=-1; best_gain=-1.0
        for i,c in enumerate(all_candidates):
            if used[i]: continue
            gain4=len(cand4[i]-covered4)
            gain3=len(cand3[i]-covered3)
            score = w4*gain4 + w3*gain3
            # Tiny jitter to break ties stochastically
            score += 1e-9*rng.random()
            if score>best_gain:
                best_gain=score; best_i=i
        if best_i==-1: break
        used[best_i]=True
        chosen.append(all_candidates[best_i])
        covered4 |= cand4[best_i]
        covered3 |= cand3[best_i]
    return chosen, covered3, covered4

def simulate_hit_rates(tickets: list[tuple[int,...]], universe_N: int, trials: int=20000, seed: int=123):
    "Monte Carlo: estimate P(at least one ticket has k matches) for k>=3,4,5."
    rng=random.Random(seed)
    tks=[set(t) for t in tickets]
    c3=c4=c5=0
    for _ in range(trials):
        draw=set(rng.sample(range(1,universe_N+1), 5))
        best=0
        for t in tks:
            k=len(draw & t)
            if k>best: best=k
            if best==5: break
        if best>=3: c3+=1
        if best>=4: c4+=1
        if best>=5: c5+=1
    return dict(
        trials=trials,
        p_any_ge3=c3/float(trials),
        p_any_ge4=c4/float(trials),
        p_any_ge5=c5/float(trials)
    )

def main():
    ap=argparse.ArgumentParser(description="12-number pool builder + wheel optimizer (no edge claimed).")
    ap.add_argument("--game", type=int, choices=[39,69], required=True, help="39 = Fantasy-5; 69 = Powerball whites")
    ap.add_argument("--history", type=str, help="Path to history file (draw_id,n1..n5). If omitted, use --pool.")
    ap.add_argument("--tau", type=float, default=None, help="Exp-decay constant (default 20 for 39; 25 for 69)")
    ap.add_argument("--pool", type=int, nargs="+", help="Exactly 12 numbers to use as the pool (space-separated)")
    ap.add_argument("--tickets", type=int, required=True, help="Number of 5-number tickets to output")
    ap.add_argument("--w4", type=float, default=1.0, help="Weight for 4-subset coverage")
    ap.add_argument("--w3", type=float, default=0.05, help="Weight for 3-subset coverage")
    ap.add_argument("--simulate", type=int, default=0, help="Monte Carlo trials to estimate hit rates (0=skip)")
    ap.add_argument("--out", type=str, default="wheel_output.csv", help="CSV to write")
    ap.add_argument("--seed", type=int, default=42, help="Random seed (tie-breaking & simulation)")
    args=ap.parse_args()

    N=args.game
    tau = args.tau if args.tau is not None else (20 if N==39 else 25)

    if args.pool:
        if len(args.pool)!=12:
            print("ERROR: --pool must list exactly 12 integers.", file=sys.stderr); sys.exit(2)
        pool=sorted(args.pool)
    elif args.history:
        draws=read_draws_csvlike(args.history)
        if not draws:
            print("ERROR: Could not parse any draws from history.", file=sys.stderr); sys.exit(2)
        pool=expdecay_pool(draws, N, K=12, tau=tau, h_max=300)
    else:
        print("ERROR: provide either --pool or --history", file=sys.stderr); sys.exit(2)

    if any(n<1 or n>N for n in pool):
        print(f"ERROR: pool numbers must be in 1..{N}", file=sys.stderr); sys.exit(2)

    start=time.time()
    tickets, cov3, cov4 = greedy_wheel(pool, tickets=args.tickets, size=5, w4=args.w4, w3=args.w3, seed=args.seed)
    elapsed=time.time()-start

    # Write CSV
    out_path=Path(args.out)
    with out_path.open("w", newline="") as f:
        w=csv.writer(f)
        w.writerow(["game_N",N,"pool",*pool])
        w.writerow(["tickets",len(tickets),"tau",tau,"w4",args.w4,"w3",args.w3])
        w.writerow(["note","Powerball users: these are white-ball picks; choose Powerball separately."])
        w.writerow([])
        w.writerow(["Ticket #","n1","n2","n3","n4","n5"])
        for i,t in enumerate(tickets,1):
            w.writerow([i,*t])

    # Optional simulation
    sim=None
    if args.simulate>0 and tickets:
        sim = simulate_hit_rates(tickets, universe_N=N, trials=args.simulate, seed=args.seed)

    # Print a concise summary
    print(f"Pool (12): {pool}")
    print(f"Built {len(tickets)} tickets in {elapsed:.3f}s; wrote: {out_path}")
    print(f"Coverage: {len(cov4)} distinct 4-subsets; {len(cov3)} distinct 3-subsets")
    if sim:
        print(f"Monte Carlo ({sim['trials']} trials): "
              f"P(any ≥3)={sim['p_any_ge3']:.4f}, "
              f"P(any ≥4)={sim['p_any_ge4']:.4f}, "
              f"P(any =5)={sim['p_any_ge5']:.6f}")

if __name__=="__main__":
    main()

