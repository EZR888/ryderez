#!/bin/bash

# Define the output file
output_file="output.txt"

# Clear the file if it already exists
> "$output_file"

# Loop to generate lines
for i in {0..99}; do
    echo "$i, $i" >> "$output_file"
done

# Print a message indicating completion
echo "File '$output_file' created with 100 lines."

