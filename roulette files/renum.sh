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

# Initialize the line counter
line_num=0

# Read the input file and process each line
while IFS= read -r line; do
    # Increment the line counter
    line_num=$((line_num + 1))

    # Remove the old number and replace it with the new one
    new_line="$line_num,${line#*,}"

    # Write the new line to the output file
    echo "$new_line" >> "$output_file"
done < "$input_file"

echo "Renumbering complete. Output saved to $output_file"

