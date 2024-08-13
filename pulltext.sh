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

# Read the input file and process it
while IFS= read -r line; do
    # Remove leading and trailing spaces and single quotes
    line=$(echo "$line" | sed "s/^[ \t]*//;s/[ \t]*$//")

    # Split the line into words based on commas, handling spaces properly
    IFS=',' read -ra words <<< "$line"

    for word in "${words[@]}"; do
        # Remove leading and trailing spaces and quotes from each word
        word=$(echo "$word" | sed "s/^[ \t]*['\"]//;s/['\"][ \t]*$//")

        # Increment the line counter
        line_num=$((line_num + 1))
        
        # Print the line number and the word to the output file
        echo "$line_num,$word" >> "$output_file"
    done
done < "$input_file"

echo "Transformation complete. Output saved to $output_file"

