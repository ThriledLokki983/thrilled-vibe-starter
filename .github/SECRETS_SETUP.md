# 🔐 GitHub Secrets Setup Guide

This guide helps you configure the required GitHub repository secrets for automated publishing to npm and Docker Hub.

## 📍 Where to Add Secrets

Go to your repository settings:
**https://github.com/ThriledLokki983/thrilled-vibe-starter/settings/secrets/actions**

## 🔑 Required Secrets

### 1. NPM_TOKEN
**Purpose:** Publish packages to npm registry

**Setup:**
1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token" 
3. Choose "Granular Access Token" (recommended) or "Classic Token"
4. For Granular Access Token:
   - **Expiration:** Set to desired duration (e.g., 1 year)
   - **Scope:** Select your packages or organizations
   - **Permissions:** 
     - Packages and scopes: **Read and write**
5. For Classic Token:
   - **Type:** Choose "Automation" 
6. Copy the token
7. Add to GitHub secrets as `NPM_TOKEN`

### 2. DOCKERHUB_USERNAME
**Purpose:** Your Docker Hub username for authentication

**Setup:**
1. This is simply your Docker Hub username (e.g., `thriledlokki983`)
2. Add to GitHub secrets as `DOCKERHUB_USERNAME`

### 3. DOCKERHUB_TOKEN
**Purpose:** Authenticate with Docker Hub for pushing images

**Setup:**
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. **Description:** GitHub Actions for thrilled-vibe-starter
4. **Permissions:** Read, Write, Delete (or Read & Write minimum)
5. Click "Generate"
6. Copy the token (you won't see it again!)
7. Add to GitHub secrets as `DOCKERHUB_TOKEN`

### 4. FINEGRAIN_TOKEN
**Purpose:** GitHub Container Registry authentication and GitHub API access

**Setup:**
1. Go to https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. **Token name:** thrilled-vibe-starter-actions
4. **Expiration:** Set to desired duration (e.g., 1 year)
5. **Repository access:** 
   - Select "Selected repositories"
   - Choose `ThriledLokki983/thrilled-vibe-starter`
6. **Permissions:**
   - **Repository permissions:**
     - Contents: **Read and write**
     - Metadata: **Read**
     - Pull requests: **Read**
     - Actions: **Read**
   - **Account permissions:**
     - Git SSH keys: **Read** (if needed)
7. Click "Generate token"
8. Copy the token
9. Add to GitHub secrets as `FINEGRAIN_TOKEN`

## 📋 Alternative: Classic Personal Access Token

If you prefer using a classic token for `FINEGRAIN_TOKEN`:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. **Note:** thrilled-vibe-starter-actions
4. **Expiration:** Set to desired duration
5. **Scopes:** Select:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `write:packages` (Upload packages to GitHub Package Registry)
   - ✅ `read:packages` (Download packages from GitHub Package Registry)
6. Generate and copy the token
7. Add to GitHub secrets as `FINEGRAIN_TOKEN`

## ✅ Verification

After adding all secrets, you can verify the setup by:

1. **Check secrets are added:**
   - Go to repository settings → Secrets and variables → Actions
   - You should see all 4 secrets listed

2. **Test the workflow:**
   - Run: `npm run publish patch`
   - Or manually trigger the release workflow from GitHub Actions

3. **Monitor the workflow:**
   - Go to https://github.com/ThriledLokki983/thrilled-vibe-starter/actions
   - Watch the release workflow execution

## 🚨 Security Best Practices

1. **Token Expiration:** Set reasonable expiration dates for all tokens
2. **Minimal Permissions:** Only grant necessary permissions
3. **Regular Rotation:** Rotate tokens periodically
4. **Monitor Usage:** Check GitHub's token usage in settings
5. **Revoke if Compromised:** Immediately revoke and regenerate if tokens are exposed

## 🔧 Troubleshooting

### Common Issues:

1. **403 Forbidden (npm):** NPM_TOKEN lacks publish permissions
2. **403 Forbidden (GHCR):** FINEGRAIN_TOKEN lacks packages permissions  
3. **Authentication failed (Docker Hub):** DOCKERHUB_TOKEN is incorrect
4. **Repository not found:** Check repository name and token permissions

### Debug Steps:

1. **Check token validity:** Test tokens manually with CLI tools
2. **Verify permissions:** Ensure tokens have required scopes
3. **Check expiration:** Tokens might have expired
4. **Repository access:** Ensure fine-grained tokens have repository access

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly named and added
3. Test tokens manually using CLI tools (npm, docker, gh)
4. Regenerate tokens if they seem to be invalid

Once all secrets are configured, the automated publishing will work seamlessly! 🚀
