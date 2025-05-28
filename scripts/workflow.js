#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Comprehensive Development Workflow Manager for Clean Vibe
 * Integrates version management, testing, formatting, and release processes
 */

class WorkflowManager {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.packagePath = path.join(this.rootDir, 'package.json');
    this.packageData = require(this.packagePath);
  }

  /**
   * Show comprehensive project status
   */
  async showStatus() {
    console.log(chalk.cyan.bold('\n🚀 Clean Vibe Project Status\n'));
    
    // Git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const isClean = gitStatus.trim() === '';
      console.log(`${chalk.blue('Git Status:')} ${isClean ? chalk.green('Clean') : chalk.yellow('Uncommitted changes')}`);
      
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`${chalk.blue('Current Branch:')} ${chalk.cyan(branch)}`);
    } catch (error) {
      console.log(`${chalk.blue('Git Status:')} ${chalk.red('Not a git repository')}`);
    }

    // Version info
    console.log(`${chalk.blue('Package Version:')} ${chalk.green(this.packageData.version)}`);
    
    // Dependencies status
    const depCount = Object.keys(this.packageData.dependencies || {}).length;
    const devDepCount = Object.keys(this.packageData.devDependencies || {}).length;
    console.log(`${chalk.blue('Dependencies:')} ${chalk.yellow(depCount)} production, ${chalk.yellow(devDepCount)} development`);

    // Test status
    console.log('\n' + chalk.cyan('📋 Quick Actions:'));
    console.log(`  ${chalk.gray('npm run workflow:dev')}     - Start development workflow`);
    console.log(`  ${chalk.gray('npm run workflow:test')}    - Run comprehensive tests`);
    console.log(`  ${chalk.gray('npm run workflow:release')} - Prepare for release`);
    console.log(`  ${chalk.gray('npm run workflow:clean')}   - Clean and reset project`);
  }

  /**
   * Development workflow
   */
  async startDevelopment() {
    console.log(chalk.cyan.bold('\n🛠️  Starting Development Workflow\n'));
    
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🧪 Run tests', value: 'test' },
        { name: '🎨 Format code', value: 'format' },
        { name: '🔍 Check version status', value: 'version' },
        { name: '📦 Install dependencies', value: 'install' },
        { name: '🐳 Docker operations', value: 'docker' },
        { name: '🔧 Project setup', value: 'setup' },
        { name: '📊 Show full status', value: 'status' }
      ]
    }]);

    switch (action) {
      case 'test':
        await this.runTests();
        break;
      case 'format':
        await this.formatCode();
        break;
      case 'version':
        await this.showVersionStatus();
        break;
      case 'install':
        await this.installDependencies();
        break;
      case 'docker':
        await this.dockerOperations();
        break;
      case 'setup':
        await this.projectSetup();
        break;
      case 'status':
        await this.showStatus();
        break;
    }
  }

  /**
   * Run comprehensive tests
   */
  async runTests() {
    console.log(chalk.blue('🧪 Running comprehensive test suite...\n'));
    
    try {
      // Run main tests
      console.log(chalk.gray('Running main test suite...'));
      execSync('npm test', { stdio: 'inherit' });
      
      // Run CLI tests
      console.log(chalk.gray('\nRunning CLI tests...'));
      execSync('npm run test:cli', { stdio: 'ignore' });
      
      // Check code formatting
      console.log(chalk.gray('Checking code formatting...'));
      execSync('npm run format:check', { stdio: 'inherit' });
      
      console.log(chalk.green.bold('\n✅ All tests passed!'));
      
    } catch (error) {
      console.log(chalk.red.bold('\n❌ Tests failed!'));
      console.log(chalk.gray('Run individual test commands to see details:'));
      console.log(chalk.cyan('  npm test'));
      console.log(chalk.cyan('  npm run format:check'));
    }
  }

  /**
   * Format code
   */
  async formatCode() {
    console.log(chalk.blue('🎨 Formatting code...\n'));
    
    try {
      execSync('npm run format', { stdio: 'inherit' });
      console.log(chalk.green.bold('\n✅ Code formatted successfully!'));
    } catch (error) {
      console.log(chalk.red.bold('\n❌ Code formatting failed!'));
    }
  }

  /**
   * Show version status
   */
  async showVersionStatus() {
    console.log(chalk.blue('🔍 Checking version status...\n'));
    
    try {
      execSync('npm run version:status', { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red.bold('\n❌ Version check failed!'));
    }
  }

  /**
   * Install dependencies
   */
  async installDependencies() {
    console.log(chalk.blue('📦 Installing dependencies...\n'));
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log(chalk.green.bold('\n✅ Dependencies installed successfully!'));
    } catch (error) {
      console.log(chalk.red.bold('\n❌ Dependency installation failed!'));
    }
  }

  /**
   * Docker operations
   */
  async dockerOperations() {
    const { dockerAction } = await inquirer.prompt([{
      type: 'list',
      name: 'dockerAction',
      message: 'Docker operation:',
      choices: [
        { name: '🔨 Build image', value: 'build' },
        { name: '🏃 Run container', value: 'run' },
        { name: '🧪 Test image', value: 'test' },
        { name: '🧹 Clean images', value: 'clean' }
      ]
    }]);

    console.log(chalk.blue(`🐳 Docker ${dockerAction}...\n`));
    
    try {
      switch (dockerAction) {
        case 'build':
          execSync('npm run docker:build', { stdio: 'inherit' });
          break;
        case 'run':
          execSync('npm run docker:run', { stdio: 'inherit' });
          break;
        case 'test':
          execSync('npm run docker:test', { stdio: 'inherit' });
          break;
        case 'clean':
          execSync('docker image prune -f', { stdio: 'inherit' });
          break;
      }
      console.log(chalk.green.bold(`\n✅ Docker ${dockerAction} completed!`));
    } catch (error) {
      console.log(chalk.red.bold(`\n❌ Docker ${dockerAction} failed!`));
    }
  }

  /**
   * Project setup
   */
  async projectSetup() {
    console.log(chalk.blue('🔧 Setting up project...\n'));
    
    const tasks = [
      { name: 'Installing dependencies', command: 'npm install' },
      { name: 'Formatting code', command: 'npm run format' },
      { name: 'Running tests', command: 'npm test' }
    ];

    for (const task of tasks) {
      try {
        console.log(chalk.gray(`${task.name}...`));
        execSync(task.command, { stdio: 'pipe' });
        console.log(chalk.green(`✅ ${task.name} completed`));
      } catch (error) {
        console.log(chalk.red(`❌ ${task.name} failed`));
        console.log(chalk.gray(`Command: ${task.command}`));
      }
    }
    
    console.log(chalk.green.bold('\n🎉 Project setup completed!'));
  }

  /**
   * Release workflow
   */
  async prepareRelease() {
    console.log(chalk.cyan.bold('\n🚀 Release Preparation Workflow\n'));
    
    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim() !== '') {
        console.log(chalk.yellow('⚠️  You have uncommitted changes.'));
        const { proceed } = await inquirer.prompt([{
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to commit them first?',
          default: false
        }]);
        
        if (!proceed) {
          console.log(chalk.blue('Release preparation cancelled.'));
          return;
        }
      }
    } catch (error) {
      console.log(chalk.red('❌ Not in a git repository'));
      return;
    }

    const steps = [
      {
        name: 'Run tests',
        action: async () => {
          console.log(chalk.gray('Running test suite...'));
          execSync('npm test', { stdio: 'pipe' });
        }
      },
      {
        name: 'Format code',
        action: async () => {
          console.log(chalk.gray('Formatting code...'));
          execSync('npm run format', { stdio: 'pipe' });
        }
      },
      {
        name: 'Build Docker image',
        action: async () => {
          console.log(chalk.gray('Building Docker image...'));
          execSync('npm run docker:build', { stdio: 'pipe' });
        }
      },
      {
        name: 'Check version status',
        action: async () => {
          console.log(chalk.gray('Checking version status...'));
          execSync('npm run version:status', { stdio: 'inherit' });
        }
      }
    ];

    console.log(chalk.blue('📋 Pre-release checklist:'));
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      try {
        console.log(`\n${i + 1}. ${step.name}`);
        await step.action();
        console.log(chalk.green(`✅ ${step.name} completed`));
      } catch (error) {
        console.log(chalk.red(`❌ ${step.name} failed`));
        console.log(chalk.gray('Fix the issues and try again.'));
        return;
      }
    }

    console.log(chalk.green.bold('\n🎉 Pre-release checks passed!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(`  ${chalk.cyan('npm run version:bump')} - Interactive version bump`);
    console.log(`  ${chalk.cyan('npm run release')} - Full release workflow`);
    console.log(`  ${chalk.cyan('git push origin main --tags')} - Push to GitHub`);
  }

  /**
   * Clean project
   */
  async cleanProject() {
    console.log(chalk.blue('🧹 Cleaning project...\n'));
    
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'This will remove node_modules, package-lock.json, and Docker images. Continue?',
      default: false
    }]);

    if (!confirm) {
      console.log(chalk.blue('Clean cancelled.'));
      return;
    }

    const cleanTasks = [
      {
        name: 'Removing node_modules',
        action: () => fs.remove('node_modules')
      },
      {
        name: 'Removing package-lock.json',
        action: () => fs.remove('package-lock.json')
      },
      {
        name: 'Cleaning Docker images',
        action: () => execSync('docker image prune -f', { stdio: 'pipe' })
      }
    ];

    for (const task of cleanTasks) {
      try {
        console.log(chalk.gray(`${task.name}...`));
        await task.action();
        console.log(chalk.green(`✅ ${task.name} completed`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  ${task.name} failed or not needed`));
      }
    }

    console.log(chalk.green.bold('\n✅ Project cleaned!'));
    console.log(chalk.blue('Run npm install to reinstall dependencies.'));
  }

  /**
   * Show help
   */
  showHelp() {
    console.log(`
${chalk.cyan.bold('Clean Vibe Workflow Manager')}

Commands:
  npm run workflow:dev        # Start interactive development workflow
  npm run workflow:test       # Run comprehensive test suite
  npm run workflow:release    # Prepare project for release
  npm run workflow:clean      # Clean project files
  npm run workflow:status     # Show project status

Direct script usage:
  node scripts/workflow.js dev       # Development workflow
  node scripts/workflow.js test      # Run tests
  node scripts/workflow.js release   # Release preparation
  node scripts/workflow.js clean     # Clean project
  node scripts/workflow.js status    # Show status

Integration with other tools:
  npm run version:status      # Version management
  npm run release            # Full release workflow
  npm run dev:*              # Development utilities
  npm run docker:*           # Docker operations
`);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (args.includes('--help') || args.includes('-h')) {
    const manager = new WorkflowManager();
    manager.showHelp();
    return;
  }
  
  const manager = new WorkflowManager();
  
  switch (command) {
    case 'dev':
    case 'development':
      await manager.startDevelopment();
      break;
      
    case 'test':
      await manager.runTests();
      break;
      
    case 'release':
      await manager.prepareRelease();
      break;
      
    case 'clean':
      await manager.cleanProject();
      break;
      
    case 'status':
      await manager.showStatus();
      break;
      
    default:
      await manager.showStatus();
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Workflow failed:'), error.message);
    process.exit(1);
  });
}

module.exports = WorkflowManager;
