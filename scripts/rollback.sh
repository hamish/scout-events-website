#!/bin/bash

# Scout Events Website Rollback Script
# This script helps with rolling back to a previous deployment

set -e

echo "🔄 Scout Events Website Rollback Utility"
echo "========================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to show recent commits
show_recent_commits() {
    echo "📋 Recent commits (last 10):"
    git log --oneline -10 --decorate
    echo ""
}

# Function to rollback to a specific commit
rollback_to_commit() {
    local commit_hash=$1
    
    if [ -z "$commit_hash" ]; then
        echo "❌ Error: No commit hash provided"
        return 1
    fi
    
    # Validate commit exists
    if ! git cat-file -e "$commit_hash^{commit}" 2>/dev/null; then
        echo "❌ Error: Invalid commit hash: $commit_hash"
        return 1
    fi
    
    echo "🔄 Rolling back to commit: $commit_hash"
    
    # Show what we're rolling back to
    echo "📝 Commit details:"
    git show --stat "$commit_hash"
    echo ""
    
    # Confirm rollback
    read -p "⚠️  Are you sure you want to rollback to this commit? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Create a new commit that reverts to the specified commit
        echo "🔄 Creating rollback commit..."
        
        # Reset to the target commit but keep it as a new commit
        git revert --no-edit HEAD.."$commit_hash" || {
            echo "❌ Rollback failed. You may need to resolve conflicts manually."
            echo "💡 Run 'git status' to see what needs to be resolved."
            exit 1
        }
        
        echo "✅ Rollback completed successfully!"
        echo "🚀 Push changes to trigger redeployment:"
        echo "   git push origin main"
        
    else
        echo "❌ Rollback cancelled"
        return 1
    fi
}

# Function to rollback to previous commit
rollback_previous() {
    local previous_commit=$(git rev-parse HEAD~1)
    echo "🔄 Rolling back to previous commit: $previous_commit"
    rollback_to_commit "$previous_commit"
}

# Main script logic
case "${1:-}" in
    "list"|"l")
        show_recent_commits
        ;;
    "previous"|"prev"|"p")
        show_recent_commits
        rollback_previous
        ;;
    "to")
        if [ -z "$2" ]; then
            echo "❌ Error: Please provide a commit hash"
            echo "💡 Usage: $0 to <commit-hash>"
            echo "💡 Use '$0 list' to see recent commits"
            exit 1
        fi
        show_recent_commits
        rollback_to_commit "$2"
        ;;
    "help"|"h"|"")
        echo "🔧 Usage:"
        echo "   $0 list          - Show recent commits"
        echo "   $0 previous      - Rollback to previous commit"
        echo "   $0 to <hash>     - Rollback to specific commit"
        echo "   $0 help          - Show this help"
        echo ""
        echo "📝 Examples:"
        echo "   $0 list"
        echo "   $0 previous"
        echo "   $0 to abc1234"
        echo ""
        echo "⚠️  Note: This creates a new commit that reverts changes."
        echo "   The original commits remain in git history."
        ;;
    *)
        echo "❌ Error: Unknown command '$1'"
        echo "💡 Use '$0 help' for usage information"
        exit 1
        ;;
esac