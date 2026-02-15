# Troubleshooting Broken Images in Deployed App

## Quick Diagnosis Steps

### Step 1: Check Browser Console
1. Open your deployed app in Antigravity
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for error messages when you upload an image/video

### Step 2: Check What You'll See

#### Common Error Messages:

**Error Type 1: CORS Error**
```
Access to fetch at 'https://...' from origin '...' has been blocked by CORS policy
```
**Fix:** This is a network issue. The AI-generated images should work as they're from Unsplash. If uploading files, this shouldn't happen.

**Error Type 2: Failed to Load**
```
GET https://... net::ERR_FAILED
```
**Fix:** The URL is broken or inaccessible.

**Error Type 3: Invalid Data URL**
```
Failed to decode image data
```
**Fix:** The base64 encoding might be corrupted.

### Step 3: Use the Debug Tool

I've added error logging to the code. When you see a broken image:

1. Open Console (F12)
2. You should see logs like:
   ```
   Image failed to load: {
     src: "data:image/png;base64,iVBORw0KGgoAAAANS...",
     error: ...
   }
   ```

3. **Check the src value:**
   - Does it start with `data:image/` or `data:video/`? ✅ Good
   - Does it start with `http://` or `https://`? ✅ Should work
   - Is it `null` or `undefined`? ❌ This is the problem!

### Step 4: Advanced Debugging

Add the MediaDebugger component to see detailed info:

1. Open `/src/app/App.tsx`
2. Import the debugger:
   ```typescript
   import { MediaDebugger } from '@/app/components/MediaDebugger';
   ```

3. Add it inside your design canvas view:
   ```typescript
   <DesignCanvas
     backgroundImage={backgroundImage}
     // ... other props
   />
   {/* Add this line: */}
   <MediaDebugger src={backgroundImage} type={mediaType} />
   ```

4. You'll see a debug panel in the bottom-right with detailed info about your media file.

## Common Problems & Solutions

### Problem 1: AI-Generated Images Show Broken Icon

**Symptom:** Images from the Concept Generator page don't display.

**Likely Cause:** Network issue or Unsplash blocked.

**Fix:**
1. Check if you can access Unsplash directly: https://images.unsplash.com/photo-1557682250-33bd709cbe85
2. If you can't, your network blocks Unsplash
3. Try from a different network

**Alternative Fix:** Use a different image service. Edit `/src/services/aiService.ts`:
```typescript
// Replace Unsplash URLs with Picsum URLs:
const baseUrl = `https://picsum.photos/seed/${Math.random()}`;
const url = `${baseUrl}/${width}/${height}`;
```

### Problem 2: Uploaded Images Show Broken Icon

**Symptom:** When you upload a file, it shows as "Image Loaded" but the preview is broken.

**Likely Causes:**
1. File is too large
2. Browser doesn't support the format
3. Data URL is corrupted

**Fix 1 - File Size:**
Add size limit. Edit `/src/app/components/ImageUploader.tsx`:

```typescript
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Add this check:
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    alert(`File too large! Please use a file smaller than ${maxSize / 1024 / 1024}MB`);
    return;
  }

  // Rest of code...
};
```

**Fix 2 - Check File Format:**
Make sure you're uploading:
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Videos: `.mp4`, `.webm`

Not supported: `.avi`, `.mov`, `.wmv` (browser doesn't support these)

**Fix 3 - Test with Tiny File:**
1. Create a 100x100 px image in any image editor
2. Export as PNG
3. Upload that
4. If it works → file size is the issue
5. If it doesn't → something else is wrong

### Problem 3: Videos Show Broken Icon

**Symptom:** Uploaded videos don't play.

**Likely Causes:**
1. Video codec not supported
2. File too large for data URL
3. Browser autoplay restrictions

**Fix 1 - Codec:**
Only use MP4 with H.264 codec or WebM format. Convert your video:
```bash
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
```

**Fix 2 - Size:**
Videos should be < 10MB for data URLs. Compress your video:
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1M output.mp4
```

**Fix 3 - Autoplay:**
The app already has `muted` and `playsInline` which should fix autoplay issues.

### Problem 4: Everything Works in Figma Make but Not in Antigravity

**Likely Cause:** Build configuration or environment variables.

**Fix:**

1. **Check your `.env` file exists in the deployed version:**
   - Antigravity should have environment variable settings
   - Make sure `VITE_USE_MOCK_API=true` is set

2. **Check build output:**
   ```bash
   npm run build
   ```
   - Make sure there are no errors
   - Check the `dist/` folder is created

3. **Check base path:**
   - If deploying to a subdirectory (like `mysite.com/app/`)
   - Update `vite.config.ts`:
     ```typescript
     export default defineConfig({
       base: '/app/', // Your subdirectory
       // ...
     })
     ```

### Problem 5: Images Work Locally but Not When Deployed

**Symptom:** Works when you run `npm run dev` but breaks on Antigravity.

**Likely Cause:** Path issues or environment variables not set.

**Fix:**

1. **Check if dist/ folder has all files:**
   ```bash
   ls -la dist/assets/
   ```
   Should show CSS, JS, and other assets.

2. **Check environment variables in Antigravity:**
   - Go to project settings
   - Add environment variable: `VITE_USE_MOCK_API` = `true`
   - Redeploy

3. **Check console for 404 errors:**
   - Open deployed app
   - F12 → Network tab
   - Upload an image
   - Look for any failed requests (red)

## Emergency Fix: Fallback to File Input

If nothing works and you need a quick fix, you can show a fallback UI:

Edit `/src/app/components/DesignCanvas.tsx`:

```typescript
{backgroundImage && mediaType === 'image' && (
  <img
    src={backgroundImage}
    alt="Background"
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    onError={(e) => {
      // Replace broken image with placeholder
      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijg4IiBoZWlnaHQ9Ijg4IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
      e.currentTarget.style.objectFit = 'contain';
    }}
  />
)}
```

## Still Not Working?

### Last Resort Checklist:

- [ ] Tried different image (small PNG file < 1MB)?
- [ ] Checked browser console for errors?
- [ ] Tried different browser (Chrome, Firefox, Safari)?
- [ ] Checked Network tab for failed requests?
- [ ] Added MediaDebugger component?
- [ ] Checked file format is supported?
- [ ] Verified `.env` file has correct settings?
- [ ] Rebuilt the app (`npm run build`)?
- [ ] Cleared browser cache (Ctrl+Shift+Delete)?

### Get More Help:

1. **Take a screenshot of:**
   - The broken image
   - Browser console (F12)
   - Network tab (F12)

2. **Share this info:**
   - What browser you're using
   - What you're uploading (image/video, size, format)
   - Any error messages from console
   - Does it work in Figma Make but not Antigravity?

3. **Try the test:**
   - Go to Concept Generator
   - Generate images (uses Unsplash)
   - Do those show up?
   - If YES → upload is the problem
   - If NO → network/deployment is the problem

## Most Likely Solution

Based on typical deployment issues, **90% of the time** it's one of these:

1. ✅ **File too large** - Use smaller files (< 5MB for images, < 10MB for videos)
2. ✅ **Environment variables not set** - Make sure `.env` is configured in Antigravity
3. ✅ **CORS/Network** - Try accessing the app from a different network
4. ✅ **Browser cache** - Clear cache and hard reload (Ctrl+Shift+R)

Try these four things first before debugging further!
