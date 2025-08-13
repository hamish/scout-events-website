#!/bin/bash

# Scout Events Website - Bundle Analysis Script
# Analyzes built site for performance optimization opportunities

set -e  # Exit on any error

# Helper function to format bytes to KB
format_bytes() {
    local bytes=$1
    if [ -z "$bytes" ] || [ "$bytes" -eq 0 ]; then
        echo "0KB"
    else
        echo "scale=1; $bytes / 1024" | bc 2>/dev/null | sed 's/$/KB/' || echo "${bytes}B"
    fi
}

echo "🔍 Starting bundle analysis for Scout Events Website..."

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Error: Hugo is not installed or not in PATH"
    exit 1
fi

# Create analysis directory
mkdir -p analysis-reports

# Build site first
echo "🔨 Building site for analysis..."
hugo --gc --minify --cleanDestinationDir --enableGitInfo

# Create timestamp for reports
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

echo "📊 Analyzing built site..."

# CSS Analysis
echo "📋 CSS Analysis:"
if [ -d "public/css" ]; then
    echo "   - CSS files found:"
    find public/css -name "*.css" -exec echo "     {}" \; -exec du -h {} \;
    
    # Total CSS size  
    TOTAL_CSS=$(find public/css -name "*.css" -exec cat {} \; | wc -c)
    echo "   - Total CSS size: $(format_bytes $TOTAL_CSS)"
else
    echo "   - No CSS files found in public/css"
fi

# JavaScript Analysis  
echo "📋 JavaScript Analysis:"
if [ -d "public/js" ] || find public -name "*.js" -type f | grep -q .; then
    echo "   - JavaScript files found:"
    find public -name "*.js" -type f -exec echo "     {}" \; -exec du -h {} \;
    
    # Total JS size
    TOTAL_JS=$(find public -name "*.js" -type f -exec cat {} \; | wc -c)
    echo "   - Total JavaScript size: $(format_bytes $TOTAL_JS)"
else
    echo "   - No JavaScript files found"
fi

# HTML Analysis
echo "📋 HTML Analysis:"
if [ -d "public" ]; then
    HTML_COUNT=$(find public -name "*.html" | wc -l)
    echo "   - HTML files: $HTML_COUNT"
    
    TOTAL_HTML=$(find public -name "*.html" -exec cat {} \; | wc -c)
    echo "   - Total HTML size: $(format_bytes $TOTAL_HTML)"
    
    # Largest HTML files
    echo "   - Largest HTML files:"
    find public -name "*.html" -exec du -h {} \; | sort -hr | head -5 | sed 's/^/     /'
fi

# Image Analysis
echo "📋 Image Analysis:"
if find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | grep -q .; then
    echo "   - Image files found:"
    find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) -exec echo "     {}" \; -exec du -h {} \;
    
    TOTAL_IMAGES=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) -exec cat {} \; | wc -c)
    echo "   - Total image size: $(format_bytes $TOTAL_IMAGES)"
else
    echo "   - No image files found"
fi

# Overall site analysis
echo "📋 Overall Site Analysis:"
TOTAL_SIZE=$(du -sh public | cut -f1)
TOTAL_FILES=$(find public -type f | wc -l)
echo "   - Total site size: $TOTAL_SIZE"
echo "   - Total files: $TOTAL_FILES"

# Performance recommendations
echo ""
echo "🚀 Performance Recommendations:"

# Check for large CSS files
if [ -n "$TOTAL_CSS" ] && [ "$TOTAL_CSS" -gt 100000 ]; then
    echo "   ⚠️  Large CSS detected ($(format_bytes $TOTAL_CSS)). Consider:"
    echo "      - Split CSS into critical and non-critical parts"
    echo "      - Remove unused CSS rules"
    echo "      - Use CSS minification"
fi

# Check for inline scripts
INLINE_SCRIPTS=$(find public -name "*.html" -exec grep -l "<script>" {} \; | wc -l)
if [ "$INLINE_SCRIPTS" -gt 0 ]; then
    echo "   ⚠️  $INLINE_SCRIPTS HTML files contain inline scripts. Consider:"
    echo "      - Extract inline JavaScript to separate files"
    echo "      - Use async/defer loading for non-critical scripts"
fi

# Check for missing optimizations
if ! find public -name "*.webp" | grep -q .; then
    echo "   💡 No WebP images found. Consider:"
    echo "      - Convert images to WebP format for better compression"
    echo "      - Implement responsive images"
fi

# Generate detailed report
echo ""
echo "📝 Generating detailed analysis report..."

cat > "analysis-reports/bundle-analysis-$TIMESTAMP.txt" << EOF
# Scout Events Website - Bundle Analysis Report
Generated: $(date)
Hugo Version: $(hugo version)

## Site Statistics
- Total size: $TOTAL_SIZE  
- Total files: $TOTAL_FILES
- HTML files: $HTML_COUNT
- CSS size: $(format_bytes ${TOTAL_CSS:-0})
- JavaScript size: $(format_bytes ${TOTAL_JS:-0})
- Image size: $(format_bytes ${TOTAL_IMAGES:-0})

## File Breakdown
### CSS Files
$(find public/css -name "*.css" 2>/dev/null | while read file; do echo "- $file ($(du -h "$file" | cut -f1))"; done)

### JavaScript Files  
$(find public -name "*.js" -type f 2>/dev/null | while read file; do echo "- $file ($(du -h "$file" | cut -f1))"; done)

### Largest HTML Files
$(find public -name "*.html" -exec du -h {} \; | sort -hr | head -10)

## Optimization Opportunities
$(if [ -n "$TOTAL_CSS" ] && [ "$TOTAL_CSS" -gt 100000 ]; then echo "- Split large CSS file ($(format_bytes $TOTAL_CSS))"; fi)
$(if [ "$INLINE_SCRIPTS" -gt 0 ]; then echo "- Extract $INLINE_SCRIPTS inline scripts"; fi)  
$(if ! find public -name "*.webp" | grep -q .; then echo "- Implement WebP image format"; fi)
- Consider implementing critical CSS
- Add lazy loading for images
- Implement service worker for caching

## Performance Budget Recommendations
- CSS: < 100KB (Current: $(format_bytes ${TOTAL_CSS:-0}))
- JavaScript: < 200KB (Current: $(format_bytes ${TOTAL_JS:-0}))
- Images per page: < 1MB
- Total page size: < 2MB

EOF

echo "✅ Analysis complete! Report saved to analysis-reports/bundle-analysis-$TIMESTAMP.txt"

# Create lighthouse analysis if available
if command -v npx &> /dev/null; then
    echo "🔍 Running Lighthouse analysis (requires local server)..."
    echo "   To run Lighthouse analysis:"
    echo "   1. Start local server: hugo server -D"
    echo "   2. Run: npm run audit:performance"
fi

echo "🎉 Bundle analysis completed successfully!"