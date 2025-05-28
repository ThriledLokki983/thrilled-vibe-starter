#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Development workflow script for Clean Vibe
 */

async function runCommand(command, description, optional = false) {
  console.log(chalk.blue(`\n🔄 ${description}...`));
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(chalk.green(`✅ ${description} completed`));
    return true;
  } catch (error) {
    if (optional) {
      console.log(chalk.yellow(`⚠️ ${description} failed (optional)`));
      return true;
    } else {
      console.log(chalk.red(`❌ ${description} failed`));
      return false;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${chalk.cyan.bold('Clean Vibe Development Workflow')}

Usage:
  npm run dev:setup           # Initial development setup
  npm run dev:check           # Pre-commit checks
  npm run dev:test            # Run all tests
  npm run dev:clean           # Clean and reinstall dependencies
  
Commands:
  setup     # Install dependencies, format code, run tests
  check     # Format check, tests, version check
  test      # Run tests with verbose output
  clean     # Clean node_modules and reinstall
  format    # Format all code
  docker    # Build and test Docker image
`);
    return;
  }

  const command = args[0] || 'check';

  console.log(chalk.cyan.bold('🚀 Clean Vibe Development Workflow\n'));

  switch (command) {
    case 'setup':
      console.log(chalk.blue('Setting up development environment...'));
      
      await runCommand('npm install', 'Installing dependencies');
      await runCommand('npm run format', 'Formatting code', true);
      await runCommand('npm test', 'Running tests');
      await runCommand('npm run version:check', 'Checking version status');
      
      console.log(chalk.green.bold('\n🎉 Development setup completed!'));
      console.log(chalk.blue('\nNext steps:'));
      console.log('  • Make your changes');
      console.log('  • Run `npm run dev:check` before committing');
      console.log('  • Use `npm run release` when ready to release');
      break;

    case 'check':
      console.log(chalk.blue('Running pre-commit checks...'));
      
      const formatCheckSuccess = await runCommand('npm run format:check', 'Checking code formatting');
      if (!formatCheckSuccess) {
        console.log(chalk.yellow('💡 Run `npm run format` to fix formatting issues'));
      }
      
      const testSuccess = await runCommand('npm test', 'Running tests');
      await runCommand('npm run version:check', 'Checking version status');
      
      if (formatCheckSuccess && testSuccess) {
        console.log(chalk.green.bold('\n✅ All checks passed! Ready to commit.'));
      } else {
        console.log(chalk.red.bold('\n❌ Some checks failed. Please fix before committing.'));
        process.exit(1);
      }
      break;

    case 'test':
      console.log(chalk.blue('Running comprehensive tests...'));
      
      await runCommand('npm test', 'Running unit tests');
      await runCommand('node index.js --help', 'Testing CLI help', true);
      
      // Test template generation
      console.log(chalk.blue('\n🧪 Testing template access...'));
      try {
        const testScript = `
          const pkg = require('./index.js');
          console.log('Available categories:', pkg.getAvailableCategories().length);
          console.log('Available templates:', pkg.getAvailableTemplates().length);
          console.log('GitHub templates:', pkg.getAvailableTemplates('github').length);
        `;
        execSync(`node -e "${testScript}"`, { stdio: 'inherit' });
        console.log(chalk.green('✅ Template access test passed'));
      } catch (error) {
        console.log(chalk.red('❌ Template access test failed'));
      }
      
      console.log(chalk.green.bold('\n🎉 All tests completed!'));
      break;

    case 'clean':
      console.log(chalk.blue('Cleaning and reinstalling dependencies...'));
      
      const { confirmClean } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmClean',
        message: 'This will delete node_modules and package-lock.json. Continue?',
        default: false
      }]);
      
      if (!confirmClean) {
        console.log(chalk.blue('Clean cancelled.'));
        return;
      }
      
      await runCommand('rm -rf node_modules package-lock.json', 'Removing old dependencies');
      await runCommand('npm install', 'Installing fresh dependencies');
      await runCommand('npm test', 'Verifying installation');
      
      console.log(chalk.green.bold('\n🧹 Clean installation completed!'));
      break;

    case 'format':
      await runCommand('npm run format', 'Formatting all code');
      console.log(chalk.green.bold('\n💅 Code formatting completed!'));
      break;

    case 'docker':
      console.log(chalk.blue('Testing Docker functionality...'));
      
      await runCommand('npm run docker:build', 'Building Docker image');
      await runCommand('npm run docker:test', 'Testing Docker image');
      
      console.log(chalk.blue('\n🐳 Docker test completed!'));
      console.log(chalk.gray('To run interactively: npm run docker:run'));
      break;

    default:
      console.log(chalk.red(`Unknown command: ${command}`));
      console.log(chalk.blue('Run with --help to see available commands'));
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Development workflow failed:'), error.message);
    process.exit(1);
  });
}
