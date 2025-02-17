#!/bin/bash

# Check for filename argument
if [ -z "$1" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

filename="$1"

# Check if file exists
if [ ! -f "$filename" ]; then
  echo "Error: File '$filename' not found."
  exit 1
fi

# Use sed to remove the string "Removed: " (including the space)
sed 's/Removed: //g' "$filename" > "$filename.tmp"  # 'g' for all occurrences

mv "$filename.tmp" "$filename"  # Replace original file

echo "String 'Removed: ' removed from '$filename'."

exit 0
