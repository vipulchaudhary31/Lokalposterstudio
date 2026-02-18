# Template JSON Schema

This document describes the JSON format exported by Poster Studio.
It is the **single source of truth** for the React Native (Android-first) renderer.

---

## Design space contract

All pixel values in this JSON are in **design px** — measured on a **1080-wide canvas**.
Before applying any design-px value in your renderer:

```
scale = outputCanvasWidth / 1080
```

Apply `scale` to:
- `ip.cr` (corner radius)
- `ip.sw` (photo stroke width)
- `np.st.ts.fs` (font size)
- `np.st.ts.ls` (letter spacing)
- `shRn.textShadowOffset`, `shRn.textShadowRadius`
- every `textShadowOffset` inside `stRn`

**Percentage keys** (`ip.x`, `ip.y`, `ip.d`, `np.y`, `np.h`) need no scaling —
multiply by your canvas dimensions directly.

**Font:** not in JSON. The web editor uses Noto Sans for preview only.
Your RN app chooses the font independently.

---

## 1. Top-level object

```json
{
  "ar": "1080:1350",
  "t": true,
  "pc": ["Health", "Motivation"],
  "lg": ["English"],
  "bg": "data:image/jpeg;base64,...",
  "mt": "image",
  "ip": { ... },
  "np": { ... }
}
```

| Key  | Type                   | Meaning                                                          |
|------|------------------------|------------------------------------------------------------------|
| `ar` | string                 | **aspectRatio** – e.g. `"1080:1350"`                            |
| `t`  | boolean                | **isProfileTemplate** – `true` = Self, `false` = Wishes         |
| `pc` | string[]               | **primaryCategories** – Self/Wishes tags                        |
| `lg` | string[]               | **languageTags** – e.g. `["English","Hindi"]`                   |
| `bg` | string \| null         | **backgroundImage** – data URL or `null`                        |
| `mt` | `"image" \| "video"`   | **mediaType** – how to interpret `bg`                           |
| `ip` | object                 | **imagePlaceholder** – photo circle/square position & style     |
| `np` | object                 | **namePlaceholder** – name text band position & style           |

---

## 2. `ip` – Image Placeholder

```json
"ip": {
  "x": 50,
  "y": 20,
  "d": 28,
  "sh": "circle",
  "cr": 16,
  "hb": true,
  "sw": 4,
  "sc": "#FFFFFF"
}
```

| Key  | Type                       | Meaning                                                          |
|------|----------------------------|------------------------------------------------------------------|
| `x`  | number (0–100)             | **left edge** of photo – % of canvas width                      |
| `y`  | number (0–100)             | **top edge** of photo – % of canvas height                      |
| `d`  | number (0–100)             | **diameter** – % of canvas width (`height = width`)             |
| `sh` | `"circle" \| "square"`     | **shape** of the photo frame                                     |
| `cr` | number (design px, optional) | **cornerRadius** – only present when `sh === "square"`         |
| `hb` | boolean                    | **hasBackground** – `true` = full photo, `false` = cutout/transparent |
| `sw` | number (design px)         | **strokeWidth** – border around photo, `0` = no border          |
| `sc` | string (hex)               | **strokeColor** – e.g. `"#FFFFFF"`                              |

**Rendering (RN):**
```
photoSize   = (d / 100) * canvasWidth             // always square
photoLeft   = (x / 100) * canvasWidth
photoTop    = (y / 100) * canvasHeight
borderRadius = sh === "circle" ? photoSize / 2 : cr * scale
borderWidth  = sw * scale    // 0 = no border
borderColor  = sc
```

---

## 3. `np` – Name Placeholder

```json
"np": {
  "y": 55,
  "h": 10,
  "st": { "ts": { ... } }
}
```

| Key | Type           | Meaning                                              |
|-----|----------------|------------------------------------------------------|
| `y` | number (0–100) | **top edge** of name band – % of canvas height       |
| `h` | number (0–100) | **height** of name band – % of canvas height         |

**Width and X position are not in JSON:**
- Width = `80%` of canvas width (hardcoded)
- X = centered: `(canvasWidth - bandWidth) / 2`

**Rendering (RN):**
```
bandWidth  = canvasWidth * 0.80
bandHeight = (h / 100) * canvasHeight
bandLeft   = (canvasWidth - bandWidth) / 2
bandTop    = (y / 100) * canvasHeight
```

---

## 4. `np.st.ts` – Text Style

