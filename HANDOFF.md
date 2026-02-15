# Development Handoff Notes

## For the Dev Team

This is a clean, working Vite + React + TypeScript poster design tool ready for deployment.

### Current State
- ✅ Runs locally with `npm run dev`
- ✅ Builds successfully with `npm run build`
- ✅ GitHub Pages workflow configured (auto-deploys on push to main)
- ✅ All Figma asset imports replaced with local placeholders

### What You Need to Do

1. **Replace Placeholder Assets**
   - `public/placeholder-logo.png` - header logo + favicon
   - `public/placeholder-sample-bg.png` - sample photo with background
   - `public/placeholder-sample-nobg.png` - sample photo without background
   - `public/placeholder-easter.png` - easter egg modal image

2. **Add Your Features** (as discussed)
   - Register/Login for design team
   - Docker configuration
   - Nginx deployment config

3. **Update Deployment Config** (if not using GitHub Pages)
   - Change `base: '/Lokalposterstudio/'` to `base: '/'` in `vite.config.ts`
   - Or remove the base entirely if deploying to root domain

### Working with Patches

If the original owner makes changes and sends you a patch file:

```bash
# Apply the patch
git apply changes.patch

# If there are conflicts, use 3-way merge
git apply --3way changes.patch

# Review changes
git diff

# Commit if everything looks good
git add .
git commit -m "Apply patch from original owner"
```

### Generating Patches (For Original Owner)

To create a patch file of your changes:

```bash
# Single commit
git format-patch -1 HEAD

# Last N commits
git format-patch -N

# All changes since a specific commit
git format-patch <commit-hash>

# All uncommitted changes
git diff > my-changes.patch
```

### Repository Setup

When you move this to your company GitHub:

1. Create new repo on your company GitHub
2. Update remote:
   ```bash
   git remote set-url origin https://github.com/your-company/your-repo.git
   git push -u origin main
   ```
3. Enable GitHub Pages (if needed) in repo Settings → Pages → Source: GitHub Actions

### Notes

- `docs-archive/` contains old documentation from the Figma export (can be deleted)
- `dist/` and `node_modules/` are gitignored
- The app uses Vite's `import.meta.env.BASE_URL` for asset paths (supports subdirectory deployment)

---

**Questions?** Check the main `README.md` or reach out to the original owner.
