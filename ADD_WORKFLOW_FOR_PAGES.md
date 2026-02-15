# Add this workflow so GitHub Pages can build and deploy

Your code is already pushed. One more step: add the workflow file so the site deploys.

## What to do (takes 1 minute)

1. **Open this link** (creates the workflow file on GitHub):  
   **https://github.com/vipulchaudhary31/Lokalposterstudio/new/main?filename=.github/workflows/deploy-pages.yml**

2. **Delete any text** in the big text box.

3. **Copy everything below** (from `name:` to `v4`) and **paste** into that box.

4. Click the green **"Commit new file"** button at the bottom.

5. Wait 1–2 minutes. Your site will be live at:  
   **https://vipulchaudhary31.github.io/Lokalposterstudio/**

---

**Paste this entire block:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

**Note:** Copy only the YAML (from `name:` through `deploy-pages@v4`). Do not copy the \`\`\`yaml or \`\`\` lines.
