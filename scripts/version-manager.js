#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const semver = require('semver');

/**
 * Enhanced Version Management System for Clean Vibe
 * Provides comprehensive version tracking, automated patching, and changelog management
 */

class VersionManager {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.packagePath = path.join(this.rootDir, 'package.json');
    this.changelogPath = path.join(this.rootDir, 'CHANGELOG.md');
    this.versionHistoryPath = path.join(this.rootDir, '.version-history.json');
    this.packageData = require(this.packagePath);
    this.currentVersion = this.packageData.version;
  }

  /**
   * Initialize version history tracking
   */
  async initVersionHistory() {
    if (!await fs.pathExists(this.versionHistoryPath)) {
      const history = {
        versions: [],
        lastRelease: null,
        totalReleases: 0,
        created: new Date().toISOString()
      };
      await fs.writeJson(this.versionHistoryPath, history, { spaces: 2 });
      console.log(chalk.green('✅ Version history initialized'));
    }
  }

  /**
   * Get version history
   */
  async getVersionHistory() {
    await this.initVersionHistory();
    return await fs.readJson(this.versionHistoryPath);
  }

  /**
   * Add version to history
   */
  async addVersionToHistory(version, type, description, commits = []) {
    const history = await this.getVersionHistory();
    
    const versionEntry = {
      version,
      type,
      description,
      date: new Date().toISOString(),
      commits: commits.length,
      commitDetails: commits.slice(0, 10), // Store first 10 commits
      previousVersion: this.currentVersion,
      semverIncrease: this.getSemverIncrease(this.currentVersion, version)
    };

    history.versions.unshift(versionEntry);
    history.lastRelease = versionEntry;
    history.totalReleases++;
    history.updated = new Date().toISOString();

    await fs.writeJson(this.versionHistoryPath, history, { spaces: 2 });
    return versionEntry;
  }

  /**
   * Get semver increase type
   */
  getSemverIncrease(from, to) {
    if (semver.major(to) > semver.major(from)) return 'major';
    if (semver.minor(to) > semver.minor(from)) return 'minor';
    if (semver.patch(to) > semver.patch(from)) return 'patch';
    return 'none';
  }

  /**
   * Smart version suggestion based on commits
   */
  async suggestNextVersion() {
    const commits = await this.getCommitsSinceLastTag();
    const categories = this.categorizeCommits(commits);
    
    let suggestedType = 'patch';
    
    if (categories.breaking.length > 0) {
      suggestedType = 'major';
    } else if (categories.features.length > 0) {
      suggestedType = 'minor';
    }
    
    return {
      type: suggestedType,
      version: this.getNextVersion(suggestedType),
      reasoning: this.getVersionReasoning(categories),
      commits: commits.length
    };
  }

  /**
   * Get version reasoning
   */
  getVersionReasoning(categories) {
    const reasons = [];
    
    if (categories.breaking.length > 0) {
      reasons.push(`${categories.breaking.length} breaking change(s)`);
    }
    if (categories.features.length > 0) {
      reasons.push(`${categories.features.length} new feature(s)`);
    }
    if (categories.fixes.length > 0) {
      reasons.push(`${categories.fixes.length} bug fix(es)`);
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Minor changes and improvements';
  }

  /**
   * Get next version based on type
   */
  getNextVersion(type) {
    const current = this.currentVersion;
    
    switch (type) {
      case 'major':
        return semver.inc(current, 'major');
      case 'minor':
        return semver.inc(current, 'minor');
      case 'patch':
        return semver.inc(current, 'patch');
      case 'prerelease':
        return semver.inc(current, 'prerelease', 'alpha');
      default:
        throw new Error(`Invalid version type: ${type}`);
    }
  }

  /**
   * Get commits since last tag
   */
  async getCommitsSinceLastTag() {
    try {
      const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim();
      const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%h|%s|%an|%ad|%B" --date=short`, { encoding: 'utf8' });
      return this.parseCommits(commits);
    } catch (error) {
      const commits = execSync('git log --pretty=format:"%h|%s|%an|%ad|%B" --date=short', { encoding: 'utf8' });
      return this.parseCommits(commits);
    }
  }

  /**
   * Parse commit data
   */
  parseCommits(commitString) {
    if (!commitString.trim()) return [];
    
    return commitString.split('\n').filter(line => line.includes('|')).map(line => {
      const [hash, message, author, date, ...bodyParts] = line.split('|');
      return {
        hash: hash.trim(),
        message: message.trim(),
        author: author.trim(),
        date: date.trim(),
        body: bodyParts.join('|').trim()
      };
    });
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
      security: [],
      performance: [],
      other: []
    };

    commits.forEach(commit => {
      const message = commit.message.toLowerCase();
      const body = (commit.body || '').toLowerCase();
      
      if (message.includes('breaking') || body.includes('breaking change')) {
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
      } else if (message.startsWith('perf')) {
        categories.performance.push(commit);
      } else if (message.startsWith('security') || message.includes('vulnerability')) {
        categories.security.push(commit);
      } else if (message.startsWith('chore')) {
        categories.chore.push(commit);
      } else {
        categories.other.push(commit);
      }
    });

    return categories;
  }

  /**
   * Generate enhanced changelog entry
   */
  generateChangelogEntry(version, categories, description) {
    const date = new Date().toISOString().split('T')[0];
    let entry = `## [${version}] - ${date}\n\n`;
    
    if (description) {
      entry += `${description}\n\n`;
    }

    const sections = [
      { title: '🚨 BREAKING CHANGES', items: categories.breaking, icon: '⚠️' },
      { title: '✨ New Features', items: categories.features, icon: '🎉' },
      { title: '🐛 Bug Fixes', items: categories.fixes, icon: '🔧' },
      { title: '🔒 Security', items: categories.security, icon: '🛡️' },
      { title: '⚡ Performance', items: categories.performance, icon: '🚀' },
      { title: '📚 Documentation', items: categories.docs, icon: '📝' },
      { title: '♻️ Code Refactoring', items: categories.refactor, icon: '🔄' },
      { title: '🧪 Tests', items: categories.test, icon: '✅' },
      { title: '💄 Styling', items: categories.style, icon: '🎨' },
      { title: '🔧 Maintenance', items: categories.chore, icon: '🛠️' }
    ];

    sections.forEach(section => {
      if (section.items.length > 0) {
        entry += `### ${section.title}\n\n`;
        section.items.forEach(commit => {
          const cleanMessage = commit.message.replace(/^(feat|fix|docs|style|refactor|test|chore|perf|security):\s*/i, '');
          entry += `- ${section.icon} ${cleanMessage} ([${commit.hash}](../../commit/${commit.hash}))\n`;
        });
        entry += '\n';
      }
    });

    return entry;
  }

  /**
   * Update package.json version
   */
  async updatePackageVersion(newVersion) {
    this.packageData.version = newVersion;
    await fs.writeJson(this.packagePath, this.packageData, { spaces: 2 });
    console.log(chalk.green(`✅ Updated package.json version to ${newVersion}`));
  }

  /**
   * Update changelog
   */
  async updateChangelog(newEntry) {
    let changelog = '';
    
    if (await fs.pathExists(this.changelogPath)) {
      changelog = await fs.readFile(this.changelogPath, 'utf8');
      // Insert new entry after the header
      const lines = changelog.split('\n');
      const headerEndIndex = lines.findIndex(line => line.startsWith('## '));
      if (headerEndIndex > 0) {
        lines.splice(headerEndIndex, 0, newEntry);
        changelog = lines.join('\n');
      } else {
        changelog = newEntry + '\n' + changelog;
      }
    } else {
      changelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${newEntry}`;
    }
    
    await fs.writeFile(this.changelogPath, changelog);
    console.log(chalk.green('✅ Updated CHANGELOG.md'));
  }

  /**
   * Create git tag and commit
   */
  async createGitTag(version, description) {
    try {
      // Add changes
      execSync('git add package.json CHANGELOG.md .version-history.json', { stdio: 'inherit' });
      
      // Commit changes
      const commitMessage = `chore(release): ${version}\n\n${description}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      // Create tag
      execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
      
      console.log(chalk.green(`✅ Created git tag v${version}`));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Failed to create git tag:'), error.message);
      return false;
    }
  }

  /**
   * Display version status
   */
  async displayVersionStatus() {
    const history = await this.getVersionHistory();
    const suggestion = await this.suggestNextVersion();
    const lastTag = this.getLastTag();
    const commitsSinceTag = await this.getCommitsSinceLastTag();
    
    console.log(chalk.cyan.bold('\n📦 Version Status Dashboard\n'));
    
    console.log(`${chalk.blue('Current Version:')} ${chalk.green(this.currentVersion)}`);
    console.log(`${chalk.blue('Last Tag:')} ${chalk.green(lastTag || 'None')}`);
    console.log(`${chalk.blue('Total Releases:')} ${chalk.yellow(history.totalReleases)}`);
    console.log(`${chalk.blue('Commits Since Tag:')} ${chalk.yellow(commitsSinceTag.length)}`);
    
    if (history.lastRelease) {
      console.log(`${chalk.blue('Last Release:')} ${chalk.cyan(history.lastRelease.version)} (${history.lastRelease.date.split('T')[0]})`);
    }
    
    console.log(`\n${chalk.cyan('🤖 Smart Suggestion:')}`);
    console.log(`  ${chalk.green(suggestion.version)} (${suggestion.type})`);
    console.log(`  ${chalk.gray('Reason:')} ${suggestion.reasoning}`);
    
    if (commitsSinceTag.length > 0) {
      console.log(`\n${chalk.blue('Recent commits:')}`);
      commitsSinceTag.slice(0, 5).forEach(commit => {
        console.log(`  ${chalk.gray(commit.hash)} ${commit.message}`);
      });
      if (commitsSinceTag.length > 5) {
        console.log(`  ${chalk.gray(`... and ${commitsSinceTag.length - 5} more`)}`);
      }
    }
  }

  /**
   * Get last git tag
   */
  getLastTag() {
    try {
      return execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf8' }).trim();
    } catch (error) {
      return null;
    }
  }

  /**
   * Quick patch version
   */
  async quickPatch(description) {
    const newVersion = this.getNextVersion('patch');
    const commits = await this.getCommitsSinceLastTag();
    const categories = this.categorizeCommits(commits);
    
    console.log(chalk.blue(`Creating quick patch: ${this.currentVersion} → ${newVersion}`));
    
    const changelogEntry = this.generateChangelogEntry(newVersion, categories, description);
    
    await this.updatePackageVersion(newVersion);
    await this.updateChangelog(changelogEntry);
    await this.addVersionToHistory(newVersion, 'patch', description || 'Patch release', commits);
    
    if (await this.createGitTag(newVersion, description || 'Patch release')) {
      console.log(chalk.green.bold(`🎉 Patch v${newVersion} created successfully!`));
      return true;
    }
    
    return false;
  }

  /**
   * Interactive version bump
   */
  async interactiveVersion() {
    const suggestion = await this.suggestNextVersion();
    const commits = await this.getCommitsSinceLastTag();
    
    if (commits.length === 0) {
      console.log(chalk.yellow('⚠️  No commits found since last tag. Nothing to release.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\n🚀 Interactive Version Management\n'));
    
    const { versionType } = await inquirer.prompt([{
      type: 'list',
      name: 'versionType',
      message: 'What type of version bump?',
      choices: [
        {
          name: `${chalk.green('Patch')} (${this.getNextVersion('patch')}) - Bug fixes`,
          value: 'patch'
        },
        {
          name: `${chalk.blue('Minor')} (${this.getNextVersion('minor')}) - New features`,
          value: 'minor'
        },
        {
          name: `${chalk.red('Major')} (${this.getNextVersion('major')}) - Breaking changes`,
          value: 'major'
        },
        {
          name: `${chalk.yellow('Smart Suggestion')} (${suggestion.version}) - ${suggestion.reasoning}`,
          value: suggestion.type
        }
      ],
      default: suggestion.type
    }]);
    
    const newVersion = this.getNextVersion(versionType);
    
    const { description } = await inquirer.prompt([{
      type: 'input',
      name: 'description',
      message: 'Release description (optional):',
      default: suggestion.reasoning
    }]);
    
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Create ${versionType} release v${newVersion}?`,
      default: true
    }]);
    
    if (!confirm) {
      console.log(chalk.blue('Release cancelled.'));
      return;
    }
    
    const categories = this.categorizeCommits(commits);
    const changelogEntry = this.generateChangelogEntry(newVersion, categories, description);
    
    await this.updatePackageVersion(newVersion);
    await this.updateChangelog(changelogEntry);
    await this.addVersionToHistory(newVersion, versionType, description, commits);
    
    if (await this.createGitTag(newVersion, description)) {
      console.log(chalk.green.bold(`🎉 Release v${newVersion} created successfully!`));
      
      console.log(chalk.blue('\nNext steps:'));
      console.log(`  ${chalk.cyan('git push origin main --tags')} - Push changes and tags`);
      console.log(`  ${chalk.cyan('npm publish')} - Publish to npm`);
    }
  }

  /**
   * Show version history
   */
  async showHistory() {
    const history = await this.getVersionHistory();
    
    console.log(chalk.cyan.bold('\n📚 Version History\n'));
    
    if (history.versions.length === 0) {
      console.log(chalk.gray('No version history found.'));
      return;
    }
    
    history.versions.slice(0, 10).forEach((version, index) => {
      const isLatest = index === 0;
      const date = version.date.split('T')[0];
      const typeColor = version.type === 'major' ? 'red' : version.type === 'minor' ? 'blue' : 'green';
      
      console.log(`${isLatest ? '🏷️ ' : '  '}${chalk[typeColor](version.version)} ${chalk.gray(`(${version.type})`)} - ${date}`);
      console.log(`    ${chalk.gray(version.description)}`);
      console.log(`    ${chalk.gray(`${version.commits} commits`)}`);
      console.log('');
    });
    
    if (history.versions.length > 10) {
      console.log(chalk.gray(`... and ${history.versions.length - 10} more versions`));
    }
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${chalk.cyan.bold('Clean Vibe Version Manager')}

Usage:
  npm run version:status         # Show version status dashboard
  npm run version:suggest        # Get smart version suggestion
  npm run version:patch          # Quick patch release
  npm run version:bump           # Interactive version bump
  npm run version:history        # Show version history
  
Commands:
  status                         # Show comprehensive version status
  suggest                        # Smart version suggestion based on commits
  patch [description]            # Quick patch version bump
  bump                           # Interactive version bump with options
  history                        # Show detailed version history
  
Examples:
  node scripts/version-manager.js status
  node scripts/version-manager.js patch "Fix critical bug"
  node scripts/version-manager.js bump
`);
    return;
  }
  
  const versionManager = new VersionManager();
  
  switch (command) {
    case 'status':
      await versionManager.displayVersionStatus();
      break;
      
    case 'suggest': {
      const suggestion = await versionManager.suggestNextVersion();
      console.log(chalk.cyan(`Suggested next version: ${chalk.green(suggestion.version)} (${suggestion.type})`));
      console.log(chalk.gray(`Reasoning: ${suggestion.reasoning}`));
      break;
    }
    
    case 'patch': {
      const description = args.slice(1).join(' ');
      await versionManager.quickPatch(description);
      break;
    }
    
    case 'bump':
      await versionManager.interactiveVersion();
      break;
      
    case 'history':
      await versionManager.showHistory();
      break;
      
    default:
      await versionManager.displayVersionStatus();
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Version management failed:'), error.message);
    process.exit(1);
  });
}

module.exports = VersionManager;
