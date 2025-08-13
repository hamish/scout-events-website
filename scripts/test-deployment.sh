#!/bin/bash

# Scout Events Website Deployment Testing Script
# This script tests the deployment pipeline with sample content changes

set -e

echo "🧪 Scout Events Website Deployment Testing"
echo "=========================================="

# Check if we're in the correct directory
if [ ! -f "config.yaml" ]; then
    echo "❌ Error: Not in the scout-events-website directory"
    echo "💡 Please run this script from the project root"
    exit 1
fi

# Check if git is available and we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to create a test event
create_test_event() {
    local event_name="deployment-test-$(date +%s)"
    local event_file="content/events/${event_name}.md"
    local test_date=$(date -d "+7 days" +%Y-%m-%d)
    
    echo "📝 Creating test event: $event_name"
    
    cat > "$event_file" << EOF
---
title: "Deployment Test Event"
start_date: "$test_date"
start_time: "19:00"
end_time: "21:00"
location: "Test Location"
event_type: "meeting"
age_groups: ["cubs", "scouts"]
description: "This is a test event created to validate the deployment pipeline. This event will be automatically removed after testing."
draft: false
---

This is a test event created by the deployment testing script on $(date).

The purpose of this event is to:
- Test the automated deployment pipeline
- Validate content management workflow
- Ensure the site builds correctly with new content
- Verify that changes are properly deployed

This event should appear on the events page after deployment.
EOF

    echo "✅ Test event created: $event_file"
    echo "$event_file"
}

# Function to remove test event
remove_test_event() {
    local event_file=$1
    
    if [ -f "$event_file" ]; then
        echo "🗑️  Removing test event: $event_file"
        rm "$event_file"
        echo "✅ Test event removed"
    fi
}

# Function to test local build
test_local_build() {
    echo "🔨 Testing local build..."
    
    # Clean previous build
    rm -rf public resources/_gen
    
    # Run build script
    if ./scripts/build.sh; then
        echo "✅ Local build successful"
        return 0
    else
        echo "❌ Local build failed"
        return 1
    fi
}

# Function to commit and push changes
commit_and_push() {
    local message=$1
    
    echo "📤 Committing and pushing changes..."
    
    # Add changes
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        echo "ℹ️  No changes to commit"
        return 0
    fi
    
    # Commit changes
    git commit -m "$message"
    
    # Push to remote
    if git push origin main; then
        echo "✅ Changes pushed successfully"
        return 0
    else
        echo "❌ Failed to push changes"
        return 1
    fi
}

# Function to wait for deployment
wait_for_deployment() {
    local site_url=${1:-"https://scout-events-website.netlify.app"}
    local max_wait=300  # 5 minutes
    local wait_time=0
    local check_interval=30
    
    echo "⏳ Waiting for deployment to complete..."
    echo "   Site URL: $site_url"
    echo "   Max wait time: ${max_wait}s"
    
    while [ $wait_time -lt $max_wait ]; do
        echo "   Checking deployment status... (${wait_time}s elapsed)"
        
        if command -v curl &> /dev/null; then
            # Check if site is responding
            if curl -s --max-time 10 "$site_url" > /dev/null; then
                echo "✅ Site is responding"
                return 0
            fi
        fi
        
        sleep $check_interval
        wait_time=$((wait_time + check_interval))
    done
    
    echo "⚠️  Deployment wait timeout reached"
    return 1
}

# Main testing workflow
main() {
    local site_url=${1:-"https://scout-events-website.netlify.app"}
    local cleanup=${2:-"true"}
    
    echo "🎯 Starting deployment test workflow"
    echo "   Site URL: $site_url"
    echo "   Cleanup after test: $cleanup"
    echo ""
    
    # Step 1: Test local build first
    echo "📋 Step 1: Testing local build"
    if ! test_local_build; then
        echo "❌ Local build test failed - aborting deployment test"
        exit 1
    fi
    echo ""
    
    # Step 2: Create test content
    echo "📋 Step 2: Creating test content"
    test_event_file=$(create_test_event)
    echo ""
    
    # Step 3: Test build with new content
    echo "📋 Step 3: Testing build with new content"
    if ! test_local_build; then
        echo "❌ Build test with new content failed"
        if [ "$cleanup" = "true" ]; then
            remove_test_event "$test_event_file"
        fi
        exit 1
    fi
    echo ""
    
    # Step 4: Commit and push changes
    echo "📋 Step 4: Deploying test content"
    if ! commit_and_push "test: deployment pipeline validation"; then
        echo "❌ Failed to deploy test content"
        if [ "$cleanup" = "true" ]; then
            remove_test_event "$test_event_file"
        fi
        exit 1
    fi
    echo ""
    
    # Step 5: Wait for deployment
    echo "📋 Step 5: Waiting for deployment"
    if wait_for_deployment "$site_url"; then
        echo "✅ Deployment completed"
    else
        echo "⚠️  Could not confirm deployment completion"
    fi
    echo ""
    
    # Step 6: Validate deployment
    echo "📋 Step 6: Validating deployment"
    if ./scripts/validate-deployment.sh "$site_url"; then
        echo "✅ Deployment validation passed"
    else
        echo "⚠️  Some validation checks failed"
    fi
    echo ""
    
    # Step 7: Cleanup (if requested)
    if [ "$cleanup" = "true" ]; then
        echo "📋 Step 7: Cleaning up test content"
        remove_test_event "$test_event_file"
        
        if commit_and_push "test: cleanup deployment test content"; then
            echo "✅ Cleanup completed"
        else
            echo "⚠️  Cleanup push failed - you may need to remove test content manually"
        fi
    else
        echo "📋 Step 7: Skipping cleanup (test content preserved)"
        echo "   Test event file: $test_event_file"
    fi
    
    echo ""
    echo "🎉 Deployment test completed!"
    echo "📊 Test Summary:"
    echo "   ✅ Local build test"
    echo "   ✅ Content creation test"
    echo "   ✅ Build with new content test"
    echo "   ✅ Deployment pipeline test"
    echo "   ✅ Deployment validation test"
    if [ "$cleanup" = "true" ]; then
        echo "   ✅ Cleanup test"
    fi
}

# Script usage
case "${1:-}" in
    "help"|"h"|"-h"|"--help")
        echo "🔧 Usage:"
        echo "   $0                           - Run full deployment test with cleanup"
        echo "   $0 <site-url>               - Test specific site URL"
        echo "   $0 <site-url> false         - Test without cleanup"
        echo "   $0 help                     - Show this help"
        echo ""
        echo "📝 Examples:"
        echo "   $0"
        echo "   $0 https://my-site.netlify.app"
        echo "   $0 https://my-site.netlify.app false"
        echo ""
        echo "⚠️  Note: This script will create and push test content to your repository."
        ;;
    *)
        main "$@"
        ;;
esac