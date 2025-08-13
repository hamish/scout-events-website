// Event preview template for Decap CMS
const EventPreview = createClass({
  render() {
    const entry = this.props.entry;
    const widgetFor = this.props.widgetFor;
    const getAsset = this.props.getAsset;
    
    // Get field values
    const title = entry.getIn(['data', 'title']);
    const startDate = entry.getIn(['data', 'start_date']);
    const endDate = entry.getIn(['data', 'end_date']);
    const startTime = entry.getIn(['data', 'start_time']);
    const endTime = entry.getIn(['data', 'end_time']);
    const location = entry.getIn(['data', 'location']);
    const eventType = entry.getIn(['data', 'event_type']);
    const ageGroups = entry.getIn(['data', 'age_groups']);
    const description = entry.getIn(['data', 'description']);
    const featuredImage = entry.getIn(['data', 'featured_image']);
    const registrationRequired = entry.getIn(['data', 'registration_required']);
    const registrationLink = entry.getIn(['data', 'registration_link']);
    
    // Format date function
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };
    
    // Format event type for display
    const formatEventType = (type) => {
      if (!type) return '';
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    
    // Format age groups for display
    const formatAgeGroups = (groups) => {
      if (!groups || !groups.size) return [];
      return groups.toArray().map(group => 
        group.replace(/\b\w/g, l => l.toUpperCase())
      );
    };
    
    return h('div', { className: 'event-preview' },
      // Preview styles
      h('style', {}, `
        .event-preview {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .event-detail-header h1 {
          color: #2c5530;
          margin-bottom: 20px;
          font-size: 2.5rem;
          font-weight: bold;
        }
        .event-datetime-detail {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid #28a745;
        }
        .event-single-date .date {
          font-size: 1.1rem;
        }
        .time-range, .time {
          color: #666;
          margin-left: 10px;
        }
        .event-location-detail {
          background: #fff3cd;
          padding: 10px 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          border-left: 4px solid #ffc107;
        }
        .location-icon {
          margin-right: 8px;
        }
        .event-meta-badges {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .event-type-badge-detail, .age-group-badge-detail {
          background: #007bff;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          margin-left: 8px;
        }
        .age-group-badge-detail {
          background: #28a745;
        }
        .meta-label {
          font-weight: bold;
          color: #495057;
        }
        .registration-info {
          background: #d1ecf1;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #17a2b8;
        }
        .registration-notice {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .registration-icon {
          margin-right: 8px;
        }
        .btn {
          display: inline-block;
          padding: 8px 16px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .registration-btn {
          background: #28a745;
        }
        .event-featured-image {
          margin: 20px 0;
          text-align: center;
        }
        .event-featured-image img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .event-content {
          margin-top: 30px;
        }
        .event-description-detail h2 {
          color: #2c5530;
          border-bottom: 2px solid #28a745;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .preview-note {
          background: #e9ecef;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-style: italic;
          text-align: center;
          color: #6c757d;
        }
      `),
      
      // Preview content
      h('div', { className: 'preview-note' }, 
        'Preview: This is how your event will appear on the website'
      ),
      
      h('article', { className: 'event-detail' },
        h('div', { className: 'event-detail-header' },
          h('h1', {}, title || 'Event Title'),
          
          // Date and time
          startDate && h('div', { className: 'event-datetime-detail' },
            h('div', { className: 'event-single-date' },
              h('span', { className: 'date' },
                h('strong', {}, formatDate(startDate))
              ),
              startTime && h('span', { className: endTime ? 'time-range' : 'time' },
                endTime ? `from ${startTime} to ${endTime}` : `at ${startTime}`
              )
            )
          ),
          
          // Location
          location && h('div', { className: 'event-location-detail' },
            h('span', { className: 'location-icon' }, '📍'),
            h('span', { className: 'location-text' }, location)
          ),
          
          // Event type and age groups
          h('div', { className: 'event-meta-badges' },
            eventType && h('div', { className: 'event-types-detail' },
              h('span', { className: 'meta-label' }, 'Event Type:'),
              h('span', { className: 'event-type-badge-detail' }, formatEventType(eventType))
            ),
            
            ageGroups && ageGroups.size > 0 && h('div', { className: 'age-groups-detail' },
              h('span', { className: 'meta-label' }, 'Age Groups:'),
              ...formatAgeGroups(ageGroups).map(group =>
                h('span', { className: 'age-group-badge-detail', key: group }, group)
              )
            )
          ),
          
          // Registration info
          registrationRequired && h('div', { className: 'registration-info' },
            h('div', { className: 'registration-notice' },
              h('span', { className: 'registration-icon' }, '📝'),
              h('span', { className: 'registration-text' }, 'Registration Required')
            ),
            registrationLink && h('a', { 
              href: registrationLink, 
              className: 'btn registration-btn',
              target: '_blank'
            }, 'Register Now')
          )
        ),
        
        // Featured image
        featuredImage && h('div', { className: 'event-featured-image' },
          h('img', { 
            src: getAsset(featuredImage)?.toString() || featuredImage,
            alt: title || 'Event image',
            loading: 'lazy'
          })
        ),
        
        // Description
        h('div', { className: 'event-content' },
          description && h('div', { className: 'event-description-detail' },
            h('h2', {}, 'About This Event'),
            h('div', {}, widgetFor('description'))
          )
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('events', EventPreview);