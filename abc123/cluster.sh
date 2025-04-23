#!/bin/bash

# Check if a file was provided
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <file>"
  exit 1
fi

file="$1"

# Initialize sums for clusters 1 to 38
cluster_sums=()
for ((i=0; i<=37; i++)); do
  cluster_sums[i]=0
done

# Loop through each line in the file
while IFS= read -r line; do
  # Check if the line starts with "Cluster: "
  if [[ $line == Cluster:* ]]; then
    # Extract the cluster number (the first number after "Cluster: " and before the first ",")
    cluster_number=$(echo "$line" | awk -F', ' '{print $1}' | awk '{print $2}')
    
    # Extract the sum value (the number after "Sum: ")
    sum=$(echo "$line" | awk -F'Sum: ' '{print $2}')
    
    # Add the sum to the corresponding cluster's total
    cluster_sums[$cluster_number]=$((cluster_sums[$cluster_number] + sum))
  fi
done < "$file"

# Output the results for each cluster
for ((i=0; i<=37; i++)); do
  if [ "${cluster_sums[$i]}" -gt 0 ]; then
    echo "Cluster $i Total Sum: ${cluster_sums[$i]}"
  fi
done

