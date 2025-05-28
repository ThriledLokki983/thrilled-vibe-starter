#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Release management script for Clean Vibe
 * Handles version bumping, changelog generation, and release preparation
 */

class ReleaseManager {
  constructor() {
    this.packagePath = path.join(__dirname, 'package.json');
    this.changelogPath = path.join(__dirname, 'CHANGELOG.md');
    this.currentVersion = require('./package.json').version;
  }

  /**
   * Get the next version based on type
   */
  getNextVersion(type) {
    const [major, minor, patch] = this.currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }
  }

  /**
   * Get commits since last tag
   */
  getCommitsSinceLastTag() {
    try {
      const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim();
      console.log(chalk.blue(`Last tag: ${lastTag}`));
      const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%h|%s|%an|%ad" --date=short`, { encoding: 'utf8' });
      return commits.split('\n').filter(line => line.trim()).map(line => {
        const [hash, message, author, date] = line.split('|');
        return { hash, message, author, date };
      });
    } catch (error) {
      console.log(chalk.yellow('No previous tags found, getting all commits'));
      const commits = execSync('git log --pretty=format:"%h|%s|%an|%ad" --date=short', { encoding: 'utf8' });
      return commits.split('\n').filter(line => line.trim()).map(line => {
        const [hash, message, author, date] = line.split('|');
        return { hash, message, author, date };
      });
    }
  }

  /**
   * Categorize commits based on conventional commit format
   */
  categorizeCommits(commits) {
    const categories = {
      breaking: [],
      features: [],
      fixes: [],
      docs: [],
      style: [],
      refactor: [],
      test: [],
      chore: [],
      other: []
    };

    commits.forEach(commit => {
      const message = commit.message.toLowerCase();
      
      if (message.includes('breaking') || message.includes('breaking change')) {
        categories.breaking.push(commit);
      } else if (message.startsWith('feat') || message.startsWith('feature')) {
        categories.features.push(commit);
      } else if (message.startsWith('fix')) {
        categories.fixes.push(commit);
      } else if (message.startsWith('docs')) {
        categories.docs.push(commit);
      } else if (message.startsWith('style')) {
        categories.style.push(commit);
      } else if (message.startsWith('refactor')) {
        categories.refactor.push(commit);
      } else if (message.startsWith('test')) {
        categories.test.push(commit);
      } else if (message.startsWith('chore')) {
        categories.chore.push(commit);
      } else {
        categories.other.push(commit);
      }
    });

    return categories;
  }

  /**
   * Generate changelog content
   */
  generateChangelogEntry(version, categories) {
    const date = new Date().toISOString().split('T')[0];
    let changelog = `## [${version}] - ${date}\n\n`;

    if (categories.breaking.length > 0) {
      changelog += `### 💥 BREAKING CHANGES\n\n`;
      categories.breaking.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.features.length > 0) {
      changelog += `### ✨ Features\n\n`;
      categories.features.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.fixes.length > 0) {
      changelog += `### 🐛 Bug Fixes\n\n`;
      categories.fixes.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.docs.length > 0) {
      changelog += `### 📚 Documentation\n\n`;
      categories.docs.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.refactor.length > 0) {
      changelog += `### ♻️ Code Refactoring\n\n`;
      categories.refactor.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.test.length > 0) {
      changelog += `### 🧪 Tests\n\n`;
      categories.test.forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    if (categories.chore.length > 0 || categories.style.length > 0 || categories.other.length > 0) {
      changelog += `### 🔧 Maintenance\n\n`;
      [...categories.chore, ...categories.style, ...categories.other].forEach(commit => {
        changelog += `- ${commit.message} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    }

    return changelog;
  }

  /**
   * Update or create CHANGELOG.md
   */
  async updateChangelog(newEntry) {
    let existingContent = '';
    
    if (await fs.pathExists(this.changelogPath)) {
      existingContent = await fs.readFile(this.changelogPath, 'utf8');
    } else {
      existingContent = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
    }

    // Insert new entry after the header
    const lines = existingContent.split('\n');
    const headerEndIndex = lines.findIndex(line => line.trim() === '') + 1;
    
    lines.splice(headerEndIndex, 0, newEntry);
    
    await fs.writeFile(this.changelogPath, lines.join('\n'));
  }

  /**
   * Update package.json version
   */
  async updatePackageVersion(newVersion) {
    const packageData = await fs.readJson(this.packagePath);
    packageData.version = newVersion;
    await fs.writeJson(this.packagePath, packageData, { spaces: 2 });
  }

  /**
   * Run tests before release
   */
  runTests() {
    console.log(chalk.blue('Running tests...'));
    try {
      execSync('npm test', { stdio: 'inherit' });
      console.log(chalk.green('✅ Tests passed'));
      return true;
    } catch (error) {
      console.log(chalk.red('❌ Tests failed'));
      return false;
    }
  }

  /**
   * Format code before release
   */
  formatCode() {
    console.log(chalk.blue('Formatting code...'));
    try {
      execSync('npm run format', { stdio: 'inherit' });
      console.log(chalk.green('✅ Code formatted'));
      return true;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Code formatting failed (continuing anyway)'));
      return true; // Don't fail the release for formatting
    }
  }

  /**
   * Commit and tag the release
   */
  commitAndTag(version, skipPush = false) {
    console.log(chalk.blue('Committing changes...'));
    
    try {
      execSync('git add .');
      execSync(`git commit -m "chore(release): ${version}"`);
      execSync(`git tag -a v${version} -m "Release v${version}"`);
      
      if (!skipPush) {
        console.log(chalk.blue('Pushing to remote...'));
        execSync('git push origin main --tags');
      }
      
      console.log(chalk.green(`✅ Release v${version} committed and tagged`));
      return true;
    } catch (error) {
      console.log(chalk.red('❌ Git operations failed:'), error.message);
      return false;
    }
  }

  /**
   * Main release workflow
   */
  async release() {
    console.log(chalk.cyan.bold('🚀 Clean Vibe Release Manager\n'));

    // Check if we're in a git repository
    try {
      execSync('git status', { stdio: 'ignore' });
    } catch (error) {
      console.log(chalk.red('❌ Not in a git repository'));
      process.exit(1);
    }

    // Check for uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log(chalk.yellow('⚠️ You have uncommitted changes:'));
        console.log(status);
        
        const { continueWithChanges } = await inquirer.prompt([{
          type: 'confirm',
          name: 'continueWithChanges',
          message: 'Do you want to continue? (changes will be included in release)',
          default: false
        }]);
        
        if (!continueWithChanges) {
          console.log(chalk.blue('Please commit your changes and try again.'));
          process.exit(0);
        }
      }
    } catch (error) {
      console.log(chalk.red('❌ Could not check git status'));
      process.exit(1);
    }

    // Get release type
    const { releaseType } = await inquirer.prompt([{
      type: 'list',
      name: 'releaseType',
      message: 'What type of release is this?',
      choices: [
        { name: 'Patch (1.0.0 → 1.0.1) - Bug fixes', value: 'patch' },
        { name: 'Minor (1.0.0 → 1.1.0) - New features', value: 'minor' },
        { name: 'Major (1.0.0 → 2.0.0) - Breaking changes', value: 'major' }
      ]
    }]);

    const newVersion = this.getNextVersion(releaseType);
    console.log(chalk.blue(`Current version: ${this.currentVersion}`));
    console.log(chalk.green(`New version: ${newVersion}`));

    // Get commits and generate changelog
    const commits = this.getCommitsSinceLastTag();
    const categories = this.categorizeCommits(commits);
    
    console.log(chalk.blue(`\nFound ${commits.length} commits since last release:`));
    if (categories.features.length > 0) console.log(`  ✨ ${categories.features.length} features`);
    if (categories.fixes.length > 0) console.log(`  🐛 ${categories.fixes.length} bug fixes`);
    if (categories.breaking.length > 0) console.log(`  💥 ${categories.breaking.length} breaking changes`);
    if (categories.docs.length > 0) console.log(`  📚 ${categories.docs.length} documentation updates`);

    // Preview changelog
    const changelogEntry = this.generateChangelogEntry(newVersion, categories);
    console.log(chalk.cyan('\n📝 Changelog preview:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(changelogEntry);
    console.log(chalk.gray('─'.repeat(50)));

    // Confirm release
    const { confirmRelease } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirmRelease',
      message: `Create release v${newVersion}?`,
      default: true
    }]);

    if (!confirmRelease) {
      console.log(chalk.blue('Release cancelled.'));
      process.exit(0);
    }

    // Run pre-release checks
    const formatSuccess = this.formatCode();
    const testSuccess = this.runTests();
    
    if (!testSuccess) {
      console.log(chalk.red('❌ Tests failed. Please fix them before releasing.'));
      process.exit(1);
    }

    // Update files
    console.log(chalk.blue('Updating version and changelog...'));
    await this.updatePackageVersion(newVersion);
    await this.updateChangelog(changelogEntry);

    // Ask about pushing to remote
    const { pushToRemote } = await inquirer.prompt([{
      type: 'confirm',
      name: 'pushToRemote',
      message: 'Push changes to remote repository?',
      default: true
    }]);

    // Commit and tag
    const commitSuccess = this.commitAndTag(newVersion, !pushToRemote);
    
    if (commitSuccess) {
      console.log(chalk.green.bold(`\n🎉 Release v${newVersion} completed successfully!`));
      
      if (pushToRemote) {
        console.log(chalk.blue('\n📦 GitHub Actions will automatically:'));
        console.log('  • Run tests and security scans');
        console.log('  • Publish to npm registry');
        console.log('  • Build and push Docker image');
        console.log('  • Create GitHub release with notes');
      } else {
        console.log(chalk.yellow('\n⚠️ Changes committed locally only.'));
        console.log('Run the following to push when ready:');
        console.log(chalk.cyan('git push origin main --tags'));
      }
      
      console.log(chalk.blue('\n🔗 Useful links:'));
      console.log(`  • npm: https://www.npmjs.com/package/@thrilled/clean-vibe`);
      console.log(`  • Docker: https://hub.docker.com/r/[username]/clean-vibe`);
      console.log(`  • Releases: https://github.com/ThriledLokki983/thrilled-vibe-starter/releases`);
    } else {
      console.log(chalk.red('❌ Release failed during git operations.'));
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${chalk.cyan.bold('Clean Vibe Release Manager')}

Usage:
  npm run release              # Interactive release
  npm run release:patch        # Quick patch release
  npm run release:minor        # Quick minor release  
  npm run release:major        # Quick major release

Options:
  --help, -h                   # Show this help
  --dry-run                    # Show what would be done without making changes
`);
    return;
  }

  const releaseManager = new ReleaseManager();

  // Handle quick release commands
  if (args.length > 0 && ['patch', 'minor', 'major'].includes(args[0])) {
    const type = args[0];
    const newVersion = releaseManager.getNextVersion(type);
    
    console.log(chalk.cyan(`Quick ${type} release: ${releaseManager.currentVersion} → ${newVersion}`));
    
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Create ${type} release v${newVersion}?`,
      default: true
    }]);
    
    if (!confirm) {
      console.log(chalk.blue('Release cancelled.'));
      return;
    }
    
    // Simulate answers for quick release
    const commits = releaseManager.getCommitsSinceLastTag();
    const categories = releaseManager.categorizeCommits(commits);
    const changelogEntry = releaseManager.generateChangelogEntry(newVersion, categories);
    
    releaseManager.formatCode();
    if (!releaseManager.runTests()) {
      console.log(chalk.red('❌ Tests failed. Release aborted.'));
      process.exit(1);
    }
    
    await releaseManager.updatePackageVersion(newVersion);
    await releaseManager.updateChangelog(changelogEntry);
    
    if (releaseManager.commitAndTag(newVersion)) {
      console.log(chalk.green.bold(`🎉 Quick ${type} release v${newVersion} completed!`));
    }
    
    return;
  }

  // Interactive release
  await releaseManager.release();
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Release failed:'), error.message);
    process.exit(1);
  });
}

module.exports = ReleaseManager;
