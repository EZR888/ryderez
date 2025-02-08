#!/opt/homebrew/bin/bash

# Usage: ./sort_csv.sh input.csv output_highest.csv output_lowest.csv

if [ $# -lt 3 ]; then
  echo "Usage: $0 input.csv output_highest.csv output_lowest.csv"
  exit 1
fi

input_file="$1"
output_highest="$2"
output_lowest="$3"

# Function to sort a row's values in descending order (the entire row)
sort_row_descending() {
  row="$1"
  
  # Split the row into an array based on the comma delimiter
  IFS=',' read -r -a row_values <<< "$row"

  # Sort all columns in descending order
  sorted_values=$(printf "%s\n" "${row_values[@]}" | sort -nr | paste -sd ',' -)

  # Return the sorted row
  echo "$sorted_values"
}

# Step 1: Sort each row by descending values and save to a temporary file
tmp_file_rows_sorted=$(mktemp)

# Read the header and write it to the output_highest file
{
  read header
  echo "$header" > "$output_highest"
} < "$input_file"

# Process each row (skipping the header) and sort it by descending order of values
tail -n +2 "$input_file" | while IFS= read -r row; do
  sorted_row=$(sort_row_descending "$row")
  echo "$sorted_row" >> "$tmp_file_rows_sorted"
done

# Step 2: Sort all rows lexicographically in descending order across all columns
sort -t, -k1,1nr -k2,2nr -k3,3nr -k4,4nr -k5,5nr -k6,6nr -k7,7nr -k8,8nr -k9,9nr -k10,10nr \
"$tmp_file_rows_sorted" >> "$output_highest"

# Step 3: Sort all rows lexicographically in ascending order across all columns (excluding the header)
sort -t, -k1,1n -k2,2n -k3,3n -k4,4n -k5,5n -k6,6n -k7,7n -k8,8n -k9,9n -k10,10n \
"$tmp_file_rows_sorted" > "$output_lowest"

# Clean up temporary files
rm "$tmp_file_rows_sorted"

echo "Sorting completed."
echo "Sorted by highest saved to $output_highest"
echo "Sorted by lowest saved to $output_lowest"

