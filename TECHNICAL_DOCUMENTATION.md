# 🔧 Mobile Template Designer - Technical Documentation

## 📊 System Architecture

### Overview
The Mobile Image Template Designer is a React-based web application that enables designers to create reusable mobile image templates with customizable layouts and styling.

### Tech Stack
- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6.3.5
- **Drag & Drop**: react-dnd + react-dnd-html5-backend
- **Image Cropping**: react-easy-crop
- **AI Integration**: OpenAI API / Google Gemini API
- **Notifications**: Sonner (toast library)
- **Icons**: Lucide React

---

## 🏗️ Project Structure

```
/src
├── /app
│   ├── App.tsx                    # Main application component
│   └── /components
│       ├── DesignCanvas.tsx       # Main canvas with draggable placeholders
│       ├── PreviewPanel.tsx       # Live preview panel
│       ├── ImageUploader.tsx      # File upload component
│       ├── ImageCropper.tsx       # Image/video cropping modal
│       ├── ConceptGenerator.tsx   # AI image generation page
│       ├── ExportPanel.tsx        # JSON export functionality
│       ├── TagSelector.tsx        # Language tag selector
│       ├── CategorySelector.tsx   # Category dropdown
│       ├── TextBackgroundSelector.tsx
│       ├── ImageStrokeSelector.tsx
│       ├── TextAlignmentSelector.tsx
│       └── /ui                    # Reusable UI components
│           ├── sonner.tsx         # Toast notifications
│           └── ...                # Other shadcn/ui components
├── /services
│   └── apiInterceptor.ts          # API request interceptor
├── /styles
│   ├── theme.css                  # CSS variables & theme tokens
│   ├── fonts.css                  # Font imports
│   └── app.css                    # Global styles
└── /imports                       # Figma-imported assets (SVGs, images)
```

---

## 📦 Key Dependencies

### Production Dependencies

```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-dnd": "16.0.1",
  "react-dnd-html5-backend": "16.0.1",
  "react-easy-crop": "5.5.6",
  "lucide-react": "0.487.0",
  "sonner": "2.0.3",
  "tailwind-merge": "3.2.0",
  "motion": "12.23.24"
}
```

### Installation

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

---

## 🔑 Core Components

### 1. App.tsx

**Purpose**: Main application orchestrator

**State Management**:
```typescript
// Page navigation
const [currentPage, setCurrentPage] = useState<'concept' | 'designer'>('concept');

// Canvas configuration
const [aspectRatio, setAspectRatio] = useState<'3:4' | '9:16'>('3:4');
const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

// Placeholders
const [imageHolder, setImageHolder] = useState<ImagePlaceholder>({...});
const [nameHolder, setNameHolder] = useState<NamePlaceholder>({...});

// Styling
const [imageStrokeStyle, setImageStrokeStyle] = useState<ImageStrokeStyle>('none');
const [textBackgroundStyle, setTextBackgroundStyle] = useState<TextBackgroundStyle>('none');
const [textAlignment, setTextAlignment] = useState<TextAlignment>('center');

// Metadata
const [primaryCategory, setPrimaryCategory] = useState<string>('');
const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
```

**Key Functions**:
```typescript
handleImageSelect(imageUrl: string)     // From AI generator
handleRawImageUpload(url, type)         // File upload
handleCropComplete(croppedUrl)          // Post-crop processing
handleExport()                          // JSON export
```

---

### 2. DesignCanvas.tsx

**Purpose**: Main editing canvas with draggable placeholders

**Props Interface**:
```typescript
interface DesignCanvasProps {
  backgroundImage: string | null;
  imageHolder: ImagePlaceholder;
  nameHolder: NamePlaceholder;
  onImageHolderChange: (pos: ImagePlaceholder) => void;
  onNameHolderChange: (pos: NamePlaceholder) => void;
  canvasWidth: number;
  canvasHeight: number;
  aspectRatio: string;
  imageStrokeStyle: ImageStrokeStyle;
  userName?: string;
  mediaType?: 'image' | 'video';
  textBackgroundStyle?: TextBackgroundStyle;
  textAlignment?: TextAlignment;
  showBorderInEditor?: boolean;
  videoMuted?: boolean;
}
```

**Features**:
- React DnD for drag-and-drop
- Real-time position clamping
- Responsive scaling
- Stroke effect rendering
- Video/image background support

