const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");

exports.handler = async (event) => {
  const { 
    title,
    start_date,
    start_time,
    end_time,
    location,
    event_type,
    "age_groups[]": age_groups,
    description,
    registration_required,
  } = JSON.parse(event.body).payload.data;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const baseBranch = "main"; // Or your default branch

  const fileName = `${start_date}-${title.toLowerCase().replace(/\s+/g, "-")}.md`;
  const filePath = `content/events/${fileName}`;

  const fileContent = `---
title: "${title}"
start_date: "${start_date}"
start_time: "${start_time}"
end_time: "${end_time}"
location: "${location}"
event_type: "${event_type}"
age_groups: [${age_groups.map(g => `"${g}"`).join(", ")}]
description: |
  ${description.replace(/\n/g, "\n  ")}
registration_required: ${registration_required === "true"}
draft: true
---
`;

  const branchName = `new-event-${Date.now()}`;

  try {
    // Get the SHA of the base branch
    const { data: baseBranchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: baseBranch,
    });
    const baseSha = baseBranchData.commit.sha;

    // Create a new branch
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    // Create the file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `feat: Add new event submission: ${title}`,
      content: Base64.encode(fileContent),
      branch: branchName,
    });

    // Create a pull request
    await octokit.pulls.create({
      owner,
      repo,
      title: `New Event Submission: ${title}`,
      head: branchName,
      base: baseBranch,
      body: `New event submitted via the website. Please review and publish.\n\n**${title}**\n\n${description}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event submitted successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting event" }),
    };
  }
};
