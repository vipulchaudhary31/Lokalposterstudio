# Lokal Poster Studio

A web-based poster/template design tool for creating social media posts with customizable layouts, text styling, and image placement.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📋 Features

- **Template Creation**: Design poster templates with custom canvas sizes
- **Image Upload**: Add and position images with circular or rectangular frames
- **Text Styling**: Full control over fonts, colors, shadows, and strokes
- **Tag System**: Categorize templates by profile/wishes tags and languages
- **Export**: Download templates as JSON for reuse

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Drag & Drop**: react-dnd

## 📁 Project Structure

```
/src
  /app
    /components    # UI components
    App.tsx        # Main application
  /imports         # SVG assets and icons
  /styles          # Global styles and Tailwind config
/public            # Static assets (logos, sample images)
```

## 🌐 Deployment

This repo is configured for **GitHub Pages** deployment:

- Push to `main` triggers automatic build and deploy
- Site is served from `/Lokalposterstudio/` path
- Workflow: `.github/workflows/deploy-pages.yml`

### To deploy elsewhere:

1. Update `base` in `vite.config.ts` (set to `/` for root deployment)
2. Run `npm run build`
3. Deploy the `dist/` folder to your hosting

## 📝 Notes

- **Placeholder Assets**: Current images in `public/` are placeholders. Replace with your actual logo and sample images.
- **Documentation Archive**: Old/outdated docs are in `docs-archive/` for reference only.

## 🔧 Configuration

- **Vite Config**: `vite.config.ts`
- **Tailwind**: `postcss.config.mjs` + inline config in CSS
- **TypeScript**: `tsconfig.json` (if present)

## 📦 Dependencies

Major packages:
- `react`, `react-dom` - UI framework
- `@radix-ui/*` - Headless UI primitives
- `tailwindcss` - Utility-first CSS
- `react-dnd` - Drag and drop
- `lucide-react` - Icon library
- `motion` (framer-motion) - Animations

See `package.json` for full list.

---

**Last Updated**: February 2026
