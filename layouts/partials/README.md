# Partials Documentation

This directory contains reusable Hugo partial templates for the Scout Events website. Each partial is designed to be modular, maintainable, and reusable across different layouts.

## 🧩 Component Architecture

### Core Components

#### `seo.html`
**Purpose**: Comprehensive SEO meta tags, Open Graph, and Twitter Card implementation  
**Usage**: `{{ partial "seo.html" . }}`  
**Context**: Page/site context required  
**Features**:
- Dynamic meta descriptions
- Social media optimization
- Structured data integration
- Canonical URL handling

#### `header.html`
**Purpose**: Site navigation and branding  
**Usage**: `{{ partial "header.html" . }}`  
**Features**:
- Responsive mobile menu
- ARIA accessibility attributes
- Dynamic menu highlighting

#### `footer.html`
**Purpose**: Site footer with contact info and navigation  
**Usage**: `{{ partial "footer.html" . }}`  
**Features**:
- Contact information from site data
- Social media links
- Footer navigation

### Event-Specific Components

#### `event-datetime.html`
**Purpose**: Consistent event date/time display  
**Usage**: `{{ partial "event-datetime.html" . }}`  
**Context**: Event page context required  
**Output**: Formatted date and time with semantic markup

#### `validate-event.html`
**Purpose**: Server-side event data validation  
**Usage**: `{{ partial "validate-event.html" . }}`  
**Features**:
- Event type validation
- Age group validation
- Required field checking

### Form Components

#### `submit-form.html`
**Purpose**: Public event submission form  
**Usage**: `{{ partial "submit-form.html" . }}`  
**Features**:
- Dynamic options from site data
- Client-side validation
- Accessibility compliance
- Rate limiting integration

### Utility Components

#### `event-type-label.html`
**Purpose**: Convert event type values to display labels  
**Usage**: `{{ partial "event-type-label.html" (dict "eventType" .Params.event_type) }}`  
**Parameters**:
- `eventType` (string): Event type value (e.g., "meeting")
**Output**: Human-readable label (e.g., "Meeting")

#### `age-group-label.html`
**Purpose**: Convert age group values to display labels  
**Usage**: `{{ partial "age-group-label.html" (dict "ageGroup" "cubs") }}`  
**Parameters**:
- `ageGroup` (string): Age group value (e.g., "cubs")
**Output**: Human-readable label (e.g., "Cubs (8-10 years)")

### Structured Data Components

#### `structured-data/event.html`
**Purpose**: JSON-LD structured data for events  
**Usage**: `{{ partial "structured-data/event.html" . }}`  
**Schema**: Schema.org Event specification  
**Features**:
- Event metadata
- Location information  
- Date/time specifications
- Organizer details

#### `structured-data/organization.html`
**Purpose**: JSON-LD structured data for scout group  
**Usage**: `{{ partial "structured-data/organization.html" . }}`  
**Schema**: Schema.org Organization specification

#### `structured-data/webpage.html`
**Purpose**: JSON-LD structured data for web pages  
**Usage**: `{{ partial "structured-data/webpage.html" . }}`  
**Schema**: Schema.org WebPage specification

## 📋 Usage Guidelines

### Best Practices

1. **Context Requirements**: Always check if a partial requires specific context
2. **Parameter Passing**: Use `dict` for passing multiple parameters
3. **Error Handling**: Include fallbacks for missing data
4. **Performance**: Avoid complex logic in partials; pre-process data in layouts

### Example Usage Patterns

```go
<!-- Basic partial inclusion -->
{{ partial "seo.html" . }}

<!-- Partial with parameters -->
{{ partial "event-type-label.html" (dict "eventType" .Params.event_type) }}

<!-- Conditional partial -->
{{ if .Params.event_type }}
  {{ partial "structured-data/event.html" . }}
{{ end }}

<!-- Partial with processed data -->
{{ $eventData := dict "event" . "config" site.Data.site.event_config }}
{{ partial "event-card.html" $eventData }}
```

### Data Dependencies

Many partials depend on:
- `site.Data.site.event_config` - Event types and age groups configuration
- Page parameters (`.Params`)
- Site configuration (`.Site.Params`)

## 🔧 Development Guidelines

### Creating New Partials

1. **Naming**: Use kebab-case for filenames (`new-component.html`)
2. **Documentation**: Add usage examples and parameter requirements
3. **Testing**: Test with various data scenarios
4. **Accessibility**: Include proper ARIA attributes where needed

### Partial Template Structure

```go
{{/* Component: Description of what this partial does
     Usage: {{ partial "component-name.html" . }}
     Params: List any required parameters
     Dependencies: List any data dependencies */}}

{{- $paramName := .paramName | default "defaultValue" -}}

<div class="component-name">
  {{/* Component content */}}
</div>
```

### Performance Considerations

- Keep partials focused on single responsibilities
- Avoid heavy computations in frequently-used partials
- Cache expensive operations when possible
- Use Hugo's built-in functions for optimal performance

## 🧪 Testing Partials

### Manual Testing Checklist

- [ ] Renders correctly with valid data
- [ ] Handles missing/invalid data gracefully
- [ ] Maintains accessibility standards
- [ ] Works across different screen sizes
- [ ] Validates HTML output

### Common Issues

1. **Missing Context**: Partial expects page context but receives site context
2. **Data Validation**: Missing checks for required parameters
3. **HTML Validation**: Malformed HTML from dynamic content
4. **Performance**: Complex logic causing build slowdowns

## 📞 Troubleshooting

### Debug Techniques

```go
<!-- Debug partial context -->
{{ printf "%#v" . | safeHTML }}

<!-- Check for required data -->
{{ if not .Params.event_type }}
  {{/* Handle missing data */}}
{{ end }}

<!-- Validate partial parameters -->
{{ $requiredParam := .requiredParam | default "" }}
{{ if not $requiredParam }}
  {{ errorf "Partial requires 'requiredParam' parameter" }}
{{ end }}
```

---

For questions about specific partials or to request new components, please refer to the main project documentation or create an issue in the repository.