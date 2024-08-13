#!/bin/bash

# Define the input and output file
input_file="lookup.txt"
output_file="lookup_quoted.txt"

# Process the input file
while IFS= read -r line; do
    # Find the position of the first comma
    comma_pos=$(echo "$line" | awk -F, '{print index($0, $2)}')
    
    if [ "$comma_pos" -ne 0 ]; then
        # Enclose the text from the first comma to the end of the line in double quotes
        first_part=$(echo "$line" | cut -d, -f1)
        second_part=$(echo "$line" | cut -d, -f2-)
        new_line="$first_part,\"$second_part\""
        echo "$new_line" >> "$output_file"
    else
        # If there is no comma, keep the line unchanged
        echo "$line" >> "$output_file"
    fi
done < "$input_file"

echo "Processing complete. Output written to $output_file."

