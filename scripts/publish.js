#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 thrilled-vibe-starter Publisher\n');

// Read current package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log(`📦 Current version: ${pkg.version}`);

// Get version type from command line
const versionType = process.argv[2] || 'patch';
const validVersions = ['patch', 'minor', 'major'];

if (!validVersions.includes(versionType)) {
  console.log(`❌ Invalid version type. Use: ${validVersions.join(', ')}`);
  process.exit(1);
}

console.log(`\n🎯 Publishing ${versionType} release via GitHub Actions...`);

try {
  // Option 1: Try to trigger via GitHub CLI
  console.log('🔧 Attempting to trigger release workflow...');
  execSync(`gh workflow run release.yml -f version=${versionType}`, { stdio: 'inherit' });
  console.log('✅ Release workflow triggered successfully!');
  
  console.log(`\n📊 Monitor progress at:`);
  console.log(`🔗 https://github.com/ThriledLokki983/thrilled-vibe-starter/actions`);
  
} catch (error) {
  console.log('⚠️  Could not trigger workflow via CLI. Manual options:');
  console.log('\n📋 Option 1 - Manual Workflow Dispatch:');
  console.log(`🔗 https://github.com/ThriledLokki983/thrilled-vibe-starter/actions/workflows/release.yml`);
  console.log(`   1. Click "Run workflow"`);
  console.log(`   2. Select "${versionType}" from dropdown`);
  console.log(`   3. Click "Run workflow"`);
  
  console.log('\n📋 Option 2 - Create GitHub Release:');
  console.log(`🔗 https://github.com/ThriledLokki983/thrilled-vibe-starter/releases/new`);
  console.log(`   1. Create a new tag (e.g., v1.0.3)`);
  console.log(`   2. Fill in release details`);
  console.log(`   3. Click "Publish release"`);
}

console.log(`\n🔐 Required GitHub Secrets (if not configured):`);
console.log(`   - NPM_TOKEN (npm publishing)`);
console.log(`   - DOCKERHUB_USERNAME & DOCKERHUB_TOKEN (Docker publishing)`);
console.log(`   - FINEGRAIN_TOKEN (GitHub API access)`);
console.log(`\n⚙️  Configure at: https://github.com/ThriledLokki983/thrilled-vibe-starter/settings/secrets/actions`);

console.log(`\n🎉 The release.yml workflow will automatically:`);
console.log(`   ✅ Run tests`);
console.log(`   ✅ Bump version`);
console.log(`   ✅ Publish to npm`);
console.log(`   ✅ Build & push Docker image`);
console.log(`   ✅ Create GitHub release`);
console.log(`\n🚀 No manual steps needed once secrets are configured!`);
