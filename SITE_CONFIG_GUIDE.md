# Site Configuration Management Guide

This guide explains how to manage your scout group's site-wide settings using the CMS interface.

## Accessing Site Configuration

1. Log into the CMS at `/admin/`
2. Navigate to "Site Configuration" in the left sidebar
3. Click on "Site Settings" to edit your site-wide information

## Available Settings

### Basic Site Information
- **Site Title**: The main title that appears in browser tabs and the header
- **Site Description**: Used for SEO and social media sharing
- **Contact Email**: Main contact email for your group

### Contact Information
- **Phone Number**: Optional contact phone number
- **Address**: Physical address of your meeting location

### Group Information
- **Group Name**: Official name of your scout group
- **Meeting Times**: When your group meets (e.g., "Fridays 7:00 PM - 9:00 PM")
- **Age Ranges**: Age ranges your group serves (e.g., "Ages 5-25")
- **Meeting Location**: Name of your meeting venue (e.g., "Scout Hall")

### Social Media
- **Facebook URL**: Link to your Facebook page
- **Instagram URL**: Link to your Instagram profile  
- **Twitter URL**: Link to your Twitter profile

## How Settings Are Used

### Site Title & Description
- Appears in browser tabs and page titles
- Used for SEO meta tags
- Shared when links are posted on social media

### Contact Information
- Displayed in the website footer
- Used on contact pages
- Available for use in page templates

### Group Information
- Shown in the footer for quick reference
- Can be displayed on about pages
- Used throughout the site for consistency

### Social Media Links
- Automatically appear in the footer when configured
- Can be used in other templates as needed

## Template Integration

The site configuration data is automatically integrated into:

- **Header**: Site title
- **Footer**: All group and contact information
- **Meta Tags**: SEO and social media sharing
- **Page Templates**: Available for use via `{{ .Site.Data.site }}`

## Using Site Data in Custom Templates

If you're creating custom templates, you can access site configuration data using:

```hugo
{{ .Site.Data.site.title }}
{{ .Site.Data.site.description }}
{{ .Site.Data.site.contact_email }}
{{ .Site.Data.site.group_info.group_name }}
{{ .Site.Data.site.social_media.facebook }}
```

## Site Info Partial

A reusable partial template is available for displaying site information:

```hugo
<!-- Display contact information -->
{{ partial "site-info.html" (dict "context" . "type" "contact") }}

<!-- Display group information -->
{{ partial "site-info.html" (dict "context" . "type" "group") }}

<!-- Display social media links -->
{{ partial "site-info.html" (dict "context" . "type" "social") }}

<!-- Display all information -->
{{ partial "site-info.html" (dict "context" . "type" "all") }}
```

## Fallback System

The templates include a fallback system that uses configuration from `config.yaml` if the CMS data is not available. This ensures your site continues to work even if the data file is missing or incomplete.

## Best Practices

1. **Keep information current**: Regularly update meeting times, contact information, and social media links
2. **Use descriptive text**: Write clear descriptions that help visitors understand your group
3. **Verify links**: Test social media and other external links to ensure they work
4. **Consistent branding**: Use the same group name and description across all settings
5. **SEO optimization**: Write descriptions that include relevant keywords for your local area and scouting activities

## Troubleshooting

If changes don't appear on your site:
1. Check that you've saved the changes in the CMS
2. Wait a few minutes for the site to rebuild and deploy
3. Clear your browser cache
4. Check the Netlify deploy logs for any errors

If you need to make emergency changes:
1. Edit the `data/site.yml` file directly in your GitHub repository
2. The changes will be deployed automatically
3. Update the CMS interface when convenient