#!/usr/bin/env node

const pkg = require('./index.js');

async function testCLI() {
  console.log('🧪 Testing CLI functionality...\n');
  
  // Test the programmatic API with the new GitHub workflows
  try {
    const result = await pkg.generatePRD('github', 'workflows', './test-cli-output');
    console.log('✅ GitHub workflows template generated successfully');
    console.log('📄 Generated at:', result);
    
    // Check if the file contains the expected content
    const fs = require('fs-extra');
    const content = fs.readFileSync(result, 'utf-8');
    
    if (content.includes('GitHub Workflows Development Instructions')) {
      console.log('✅ Content verification passed');
    } else {
      console.log('❌ Content verification failed');
    }
    
    // Cleanup
    fs.removeSync('./test-cli-output');
    console.log('✅ Cleanup completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Test available options
  console.log('\n📋 Available categories:', pkg.getAvailableCategories());
  console.log('📋 Available templates:', pkg.getAvailableTemplates());
  console.log('📋 GitHub category templates:', pkg.getAvailableTemplates('github'));
  
  // Test template info
  const info = pkg.getTemplateInfo('github', 'workflows');
  console.log('📋 GitHub workflows info:', info);
}

testCLI().catch(console.error);