**Drag & Drop Implementation**:
```typescript
const [{ isDragging }, drag] = useDrag({
  type: 'placeholder',
  item: { type: 'image', id: 'imageHolder' },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
});
```

---

### 3. PreviewPanel.tsx

**Purpose**: Real-time preview with sample data

**Key Features**:
- Scaled preview (360px width)
- Sample photo rendering
- Sample name rendering
- All effects applied
- Matches final output

**Rendering Logic**:
```typescript
const scale = PREVIEW_WIDTH / canvasWidth;
const previewHeight = canvasHeight * scale;

// All positions scaled proportionally
const scaledImageX = imageHolder.x * scale;
const scaledImageY = imageHolder.y * scale;
```

---

### 4. ConceptGenerator.tsx

**Purpose**: AI-powered background image generation

**AI Providers**:
1. **OpenAI DALL-E 3**
   - Endpoint: `/v1/images/generations`
   - Model: `dall-e-3`
   - Size: `1024x1024` or `1024x1792`

2. **Google Gemini (Imagen 3)**
   - Endpoint: `/v1beta/models/imagen-3.0-generate-001:predict`
   - Aspect ratio support: `3:4`, `9:16`

**Mock Mode**:
When no valid API key is provided, falls back to Unsplash:
```typescript
const mockUrl = `https://source.unsplash.com/1080x${height}/?${searchTerm}`;
```

**System Prompts**:
```typescript
const MOBILE_OPTIMIZED_PROMPT = `
Create a mobile-friendly vertical image (${aspectRatio === '3:4' ? '1080x1440' : '1080x1920'}px).
Requirements:
- Leave center space for overlays
- High contrast areas for text
- No text/watermarks
- Professional quality
- ${conceptDescription}
`;
```

---

### 5. ImageCropper.tsx

**Purpose**: Crop uploaded images to correct aspect ratio

**Library**: react-easy-crop

**Features**:
- Interactive crop area
- Zoom controls
- Aspect ratio locking
- Canvas-based crop extraction
- Video support (no actual cropping for videos)

**Crop Extraction**:
```typescript
const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.src = url;
  });
};

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  
  return canvas.toDataURL('image/jpeg', 0.9);
};
```

---

## 🎨 Styling System

### Stroke Effects

Implemented with CSS animations and SVG filters:

```css
/* Paint Flow - Blue flowing strokes */
@keyframes paintFlow {
  0%, 100% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.7; 
  }
  50% { 
    transform: rotate(180deg) scale(1.1); 
    opacity: 0.5; 
  }
}

/* Vibrant Waves - Purple/pink gradients */
@keyframes vibrateWave1 {
  0%, 100% { transform: rotate(-5deg) translateY(0px); }
  50% { transform: rotate(5deg) translateY(-5px); }
}

/* Sunset Glow - Orange/pink gradient */
/* Aurora - Multi-color effect */
```

**Implementation**:
```typescript
{imageStrokeStyle === 'paintFlow' && (
  <div className="absolute inset-0 pointer-events-none">
    {/* Multi-layered SVG paths with animations */}
  </div>
)}
```

### Text Background Styles

```typescript
// None - transparent
background: 'transparent'

// Solid - black with white text
background: 'rgba(0, 0, 0, 0.8)'
color: 'white'

// Gradient - amber gradient
background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
color: 'white'
```

---

## 📡 API Integration

### API Interceptor

**File**: `/src/services/apiInterceptor.ts`

**Purpose**: Route AI requests and handle fallbacks

```typescript
// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [url, options] = args;
  
  // Check if it's an AI generation request
  if (url.includes('openai.com') || url.includes('googleapis.com')) {
    // Validate API key
    const hasValidKey = checkAPIKey(options.headers);
    
    if (!hasValidKey) {
      // Fallback to Unsplash mock
      return mockImageGeneration(url);
    }
  }
  
  // Proceed with original request
  return originalFetch(...args);
};
```

### AI Generation Flow

```
User enters prompt
      ↓
ConceptGenerator.tsx
      ↓
Check API key validity
      ↓
   ┌──────┴──────┐
   ↓             ↓
Valid Key    No Key
   ↓             ↓
Real AI      Unsplash Mock
(OpenAI/     (Random images
 Gemini)      matching theme)
   ↓             ↓
   └──────┬──────┘
          ↓
   Display results
          ↓
   User selects image
          ↓
   Proceeds to designer
