const { Octokit } = require('@octokit/rest');

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.timestamp < oneDayAgo) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up hourly

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Allow': 'POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: ''
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    
    // Rate limiting check
    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    const rateLimitKey = `submissions_${clientIP}`;
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const rateLimitData = rateLimitStore.get(rateLimitKey);
    if (rateLimitData) {
      // Remove old submissions from count
      rateLimitData.submissions = rateLimitData.submissions.filter(timestamp => timestamp > oneDayAgo);
      
      if (rateLimitData.submissions.length >= 5) {
        return {
          statusCode: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: 'Rate limit exceeded. Maximum 5 submissions per day per IP address.' 
          })
        };
      }
      
      rateLimitData.submissions.push(now);
    } else {
      rateLimitStore.set(rateLimitKey, {
        timestamp: now,
        submissions: [now]
      });
    }

    // Validate required fields
    const requiredFields = ['title', 'start_date', 'start_time', 'location', 'description'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields', 
          missingFields 
        })
      };
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.start_date)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Invalid start_date format. Use YYYY-MM-DD.' 
        })
      };
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(data.start_time)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Invalid start_time format. Use HH:MM (24-hour format).' 
        })
      };
    }

    // Validate end_time if provided
    if (data.end_time && !timeRegex.test(data.end_time)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Invalid end_time format. Use HH:MM (24-hour format).' 
        })
      };
    }

    // Validate date is not in the past
    const eventDate = new Date(data.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Event date cannot be in the past.' 
        })
      };
    }

    // Sanitize and validate content
    const sanitizedData = {
      title: sanitizeString(data.title).substring(0, 200),
      start_date: data.start_date,
      start_time: data.start_time,
      end_time: data.end_time || '',
      location: sanitizeString(data.location).substring(0, 500),
      description: sanitizeString(data.description).substring(0, 2000),
      event_type: Array.isArray(data.event_type) ? data.event_type.filter(type => 
        ['meeting', 'camping', 'community_service', 'fundraising', 'social', 'training', 'competition'].includes(type)
      ) : ['meeting'],
      age_groups: Array.isArray(data.age_groups) ? data.age_groups.filter(group => 
        ['beavers', 'cubs', 'scouts', 'venturers', 'rovers', 'all'].includes(group)
      ) : ['all'],
      registration_required: Boolean(data.registration_required),
      registration_link: data.registration_link ? sanitizeString(data.registration_link).substring(0, 500) : '',
      submitter_name: sanitizeString(data.submitter_name || 'Anonymous').substring(0, 100),
      submitter_email: sanitizeString(data.submitter_email || '').substring(0, 200)
    };

    // Create GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Generate filename
    const slug = sanitizedData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const filename = `${sanitizedData.start_date}-${slug}.md`;
    const filepath = `content/events/${filename}`;

    // Check if file already exists
    try {
      await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: filepath
      });
      
      // File exists, add timestamp to make it unique
      const timestamp = Date.now();
      const uniqueFilename = `${sanitizedData.start_date}-${slug}-${timestamp}.md`;
      const uniqueFilepath = `content/events/${uniqueFilename}`;
      
      return await createEventFile(octokit, uniqueFilepath, sanitizedData, clientIP);
    } catch (error) {
      if (error.status === 404) {
        // File doesn't exist, proceed with original filename
        return await createEventFile(octokit, filepath, sanitizedData, clientIP);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('Error processing submission:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error. Please try again later or contact us directly.' 
      })
    };
  }
};

async function createEventFile(octokit, filepath, data, clientIP) {
  // Generate markdown content
  const frontmatter = `---
title: "${data.title}"
start_date: "${data.start_date}"
start_time: "${data.start_time}"${data.end_time ? `\nend_time: "${data.end_time}"` : ''}
location: "${data.location}"
event_type: [${data.event_type.map(t => `"${t}"`).join(', ')}]
age_groups: [${data.age_groups.map(g => `"${g}"`).join(', ')}]
description: |
  ${data.description.split('\n').map(line => '  ' + line).join('\n')}
registration_required: ${data.registration_required}${data.registration_link ? `\nregistration_link: "${data.registration_link}"` : ''}
draft: true
date: ${new Date().toISOString()}
# Submitted via public form
submitter_name: "${data.submitter_name}"
submitter_email: "${data.submitter_email}"
submission_ip: "${clientIP}"
submission_date: "${new Date().toISOString()}"
---

This event was submitted through the public event submission form and is pending review by the group administrators.

**Event Details:**
- **When:** ${data.start_date} at ${data.start_time}${data.end_time ? ` - ${data.end_time}` : ''}
- **Where:** ${data.location}
- **Who:** ${data.age_groups.join(', ')}
- **Type:** ${data.event_type.join(', ')}${data.registration_required ? '\n- **Registration Required:** Yes' : ''}${data.registration_link ? `\n- **Registration Link:** ${data.registration_link}` : ''}

**Description:**
${data.description}

---
*This event will be published after review by group administrators.*
`;

  // Create the file in GitHub
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: filepath,
    message: `Add submitted event: ${data.title}

Event submitted via public form:
- Title: ${data.title}
- Date: ${data.start_date} ${data.start_time}
- Location: ${data.location}
- Submitter: ${data.submitter_name} (${data.submitter_email})
- Status: Draft (pending review)

This event was automatically created from a public submission and requires admin review before publication.`,
    content: Buffer.from(frontmatter).toString('base64'),
    branch: 'main'
  });

  // Generate submission ID for tracking
  const submissionId = Buffer.from(`${filepath}-${Date.now()}`).toString('base64').substring(0, 12);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      message: 'Event submitted successfully! It will be reviewed and published by our administrators.',
      submissionId: submissionId,
      filename: filepath
    })
  };
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/["\\"]/g, '\\"') // Escape quotes for YAML safety
    .trim();
}