import sys
import re
from pathlib import Path

html_file = Path(sys.argv[1])
js_file = Path(sys.argv[2])
obf_file = Path(sys.argv[3])

html_content = html_file.read_text(encoding='utf-8')

# Find all script blocks that do not use a 'src' attribute
script_blocks = list(re.finditer(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL))

if not script_blocks:
    print(f"No inline <script> blocks found in {html_file.name}")
    sys.exit(1)

# Pick the largest script block (likely the main logic)
largest_block = max(script_blocks, key=lambda m: len(m.group(1)))
script_code = largest_block.group(1).strip()

# Save JS code to file with copyright
license_comment = "/* Copyright 2025 © EZR Consulting. All rights reserved. */\n\n"
js_file.write_text(license_comment + script_code, encoding='utf-8')

# Replace the script block in HTML with reference to obfuscated version
start, end = largest_block.span()
new_html = html_content[:start] + f'<script src="{obf_file.name}"></script>' + html_content[end:]

# Write updated HTML back to file
html_file.write_text(new_html, encoding='utf-8')

print(f"Processed {html_file.name} -> extracted JS to {js_file.name}, replaced with {obf_file.name}")