```

---

## 💾 Data Models

### Template Export Schema

```typescript
interface TemplateExport {
  // Canvas configuration
  aspectRatio: '3:4' | '9:16';
  canvasWidth: number;      // 1080
  canvasHeight: number;     // 1440 or 1920
  
  // Background
  backgroundImage: string;  // Base64 data URI
  mediaType: 'image' | 'video';
  
  // Placeholders
  imageHolder: {
    x: number;              // X position
    y: number;              // Y position
    diameter: number;       // Circle diameter (300)
  };
  nameHolder: {
    x: number;              // X position
    y: number;              // Y position
    width: number;          // Rectangle width (600)
    height: number;         // Rectangle height (100)
  };
  
  // Styling
  imageStrokeStyle: 'none' | 'paintFlow' | 'vibrantWaves' | 'sunsetGlow' | 'aurora';
  textBackgroundStyle: 'none' | 'solid' | 'gradient';
  textAlignment: 'left' | 'center' | 'right';
  
  // Metadata
  primaryCategory: string;
  secondaryCategory?: string;
  selectedLanguages: string[];
}
```

### Placeholder Interfaces

```typescript
interface ImagePlaceholder {
  x: number;          // X coordinate (0 to canvasWidth - diameter)
  y: number;          // Y coordinate (0 to canvasHeight - diameter)
  diameter: number;   // Circle diameter (default: 300)
}

interface NamePlaceholder {
  x: number;          // X coordinate (0 to canvasWidth - width)
  y: number;          // Y coordinate (0 to canvasHeight - height)
  width: number;      // Rectangle width (default: 600)
  height: number;     // Rectangle height (default: 100)
}
```

---

## 🔄 State Flow

### Complete User Flow

```
┌─────────────────────────────────────────────┐
│ 1. LANDING / CONCEPT GENERATION PAGE        │
│    - Enter concept description               │
│    - Configure AI settings                   │
│    - Generate images                         │
│    - Select image OR skip to designer        │
└────────────┬────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────┐
│ 2. TEMPLATE DESIGNER PAGE                   │
│                                              │
│    Step 1: Select Aspect Ratio              │
│    ├─ 3:4 (1080×1440)                       │
│    └─ 9:16 (1080×1920)                      │
│             ↓                                │
│    Step 2: Upload Background                │
│    ├─ File upload                           │
│    ├─ Crop (ImageCropper modal)             │
│    └─ Background set                        │
│             ↓                                │
│    Step 3: Position Placeholders            │
│    ├─ Drag photo placeholder                │
│    ├─ Drag name placeholder                 │
│    └─ Preview updates in real-time          │
│             ↓                                │
│    Step 4: Apply Styles                     │
│    ├─ Image Stroke Effect                   │
│    ├─ Text Background Style                 │
│    └─ Text Alignment                        │
│             ↓                                │
│    Step 5: Configure Metadata               │
│    ├─ Primary Category                      │
│    ├─ Secondary Category (optional)         │
│    └─ Languages (1+ required)               │
│             ↓                                │
│    Step 6: Export Template                  │
│    └─ Generate JSON                         │
└─────────────────────────────────────────────┘
```

### State Synchronization

```typescript
// App.tsx manages all state
// Child components receive via props
// Updates flow back via callbacks

App.tsx (State Container)
    ↓ (props)
DesignCanvas.tsx ←→ PreviewPanel.tsx
    ↑ (callbacks)
User interactions
```

---

## 🎯 Canvas Coordinate System

### Coordinate Space

```
(0,0) ┌──────────────────────────┐
      │                          │
      │   Canvas Area            │
      │   Width: 1080px          │
      │   Height: 1440 or 1920   │
      │                          │
      │   Photo Placeholder:     │
      │   - x: 390 (center-ish)  │
      │   - y: 200               │
      │   - diameter: 300        │
      │                          │
      │   Name Placeholder:      │
      │   - x: 240               │
      │   - y: 550               │
      │   - width: 600           │
      │   - height: 100          │
      │                          │
      └──────────────────────────┘ (1080, 1440/1920)
```

### Position Clamping

```typescript
// Ensure placeholders stay within canvas bounds
const clampImagePosition = (x: number, y: number, diameter: number) => {
  return {
    x: Math.max(0, Math.min(x, CANVAS_WIDTH - diameter)),
    y: Math.max(0, Math.min(y, canvasHeight - diameter))
  };
};

