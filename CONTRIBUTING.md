# Contributing to Clean Vibe

Thank you for your interest in contributing to Clean Vibe! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be collaborative**: Work together constructively
- **Be patient**: Help others learn and grow

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git
- Docker (optional, for testing Docker functionality)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/thrilled-vibe-starter.git
   cd thrilled-vibe-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

4. **Test the CLI locally**
   ```bash
   # Test basic functionality
   node index.js --help
   
   # Test template generation
   node index.js
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug reports and fixes**
- ✨ **New features and enhancements**
- 📝 **Documentation improvements**
- 🎨 **New templates or template improvements**
- 🔧 **CI/CD and workflow improvements**
- 🧪 **Tests and test coverage**

### Areas for Contribution

1. **New Templates**
   - Frontend frameworks (Vue, Angular, Svelte, etc.)
   - Backend frameworks (FastAPI, Spring Boot, etc.)
   - Mobile frameworks (React Native, Flutter)
   - DevOps templates (Kubernetes, Terraform)

2. **Enhanced Features**
   - Interactive template selection
   - Template customization options
   - Better error handling
   - Performance improvements

3. **Documentation**
   - README improvements
   - Template documentation
   - Usage examples
   - Video tutorials

## Pull Request Process

### Before You Start

1. **Check existing issues** to see if your idea is already being worked on
2. **Open an issue** for discussion before starting major features
3. **Fork the repository** and create a feature branch

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test thoroughly**
   ```bash
   npm test
   npm run format:check
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new React template with TypeScript"
   # or
   git commit -m "fix: resolve CLI argument parsing issue"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Requirements

- ✅ All tests pass
- ✅ Code is properly formatted
- ✅ Documentation is updated
- ✅ Clear description of changes
- ✅ Linked to relevant issues

### PR Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** on multiple platforms
4. **Approval** and merge

## Issue Guidelines

### Bug Reports

Please include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Node.js version, etc.)
- **Error messages** or screenshots if applicable

**Template:**
```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Run `clean-vibe`
2. Select 'react' template
3. Error occurs...

## Expected Behavior
What should have happened.

## Environment
- OS: macOS/Windows/Linux
- Node.js: 18.x
- Package version: 1.0.0
```

### Feature Requests

Please include:

- **Clear description** of the proposed feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Examples** or mockups if applicable

## Coding Standards

### JavaScript/Node.js

- Use **ES6+ features** where appropriate
- Follow **ESLint** configuration (when added)
- Use **Prettier** for code formatting
- Write **clear, descriptive variable names**
- Add **JSDoc comments** for functions

### Code Structure

```javascript
/**
 * Brief description of function
 * @param {string} templateName - Name of the template
 * @param {Object} options - Configuration options
 * @returns {Promise<boolean>} Success status
 */
async function generateTemplate(templateName, options) {
  // Implementation
}
```

### File Organization

- **Templates**: Place in appropriate category folder
- **Tests**: Mirror the structure of source files
- **Documentation**: Keep close to related code
- **Utilities**: Use clear, reusable functions

## Testing

### Test Requirements

- **Unit tests** for new functions
- **Integration tests** for CLI functionality
- **Template tests** for new templates
- **Maintain 80%+ coverage** where possible

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test
npm test -- --grep "template generation"
```

### Writing Tests

```javascript
// Example test structure
describe('Template Generation', () => {
  it('should generate React template successfully', async () => {
    const result = await generateTemplate('react', { typescript: true });
    expect(result).toBe(true);
  });
});
```

## Documentation

### Documentation Standards

- **Clear and concise** explanations
- **Code examples** for all features
- **Keep up-to-date** with changes
- **Include screenshots** where helpful

### Template Documentation

Each template should include:

```markdown
# Template Name

## Description
Brief description of what this template provides.

## Features
- Feature 1
- Feature 2

## Usage
Instructions for using the template.

## Customization
How to customize the template.

## Dependencies
Required dependencies and versions.
```

## Getting Help

### Community Support

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord/Slack**: (if available) For real-time chat

### Maintainer Contact

- **GitHub**: @ThriledLokki983
- **Issues**: Primary communication method

## Recognition

Contributors will be:

- **Listed in README.md** contributors section
- **Mentioned in release notes** for significant contributions
- **Credited in commit messages** and PR descriptions

## Development Tips

### Adding New Templates

1. **Create template directory** under appropriate category
2. **Add instructions.md** with clear documentation
3. **Include template files** if needed
4. **Update main index.js** to include new template
5. **Add tests** for the new template
6. **Update README.md** with new template info

### Testing Docker Functionality

```bash
# Build and test Docker image
npm run docker:build
npm run docker:test

# Test with volume mounting
docker run --rm -v $(pwd)/output:/output clean-vibe:latest
```

### Local Development

```bash
# Install globally for testing
npm link

# Test globally installed version
clean-vibe --help

# Unlink when done
npm unlink
```

## Release Process

Releases are automated through GitHub Actions:

1. **Version bump** using `npm version patch|minor|major`
2. **Push tags** to trigger release workflow
3. **Automated publishing** to npm and Docker Hub
4. **Release notes** generated automatically

---

Thank you for contributing to Clean Vibe! Your efforts help make this tool better for everyone. 🚀
