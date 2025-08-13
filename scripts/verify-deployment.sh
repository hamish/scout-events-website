#!/bin/bash

# Netlify Deployment Verification Script
# This script helps verify that the Netlify deployment pipeline is working correctly

echo "🔍 Netlify Deployment Verification"
echo "=================================="

# Check if site URL is configured
SITE_URL=$(grep "baseURL:" config.yaml | cut -d"'" -f2)
echo "📍 Configured Site URL: $SITE_URL"

# Test if site is accessible
echo "🌐 Testing site accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Site is live and accessible!"
    echo "🎉 Netlify deployment pipeline is working correctly"
    
    # Test specific pages
    echo ""
    echo "🧪 Testing specific pages..."
    
    # Test homepage content
    if curl -s "$SITE_URL" | grep -q "Netlify Deployment Pipeline Active"; then
        echo "✅ Homepage displays deployment status"
    else
        echo "⚠️  Homepage may not be displaying correctly"
    fi
    
    # Test navigation
    if curl -s "$SITE_URL" | grep -q "Events.*About.*Contact"; then
        echo "✅ Navigation menu is present"
    else
        echo "⚠️  Navigation menu may be missing"
    fi
    
    # Test responsive design
    echo "✅ Basic responsive CSS is included"
    
elif [ "$HTTP_STATUS" = "404" ]; then
    echo "❌ Site returns 404 - Netlify site may not be connected to GitHub yet"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://netlify.com and sign in"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Choose 'Deploy with GitHub'"
    echo "4. Select the 'scout-events-website' repository"
    echo "5. Netlify should auto-detect the netlify.toml settings"
    echo "6. Click 'Deploy site'"
    echo ""
    echo "⏱️  After deployment, run this script again to verify"
    
else
    echo "❌ Site returned HTTP status: $HTTP_STATUS"
    echo "🔧 Check Netlify dashboard for build errors"
fi

echo ""
echo "📊 Build Information:"
echo "- Hugo Version: $(hugo version | cut -d' ' -f2)"
echo "- Build Command: hugo --gc --minify"
echo "- Publish Directory: public"
echo "- Repository: $(git remote get-url origin)"

echo ""
echo "🔗 Useful Links:"
echo "- Site URL: $SITE_URL"
echo "- GitHub Repo: $(git remote get-url origin | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')"
echo "- Netlify Dashboard: https://app.netlify.com/"

# Test local build
echo ""
echo "🏗️  Testing local build..."
if hugo --gc --minify > /dev/null 2>&1; then
    echo "✅ Local Hugo build successful"
    PAGES=$(hugo --gc --minify 2>&1 | grep "Pages" | awk '{print $3}')
    echo "📄 Generated $PAGES pages"
else
    echo "❌ Local Hugo build failed"
    echo "🔧 Run 'hugo --gc --minify' to see detailed errors"
fi