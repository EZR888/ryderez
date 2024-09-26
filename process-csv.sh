#!/bin/bash

# Function to process the CSV file and display text-based output with row numbers and group sums
process_csv_data() {
  input_file="$1"

  # Define column order and groups
  column_order=("6" "21" "33" "16" "4" "23" "35" "14" "2" "0" "28" "9" "26" "30" "11" "7" "20" "32" "17" "5" "22" "34" "15" "3" "24" "36" "13" "1" "37" "27" "10" "25" "29" "12" "8" "19" "31" "18")
  group1_columns=("14" "2" "0" "28" "9")
  group2_columns=("13" "1" "37" "27" "10")

  header_processed=false
  header_indices=()
  sorted_rows=()

  # Read the CSV file line by line
  line_number=0
  while IFS=',' read -r -a row; do
    if [ "$header_processed" = false ]; then
      # First row is the header
      echo "Header: ${row[*]}"
      
      # Extract header indices based on column order
      for col in "${column_order[@]}"; do
        for i in "${!row[@]}"; do
          if [ "${row[$i]}" = "$col" ]; then
            header_indices+=($i)
          fi
        done
      done

      header_processed=true
    else
      # Process data rows
      group1_sum=0
      group2_sum=0
      row_data=()

      for i in "${header_indices[@]}"; do
        cell_value="${row[$i]}"
        row_data+=("$cell_value")

        # Calculate Group 1 sum
        if [[ " ${group1_columns[*]} " == *" ${column_order[$i]} "* ]]; then
          group1_sum=$((group1_sum + cell_value))
        fi
        # Calculate Group 2 sum
        if [[ " ${group2_columns[*]} " == *" ${column_order[$i]} "* ]]; then
          group2_sum=$((group2_sum + cell_value))
        fi
      done

      # Save the row data with original line number
      sorted_rows+=("$line_number ${row_data[*]} | Group 1 Sum: $group1_sum | Group 2 Sum: $group2_sum")
    fi
    line_number=$((line_number + 1))
  done < "$input_file"

  # Sort rows based on the data values (skipping the line number)
  sorted_output=($(printf "%s\n" "${sorted_rows[@]}" | sort -r -k2,2n))

  # Output sorted rows with before and after row numbers
  for i in "${!sorted_output[@]}"; do
    after_sort_row_num=$((i + 1))  # After sorting row number
    original_line=$(echo "${sorted_output[$i]}" | cut -d' ' -f1)  # Before sorting row number
    row_data=$(echo "${sorted_output[$i]}" | cut -d' ' -f2-)  # Row data
    echo "Row: $after_sort_row_num (Original Row: $original_line) $row_data"
  done
}

# Check if the correct number of arguments is provided
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <csv_file>"
  exit 1
fi

# Process the provided CSV file
process_csv_data "$1"
`
