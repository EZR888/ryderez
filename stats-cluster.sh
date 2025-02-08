#!/opt/homebrew/bin/bash

# Usage: ./process_csv.sh input.csv

if [ $# -lt 1 ]; then
  echo "Usage: $0 input.csv"
  exit 1
fi

input_file="$1"

# Define the column orders
column_order=("6" "21" "33" "16" "4" "23" "35" "14" "2" "0" "28" "9" "26" "30" "11" "7" "20" "32" "17" "5" "22" "34" "15" "3" "24" "36" "13" "1" "00" "27" "10" "25" "29" "12" "8" "19" "31" "18")
group1_columns=("0" "9" "14" "28" "2")
group2_columns=("1" "13" "27" "10" "00")

# Initialize stats data
declare -A highHits
declare -A group1
declare -A group2

for i in {1..17}; do
    highHits[$i]=0
    group1[$i]=0
    group2[$i]=0
done

# Read and process CSV
run_count=0

# Skip the header row and process each data row
while IFS=, read -r -a row_data; do
    ((run_count++))
    group1Sum=0
    group2Sum=0

    for i in "${!column_order[@]}"; do
        header="${column_order[$i]}"
        adjusted_index=$((i + 1))  # Skip line number column
        cell_value="${row_data[$adjusted_index]}"

        if [[ $cell_value =~ ^[0-9]+$ ]]; then
            num_value=$cell_value

            # Calculate sums for group1 and group2
            if [[ " ${group1_columns[@]} " =~ " ${header} " ]]; then
                group1Sum=$((group1Sum + num_value))
            fi
            if [[ " ${group2_columns[@]} " =~ " ${header} " ]]; then
                group2Sum=$((group2Sum + num_value))
            fi

            # Update highHits count if value is between 1 and 17
            if (( num_value >= 1 && num_value <= 17 )); then
                highHits[$num_value]=$((highHits[$num_value] + 1))
            fi
        fi
    done

    # Update group1 and group2 sums
    if (( group1Sum >= 1 && group1Sum <= 17 )); then
        group1[$group1Sum]=$((group1[$group1Sum] + 1))
    fi
    if (( group2Sum >= 1 && group2Sum <= 17 )); then
        group2[$group2Sum]=$((group2[$group2Sum] + 1))
    fi
done < <(tail -n +2 "$input_file")  # Skip the header

# Output the result
echo "Runs: $run_count"
echo "Totals, Cluster 0, Cluster 00, Times Hit"

for i in {1..17}; do
    echo "$i, ${group1[$i]}, ${group2[$i]}, ${highHits[$i]}"
done