const clampNamePosition = (x: number, y: number, width: number, height: number) => {
  return {
    x: Math.max(0, Math.min(x, CANVAS_WIDTH - width)),
    y: Math.max(0, Math.min(y, canvasHeight - height))
  };
};
```

---

## 🔐 Security Considerations

### API Keys

**Storage**: User-provided, stored in component state only  
**Transmission**: HTTPS only  
**Validation**: Client-side validation before API calls  
**Best Practice**: Never commit API keys to version control

```typescript
// Example validation
const validateAPIKey = (key: string, provider: 'openai' | 'gemini') => {
  if (provider === 'openai') {
    return key.startsWith('sk-') && key.length > 20;
  }
  if (provider === 'gemini') {
    return key.length > 10; // Basic check
  }
  return false;
};
```

### Image Handling

**Upload Validation**:
```typescript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File) => {
  const isValidType = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    .includes(file.type);
  const isValidSize = file.size <= MAX_FILE_SIZE;
  
  return isValidType && isValidSize;
};
```

**XSS Prevention**:
- All user inputs are properly escaped
- No `dangerouslySetInnerHTML` usage
- Sanitized exports

---

## ⚡ Performance Optimizations

### Image Optimization

```typescript
// Convert to JPEG with quality compression
canvas.toDataURL('image/jpeg', 0.9); // 90% quality

// Recommended dimensions
const OPTIMAL_WIDTH = 1080;
const OPTIMAL_HEIGHT_3_4 = 1440;
const OPTIMAL_HEIGHT_9_16 = 1920;
```

### Rendering Optimization

```typescript
// Memoize expensive calculations
const scaledImageHolder = useMemo(() => ({
  x: imageHolder.x * scale,
  y: imageHolder.y * scale,
  diameter: imageHolder.diameter * scale
}), [imageHolder, scale]);

// Debounce drag updates
const debouncedUpdate = useMemo(
  () => debounce(onImageHolderChange, 16), // ~60fps
  [onImageHolderChange]
);
```

### Video Performance

```typescript
// Lazy load videos
<video
  src={backgroundImage}
  autoPlay
  loop
  muted={videoMuted}
  playsInline          // Prevents fullscreen on iOS
  preload="metadata"   // Load only metadata initially
/>
```

---

## 🧪 Testing Recommendations

### Unit Testing

```typescript
// Test placeholder clamping
describe('Position Clamping', () => {
  it('should clamp image placeholder to canvas bounds', () => {
    const result = clampImagePosition(1200, -50, 300);
    expect(result.x).toBe(780);  // 1080 - 300
    expect(result.y).toBe(0);    // Min bound
  });
});

