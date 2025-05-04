# scan_high_rawpoints.py

import pandas as pd

# Load the rawpoints CSV
filename = 'lotto_rawpoints.csv'  # (change if needed)
df = pd.read_csv(filename)

# Settings
THRESHOLD = 100   # Anything above this is considered "high" (you can adjust)
TOP_N = 50        # Show top N highest RawPoints entries

# Find all entries above the threshold
high_values = df[df['RawPoints'] > THRESHOLD]

# Sort descending by RawPoints
high_values_sorted = high_values.sort_values(by='RawPoints', ascending=False)

# Output
print(f"Total entries above {THRESHOLD}: {len(high_values_sorted)}\n")
print(high_values_sorted.head(TOP_N))

# Save results if you want
high_values_sorted.to_csv('high_rawpoints_found.csv', index=False)
print("\n✅ Done. Saved high RawPoints to high_rawpoints_found.csv")

