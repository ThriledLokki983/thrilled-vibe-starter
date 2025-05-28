# Thrilled Vibe Starter

A PRD (Product Requirements Document) generator that provides AI agents with comprehensive instructions for creating well-structured frontend applications.

## Overview

This package generates detailed instructions files that AI agents can use to build consistent, high-quality frontend applications. Instead of providing boilerplate code, it provides comprehensive guidelines that AI agents can follow to create projects tailored to specific requirements.

## Installation

### Global Installation (Recommended)
```bash
npm install -g thrilled-vibe-starter
```

### Local Project Installation
```bash
npm install thrilled-vibe-starter
```

## Usage

### CLI Usage

After global installation, you can run:
```bash
thrilled-vibe
```

This will prompt you to select a template and automatically copy the instructions to your project's `.github` folder.

### Programmatic Usage

```javascript
const { generatePRD, getAvailableCategories, getAvailableTemplates, getTemplateInfo } = require('thrilled-vibe-starter');

// Get available categories
const categories = getAvailableCategories();
console.log(categories); // ['fe', 'be']

// Get available templates in a category
const feTemplates = getAvailableTemplates('fe');
console.log(feTemplates); // ['react', 'vanilla']

// Get all templates in format category/template
const allTemplates = getAvailableTemplates();
console.log(allTemplates); // ['fe/react', 'fe/vanilla', 'be/node-express', 'be/python-django', 'github/workflows']

// Get template information
const templateInfo = getTemplateInfo('fe', 'react');
console.log(templateInfo);
/* Output:
{
  category: 'Frontend',
  template: 'React',
  description: 'React with TypeScript, React Query, Zustand, React Router DOM, CSS Modules, React Aria, and Yarn',
  source: 'templates/fe/react/instructions.md'
}
*/

// Generate PRD instructions
await generatePRD('fe', 'react', '/path/to/project');
```

## Available Templates

### Frontend Templates (`fe`)

#### `react`
**React Frontend with Modern Stack**

Generates comprehensive instructions for building React applications with:
- **React 18+** with TypeScript
- **React Query** for server state management
- **Zustand** for client state management
- **React Router DOM** for routing
- **CSS Modules** for styling
- **React Aria** for accessibility
- **Yarn** for package management
- **HuisHelder** design system

#### `vanilla`
**Vanilla JavaScript/TypeScript Frontend**

Generates comprehensive instructions for building vanilla JavaScript applications with:
- **TypeScript** for type safety
- **Vite** for build tooling
- **Modern CSS** with Grid, Flexbox, and custom properties
- **PostCSS** for CSS processing
- **ESLint** and **Prettier** for code quality
- **HuisHelder** design system

### Backend Templates (`be`)

#### `node-express`
**Node.js Express API**

Generates comprehensive instructions for building Node.js APIs with:
- **Express.js** web framework
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **Redis** for caching
- **JWT** authentication
- **Swagger** API documentation
- **Docker** containerization

#### `python-django`
**Python Django REST API**

Generates comprehensive instructions for building Django APIs with:
- **Django REST Framework**
- **PostgreSQL** database
- **Redis** for caching
- **Celery** for background tasks
- **JWT** authentication
- **Poetry** for dependency management
- **Docker** containerization

### GitHub Templates (`github`)

#### `workflows`
**GitHub Actions Workflows**

Generates comprehensive instructions for setting up GitHub Actions workflows including:
- **CI/CD Pipelines** - Automated testing, building, and deployment
- **Security Scanning** - CodeQL, dependency scanning, secret detection
- **Quality Checks** - ESLint, Prettier, type checking, test coverage
- **Automated Updates** - Dependabot configuration, security updates
- **Release Automation** - Semantic versioning, changelog generation, npm publishing
- **Branch Protection** - Pull request validation, required status checks
- **Issue Templates** - Bug reports, feature requests, pull request templates
- **Deployment Workflows** - Multi-environment deployments (staging, production)
- **Performance Monitoring** - Lighthouse CI, bundle size analysis
- **Repository Configuration** - CODEOWNERS, dependabot.yml, branch protection rules

The instructions include:
- Complete tech stack setup
- Project structure guidelines
- Implementation patterns and best practices
- Security configurations
- Testing strategies
- Deployment instructions
- Code quality standards and checklist

## How It Works

1. **Select Template**: Choose from available frontend/backend templates
2. **Generate Instructions**: The tool copies detailed instructions to `.github/instructions.md`
3. **AI Integration**: Share the instructions file with your AI agent
4. **Project Creation**: The AI agent uses the guidelines to build your project

## Why Instructions Instead of Boilerplate?

- **Flexibility**: AI agents can adapt instructions to specific requirements
- **Consistency**: Ensures all projects follow the same patterns and standards
- **Maintainability**: Easier to update guidelines than maintain multiple boilerplate projects
- **Customization**: AI can make intelligent decisions based on project context

## Generated File Structure

After running the tool, you'll have:
```
your-project/
├── .github/
│   └── instructions.md    # Comprehensive build instructions for AI
└── (your existing files)
```

## Integration with AI Agents

The generated `instructions.md` file is designed to be shared with AI development agents like:
- GitHub Copilot
- Claude
- ChatGPT
- Custom AI development assistants

Simply include the instructions file in your prompt or conversation context.

## Version Management

Clean Vibe includes a comprehensive version management system with smart release automation:

### Quick Start
```bash
# Check version status and get smart suggestions
npm run version:status

# Create a quick patch release
npm run version:patch "Fix critical bug"

# Interactive version bump with full options
npm run version:bump

# View complete version history
npm run version:history
```

### Features
- **🤖 Smart Suggestions**: Analyzes commits to suggest appropriate version bumps
- **📊 Status Dashboard**: Comprehensive overview of version status and history
- **🏷️ Automated Tagging**: Creates git tags with detailed release information
- **📚 Enhanced Changelog**: Generates categorized changelog with commit links
- **🔍 Version History**: Tracks complete release history with analytics

### Available Commands
- `npm run version:status` - Show version dashboard
- `npm run version:suggest` - Get smart version suggestion  
- `npm run version:patch "description"` - Quick patch release
- `npm run version:bump` - Interactive version bump
- `npm run version:history` - Show version history
- `npm run release` - Full release workflow with CI/CD

For detailed documentation, see [Version Management Guide](docs/VERSION_MANAGEMENT.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new templates in the `templates/` directory
4. Update the `TEMPLATES` object in `index.js`
5. Submit a pull request

## Template Structure

```
templates/
├── fe/
│   └── react/
│       └── instructions.md
└── be/
    └── (future backend templates)
```

## License

MIT

## Repository

[GitHub Repository](https://github.com/ThriledLokki983/thrilled-vibe-starter)

## Issues

[Report Issues](https://github.com/ThriledLokki983/thrilled-vibe-starter/issues)
