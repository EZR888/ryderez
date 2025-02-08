#!/bin/bash

# Check if at least one file was provided
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <csv_file1> [csv_file2 ... csv_fileN]"
  exit 1
fi

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
  if [ ${#columns[@]} -le 37 ]; then
    echo "The file does not have enough columns: $csv_file"
    continue
  fi

  # Sum columns for '0' and '00'
  sum_0=$(echo "${columns[14]} + ${columns[2]} + ${columns[0]} + ${columns[28]} + ${columns[9]}" | bc)
  sum_00=$(echo "${columns[13]} + ${columns[1]} + ${columns[27]} + ${columns[10]} + ${columns[37]}" | bc)

  # Print the results
  echo "Filename: $csv_file"
  echo "Results for 0: $sum_0"
  echo "Results for 00: $sum_00"
  echo
done

