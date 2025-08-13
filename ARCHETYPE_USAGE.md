# Event Archetype Usage Guide

## Creating New Events

To create a new event using the archetype, run:

```bash
hugo new events/your-event-name.md
```

This will create a new event file with all the required and optional fields pre-populated.

## Required Fields

The following fields must be filled in for every event:

- **title**: The event name/title
- **start_date**: Event date in YYYY-MM-DD format
- **start_time**: Event start time in HH:MM format (24-hour)
- **location**: Where the event takes place
- **description**: Brief description of the event

## Optional Fields

- **end_date**: If the event spans multiple days (defaults to start_date)
- **end_time**: Event end time in HH:MM format (if not specified, only start_time is shown)
- **event_type**: One of: meeting, camping, community_service, fundraising, social, training, competition
- **age_groups**: Array of target age groups: beavers, cubs, scouts, venturers, rovers, all
- **featured_image**: Path to event image
- **registration_required**: Boolean indicating if registration is needed
- **registration_link**: URL to registration form/page

## Validation Rules

The archetype includes validation logic that checks:

1. All required fields are present and not empty
2. Dates are in correct YYYY-MM-DD format
3. Times are in correct HH:MM format (24-hour)
4. End date is on or after start date (if specified)
5. Event type is from the allowed list
6. Age groups are from the allowed list

## Example Event

```yaml
---
title: "Weekend Camping Trip"
start_date: "2025-09-15"
start_time: "18:00"
location: "Camp Wilderness, Blue Mountains"
description: "Two-day camping adventure with hiking and campfire activities"
end_date: "2025-09-16"
end_time: "16:00"
event_type: "camping"
age_groups: ["scouts", "venturers"]
featured_image: "/images/events/camping.jpg"
registration_required: true
registration_link: "https://forms.example.com/camping-registration"
draft: false
---
```

## Publishing Events

- Set `draft: false` when ready to publish
- Events with `draft: true` will not appear on the live site
- The validation partial will show any errors in development mode