---
# Required fields
title: "{{ replace .Name "-" " " | title }}"
start_date: "{{ dateFormat "2006-01-02" .Date }}"  # Required: YYYY-MM-DD format
start_time: "19:00"  # Required: HH:MM format (24-hour)
location: ""  # Required: Event location/venue
description: ""  # Required: Brief event description

# Optional fields
end_date: ""  # Optional: YYYY-MM-DD format, defaults to start_date if empty
end_time: ""  # Optional: HH:MM format, if empty only start_time is displayed
event_types: ["meeting"]  # Optional: meeting, camping, community_service, fundraising, social, training, competition
age_groups: ["all"]  # Optional: beavers, cubs, scouts, venturers, rovers, all
featured_image: ""  # Optional: path to event image
registration_required: false  # Optional: whether registration is needed
registration_link: ""  # Optional: link to registration form/page

# System fields
date: {{ .Date }}  # Hugo creation date
draft: true  # Set to false when ready to publish
---

<!-- 
VALIDATION RULES:
- title: Must not be empty
- start_date: Must be valid date in YYYY-MM-DD format
- start_time: Must be valid time in HH:MM format (24-hour)
- location: Must not be empty
- description: Must not be empty
- end_date: If specified, must be >= start_date
- end_time: If specified, must be valid time in HH:MM format
- event_types: Must be array containing one or more of: meeting, camping, community_service, fundraising, social, training, competition
- age_groups: Must be array containing one or more of: beavers, cubs, scouts, venturers, rovers, all
-->

Write your detailed event description here. This content will appear on the event detail page and can include:

- Additional event details
- What to bring
- Meeting points
- Special instructions
- Contact information for questions

Use markdown formatting for:
- **Bold text** for important information
- *Italic text* for emphasis
- Lists for items to bring or agenda points
- Links to related resources