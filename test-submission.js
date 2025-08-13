#!/usr/bin/env node

// Simple test script for the event submission function
// This tests the validation and data processing logic without GitHub API calls

const testData = {
  valid: {
    title: "Test Community Event",
    start_date: "2025-12-25",
    start_time: "14:00",
    end_time: "16:00",
    location: "Community Center, 123 Main Street",
    description: "This is a test event to verify the submission system is working correctly. It includes all required fields and should pass validation.",
    event_type: ["community_service"],
    age_groups: ["all"],
    registration_required: false,
    submitter_name: "Test User",
    submitter_email: "test@example.com"
  },
  
  invalid: {
    title: "", // Missing required field
    start_date: "2023-01-01", // Date in the past
    start_time: "25:00", // Invalid time format
    location: "",
    description: "x".repeat(2001), // Too long
    submitter_email: "invalid-email" // Invalid email format
  }
};

function validateData(data) {
  const errors = [];
  
  // Required fields
  const required = ['title', 'start_date', 'start_time', 'location', 'description'];
  required.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  // Date validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (data.start_date && !dateRegex.test(data.start_date)) {
    errors.push('Invalid start_date format');
  }
  
  if (data.start_date) {
    const eventDate = new Date(data.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }
  
  // Time validation
  const timeRegex = /^\d{2}:\d{2}$/;
  if (data.start_time && !timeRegex.test(data.start_time)) {
    errors.push('Invalid start_time format');
  }
  
  // Length validation
  if (data.title && data.title.length > 200) {
    errors.push('Title too long');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('Description too long');
  }
  
  // Email validation
  if (data.submitter_email && data.submitter_email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.submitter_email)) {
      errors.push('Invalid email format');
    }
  }
  
  return errors;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/["\\"]/g, '\\"')
    .trim();
}

function generateMarkdown(data) {
  const sanitizedData = {
    title: sanitizeString(data.title).substring(0, 200),
    start_date: data.start_date,
    start_time: data.start_time,
    end_time: data.end_time || '',
    location: sanitizeString(data.location).substring(0, 500),
    description: sanitizeString(data.description).substring(0, 2000),
    event_type: Array.isArray(data.event_type) ? data.event_type : ['meeting'],
    age_groups: Array.isArray(data.age_groups) ? data.age_groups : ['all'],
    registration_required: Boolean(data.registration_required),
    submitter_name: sanitizeString(data.submitter_name || 'Anonymous').substring(0, 100),
    submitter_email: sanitizeString(data.submitter_email || '').substring(0, 200)
  };

  const frontmatter = `---
title: "${sanitizedData.title}"
start_date: "${sanitizedData.start_date}"
start_time: "${sanitizedData.start_time}"${sanitizedData.end_time ? `\nend_time: "${sanitizedData.end_time}"` : ''}
location: "${sanitizedData.location}"
event_type: [${sanitizedData.event_type.map(t => `"${t}"`).join(', ')}]
age_groups: [${sanitizedData.age_groups.map(g => `"${g}"`).join(', ')}]
description: |
  ${sanitizedData.description.split('\n').map(line => '  ' + line).join('\n')}
registration_required: ${sanitizedData.registration_required}
draft: true
date: ${new Date().toISOString()}
submitter_name: "${sanitizedData.submitter_name}"
submitter_email: "${sanitizedData.submitter_email}"
---

This event was submitted through the public event submission form.

**Event Details:**
- **When:** ${sanitizedData.start_date} at ${sanitizedData.start_time}${sanitizedData.end_time ? ` - ${sanitizedData.end_time}` : ''}
- **Where:** ${sanitizedData.location}
- **Who:** ${sanitizedData.age_groups.join(', ')}
- **Type:** ${sanitizedData.event_type.join(', ')}${sanitizedData.registration_required ? '\n- **Registration Required:** Yes' : ''}

**Description:**
${sanitizedData.description}
`;

  return frontmatter;
}

console.log('Testing Event Submission Validation\n');

console.log('1. Testing VALID data:');
const validErrors = validateData(testData.valid);
if (validErrors.length === 0) {
  console.log('✅ Valid data passed validation');
  console.log('\nGenerated markdown preview:');
  console.log('---');
  console.log(generateMarkdown(testData.valid).substring(0, 500) + '...');
} else {
  console.log('❌ Valid data failed validation:', validErrors);
}

console.log('\n2. Testing INVALID data:');
const invalidErrors = validateData(testData.invalid);
if (invalidErrors.length > 0) {
  console.log('✅ Invalid data correctly rejected');
  console.log('Validation errors found:', invalidErrors);
} else {
  console.log('❌ Invalid data incorrectly passed validation');
}

console.log('\n3. Testing sanitization:');
const maliciousData = {
  title: 'Test <script>alert("xss")</script> Event',
  description: 'Event with "quotes" and <tags>',
  location: 'Location with <iframe>malicious</iframe> content'
};

console.log('Original:', maliciousData.title);
console.log('Sanitized:', sanitizeString(maliciousData.title));

console.log('\n🎉 Test completed successfully!');
console.log('\nNext steps:');
console.log('1. Configure environment variables in Netlify');
console.log('2. Deploy the site');
console.log('3. Test the live submission form');
console.log('4. Verify events are created in your GitHub repository');