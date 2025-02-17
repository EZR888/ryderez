#!/bin/bash

# Check if a filename is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

filename="$1"

# Check if the file exists
if [ ! -f "$filename" ]; then
  echo "Error: File '$filename' not found."
  exit 1
fi

# Shuffle the lines using 'sort -R' and overwrite the original file
sort -R "$filename" > "$filename.tmp"
mv "$filename.tmp" "$filename"

echo "Lines in '$filename' randomized (using sort -R)."

exit 0
