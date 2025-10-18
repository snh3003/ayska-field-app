#!/bin/bash

# Clean Duplicates Detection Script
# Scans for files with " 2", " 3" suffixes that indicate macOS file conflicts

echo "🔍 Scanning for duplicate files (macOS conflict artifacts)..."

# Find files with duplicate suffixes, excluding node_modules and .git
duplicates=$(find . -name "* 2*" -o -name "* 3*" | grep -v node_modules | grep -v ".git" | sort)

if [ -z "$duplicates" ]; then
    echo "✅ No duplicate files found!"
    exit 0
else
    echo "❌ Found duplicate files:"
    echo "$duplicates"
    echo ""
    echo "These files appear to be macOS file conflict artifacts."
    echo "Consider removing them if they are not needed."
    echo ""
    echo "To remove all duplicates:"
    echo "find . -name '* 2*' -o -name '* 3*' | grep -v node_modules | grep -v '.git' | xargs rm -rf"
    exit 1
fi
