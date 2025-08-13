#!/bin/bash

# Scout Events Website Deployment Validation Script
# This script validates the deployed site and checks for common issues

set -e

SITE_URL=${1:-"https://scout-events-website.netlify.app"}

echo "🔍 Validating deployment at: $SITE_URL"

# Function to check HTTP status
check_url() {
    local url=$1
    local expected_status=${2:-200}
    
    echo "   Checking: $url"
    
    if command -v curl &> /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
        if [ "$status" = "$expected_status" ]; then
            echo "   ✅ $url returned $status"
            return 0
        else
            echo "   ❌ $url returned $status (expected $expected_status)"
            return 1
        fi
    else
        echo "   ⚠️  curl not available, skipping URL check"
        return 0
    fi
}

# Function to check if content exists
check_content() {
    local url=$1
    local search_text=$2
    
    echo "   Checking content: $search_text in $url"
    
    if command -v curl &> /dev/null; then
        if curl -s "$url" | grep -q "$search_text"; then
            echo "   ✅ Found expected content"
            return 0
        else
            echo "   ❌ Expected content not found"
            return 1
        fi
    else
        echo "   ⚠️  curl not available, skipping content check"
        return 0
    fi
}

echo "🌐 Testing critical pages..."

# Test critical pages
critical_pages=(
    "$SITE_URL/"
    "$SITE_URL/events/"
    "$SITE_URL/contact/"
    "$SITE_URL/admin/"
)

failed_checks=0

for page in "${critical_pages[@]}"; do
    if ! check_url "$page"; then
        ((failed_checks++))
    fi
done

echo ""
echo "📝 Testing page content..."

# Test homepage content
if ! check_content "$SITE_URL/" "Scout Events"; then
    ((failed_checks++))
fi

# Test events page
if ! check_content "$SITE_URL/events/" "Events"; then
    ((failed_checks++))
fi

# Test admin interface
if ! check_content "$SITE_URL/admin/" "Decap CMS"; then
    ((failed_checks++))
fi

echo ""
echo "🔧 Testing form functionality..."

# Test contact form exists
if ! check_content "$SITE_URL/contact/" "contact"; then
    ((failed_checks++))
fi

echo ""
echo "📊 Testing RSS feed..."

# Test RSS feed
if ! check_url "$SITE_URL/index.xml"; then
    ((failed_checks++))
fi

echo ""
echo "🔒 Testing security headers..."

# Test security headers if curl is available
if command -v curl &> /dev/null; then
    echo "   Checking security headers..."
    headers=$(curl -s -I "$SITE_URL/" || echo "")
    
    if echo "$headers" | grep -q "X-Frame-Options"; then
        echo "   ✅ X-Frame-Options header present"
    else
        echo "   ❌ X-Frame-Options header missing"
        ((failed_checks++))
    fi
    
    if echo "$headers" | grep -q "X-Content-Type-Options"; then
        echo "   ✅ X-Content-Type-Options header present"
    else
        echo "   ❌ X-Content-Type-Options header missing"
        ((failed_checks++))
    fi
fi

echo ""
echo "📋 Validation Summary:"
echo "   Total failed checks: $failed_checks"

if [ $failed_checks -eq 0 ]; then
    echo "🎉 All validation checks passed!"
    exit 0
else
    echo "❌ $failed_checks validation checks failed"
    echo "🔧 Please review the deployment and fix any issues"
    exit 1
fi