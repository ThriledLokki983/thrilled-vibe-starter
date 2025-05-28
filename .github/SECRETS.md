# Repository Secrets Configuration

This document outlines the required secrets for GitHub Actions workflows in this repository.

## Required Secrets

### NPM Publishing
- **NPM_TOKEN**: Token for publishing to npm registry
  - Go to [npm.com](https://www.npmjs.com) → Account → Access Tokens
  - Create a new "Automation" token with "Read and write" permissions
  - Add to GitHub: Repository Settings → Secrets and variables → Actions → New repository secret

### Docker Hub Publishing
- **DOCKERHUB_USERNAME**: Your Docker Hub username
- **DOCKERHUB_TOKEN**: Docker Hub access token
  - Go to [Docker Hub](https://hub.docker.com) → Account Settings → Security → Access Tokens
  - Create a new token with "Read, Write, Delete" permissions
  - Add both username and token to GitHub secrets

### GitHub Operations
- **FINEGRAIN_TOKEN**: Fine-grained GitHub personal access token
  - **Important**: Cannot use `GITHUB_TOKEN` as secret name (reserved by GitHub)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
  - Create a new token with the following repository permissions:
    - Contents: Read and write (for creating releases)
    - Metadata: Read (for repository information)
    - Pull requests: Read (for PR operations)
    - Actions: Read (for workflow operations)
    - Packages: Write (for container registry access)
    - Security events: Write (for security scanning)
  - Set expiration date (recommended: 1 year)
  - Add to GitHub: Repository Settings → Secrets and variables → Actions → New repository secret

### Security Scanning (Optional)
- **SNYK_TOKEN**: Token for Snyk vulnerability scanning
  - Sign up at [snyk.io](https://snyk.io)
  - Go to Account Settings → General → Auth Token
  - Copy token and add to GitHub secrets

- **GITLEAKS_LICENSE**: License for GitLeaks secret scanning (optional)
  - Only needed for enterprise features
  - Can be left empty for basic secret detection

## How to Add Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Environment Variables

The following environment variables are used in workflows but don't require secrets:

- `REGISTRY`: Container registry (defaults to ghcr.io)
- `IMAGE_NAME`: Docker image name (auto-generated from repository name)
- `NODE_ENV`: Node environment (set to production in Docker)
- `OUTPUT_DIR`: Output directory for Docker container (set to /output)

## Workflow Permissions

Ensure your repository has the following permissions enabled:

1. **Settings** → **Actions** → **General**
2. Set "Workflow permissions" to:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

3. **Settings** → **Code security and analysis**
   - ✅ Enable Dependency graph
   - ✅ Enable Dependabot alerts
   - ✅ Enable Dependabot security updates
   - ✅ Enable Code scanning (CodeQL)
   - ✅ Enable Secret scanning

## Testing Workflows

After setting up secrets, you can test the workflows:

1. **CI Workflow**: Automatically runs on push/PR to main branch
2. **Release Workflow**: 
   - Create a release on GitHub, or
   - Run manually: Actions → Release → Run workflow
3. **Security Scanning**: Runs daily and on push/PR
4. **PR Checks**: Automatically runs on pull requests

## Troubleshooting

### Common Issues

1. **NPM Publish Fails**: 
   - Verify NPM_TOKEN has correct permissions
   - Check if package name is available on npm
   - Ensure version in package.json is incremented

2. **Docker Push Fails**:
   - Verify DOCKERHUB_USERNAME and DOCKERHUB_TOKEN are correct
   - Check if repository exists on Docker Hub
   - Ensure token has write permissions

3. **Security Scans Fail**:
   - SNYK_TOKEN is optional - workflows will continue without it
   - Check if repository has CodeQL enabled
   - Verify workflow permissions are set correctly

### Manual Testing

Test Docker image locally:
```bash
# Build image
docker build -t clean-vibe:test .

# Run container
docker run --rm -v $(pwd)/output:/output clean-vibe:test

# Test with specific command
docker run --rm clean-vibe:test --version
```

Test npm package locally:
```bash
# Pack without publishing
npm pack

# Install locally
npm install -g ./thrilled-clean-vibe-*.tgz

# Test CLI
clean-vibe --help
```
