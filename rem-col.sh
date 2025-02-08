#!/bin/bash

# Check if the user has provided a file as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <input_csv_file> [output_csv_file]"
    exit 1
fi

# Input file
input_file="$1"

# Default output file if not provided
output_file="${2:-output.csv}"

# Use awk to remove the first column and preserve the remaining columns
awk -F, '{ $1=""; sub(/^,/, ""); print }' OFS=, "$input_file" > "$output_file"

# Notify user of successful removal
echo "First column removed. Output saved to $output_file."

