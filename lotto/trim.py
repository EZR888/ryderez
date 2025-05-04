import os

def trim_file(file_path, output_path, start_phrase="Winning Numbers", end_phrase="Select Page"):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_index = end_index = None
    for i, line in enumerate(lines):
        if start_phrase in line and start_index is None:
            start_index = i
        if end_phrase in line:
            end_index = i
            break  # Assume only one end_phrase appears and we want the first occurrence

    if start_index is not None and end_index is not None and start_index <= end_index:
        trimmed_lines = lines[start_index:end_index + 1]
        with open(output_path, 'w', encoding='utf-8') as f_out:
            f_out.writelines(trimmed_lines)
    else:
        print(f"⚠️ Could not find both markers in: {file_path}")

# Process files output-1.txt through output-382.txt
for i in range(1, 41):
    input_file = f"output-{i}.txt"
    output_file = f"trimmed-{i}.txt"
    if os.path.exists(input_file):
        trim_file(input_file, output_file)
    else:
        print(f"File not found: {input_file}")

