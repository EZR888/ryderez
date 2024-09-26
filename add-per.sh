#!/bin/bash

# Check if a filename is provided
if [ $# -ne 2 ]; then
  echo "Usage: $0 <input_file> <output_file>"
  exit 1
fi

input_file="$1"
output_file="$2"

# Check if the input file exists
if [ ! -f "$input_file" ]; then
  echo "Input file does not exist."
  exit 1
fi

# Append a period to the end of each line and write to the output file
while IFS= read -r line; do
  echo "${line}." >> "$output_file"
done < "$input_file"

echo "Periods have been added to each line. Check $output_file for results."

