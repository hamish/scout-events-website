# Project Overview

This is a static website for a scout group, built with the [Hugo](https://gohugo.io/) static site generator. It's designed to manage and display events and other group activities. The site is set up for continuous deployment through [Netlify](https://www.netlify.com/) and uses [Decap CMS](https://decapcms.org/) (formerly Netlify CMS) for content management.

The website features event listings, pages for general information (like "About" and "Group Info"), and a contact form. It also includes a feature for public event submissions, which creates a pull request in the GitHub repository for an editor to review.

## Building and Running

### Prerequisites

*   [Hugo (extended version)](https://gohugo.io/getting-started/installing/)
*   [Node.js](https://nodejs.org/en/) (for Netlify functions)
*   [Git](https://git-scm.com/)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd scout-events-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    hugo server -D
    ```
    This will start a local server, typically at `http://localhost:1313`. The `-D` flag builds draft content.

### Building for Production

To build the static site for production, run the following command:

```bash
./scripts/build.sh
```

This script will clean the `public` and `resources` directories, build the site using Hugo, and place the output in the `public` directory.

## Development Conventions

*   **Content:** All website content is stored in the `content` directory as Markdown files.
*   **Layouts:** The HTML templates that render the content are located in the `layouts` directory. The site uses a `baseof.html` template for the main structure and specific templates for different content types (e.g., `layouts/events/single.html` for a single event).
*   **Styling:** CSS is located in the `static/css` directory.
*   **Event Submissions:** A Netlify Function, `netlify/functions/submit-event.js`, handles public event submissions. This function is triggered by a form on the `/submit-event/` page and creates a pull request in the GitHub repository.
*   **Deployment:** The site is deployed via Netlify. The `netlify.toml` file configures the build settings, redirects, and headers. The production build is triggered by a push to the `main` branch.
*   **CMS:** The Decap CMS is configured in `static/admin/config.yml`. It allows editors to manage content without directly editing the Markdown files.
