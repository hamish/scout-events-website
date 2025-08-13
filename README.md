# Scout Events Website

A static website built with Hugo for managing and displaying scout group events and activities.

## Features

- Event management through Decap CMS
- Responsive design for all devices
- Contact form integration
- Automatic deployment via Netlify
- SEO optimized

## Technology Stack

- **Static Site Generator**: Hugo
- **CMS**: Decap CMS (formerly Netlify CMS)
- **Hosting**: Netlify
- **Version Control**: GitHub

## Development

### Prerequisites

- Hugo (extended version)
- Git

### Local Development

1. Clone the repository
2. Run `hugo server -D` to start the development server
3. Visit `http://localhost:1313` to view the site

### Building

Run `hugo` to build the static site. Output will be in the `public/` directory.

## Deployment

### Initial Setup

1. **GitHub Repository**: Follow instructions in `GITHUB_SETUP.md` to create and connect the GitHub repository
2. **Netlify Deployment**: Follow instructions in `NETLIFY_SETUP.md` to set up continuous deployment
3. **Verification**: Run `./scripts/verify-deployment.sh` to check your setup

### Continuous Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch. Build settings are configured in `netlify.toml`.

- **Build Command**: `hugo --gc --minify`
- **Publish Directory**: `public`
- **Hugo Version**: 0.121.0

## Content Management

Content is managed through Decap CMS, accessible at `/admin/` once deployed.