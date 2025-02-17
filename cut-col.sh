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

# Use sed to remove the first column and the following comma
sed 's/^[^,]*,//' "$filename" > "$filename.tmp"  # Create a temp file
mv "$filename.tmp" "$filename"                    # Replace the original file

echo "First column removed from '$filename'."

exit 0
