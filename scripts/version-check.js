#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Version checking utility for Clean Vibe
 */

function getCurrentVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageData.version;
}

function getLatestTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim();
    return tag.replace('v', '');
  } catch (error) {
    return null;
  }
}

function getCommitsSinceTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim();
    const commits = execSync(`git rev-list ${lastTag}..HEAD --count`, { encoding: 'utf8' }).trim();
    return parseInt(commits);
  } catch (error) {
    const totalCommits = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    return parseInt(totalCommits);
  }
}

function getBranchName() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getLastCommit() {
  try {
    return execSync('git log -1 --pretty=format:"%h %s" 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'No commits found';
  }
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() === '';
  } catch (error) {
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${chalk.cyan.bold('Clean Vibe Version Checker')}

Usage:
  npm run version:check        # Show version information
  
Shows:
  • Current package.json version
  • Latest git tag
  • Commits since last tag
  • Git branch and status
  • Last commit info
`);
    return;
  }

  console.log(chalk.cyan.bold('📦 Clean Vibe Version Information\n'));
  
  const currentVersion = getCurrentVersion();
  const latestTag = getLatestTag();
  const commitsSinceTag = getCommitsSinceTag();
  const branchName = getBranchName();
  const lastCommit = getLastCommit();
  const isClean = checkGitStatus();

  console.log(`${chalk.blue('Current Version:')} ${chalk.green(currentVersion)}`);
  
  if (latestTag) {
    console.log(`${chalk.blue('Latest Tag:')} ${chalk.green('v' + latestTag)}`);
    
    if (currentVersion !== latestTag) {
      console.log(`${chalk.yellow('⚠️  Version mismatch:')} package.json (${currentVersion}) != tag (${latestTag})`);
    } else {
      console.log(`${chalk.green('✅ Version matches latest tag')}`);
    }
  } else {
    console.log(`${chalk.blue('Latest Tag:')} ${chalk.gray('No tags found')}`);
  }

  console.log(`${chalk.blue('Commits since tag:')} ${chalk.yellow(commitsSinceTag)}`);
  console.log(`${chalk.blue('Current Branch:')} ${chalk.cyan(branchName)}`);
  console.log(`${chalk.blue('Git Status:')} ${isClean ? chalk.green('Clean') : chalk.yellow('Uncommitted changes')}`);
  console.log(`${chalk.blue('Last Commit:')} ${chalk.gray(lastCommit)}`);

  if (commitsSinceTag > 0 && latestTag) {
    console.log(`\n${chalk.cyan('💡 Suggested next version:')}`);
    
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    console.log(`  ${chalk.gray('Patch:')} ${major}.${minor}.${patch + 1} (bug fixes)`);
    console.log(`  ${chalk.gray('Minor:')} ${major}.${minor + 1}.0 (new features)`);
    console.log(`  ${chalk.gray('Major:')} ${major + 1}.0.0 (breaking changes)`);
    
    console.log(`\n${chalk.blue('To create a release:')}`);
    console.log(`  ${chalk.cyan('npm run release')}        # Interactive release`);
    console.log(`  ${chalk.cyan('npm run release:patch')}  # Quick patch release`);
    console.log(`  ${chalk.cyan('npm run release:minor')}  # Quick minor release`);
    console.log(`  ${chalk.cyan('npm run release:major')}  # Quick major release`);
  }

  if (!isClean) {
    console.log(`\n${chalk.yellow('⚠️  You have uncommitted changes.')}`);
    console.log(`${chalk.blue('Run')} ${chalk.cyan('git status')} ${chalk.blue('to see details.')}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  getLatestTag,
  getCommitsSinceTag,
  getBranchName,
  getLastCommit,
  checkGitStatus
};
