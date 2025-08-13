# GitHub OAuth Setup for Decap CMS

## The "Not Found" Error Fix

If you're getting a "Not Found" error when trying to login to `/admin/`, it's because GitHub OAuth isn't configured yet. Here's how to fix it:

## Step 1: Create GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - **Application name**: `Scout Events CMS`
   - **Homepage URL**: `https://your-site.netlify.app` (replace with your actual Netlify URL)
   - **Application description**: `Content management for Scout Events Website`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`

4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

## Step 2: Configure Netlify OAuth

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Access control** → **OAuth**
3. Click **"Install provider"** and select **GitHub**
4. Enter your GitHub OAuth app credentials:
   - **Client ID**: (from step 1)
   - **Client Secret**: (from step 1)
5. Click **"Install"**

## Step 3: Update Site URL (if needed)

Make sure your `site_url` in `/static/admin/config.yml` matches your actual Netlify URL:

```yaml
site_url: https://your-actual-site.netlify.app
```

## Alternative: Local Development

For local testing without OAuth setup, you can:

1. Uncomment this line in `/static/admin/config.yml`:
   ```yaml
   local_backend: true
   ```

2. Install and run the Decap CMS proxy:
   ```bash
   npx decap-server
   ```

3. Access the CMS at `http://localhost:1313/admin/`

## Troubleshooting

### Still getting "Not Found"?
- Check that your GitHub repo URL is correct in `config.yml`
- Verify the OAuth callback URL is exactly: `https://api.netlify.com/auth/done`
- Make sure you have write access to the GitHub repository
- Try clearing your browser cache

### "Error loading the CMS configuration"?
- Check the browser console for specific error messages
- Verify the `config.yml` syntax is valid YAML
- Make sure all required fields are filled in

### "Failed to load entries"?
- Check that the GitHub repo exists and is accessible
- Verify you have the correct permissions on the repository
- Check that the branch name is correct (usually `main` or `master`)

## Testing the Setup

Once configured:
1. Go to `https://your-site.netlify.app/admin/`
2. Click "Login with GitHub"
3. Authorize the application
4. You should see the CMS interface with your content collections

## Security Notes

- Only users with repository access can use the CMS
- All changes are tracked in Git history
- The OAuth app only has access to the specific repository
- You can revoke access anytime from GitHub settings