```json
"np": {
  "y": 55,
  "h": 10,
  "st": {
    "ts": {
      "c": "#FFFFFF",
      "fs": 64,
      "fw": 700,
      "ls": 0,
      "ta": "center",
      "shRn": {
        "textShadowOffset": { "width": 0, "height": 2 },
        "textShadowRadius": 8,
        "textShadowColor": "rgba(0,0,0,0.65)"
      },
      "stRn": [
        { "textShadowOffset": { "width": 2.0, "height": 0.0 }, "textShadowRadius": 0, "textShadowColor": "#000000" },
        { "textShadowOffset": { "width": 1.73, "height": 1.0 }, "textShadowRadius": 0, "textShadowColor": "#000000" }
      ]
    }
  }
}
```

| Key    | Type                            | Meaning                                              |
|--------|---------------------------------|------------------------------------------------------|
| `c`    | string (hex)                    | **text color**                                       |
| `fs`   | number (design px)              | **fontSize** – scale before use                      |
| `fw`   | number                          | **fontWeight** – e.g. `400`, `700`                   |
| `ls`   | number (design px)              | **letterSpacing** – scale before use                 |
| `ta`   | `"left" \| "center" \| "right"` | **textAlign**                                        |
| `shRn` | object \| `null`                | **text shadow** (see below). `null` = no shadow.     |
| `stRn` | array (may be empty)            | **text stroke** as shadow list (see below)           |

---

### 4.1 `shRn` – Text Shadow

`null` when shadow is disabled. Otherwise:

```json
"shRn": {
  "textShadowOffset": { "width": 0, "height": 2 },
  "textShadowRadius": 8,
  "textShadowColor": "rgba(0,0,0,0.65)"
}
```

| Field               | Type                              | Notes                          |
|---------------------|-----------------------------------|--------------------------------|
| `textShadowOffset`  | `{ width: number, height: number }` | design px — **scale before use** |
| `textShadowRadius`  | number                            | blur radius, design px — **scale before use** |
| `textShadowColor`   | string (`rgba(...)`)              | ready to use directly          |

**Rendering (RN Android):**
```jsx
const s = scale; // outputCanvasWidth / 1080
const shadowStyle = shRn ? {
  textShadowOffset: { width: shRn.textShadowOffset.width * s, height: shRn.textShadowOffset.height * s },
  textShadowRadius: shRn.textShadowRadius * s,
  textShadowColor: shRn.textShadowColor,
} : {};

<Text style={{ ...textStyle, ...shadowStyle }}>{name}</Text>
```

---

### 4.2 `stRn` – Text Stroke (Android)

Empty array when stroke is disabled.

React Native does not support `textStroke` natively. Stroke is simulated by
rendering multiple `<Text>` layers (one per shadow object in `stRn`) behind
the main text, each with a single `textShadow*` offset.

**Rendering (RN Android):**

```jsx
const s = scale; // outputCanvasWidth / 1080

// Render stroke layers first (behind)
{stRn.map((shadow, i) => (
  <Text
    key={i}
    style={[
      baseTextStyle,
      {
        position: 'absolute',
        textShadowOffset: {
          width: shadow.textShadowOffset.width * s,
          height: shadow.textShadowOffset.height * s,
        },
        textShadowRadius: 0,
        textShadowColor: shadow.textShadowColor,
      },
    ]}
  >
    {name}
  </Text>
))}

// Main text layer on top (with optional drop shadow)
<Text style={[baseTextStyle, shadowStyle]}>{name}</Text>
```

---

## 5. Full example JSON

```json
{
  "ar": "1080:1350",
  "t": true,
  "pc": ["Health"],
  "lg": ["English"],
  "bg": "data:image/jpeg;base64,...",
  "mt": "image",
  "ip": {
    "x": 50,
    "y": 10,
    "d": 28,
    "sh": "circle",
    "hb": false,
    "sw": 3,
    "sc": "#FFFFFF"
  },
  "np": {
    "y": 72,
    "h": 9,
    "st": {
      "ts": {
        "c": "#FFFFFF",
        "fs": 64,
        "fw": 700,
        "ls": 0,
        "ta": "center",
        "shRn": {
          "textShadowOffset": { "width": 0, "height": 2 },
          "textShadowRadius": 8,
          "textShadowColor": "rgba(0,0,0,0.65)"
        },
        "stRn": []
      }
    }
  }
}
```

---

## 6. TypeScript type

```ts
import type { CompactTemplateJSON } from '@/templateSchema';
```

See `src/templateSchema.ts` for the exact typed definition.
