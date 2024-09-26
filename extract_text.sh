#!/bin/bash

# Output file
output_file="extracted_text.txt"

# Clear or create the output file
> "$output_file"

# Loop through all files in the current directory
for file in *; do
  # Check if it's a file
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Use grep to find lines containing 'colspan', then use sed to extract text between '>' and '.'
    grep 'colspan' "$file" | sed -n 's/.*>\([^<]*\)\.[^<]*<\/a>.*/\1/p' >> "$output_file"
  fi
done

echo "Extraction completed. Check $output_file for results."

