#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const TEMPLATE_STRUCTURE = {
  'fe': {
    name: 'Frontend',
    description: 'Frontend application templates',
    children: {
      'react': {
        name: 'React',
        description: 'React with TypeScript, React Query, Zustand, React Router DOM, CSS Modules, React Aria, and Yarn',
        source: 'templates/fe/react/instructions.md'
      },
      'vanilla': {
        name: 'Vanilla JavaScript',
        description: 'Vanilla JavaScript/TypeScript with Vite, modern CSS, and accessibility features',
        source: 'templates/fe/vanilla/instructions.md'
      }
    }
  },
  'be': {
    name: 'Backend',
    description: 'Backend API templates',
    children: {
      'node-express': {
        name: 'Node.js + Express',
        description: 'Node.js Express API with TypeScript, Prisma, PostgreSQL, Redis, and JWT authentication',
        source: 'templates/be/node-express/instructions.md'
      },
      'python-django': {
        name: 'Python + Django',
        description: 'Django REST API with PostgreSQL, Redis, Celery, and JWT authentication',
        source: 'templates/be/python-django/instructions.md'
      }
    }
  },
  'github': {
    name: 'GitHub',
    description: 'GitHub repository setup templates',
    children: {
      'workflows': {
        name: 'GitHub Workflows',
        description: 'Complete GitHub Actions workflows for CI/CD, testing, and automation',
        source: 'templates/github/workflows/instructions.md'
      }
    }
  }
};

async function main() {
  console.log(chalk.blue('🚀 Clean Vibe - PRD Generator\n'));
  console.log(chalk.gray('Generate comprehensive instructions for AI agents to build well-structured applications.\n'));
  
  
  // Step 1: Select category (fe or be)
  const categoryChoices = Object.keys(TEMPLATE_STRUCTURE).map(key => ({
    name: `${TEMPLATE_STRUCTURE[key].name} - ${TEMPLATE_STRUCTURE[key].description}`,
    value: key
  }));

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Select a category:',
      choices: categoryChoices
    }
  ]);

  // Step 2: Select specific template within category
  const selectedCategory = TEMPLATE_STRUCTURE[category];
  const templateChoices = Object.keys(selectedCategory.children).map(key => ({
    name: `${selectedCategory.children[key].name} - ${selectedCategory.children[key].description}`,
    value: key
  }));

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: `Select a ${selectedCategory.name.toLowerCase()} template:`,
      choices: templateChoices
    }
  ]);

  const selectedTemplate = selectedCategory.children[template];
  const sourcePath = path.join(__dirname, selectedTemplate.source);
  const targetPath = path.join(process.cwd(), '.github/instructions.md');

  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Template file not found: ${selectedTemplate.source}`);
    }

    // Ensure .github directory exists
    const githubDir = path.dirname(targetPath);
    await fs.ensureDir(githubDir);

    // Copy instructions file
    await fs.copy(sourcePath, targetPath);

    console.log(chalk.green(`✅ Successfully copied ${selectedTemplate.name} instructions to .github/instructions.md`));
    console.log(chalk.yellow(`\nNext steps:`));
    console.log(chalk.white(`1. Review the instructions in .github/instructions.md`));
    console.log(chalk.white(`2. Share this file with your AI agent`));
    console.log(chalk.white(`3. The AI agent will use these instructions to create your ${category === 'fe' ? 'frontend' : 'backend'} project\n`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error copying instructions:'), error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = {
  generatePRD: async (category, template, targetDir = process.cwd()) => {
    if (!TEMPLATE_STRUCTURE[category]) {
      throw new Error(`Category "${category}" not found`);
    }
    
    if (!TEMPLATE_STRUCTURE[category].children[template]) {
      throw new Error(`Template "${template}" not found in category "${category}"`);
    }

    const selectedTemplate = TEMPLATE_STRUCTURE[category].children[template];
    const sourcePath = path.join(__dirname, selectedTemplate.source);
    const targetPath = path.join(targetDir, '.github/instructions.md');

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Template file not found: ${selectedTemplate.source}`);
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);
    
    return targetPath;
  },
  
  getAvailableCategories: () => Object.keys(TEMPLATE_STRUCTURE),
  
  getAvailableTemplates: (category) => {
    if (!category) {
      // Return all templates in format category/template
      const allTemplates = [];
      Object.keys(TEMPLATE_STRUCTURE).forEach(cat => {
        Object.keys(TEMPLATE_STRUCTURE[cat].children).forEach(temp => {
          allTemplates.push(`${cat}/${temp}`);
        });
      });
      return allTemplates;
    }
    
    if (!TEMPLATE_STRUCTURE[category]) {
      throw new Error(`Category "${category}" not found`);
    }
    
    return Object.keys(TEMPLATE_STRUCTURE[category].children);
  },
  
  getTemplateInfo: (category, template) => {
    if (!TEMPLATE_STRUCTURE[category] || !TEMPLATE_STRUCTURE[category].children[template]) {
      return null;
    }
    
    return {
      category: TEMPLATE_STRUCTURE[category].name,
      template: TEMPLATE_STRUCTURE[category].children[template].name,
      description: TEMPLATE_STRUCTURE[category].children[template].description,
      source: TEMPLATE_STRUCTURE[category].children[template].source
    };
  }
};

// Run CLI if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Unexpected error:'), error);
    process.exit(1);
  });
}
