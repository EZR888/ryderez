#!/bin/bash

# Check if the input file is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 input_file output_file"
    exit 1
fi

input_file="$1"
output_file="$2"

# Remove any existing output file
if [ -f "$output_file" ]; then
    rm "$output_file"
fi

# Create a temporary file to store lines with new random numbers
temp_file=$(mktemp)

# Seed the random number generator
RANDOM=$(date +%s)

# Read the input file and process each line
while IFS= read -r line; do
    # Generate a random number
    random_num=$((RANDOM))

    # Append the random number and the original line (excluding the old number) to the temp file
    echo "$random_num,${line#*,}" >> "$temp_file"
done < "$input_file"

# Sort the temp file by the new random number and save it to the output file
sort -t, -k1,1n "$temp_file" > "$output_file"

# Clean up the temporary file
rm "$temp_file"

echo "Random reordering complete. Output saved to $output_file"

