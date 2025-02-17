#!/bin/bash

# Define file paths
REMOVE_FILE="remove_words.txt"   # File containing words to remove
TARGET_FILE="target_file.txt"     # File from which lines should be removed
OUTPUT_FILE="cleaned_target_file.txt"  # Output file after filtering

# Check if both files exist
if [[ ! -f "$REMOVE_FILE" || ! -f "$TARGET_FILE" ]]; then
    echo "Error: One or both input files do not exist."
    exit 1
fi

# Use grep to filter out lines containing words from remove_words.txt
grep -v -F -f "$REMOVE_FILE" "$TARGET_FILE" > "$OUTPUT_FILE"

# Output result message
echo "Filtered file saved as: $OUTPUT_FILE"

