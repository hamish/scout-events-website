# Environment Setup for Event Submission Feature

This document outlines the environment variables that need to be configured in your Netlify dashboard for the public event submission feature to work.

## Required Environment Variables

Configure these in your Netlify dashboard under **Site Settings > Environment Variables**:

### GitHub Integration
- **GITHUB_TOKEN**: Personal access token with repository permissions
  - Go to GitHub Settings > Developer Settings > Personal Access Tokens
  - Create a token with `repo` permissions (read and write access to repository contents)
  - Example: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

- **GITHUB_OWNER**: Your GitHub username or organization name
  - Example: `yourusername` or `yourorganization`

- **GITHUB_REPO**: The name of your repository
  - Example: `scout-events-website`

### Site Configuration (Optional)
- **ADMIN_EMAIL**: Email address for administrative notifications
  - Example: `admin@scoutgroup.org`

- **SITE_URL**: Your site's URL (usually auto-detected by Netlify)
  - Example: `https://yoursite.netlify.app`

## How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site Settings > Environment Variables**
4. Click **Add Variable** for each required variable
5. Enter the **Key** (variable name) and **Value**
6. Click **Save**

## GitHub Token Permissions

Your GitHub token needs the following permissions:
- **Contents**: Write (to create and modify files)
- **Metadata**: Read (to access repository information)
- **Pull Requests**: Write (if using branch-based workflow in the future)

## Security Notes

- Never commit these environment variables to your repository
- Use the minimum required permissions for your GitHub token
- Regularly rotate your tokens for security
- Monitor your repository for any unauthorized submissions

## Testing the Setup

After configuring the environment variables:

1. Deploy your site to Netlify
2. Visit `/pages/submit/` on your live site
3. Try submitting a test event
4. Check your repository for the new event file in `content/events/`
5. Verify the event appears with `draft: true` status

## Troubleshooting

If submissions aren't working:

1. Check the browser console for JavaScript errors
2. Verify all environment variables are set correctly
3. Ensure your GitHub token has the correct permissions
4. Check the Netlify function logs for errors
5. Verify the repository name and owner are spelled correctly

## Rate Limiting

The submission system includes rate limiting:
- Maximum 5 submissions per IP address per day
- This helps prevent spam and abuse
- Legitimate users can contact you directly if they need to exceed this limit

## File Structure

Submitted events are created as:
- **Location**: `content/events/YYYY-MM-DD-event-slug.md`
- **Status**: `draft: true` (requires admin review)
- **Format**: Hugo markdown with proper frontmatter

## Next Steps

Once the environment is configured:
1. Test the submission workflow
2. Train administrators on reviewing submitted events
3. Consider adding email notifications for new submissions
4. Monitor usage and adjust rate limits if needed