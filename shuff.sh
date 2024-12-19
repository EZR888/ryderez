#!/bin/bash

# Check if the input file and output file are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input_file> <output_file>"
    exit 1
fi

input_file="$1"
output_file="$2"

# Check if the input file exists
if [ ! -f "$input_file" ]; then
    echo "Error: Input file '$input_file' not found!"
    exit 1
fi

# Shuffle the lines using awk
awk 'BEGIN {srand()} {print rand(), $0}' "$input_file" | sort -k1,1n | cut -d" " -f2- > "$output_file"

echo "File shuffled successfully. Output saved to '$output_file'."

