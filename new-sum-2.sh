#!/bin/bash

# Check if at least one file was provided
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <csv_file1> [csv_file2 ... csv_fileN]"
  exit 1
fi

# Define the column order based on the user's sequence
columns_order=(18 6 21 33 16 4 23 35 14 2 0 28 9 26 30 11 7 20 32 17 5 22 34 15 3 24 36 13 1 37 27 10 25 29 12 8 19 31)

# Loop through all provided CSV files
for csv_file in "$@"; do
  # Check if the file exists
  if [ ! -f "$csv_file" ]; then
    echo "File not found: $csv_file"
    continue
  fi

  # Read the second line from the CSV file
  line=$(sed -n '2p' "$csv_file")

  # Check if the line is empty
  if [ -z "$line" ]; then
    echo "The file does not contain a second line: $csv_file"
    continue
  fi

  # Convert the line into an array using comma as delimiter
  IFS=',' read -r -a columns <<< "$line"

  # Check if the columns array has enough elements
  if [ ${#columns[@]} -lt 38 ]; then
    echo "The file does not have enough columns: $csv_file"
    continue
  fi

  # Loop through the sequence and check sums of clusters of 5
  len=${#columns_order[@]}
  for ((i = 0; i < len; i++)); do
    # Get the indices of the 5 adjacent columns, wrapping around if necessary
    idx1=${columns_order[$i]}
    idx2=${columns_order[$(( (i+1) % len ))]}
    idx3=${columns_order[$(( (i+2) % len ))]}
    idx4=${columns_order[$(( (i+3) % len ))]}
    idx5=${columns_order[$(( (i+4) % len ))]}

    # Sum the values in these columns
    sum=$(echo "${columns[idx1]} + ${columns[idx2]} + ${columns[idx3]} + ${columns[idx4]} + ${columns[idx5]}" | bc)

    # Check if the sum is 10 or 11
    if [ "$sum" -eq 10 ] || [ "$sum" -eq 11 ]; then
      echo "Filename: $csv_file"
      echo "Cluster: ${idx1}, ${idx2}, ${idx3}, ${idx4}, ${idx5} -> Sum: $sum"
      echo "Values: ${columns[idx1]}, ${columns[idx2]}, ${columns[idx3]}, ${columns[idx4]}, ${columns[idx5]}"
      echo
    fi
  done
done

