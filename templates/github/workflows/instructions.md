# GitHub Workflows Development Instructions

## Project Overview
Create a comprehensive GitHub Actions workflow setup for modern development projects with CI/CD, automated testing, security scanning, and deployment pipelines.

## Technology Stack

### Core GitHub Actions
- **GitHub Actions** - CI/CD automation platform
- **Node.js Actions** - For Node.js/JavaScript projects
- **Docker Actions** - For containerized applications
- **Security Actions** - CodeQL, dependency scanning
- **Deployment Actions** - Various cloud providers

### Testing & Quality
- **Jest/Vitest** - Testing frameworks
- **ESLint/Prettier** - Code quality and formatting
- **CodeQL** - Security scanning
- **Dependabot** - Dependency updates
- **Codecov** - Code coverage reporting

### Deployment Targets
- **Vercel** - Frontend deployments
- **Netlify** - Static site deployments
- **AWS** - Cloud infrastructure
- **Docker Hub** - Container registry
- **npm** - Package publishing

## Workflow Structure

```
.github/
├── workflows/
│   ├── ci.yml                    # Continuous Integration
│   ├── cd.yml                    # Continuous Deployment
│   ├── pr-check.yml              # Pull Request checks
│   ├── release.yml               # Release automation
│   ├── security.yml              # Security scanning
│   ├── dependency-update.yml     # Dependency management
│   └── cleanup.yml               # Cleanup workflows
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
├── PULL_REQUEST_TEMPLATE.md
├── CODEOWNERS
└── dependabot.yml
```

## Core Workflow Files

### 1. Continuous Integration (ci.yml)
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  test:
    name: Test & Build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts-${{ matrix.node-version }}
          path: |
            dist/
            build/
          retention-days: 7

  audit:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=moderate

      - name: Check for vulnerabilities
        run: npx audit-ci --moderate
```

### 2. Pull Request Checks (pr-check.yml)
```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  pr-validation:
    name: PR Validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate PR title
        uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Check for breaking changes
        run: |
          git fetch origin main
          npx @changesets/cli status --since=origin/main

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Comment coverage report
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          recreate: true
          path: coverage/lcov-report/index.html

  size-check:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Analyze bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Security Scanning (security.yml)
```yaml
name: Security

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM

jobs:
  codeql:
    name: CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript', 'typescript' ]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  dependency-scan:
    name: Dependency Scanning
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run secret detection
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
```

### 4. Release Automation (release.yml)
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Generate changelog
        id: changelog
        run: |
          npx conventional-changelog-cli -p angular -i CHANGELOG.md -s
          echo "CHANGELOG<<EOF" >> $GITHUB_OUTPUT
          cat CHANGELOG.md >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.CHANGELOG }}
          draft: false
          prerelease: false

      - name: Publish to npm
        run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  docker:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: your-org/your-app
          tags: |
            type=ref,event=tag
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 5. Continuous Deployment (cd.yml)
```yaml
name: CD

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          NODE_ENV: staging
          REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          STAGING_URL: ${{ steps.deploy.outputs.preview-url }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production
          REACT_APP_API_URL: ${{ secrets.PRODUCTION_API_URL }}

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 6. Dependency Updates (dependency-update.yml)
```yaml
name: Dependency Updates

on:
  schedule:
    - cron: '0 10 * * MON'  # Every Monday at 10 AM
  workflow_dispatch:

jobs:
  update-dependencies:
    name: Update Dependencies
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.PAT_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install npm-check-updates
        run: npm install -g npm-check-updates

      - name: Update dependencies
        run: |
          ncu -u
          npm install

      - name: Run tests
        run: npm test

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.PAT_TOKEN }}
          commit-message: 'chore: update dependencies'
          title: 'chore: weekly dependency updates'
          body: |
            This PR updates dependencies to their latest versions.
            
            Please review the changes and ensure all tests pass.
          branch: dependency-updates
          delete-branch: true
```

### 7. Cleanup Workflows (cleanup.yml)
```yaml
name: Cleanup

on:
  schedule:
    - cron: '0 2 * * SUN'  # Every Sunday at 2 AM
  workflow_dispatch:

jobs:
  cleanup-artifacts:
    name: Cleanup Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Delete old artifacts
        uses: c-hive/gha-remove-artifacts@v1
        with:
          age: '7 days'
          skip-tags: true
          skip-recent: 5

  cleanup-caches:
    name: Cleanup Caches
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup old caches
        run: |
          gh api \
            --method GET \
            -H "Accept: application/vnd.github+json" \
            /repos/${{ github.repository }}/actions/caches \
            --jq '.actions_caches[] | select(.created_at < (now - 604800)) | .id' \
            | xargs -I {} gh api \
              --method DELETE \
              -H "Accept: application/vnd.github+json" \
              /repos/${{ github.repository }}/actions/caches/{}
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Repository Configuration Files

