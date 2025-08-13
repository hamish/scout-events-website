// Page preview template for Decap CMS
const PagePreview = createClass({
  render() {
    const entry = this.props.entry;
    const widgetFor = this.props.widgetFor;
    const getAsset = this.props.getAsset;
    
    // Get field values
    const title = entry.getIn(['data', 'title']);
    const featuredImage = entry.getIn(['data', 'featured_image']);
    
    return h('div', { className: 'page-preview' },
      // Preview styles
      h('style', {}, `
        .page-preview {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .page-header h1 {
          color: #2c5530;
          margin-bottom: 20px;
          font-size: 2.5rem;
          font-weight: bold;
          border-bottom: 3px solid #28a745;
          padding-bottom: 15px;
        }
        .page-featured-image {
          margin: 20px 0;
          text-align: center;
        }
        .page-featured-image img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .page-content {
          margin-top: 30px;
          font-size: 1.1rem;
        }
        .page-content h2 {
          color: #2c5530;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .page-content h3 {
          color: #495057;
          margin-top: 25px;
          margin-bottom: 12px;
        }
        .page-content p {
          margin-bottom: 15px;
        }
        .page-content ul, .page-content ol {
          margin-bottom: 15px;
          padding-left: 30px;
        }
        .page-content li {
          margin-bottom: 5px;
        }
        .page-content blockquote {
          border-left: 4px solid #28a745;
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          color: #666;
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
        'Preview: This is how your page will appear on the website'
      ),
      
      h('article', { className: 'page-detail' },
        h('div', { className: 'page-header' },
          h('h1', {}, title || 'Page Title')
        ),
        
        // Featured image
        featuredImage && h('div', { className: 'page-featured-image' },
          h('img', { 
            src: getAsset(featuredImage)?.toString() || featuredImage,
            alt: title || 'Page image',
            loading: 'lazy'
          })
        ),
        
        // Page content
        h('div', { className: 'page-content' },
          widgetFor('body')
        )
      )
    );
  }
});

// Register the preview template
CMS.registerPreviewTemplate('pages', PagePreview);