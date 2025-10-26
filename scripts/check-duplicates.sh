#!/bin/bash

# Check for duplicate files with " 2" suffix
# Created to prevent Cursor IDE from creating duplicate files

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Scanning for duplicate files...${NC}"
echo ""

# Find all files with " 2" suffix
DUPLICATES=$(find . -type f -name "* 2.*" \
    -not -path "*/node_modules/*" \
    -not -path "*/ios/Pods/*" \
    -not -path "*/ios/build/*" \
    -not -path "*/android/build/*" \
    -not -path "*/.git/*" \
    -not -path "*/coverage/*" 2>/dev/null || true)

if [ -z "$DUPLICATES" ]; then
    echo -e "${GREEN}✅ No duplicate files found!${NC}"
    exit 0
fi

echo -e "${RED}❌ Found duplicate files:${NC}"
echo ""
echo "$DUPLICATES" | sed 's/^/  /'
echo ""

# Count duplicates
COUNT=$(echo "$DUPLICATES" | wc -l | tr -d ' ')
echo -e "${YELLOW}Total duplicates found: $COUNT${NC}"
echo ""

# Ask user what to do
read -p "Do you want to compare and clean these duplicates? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Exiting without changes."
    exit 0
fi

# Process each duplicate
echo "$DUPLICATES" | while read -r duplicate; do
    # Get original filename by removing " 2" before extension
    original=$(echo "$duplicate" | sed 's/ 2\(\.[^.]*\)$/\1/')
    
    echo ""
    echo -e "${BLUE}Comparing:${NC}"
    echo "  Original: $original"
    echo "  Duplicate: $duplicate"
    echo ""
    
    if [ ! -f "$original" ]; then
        echo -e "${YELLOW}⚠️  Original file not found. Skipping...${NC}"
        continue
    fi
    
    # Compare files
    if diff -q "$original" "$duplicate" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Files are IDENTICAL${NC}"
        echo "  Deleting duplicate: $duplicate"
        rm "$duplicate"
    else
        echo -e "${RED}✗ Files are DIFFERENT${NC}"
        echo ""
        echo "Differences:"
        diff -u "$original" "$duplicate" | head -20 || true
        echo ""
        echo -e "${YELLOW}⚠️  Manual review required. Please merge manually.${NC}"
        echo "  Keep this duplicate for now."
    fi
done

echo ""
echo -e "${GREEN}✅ Duplicate check complete!${NC}"

