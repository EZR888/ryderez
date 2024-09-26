#!/bin/bash

# Check if the input CSV file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 input.csv [output.csv]"
    exit 1
fi

# Set input and output files
input_file="$1"
output_file="${2:-output.csv}"  # Default output is 'output.csv' if not provided

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Error: Input file '$input_file' not found."
    exit 1
fi

# Add line numbers to the CSV file
awk -F, 'BEGIN {OFS=","} NR==1 {print "LineNumber",$0} NR>1 {print NR-1,$0}' "$input_file" > "$output_file"

# Notify the user
echo "Line numbers added to '$output_file'."

