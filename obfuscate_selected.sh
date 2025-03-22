#!/bin/bash

# Requires: javascript-obfuscator and Python 3
# Install: npm install -g javascript-obfuscator

declare -a files=("view-data.html")
# declare -a files=("roulette.html" "view-data.html" "sort.html" "view-stats.html" "pvalues.html" "xfreq.html")

for file in "${files[@]}"; do
  base="${file%.html}"
  js="${base}.js"
  obf="${base}.obf.js"

  echo "Processing $file..."
  python3 extract_and_inject.py "$file" "$js" "$obf"
  javascript-obfuscator "$js" --output "$obf" --compact true --rename-globals false
  echo "Done with $file"
  echo
done
