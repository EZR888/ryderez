#!/bin/bash

# Base URL
base_url="http://www.fortunecookiemessage.com/archive.php"

# Starting point
start=0

# Maximum value
max_start=900

# Loop through and download files
while [ $start -le $max_start ]; do
  # Construct the URL with the current start value
  url="${base_url}?start=${start}"
  
  # Construct the filename
  filename="archive_${start}.php"
  
  # Perform the download
  echo "Downloading from: $url"
  curl -o "$filename" "$url"
  
  # Increment the start value
  start=$((start + 50))
done

echo "Download completed."
