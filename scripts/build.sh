#!/bin/bash

# Scout Events Website Build Script
# This script handles the Hugo build process with error handling and notifications

set -e  # Exit on any error

echo "🚀 Starting Scout Events Website build..."

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Error: Hugo is not installed or not in PATH"
    exit 1
fi

# Display Hugo version
echo "📦 Hugo version: $(hugo version)"

# Set build environment
export HUGO_ENV=${HUGO_ENV:-production}
echo "🌍 Build environment: $HUGO_ENV"

# Clean previous build artifacts
echo "🧹 Cleaning previous build..."
rm -rf public resources

# Create necessary directories
mkdir -p public resources/_gen

# Run Hugo build with error handling
echo "🔨 Building site..."
if hugo --gc --minify --cleanDestinationDir --enableGitInfo; then
    echo "✅ Build completed successfully!"
    
    # Display build statistics
    if [ -f "public/index.html" ]; then
        echo "📊 Build statistics:"
        echo "   - Total files: $(find public -type f | wc -l)"
        echo "   - HTML files: $(find public -name "*.html" | wc -l)"
        echo "   - CSS files: $(find public -name "*.css" | wc -l)"
        echo "   - JS files: $(find public -name "*.js" | wc -l)"
        echo "   - Image files: $(find public \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" \) | wc -l)"
        
        # Check public directory size
        if command -v du &> /dev/null; then
            echo "   - Total size: $(du -sh public | cut -f1)"
        fi
    fi
    
    # Validate critical files exist
    echo "🔍 Validating build output..."
    critical_files=("public/index.html" "public/events/index.html" "public/admin/index.html")
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            echo "   ✅ $file exists"
        else
            echo "   ❌ Critical file missing: $file"
            exit 1
        fi
    done
    
    echo "🎉 Build validation passed!"
    
else
    echo "❌ Build failed!"
    echo "📋 Build logs have been captured above"
    
    # If in CI environment, create failure notification
    if [ -n "$NETLIFY" ]; then
        echo "🔔 Netlify build failure detected"
        # Netlify will handle the notification automatically
    fi
    
    exit 1
fi

echo "✨ Build process completed successfully!"