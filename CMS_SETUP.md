# Decap CMS Setup Guide

This guide explains how to configure and use the Decap CMS (formerly Netlify CMS) for managing content on the Scout Events Website.

## Overview

The CMS is configured to work with:
- **Backend**: GitHub (stores content as markdown files)
- **Authentication**: GitHub OAuth via Netlify
- **Media Storage**: GitHub repository under `/static/images/uploads/`
- **Preview**: Real-time preview of content as it will appear on the site

## Configuration Files

### `/static/admin/config.yml`
Main configuration file that defines:
- GitHub backend settings
- Content collections (events, pages, site config)
- Field types and validation rules
- Authentication settings

### `/static/admin/index.html`
CMS interface entry point that loads:
- Decap CMS core library
- Custom preview templates

### Preview Templates
- `/static/admin/preview-templates/event.js` - Event preview
- `/static/admin/preview-templates/page.js` - Page preview

## Setup Steps

### 1. Update Configuration
Edit `/static/admin/config.yml` and update:
```yaml
backend:
  repo: your-username/scout-events-website # Your actual GitHub repo
site_url: https://your-site.netlify.app # Your actual site URL
```

### 2. Enable GitHub OAuth in Netlify
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Access control > OAuth
3. Click "Install provider" and select GitHub
4. Enter your GitHub App credentials

### 3. Create GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Scout Events CMS"
   - Homepage URL: `https://your-site.netlify.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
4. Copy Client ID and Client Secret to Netlify OAuth settings

## Using the CMS

### Accessing the CMS
- Visit `https://your-site.netlify.app/admin/`
- Log in with your GitHub account
- You'll see the content management interface

### Creating Events
1. Click "Events" in the sidebar
2. Click "New Events"
3. Fill in the required fields:
   - **Title**: Event name
   - **Start Date**: When the event begins
   - **Start Time**: Time in 24-hour format (e.g., 19:00)
   - **Location**: Full address or venue name
   - **Event Type**: Category (meeting, camping, etc.)
   - **Age Groups**: Target scout sections
   - **Description**: Detailed event information (supports Markdown)

4. Optional fields:
   - **End Date**: If different from start date
   - **End Time**: If event has specific end time
   - **Featured Image**: Upload an image
   - **Registration Required**: Toggle if registration needed
   - **Registration Link**: URL for registration

5. Use the **Preview** tab to see how the event will look
6. Click **Publish** to make it live

### Managing Pages
1. Click "Pages" in the sidebar
2. Create or edit static pages (About, Contact, etc.)
3. Use Markdown for rich text formatting
4. Set menu order for navigation

### Site Configuration
1. Click "Site Configuration" in the sidebar
2. Edit site-wide settings:
   - Contact information
   - Social media links
   - Group details

## Content Workflow

### Editorial Workflow
The CMS is configured with editorial workflow:
1. **Draft**: Content is saved but not published
2. **In Review**: Content is ready for review
3. **Ready**: Content is approved and will be published

### Automatic Deployment
- When content is published, it's committed to GitHub
- Netlify automatically rebuilds and deploys the site
- Changes appear live within 2-5 minutes

## Preview Functionality

### Real-time Preview
- Click the "Preview" tab when editing content
- See exactly how content will appear on the live site
- Preview updates as you type

### Preview Features
- **Events**: Shows formatted date/time, location, badges, registration info
- **Pages**: Shows formatted content with proper styling
- **Images**: Displays uploaded images as they'll appear
- **Markdown**: Renders formatted text, lists, links, etc.

## Troubleshooting

### Can't Access CMS
- Check that GitHub OAuth is properly configured in Netlify
- Verify the GitHub OAuth app callback URL
- Ensure you have write access to the GitHub repository

### Preview Not Working
- Check browser console for JavaScript errors
- Verify preview template files are properly loaded
- Clear browser cache and try again

### Content Not Publishing
- Check the editorial workflow status
- Verify GitHub permissions
- Check Netlify build logs for errors

### Images Not Uploading
- Check GitHub repository permissions
- Verify media folder configuration
- Ensure file size is under GitHub limits (100MB)

## File Structure

```
static/admin/
├── index.html              # CMS entry point
├── config.yml             # Main configuration
└── preview-templates/
    ├── event.js           # Event preview template
    └── page.js            # Page preview template

content/
├── events/                # Event markdown files
└── pages/                 # Page markdown files

data/
└── site.yml              # Site configuration data

static/images/uploads/     # Uploaded media files
```

## Security Notes

- The CMS requires GitHub authentication
- Only users with repository access can edit content
- All changes are tracked in Git history
- Content is stored as plain text (markdown) in the repository

## Support

For technical issues:
1. Check the browser console for errors
2. Review Netlify build logs
3. Verify GitHub repository permissions
4. Test with a simple content change first