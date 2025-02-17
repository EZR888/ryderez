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

# Use grep to filter lines NOT starting with uppercase
grep -Ev '^[A-Z][a-zA-Z]*\b' "$filename" > "$filename.tmp"

mv "$filename.tmp" "$filename"

echo "Lines starting with uppercase removed from '$filename'."

exit 0
