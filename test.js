#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const pkg = require('./index.js');

async function runTests() {
  console.log(chalk.blue('🧪 Running comprehensive tests for thrilled-vibe-starter\n'));
  
  let passedTests = 0;
  let totalTests = 0;
  
  function test(name, testFn) {
    totalTests++;
    try {
      const result = testFn();
      if (result === true || result === undefined) {
        console.log(chalk.green(`✅ ${name}`));
        passedTests++;
      } else {
        console.log(chalk.red(`❌ ${name}: ${result}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${name}: ${error.message}`));
    }
  }
  
  async function asyncTest(name, testFn) {
    totalTests++;
    try {
      const result = await testFn();
      if (result === true || result === undefined) {
        console.log(chalk.green(`✅ ${name}`));
        passedTests++;
      } else {
        console.log(chalk.red(`❌ ${name}: ${result}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${name}: ${error.message}`));
    }
  }
  
  // Test API functions
  test('getAvailableCategories returns correct categories', () => {
    const categories = pkg.getAvailableCategories();
    return categories.length === 3 && categories.includes('fe') && categories.includes('be') && categories.includes('github');
  });
  
  test('getAvailableTemplates returns all templates', () => {
    const templates = pkg.getAvailableTemplates();
    const expected = ['fe/react', 'fe/vanilla', 'be/node-express', 'be/python-django', 'github/workflows'];
    return templates.length === 5 && expected.every(t => templates.includes(t));
  });
  
  test('getAvailableTemplates for fe category', () => {
    const templates = pkg.getAvailableTemplates('fe');
    return templates.length === 2 && templates.includes('react') && templates.includes('vanilla');
  });
  
  test('getAvailableTemplates for be category', () => {
    const templates = pkg.getAvailableTemplates('be');
    return templates.length === 2 && templates.includes('node-express') && templates.includes('python-django');
  });
  
  test('getTemplateInfo returns correct info for React', () => {
    const info = pkg.getTemplateInfo('fe', 'react');
    return info && info.category === 'Frontend' && info.template === 'React';
  });
  
  test('getTemplateInfo returns null for invalid template', () => {
    const info = pkg.getTemplateInfo('invalid', 'template');
    return info === null;
  });
  
  // Test file generation
  const testDir = './test-comprehensive';
  
  await asyncTest('generatePRD creates React instructions', async () => {
    const result = await pkg.generatePRD('fe', 'react', testDir);
    const expectedPath = path.join(testDir, '.github/instructions.md');
    const exists = fs.existsSync(expectedPath);
    const content = exists ? fs.readFileSync(expectedPath, 'utf-8') : '';
    return exists && content.includes('React Application') && result === expectedPath;
  });
  
  await asyncTest('generatePRD creates Vanilla JS instructions', async () => {
    const result = await pkg.generatePRD('fe', 'vanilla', testDir);
    const expectedPath = path.join(testDir, '.github/instructions.md');
    const content = fs.readFileSync(expectedPath, 'utf-8');
    return content.includes('vanilla JavaScript') || content.includes('Vanilla JavaScript');
  });
  
  await asyncTest('generatePRD creates Node Express instructions', async () => {
    const result = await pkg.generatePRD('be', 'node-express', testDir);
    const expectedPath = path.join(testDir, '.github/instructions.md');
    const content = fs.readFileSync(expectedPath, 'utf-8');
    return content.includes('Node.js Express API');
  });
  
  await asyncTest('generatePRD creates Django instructions', async () => {
    const result = await pkg.generatePRD('be', 'python-django', testDir);
    const expectedPath = path.join(testDir, '.github/instructions.md');
    const content = fs.readFileSync(expectedPath, 'utf-8');
    return content.includes('Django REST API');
  });
  
  await asyncTest('generatePRD creates GitHub workflows instructions', async () => {
    const result = await pkg.generatePRD('github', 'workflows', testDir);
    const expectedPath = path.join(testDir, '.github/instructions.md');
    const content = fs.readFileSync(expectedPath, 'utf-8');
    return content.includes('GitHub Workflows Development Instructions');
  });
  
  // Test error handling
  await asyncTest('generatePRD throws error for invalid category', async () => {
    try {
      await pkg.generatePRD('invalid', 'template', testDir);
      return 'Should have thrown error';
    } catch (error) {
      return error.message.includes('Category "invalid" not found');
    }
  });
  
  await asyncTest('generatePRD throws error for invalid template', async () => {
    try {
      await pkg.generatePRD('fe', 'invalid', testDir);
      return 'Should have thrown error';
    } catch (error) {
      return error.message.includes('Template "invalid" not found');
    }
  });
  
  // Verify all template files exist
  const templates = [
    'templates/fe/react/instructions.md',
    'templates/fe/vanilla/instructions.md',
    'templates/be/node-express/instructions.md',
    'templates/be/python-django/instructions.md',
    'templates/github/workflows/instructions.md'
  ];
  
  templates.forEach(templatePath => {
    test(`Template file exists: ${templatePath}`, () => {
      return fs.existsSync(templatePath);
    });
  });
  
  // Clean up
  fs.removeSync(testDir);
  
  console.log(chalk.blue(`\n📊 Test Results: ${passedTests}/${totalTests} passed`));
  
  if (passedTests === totalTests) {
    console.log(chalk.green('🎉 All tests passed! The package is ready for use.'));
    return true;
  } else {
    console.log(chalk.red(`❌ ${totalTests - passedTests} tests failed.`));
    return false;
  }
}

if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };
