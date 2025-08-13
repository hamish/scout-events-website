# Netlify & GitHub Environment Variable Setup Guide

This guide explains how to configure the necessary environment variables in your Netlify site to allow the event submission form to create pull requests in your GitHub repository.

## Summary of Environment Variables

You will need to create three environment variables in your Netlify site's settings:

1.  `GITHUB_TOKEN`: A GitHub Personal Access Token that grants permission to create branches and pull requests.
2.  `GITHUB_REPO_OWNER`: The username or organization name that owns the GitHub repository.
3.  `GITHUB_REPO_NAME`: The name of your site's GitHub repository.

---

## Step 1: Create a GitHub Personal Access Token (PAT)

The submission function needs a GitHub token to act on your behalf.

1.  **Navigate to GitHub's Token Settings:**
    *   Go to your GitHub account settings.
    *   Click on **Developer settings** in the left sidebar.
    *   Click on **Personal access tokens**, then select **Tokens (classic)**.

2.  **Generate a New Token:**
    *   Click the **"Generate new token"** button (you may be asked to re-authenticate).
    *   Give the token a descriptive **Note**, for example, `Netlify Event Submission`.
    *   Set the **Expiration** for the token. For security, it's recommended to set an expiration date.
    *   In the **"Select scopes"** section, check the box next to **`repo`**. This will grant the necessary permissions for the function to create branches, commit files, and open pull requests in your repository.
    *   Scroll down and click the **"Generate token"** button.

3.  **Copy the Token:**
    *   **Important:** Copy the generated token immediately. You will not be able to see it again after you leave the page. Store it securely until you complete the next step.

---

## Step 2: Add Environment Variables to Netlify

Now, you'll add the token and repository details to your Netlify site.

1.  **Go to Your Site's Settings in Netlify:**
    *   Log in to your Netlify account.
    *   From the **Sites** tab, select the project you are configuring.

2.  **Navigate to Environment Variables:**
    *   Go to **Site configuration** > **Environment variables**.

3.  **Add the Variables:**
    *   Click **"Add a variable"** and add the following three variables one by one:

    *   **Variable 1: GitHub Token**
        *   **Key:** `GITHUB_TOKEN`
        *   **Value:** Paste the GitHub Personal Access Token you copied in Step 1.

    *   **Variable 2: Repository Owner**
        *   **Key:** `GITHUB_REPO_OWNER`
        *   **Value:** Enter the username of the GitHub account or organization that owns the repository. For example, if your repository is at `https://github.com/your-username/your-repo`, the value would be `your-username`.

    *   **Variable 3: Repository Name**
        *   **Key:** `GITHUB_REPO_NAME`
        *   **Value:** Enter the name of your repository. For the example above, the value would be `your-repo`.

4.  **Deploy Changes:**
    *   After adding the variables, you may need to trigger a new deploy for the changes to take effect. Go to the **Deploys** tab for your site and trigger a new deploy of your `main` branch.

Your event submission form should now be fully configured. When a user submits an event, the Netlify function will use these variables to authenticate with GitHub and create a pull request.
