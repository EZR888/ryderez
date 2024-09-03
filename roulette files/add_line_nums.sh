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

    # Add line number and wrap the line in double quotes
    echo "$line_num,\"$line\"" >> "$output_file"
done < "$input_file"

echo "Processing complete. Output saved to $output_file"

