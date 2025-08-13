#!/usr/bin/env node

/**
 * Simple script to validate the Decap CMS configuration
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const configPath = path.join(__dirname, '..', 'static', 'admin', 'config.yml');

try {
  // Read and parse the config file
  const configContent = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configContent);
  
  console.log('✅ CMS Configuration Validation');
  console.log('================================');
  
  // Check backend configuration
  if (config.backend && config.backend.name === 'github') {
    console.log('✅ GitHub backend configured');
  } else {
    console.log('❌ GitHub backend not properly configured');
  }
  
  // Check collections
  if (config.collections && config.collections.length > 0) {
    console.log(`✅ ${config.collections.length} collections configured:`);
    config.collections.forEach(collection => {
      console.log(`   - ${collection.name} (${collection.label})`);
    });
  } else {
    console.log('❌ No collections configured');
  }
  
  // Check media folder
  if (config.media_folder) {
    console.log(`✅ Media folder: ${config.media_folder}`);
  } else {
    console.log('❌ Media folder not configured');
  }
  
  // Check if preview templates exist
  const previewDir = path.join(__dirname, '..', 'static', 'admin', 'preview-templates');
  if (fs.existsSync(previewDir)) {
    const previewFiles = fs.readdirSync(previewDir).filter(file => file.endsWith('.js'));
    console.log(`✅ ${previewFiles.length} preview templates found:`);
    previewFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log('❌ No preview templates directory found');
  }
  
  console.log('\n🎉 CMS configuration appears to be valid!');
  console.log('\nNext steps:');
  console.log('1. Update the GitHub repo URL in config.yml');
  console.log('2. Update the site URL in config.yml');
  console.log('3. Deploy to Netlify and enable GitHub OAuth');
  console.log('4. Access the CMS at /admin/ on your deployed site');
  
} catch (error) {
  console.error('❌ Error validating CMS configuration:', error.message);
  process.exit(1);
}