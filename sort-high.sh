#!/bin/bash

# Usage: ./sort_by_highest.sh input.csv output.csv

if [ $# -lt 2 ]; then
  echo "Usage: $0 input.csv output.csv"
  exit 1
fi

input_file="$1"
output_file="$2"

# Temporary file to store sorted rows
tmp_file=$(mktemp)

# Read the header line first
{
  read header
  echo "$header" > "$tmp_file"
} < "$input_file"

# Function to sort each row's values in descending order, except the first column
sort_row_values() {
  row="$1"
  
  # Split the row into an array based on the comma delimiter
  IFS=',' read -r -a row_values <<< "$row"

  # Extract the row number (first element) and the remaining values
  first_col="${row_values[0]}"
  rest_cols=("${row_values[@]:1}")

  # Sort the remaining columns (values) in descending order
  sorted_values=$(printf "%s\n" "${rest_cols[@]}" | sort -nr | paste -sd ',' -)

  # Combine the first column with the sorted values
  echo "$first_col,$sorted_values"
}

# Read the CSV rows, process each row and sort
tail -n +2 "$input_file" | while IFS= read -r row; do
  sorted_row=$(sort_row_values "$row")
  echo "$sorted_row" >> "$tmp_file"
done

# Sort rows lexicographically based on the first sorted number in descending order
sort -t, -k2,2nr "$tmp_file" > "$output_file"

# Prepend the header back to the sorted file
sed -i '' '1s/^/'"$(head -n 1 "$tmp_file")"'\n/' "$output_file"

# Clean up
rm "$tmp_file"

echo "Sorted CSV saved to $output_file"