// Test export generation
describe('Export Functionality', () => {
  it('should generate valid JSON export', () => {
    const exported = generateExport(state);
    expect(exported).toHaveProperty('aspectRatio');
    expect(exported).toHaveProperty('backgroundImage');
    expect(exported.canvasWidth).toBe(1080);
  });
});
```

### Integration Testing

```typescript
// Test complete workflow
describe('Template Creation Flow', () => {
  it('should complete full template creation', async () => {
    // 1. Select aspect ratio
    fireEvent.click(screen.getByText('3:4'));
    
    // 2. Upload background
    const file = new File(['...'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(uploadInput, { target: { files: [file] } });
    
    // 3. Crop (skip)
    fireEvent.click(screen.getByText('Apply Crop'));
    
    // 4. Set category
    fireEvent.change(categorySelect, { target: { value: 'Birthday' } });
    
    // 5. Select language
    fireEvent.click(screen.getByText('English'));
    
    // 6. Export
    fireEvent.click(screen.getByText('Export Template'));
    
    // Verify export
    expect(mockExport).toHaveBeenCalled();
  });
});
```

### E2E Testing

```typescript
// Using Playwright or Cypress
describe('Full User Journey', () => {
  it('should create template from AI generation', async () => {
    await page.goto('/');
    await page.fill('textarea', 'Birthday balloons');
    await page.click('button:has-text("Generate Images")');
    await page.waitForSelector('img[alt*="generated"]');
    await page.click('button:has-text("Use This Image")');
    
    // Continue with template design...
  });
});
```

---

## 🐛 Debugging

### Common Issues

**Issue**: Placeholders don't drag
```typescript
// Check DnD context
console.log('DnD Backend:', useDragLayer(monitor => monitor.getBackendId()));

// Verify drag handlers
const [{ isDragging }, drag] = useDrag({...});
console.log('Is Dragging:', isDragging);
```

**Issue**: Video doesn't play
```typescript
// Check video element
<video
  onError={(e) => console.error('Video error:', e)}
  onLoadedData={() => console.log('Video loaded')}
  onCanPlay={() => console.log('Video can play')}
/>
```

**Issue**: Export fails
```typescript
// Validate state before export
const validateExportState = () => {
  console.log('Background:', backgroundImage ? 'Set' : 'Missing');
  console.log('Category:', primaryCategory || 'Missing');
  console.log('Languages:', selectedLanguages.length, 'selected');
};
```

### Development Tools

```typescript
// Enable React DevTools
// Install: React Developer Tools (Chrome/Firefox extension)

// Performance monitoring
import { Profiler } from 'react';

<Profiler id="DesignCanvas" onRender={onRenderCallback}>
  <DesignCanvas {...props} />
</Profiler>
```

---

## 🚀 Deployment

### Build Production Bundle

```bash
# Build for production
npm run build

# Output directory
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [assets]
```

### Environment Variables

```env
# .env.production
VITE_APP_ENV=production
VITE_API_URL=https://api.yourdomain.com
```

### Deployment Checklist

- [ ] Remove console.log statements
- [ ] Verify all assets load correctly
- [ ] Test on target browsers
- [ ] Check mobile responsiveness
- [ ] Validate API integrations
- [ ] Test video/image uploads
- [ ] Verify export functionality
- [ ] Check CORS settings
- [ ] Enable compression (gzip/brotli)
- [ ] Set up CDN for assets

---

## 📊 Browser Support

### Minimum Requirements

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

### Required Features

- ✅ ES6+ JavaScript
- ✅ CSS Grid & Flexbox
- ✅ HTML5 Canvas API
- ✅ File API
- ✅ Drag and Drop API
- ✅ Video element
- ✅ CSS Animations

---

## 🔧 Customization Guide

### Adding New Stroke Effects

```typescript
// 1. Define in type
type ImageStrokeStyle = 'none' | 'paintFlow' | 'yourNewEffect';

// 2. Add CSS animation
@keyframes yourNewEffect {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 3. Add to selector component
const STROKE_OPTIONS = [
  // ...existing
  { value: 'yourNewEffect', label: 'Your New Effect', icon: '✨' }
];

// 4. Implement in DesignCanvas.tsx
{imageStrokeStyle === 'yourNewEffect' && (
  <div className="absolute inset-0">
    {/* Your effect SVG/elements */}
  </div>
)}
```

### Adding New Categories

```typescript
// Update OCCASION_TAGS in App.tsx
const OCCASION_TAGS = [
  // ...existing
  'New Occasion',
  'Another Occasion'
];
```

### Adding New Languages

```typescript
// Update LANGUAGE_OPTIONS in TagSelector.tsx
const LANGUAGE_OPTIONS = [
  // ...existing
  'New Language'
];
```

---

## 📝 Code Style Guide

### TypeScript Best Practices

```typescript
// Use interfaces for props
interface ComponentProps {
  required: string;
  optional?: number;
}

// Use type for unions
type Status = 'idle' | 'loading' | 'success' | 'error';

// Explicit return types for functions
const calculateScale = (width: number, height: number): number => {
  return width / height;
};
```

### React Best Practices

```typescript
// Destructure props
const Component = ({ prop1, prop2 }: Props) => {
  // ...
};

// Use functional components
export function Component() {
  // ...
}

// Memoize expensive calculations
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Use callbacks for functions passed as props
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

---

## 📚 Additional Resources

### Documentation Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React DnD](https://react-dnd.github.io/react-dnd/)
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)

### Internal Documentation

- `USER_GUIDE.md` - End-user documentation
- `QUICK_REFERENCE.md` - Quick reference card
- `VIDEO_AUDIO_FEATURE.md` - Video audio feature docs

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review
6. Merge to main

### Commit Message Format

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(stroke-effects): add new galaxy stroke effect

- Implemented multi-color galaxy animation
- Added to ImageStrokeSelector options
- Updated documentation

Closes #123
```

---

## 📞 Support

### For Developers

- **Code Issues**: Check browser console first
- **Build Issues**: Verify Node.js version (16+)
- **Type Errors**: Run `tsc --noEmit` for type checking

### For End Users

- **User Guide**: See `USER_GUIDE.md`
- **Quick Help**: See `QUICK_REFERENCE.md`

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintainer**: Internal Design Tools Team
