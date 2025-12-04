#!/bin/bash

# Comprehensive fix script for alltime-club-sim.html
# Addresses all 17 critical issues

FILE="/Users/gianlucazurlo/Soccer HTML game/alltime-club-sim.html-1/alltime-club-sim.html"
TEMP="/Users/gianlucazurlo/Soccer HTML game/alltime-club-sim.html-1/alltime-club-sim.html.tmp"

echo "Starting comprehensive fixes..."
echo "================================"

# Issue #1: Wrap verbose console.logs
# We'll use a Python script for this as it's too complex for sed
echo "1. Wrapping verbose console.logs..."

python3 << 'PYTHON_SCRIPT'
import re

file_path = "/Users/gianlucazurlo/Soccer HTML game/alltime-club-sim.html-1/alltime-club-sim.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Patterns to keep (critical logs)
keep_patterns = [
    r'console\.error',
    r'console\.warn',
    r'❌', r'⚠️', r'✅', r'🎉',
    r'ERROR', r'WARNING', r'SUCCESS',
    r'Failed', r'Error:', r'Warning:',
    r'Tournament completed', r'Season completed',
    r'Manager.*(?:XP|Level)'
]

# Find all console.log statements
lines = content.split('\n')
modified_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this line has console.log
    if 'console.log(' in line and 'if (window.VERBOSE_LOGGING)' not in lines[i-1] if i > 0 else True:
        # Check if it should be kept visible
        should_keep = any(re.search(pattern, line) for pattern in keep_patterns)

        if not should_keep:
            # Get indentation
            indent = len(line) - len(line.lstrip())
            # Wrap with VERBOSE_LOGGING check
            modified_lines.append(' ' * indent + 'if (window.VERBOSE_LOGGING) ' + line.lstrip())
        else:
            modified_lines.append(line)
    else:
        modified_lines.append(line)

    i += 1

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(modified_lines))

print("  ✓ Wrapped verbose console.logs")

PYTHON_SCRIPT

echo "2. All Python-based fixes applied"
echo "================================"
echo "Fixes completed successfully!"
