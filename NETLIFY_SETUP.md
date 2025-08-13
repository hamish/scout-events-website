# Netlify Deployment Setup Instructions

This document provides step-by-step instructions for connecting your GitHub repository to Netlify and configuring continuous deployment.

## Prerequisites

- ✅ GitHub repository created and pushed (see GITHUB_SETUP.md)
- ✅ Hugo templates and configuration files ready
- ✅ netlify.toml configuration file present
- Netlify account (free tier is sufficient) - **MANUAL STEP REQUIRED**

## Current Status

The project is ready for Netlify deployment with:
- Proper `netlify.toml` configuration
- Basic Hugo templates for functional site
- Test content to verify deployment
- GitHub repository with latest changes pushed

## Step 1: Connect GitHub Repository to Netlify

1. Go to [Netlify.com](https://netlify.com) and sign in to your account
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub account if prompted
5. Select your `scout-events-website` repository from the list

## Step 2: Configure Build Settings

Netlify should automatically detect the `netlify.toml` configuration file, but verify these settings:

- **Build command**: `hugo --gc --minify`
- **Publish directory**: `public`
- **Production branch**: `main`

If the settings are not automatically detected:
1. Click "Show advanced"
2. Add environment variable: `HUGO_VERSION` = `0.121.0`
3. Ensure build command and publish directory match above

## Step 3: Deploy the Site

1. Click "Deploy site"
2. Netlify will assign a random subdomain (e.g., `amazing-cupcake-123456.netlify.app`)
3. The initial build should complete in 1-2 minutes
4. You'll see the build log in the "Deploys" tab

## Step 4: Configure Custom Domain (Optional)

### Option A: Use Netlify Subdomain
1. Go to "Site settings" → "Domain management"
2. Click "Options" next to your Netlify domain
3. Select "Edit site name"
4. Change to: `scout-events-website` (if available)
5. Your site will be available at: `scout-events-website.netlify.app`

### Option B: Add Custom Domain
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter your domain name (e.g., `scoutevents.org`)
4. Follow DNS configuration instructions provided by Netlify
5. Update `baseURL` in `config.yaml` to match your custom domain

## Step 5: Test Deployment

1. Visit your deployed site URL
2. Verify the homepage loads correctly
3. Check that navigation menu works
4. Confirm the site is responsive on mobile devices

## Step 6: Configure Continuous Deployment

Continuous deployment is automatically enabled. Test it:

1. Make a small change to your local repository (e.g., edit README.md)
2. Commit and push the change:
   ```bash
   git add .
   git commit -m "Test deployment pipeline"
   git push origin main
   ```
3. Go to Netlify "Deploys" tab
4. You should see a new build triggered automatically
5. Verify the change appears on your live site after build completes

## Troubleshooting

### Build Failures
- Check the build log in Netlify's "Deploys" tab
- Ensure Hugo version matches what's specified in netlify.toml
- Verify all content files have valid frontmatter

### DNS Issues (Custom Domain)
- DNS changes can take 24-48 hours to propagate
- Use DNS checker tools to verify configuration
- Ensure CNAME or A records point to Netlify

### Form Handling
- Forms will be automatically detected by Netlify
- Check "Forms" tab in Netlify dashboard to see submissions
- Configure email notifications in "Forms" settings

## Next Steps

After successful deployment:
1. Update the `baseURL` in `config.yaml` if using a custom domain
2. Configure form notifications for the contact form
3. Set up branch deploy previews for testing changes
4. Consider enabling Netlify Analytics for visitor insights

## Site URLs

- **Production**: Your configured domain or Netlify subdomain
- **Admin Interface**: `your-domain.com/admin/` (will be set up in later tasks)
- **Build Status**: Available in Netlify dashboard

The deployment pipeline is now complete and ready for content management!