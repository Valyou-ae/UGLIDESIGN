# GitHub Actions CI/CD Setup Guide

This document explains how to set up and configure the GitHub Actions CI/CD pipeline for UGLIDESIGN.

## Overview

The CI/CD pipeline consists of 4 workflows:

1. **ci-cd.yml** - Main CI/CD pipeline (testing, building, deployment)
2. **pr-validation.yml** - Pull request validation and automated review
3. **dependency-updates.yml** - Automated dependency updates and security checks
4. **nightly-tests.yml** - Comprehensive nightly test suite

---

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Production Environment Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DATABASE_URL` | Production database connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Express session secret key | Random 64-character string |
| `REPLIT_API_TOKEN` | Replit API token for deployments | Get from Replit account settings |
| `SLACK_WEBHOOK` | Slack webhook URL for notifications | `https://hooks.slack.com/services/...` |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID | `Ugli` |
| `R2_ACCESS_KEY_ID` | R2 access key | Your R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | Your R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name | `uglidesign-images` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `STRIPE_SECRET_KEY` | Stripe secret key | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | From Stripe webhook settings |

### Optional Secrets

| Secret Name | Description |
|------------|-------------|
| `CODECOV_TOKEN` | Codecov token for coverage reports |
| `SENTRY_DSN` | Sentry DSN for error tracking |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for releases |

---

## Workflow Triggers

### ci-cd.yml

**Triggers:**
- Push to `main` branch → Deploy to production
- Push to `develop` branch → Deploy to staging
- Pull requests to `main` or `develop` → Run tests

**Jobs:**
1. Code Quality - TypeScript check, linting
2. Unit Tests - Fast unit tests with coverage
3. Integration Tests - API tests with test database
4. Security Audit - npm audit, secret scanning
5. Build - Build application artifacts
6. Deploy Staging - Deploy to staging environment (develop branch)
7. Deploy Production - Deploy to production (main branch)

### pr-validation.yml

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
1. Validate PR - Check title format, size
2. Quick Tests - Fast type check and unit tests
3. Breaking Changes - Detect schema/API changes
4. Code Review - Automated code review comments

### dependency-updates.yml

**Triggers:**
- Schedule: Every Monday at 9 AM UTC
- Manual: workflow_dispatch

**Jobs:**
1. Check Updates - Find outdated packages
2. Security Check - Run npm audit
3. Auto Update - Create PR with patch updates

### nightly-tests.yml

**Triggers:**
- Schedule: Every day at 2 AM UTC
- Manual: workflow_dispatch

**Jobs:**
1. Full Test Suite - All tests with coverage
2. Performance Tests - Benchmark performance
3. Migration Tests - Test database migrations
4. Vulnerability Scan - Trivy security scan
5. Report - Generate summary report

---

## Setup Steps

### 1. Enable GitHub Actions

1. Go to repository `Settings > Actions > General`
2. Enable "Allow all actions and reusable workflows"
3. Enable "Read and write permissions" for GITHUB_TOKEN

### 2. Configure Secrets

```bash
# Add secrets via GitHub CLI
gh secret set DATABASE_URL --body "postgresql://..."
gh secret set SESSION_SECRET --body "$(openssl rand -hex 32)"
gh secret set REPLIT_API_TOKEN --body "your-token"
# ... add all other secrets
```

Or manually in GitHub UI:
1. Go to `Settings > Secrets and variables > Actions`
2. Click "New repository secret"
3. Add each secret from the table above

### 3. Configure Environments

Create two environments for deployment:

**Staging Environment:**
1. Go to `Settings > Environments`
2. Click "New environment"
3. Name: `staging`
4. Add environment-specific secrets if needed
5. Optional: Add required reviewers

**Production Environment:**
1. Create environment named `production`
2. Enable "Required reviewers" (recommended)
3. Add protection rules:
   - Wait timer: 5 minutes
   - Required reviewers: 1-2 team members
4. Add environment-specific secrets

### 4. Configure Branch Protection

Protect `main` and `develop` branches:

1. Go to `Settings > Branches`
2. Add rule for `main`:
   - Require pull request reviews (1 approval)
   - Require status checks to pass:
     - `Code Quality`
     - `Unit Tests`
     - `Integration Tests`
   - Require branches to be up to date
   - Include administrators

3. Add rule for `develop`:
   - Require status checks to pass
   - Allow force pushes (for rebasing)

### 5. Test the Pipeline

```bash
# Create a test branch
git checkout -b test/ci-pipeline

# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "test: verify CI/CD pipeline"
git push origin test/ci-pipeline

# Create PR and watch the pipeline run
gh pr create --title "test: CI/CD pipeline" --body "Testing GitHub Actions"
```

---

## Deployment Process

### Staging Deployment (develop branch)

```bash
# Merge feature to develop
git checkout develop
git merge feature/my-feature
git push origin develop

# Pipeline automatically:
# 1. Runs all tests
# 2. Builds application
# 3. Deploys to staging
# 4. Runs smoke tests
# 5. Notifies via Slack
```

### Production Deployment (main branch)

```bash
# Merge develop to main
git checkout main
git merge develop
git push origin main

# Pipeline automatically:
# 1. Creates database backup
# 2. Runs all tests
# 3. Builds application
# 4. Waits for approval (if configured)
# 5. Deploys to production
# 6. Runs smoke tests
# 7. Creates GitHub release
# 8. Notifies via Slack
```

---

## Monitoring and Debugging

### View Workflow Runs

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

### Check Logs

```bash
# View logs for failed job
gh run view <run-id> --log-failed

# Download all logs
gh run download <run-id>
```

### Common Issues

**Issue: Tests fail in CI but pass locally**
- Check environment variables
- Verify Node.js version matches
- Check for timezone issues
- Review test database setup

**Issue: Deployment fails**
- Verify all secrets are set
- Check Replit API token is valid
- Ensure database migrations ran
- Review deployment logs

**Issue: Coverage below threshold**
- Run `npm run test:coverage` locally
- Add tests for uncovered code
- Update coverage thresholds in `vitest.config.ts`

---

## Customization

### Modify Deployment

Edit `.github/workflows/ci-cd.yml`:

```yaml
# Change deployment target
- name: Deploy to Replit (Production)
  run: |
    # Replace with your deployment commands
    curl -X POST https://your-deploy-endpoint.com
```

### Add Custom Tests

Add new job to `ci-cd.yml`:

```yaml
e2e-tests:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run E2E tests
      run: npm run test:e2e
```

### Configure Notifications

Update Slack webhook or add other notification services:

```yaml
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## Best Practices

1. **Keep secrets secure** - Never commit secrets to code
2. **Use environment-specific secrets** - Different keys for staging/production
3. **Monitor pipeline performance** - Optimize slow jobs
4. **Review failed runs immediately** - Don't let CI stay red
5. **Keep workflows DRY** - Use reusable workflows for common tasks
6. **Document changes** - Update this guide when modifying workflows
7. **Test before merging** - Always create PR to test CI pipeline

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Replit Deployment API](https://docs.replit.com/hosting/deployments/about-deployments)
- [Codecov Documentation](https://docs.codecov.com/)

---

## Support

If you encounter issues with the CI/CD pipeline:

1. Check workflow logs in GitHub Actions tab
2. Review this documentation
3. Check GitHub Actions status page
4. Contact DevOps team