### 1. Dependabot Configuration (dependabot.yml)
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "10:00"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    assignees:
      - "your-username"
    commit-message:
      prefix: "chore"
      include: "scope"
    labels:
      - "dependencies"
      - "automated"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "ci"
    labels:
      - "github-actions"
      - "automated"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "docker"
    labels:
      - "docker"
      - "automated"
```

### 2. CODEOWNERS
```
# Global owners
* @your-username @team-leads

# Frontend specific
/src/components/ @frontend-team
/src/pages/ @frontend-team
/src/styles/ @ui-team

# Backend specific
/api/ @backend-team
/server/ @backend-team
/database/ @backend-team @db-admin

# DevOps and CI/CD
/.github/ @devops-team
/docker/ @devops-team
/k8s/ @devops-team

# Documentation
/docs/ @tech-writers
README.md @tech-writers
```

### 3. Bug Report Template (ISSUE_TEMPLATE/bug_report.md)
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]

## Additional Context
Add any other context about the problem here.

## Possible Solution
If you have suggestions on how to fix the bug, please describe them here.
```

### 4. Feature Request Template (ISSUE_TEMPLATE/feature_request.md)
```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
Is your feature request related to a problem? Please describe.
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternative Solutions
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Priority
- [ ] Low
- [ ] Medium
- [ ] High
- [ ] Critical
```

### 5. Pull Request Template (PULL_REQUEST_TEMPLATE.md)
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Fixes #(issue number)

## Changes Made
- List of changes made
- Another change
- Yet another change

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Testing
- [ ] Tests pass locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have performed a self-review of my own code

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Additional Notes
Any additional information or context about the PR.
```

## Environment Setup

### Required Secrets
Add these secrets to your GitHub repository settings:

#### Basic Secrets
```bash
# npm publishing
NPM_TOKEN=your_npm_token

# Docker Hub
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# Vercel deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# API URLs
STAGING_API_URL=https://api-staging.yourapp.com
PRODUCTION_API_URL=https://api.yourapp.com

# Notifications
SLACK_WEBHOOK=your_slack_webhook_url

# For dependency updates
PAT_TOKEN=your_personal_access_token

# Code coverage
CODECOV_TOKEN=your_codecov_token
```

#### Cloud Provider Secrets (if using)
```bash
# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1

# Azure
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id

# Google Cloud
GCP_SA_KEY=your_gcp_service_account_key
```

### Branch Protection Rules
Configure these branch protection rules for `main`:

1. **Require pull request reviews before merging**
   - Required approving reviews: 1
   - Dismiss stale reviews when new commits are pushed
   - Require review from code owners

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Required status checks:
     - `Test & Build`
     - `Security Audit`
     - `PR Validation`

3. **Require signed commits**

4. **Require linear history**

5. **Include administrators**

## Advanced Features

### 1. Automated Security Updates
```yaml
# .github/workflows/security-updates.yml
name: Security Updates

on:
  schedule:
    - cron: '0 4 * * TUE'
  workflow_dispatch:

jobs:
  security-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security updates
        run: |
          npm audit fix
          npm test
      - name: Create security PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'security: automated security updates'
          body: 'Automated security vulnerability fixes'
          branch: security-updates
```

### 2. Performance Monitoring
```yaml
# .github/workflows/performance.yml
name: Performance

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.js'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 3. Auto-merge for Dependabot
```yaml
# .github/workflows/auto-merge.yml
name: Auto Merge

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - name: Auto-merge Dependabot PRs
        uses: ahmadnassri/action-dependabot-auto-merge@v2
        with:
          target: minor
          github-token: ${{ secrets.PAT_TOKEN }}
```

## Quality Checklist

### Workflow Quality
- [ ] All workflows have proper error handling
- [ ] Secrets are properly configured and not exposed
- [ ] Matrix builds cover supported Node.js versions
- [ ] Proper caching strategies implemented
- [ ] Workflow permissions follow least privilege principle

### Security
- [ ] CodeQL scanning enabled
- [ ] Dependency scanning configured
- [ ] Secret scanning enabled
- [ ] Branch protection rules configured
- [ ] Signed commits required

### Performance
- [ ] Efficient use of GitHub Actions minutes
- [ ] Proper artifact cleanup
- [ ] Cache optimization implemented
- [ ] Parallel job execution where possible

### Monitoring
- [ ] Proper logging and error reporting
- [ ] Notification systems configured
- [ ] Performance monitoring in place
- [ ] Deployment status tracking

### Documentation
- [ ] Clear issue and PR templates
- [ ] CODEOWNERS file maintained
- [ ] Workflow documentation complete
- [ ] Setup instructions provided

This comprehensive GitHub workflows setup ensures robust CI/CD, security scanning, automated testing, and deployment pipelines for modern development projects.
