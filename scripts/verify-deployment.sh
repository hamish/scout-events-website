#!/bin/bash

# Deployment Verification Script
# This script helps verify that the Netlify deployment is working correctly

echo "🚀 Scout Events Website - Deployment Verification"
echo "================================================"

# Check if we're in the correct directory
if [ ! -f "config.yaml" ]; then
    echo "❌ Error: Please run this script from the scout-events-website directory"
    exit 1
fi

echo "📁 Checking project structure..."

# Check essential files
files_to_check=(
    "config.yaml"
    "netlify.toml"
    "NETLIFY_SETUP.md"
    "content/_index.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

echo ""
echo "🔧 Checking Hugo installation..."
if command -v hugo &> /dev/null; then
    hugo_version=$(hugo version)
    echo "✅ Hugo is installed: $hugo_version"
else
    echo "❌ Hugo is not installed. Please install Hugo first."
    echo "   Visit: https://gohugo.io/installation/"
fi

echo ""
echo "🏗️  Testing local build..."
if hugo --gc --minify --destination public-test; then
    echo "✅ Hugo build successful"
    rm -rf public-test
else
    echo "❌ Hugo build failed"
    exit 1
fi

echo ""
echo "📡 Checking Git repository status..."
if git status &> /dev/null; then
    echo "✅ Git repository initialized"
    
    # Check if remote origin is set
    if git remote get-url origin &> /dev/null; then
        origin_url=$(git remote get-url origin)
        echo "✅ Remote origin configured: $origin_url"
    else
        echo "⚠️  Remote origin not configured yet"
        echo "   Follow instructions in GITHUB_SETUP.md"
    fi
else
    echo "❌ Not a Git repository"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "   □ GitHub repository created and pushed"
echo "   □ Netlify account created"
echo "   □ Repository connected to Netlify"
echo "   □ Build settings configured"
echo "   □ Initial deployment tested"
echo "   □ Custom domain configured (optional)"
echo ""
echo "📖 Next steps:"
echo "   1. Follow GITHUB_SETUP.md if repository not yet pushed"
echo "   2. Follow NETLIFY_SETUP.md to configure deployment"
echo "   3. Test the deployment with the test page"
echo ""
echo "🎉 Ready for Netlify deployment!"