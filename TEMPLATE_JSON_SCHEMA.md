# Template JSON Schema — React Native Rendering Guide

Exported by **Poster Studio** web tool.
Target platform: **React Native, Android-first**.

---

## Canvas & design space

The web editor works on a fixed **1080 × variable-height** canvas.
All supported aspect ratios and their canvas heights:

| `ar` value   | Canvas height (px) |
|--------------|--------------------|
| `1080:1152`  | 1152               |
| `1080:1350`  | 1350               |
| `1080:1484`  | 1484               |
| `1080:1620`  | 1620               |

Parse `ar` as `"width:height"` → `canvasWidth = 1080`, `canvasHeight` from table above.

---

## Scaling contract

Some values in the JSON are in **design px** (measured on the 1080-wide canvas).
Before applying them in your renderer, compute:

```js
const scale = outputCanvasWidth / 1080;
```

Fields that **must be scaled**:
- `np.st.ts.fs` — font size
- `np.st.ts.ls` — letter spacing
- `np.st.ts.shRn.textShadowOffset` (width & height)
- `np.st.ts.shRn.textShadowRadius`
- every `textShadowOffset` inside `np.st.ts.stRn`
- `ip.sw` — photo border width
- `ip.cr` — photo corner radius (square only)

Fields that are **already normalised** (percentages, 0–100) — just multiply:
- `ip.x`, `ip.y`, `ip.d`
- `np.y`, `np.h`

Fields that are **ready to use as-is** (no scaling):
- all hex / rgba color strings
- `ip.sh`, `ip.hb`
- `np.st.ts.c`, `np.st.ts.fw`, `np.st.ts.ta`
- `np.st.ts.shRn` → `textShadowColor`
- every `textShadowColor` inside `stRn`

---

## Font

**Font is not in the JSON.** The web editor uses *Noto Sans* for preview only.
Your app chooses the font independently.
All numeric values (size, weight, spacing) are font-agnostic.

---

## Top-level structure

```json
{
  "ar": "1080:1350",
  "t": true,
  "pc": ["Health", "Motivation"],
  "lg": ["English", "Hindi"],
  "bg": "data:image/jpeg;base64,/9j/4AAQ...",
  "mt": "image",
  "ip": { ... },
  "np": { ... }
}
```

| Key  | Type                   | Description                                                       |
|------|------------------------|-------------------------------------------------------------------|
| `ar` | string                 | Aspect ratio, format `"width:height"` e.g. `"1080:1350"`         |
| `t`  | boolean                | Template type — `true` = Self/Profile, `false` = Wishes/Upload   |
| `pc` | string[]               | Primary category tags selected by the designer                   |
| `lg` | string[]               | Language tags e.g. `["English"]`                                  |
| `bg` | string \| null         | Background — data URL (JPEG/PNG/video) or `null` if none uploaded |
| `mt` | `"image"` \| `"video"` | How to interpret `bg` — render as `<Image>` or `<Video>`         |
| `ip` | object                 | Photo placeholder config (position, size, shape, border)         |
| `np` | object                 | Name text placeholder config (position, size, text style)        |

---

## `ip` — Photo placeholder

```json
"ip": {
  "x": 36,
  "y": 8,
  "d": 28,
  "sh": "circle",
  "hb": false,
  "sw": 3,
  "sc": "#FFFFFF"
}
```

```json
"ip": {
  "x": 36,
  "y": 8,
  "d": 28,
  "sh": "square",
  "cr": 20,
  "hb": true,
  "sw": 0,
  "sc": "#FFFFFF"
}
```

| Key  | Type                      | Description                                                                                   |
|------|---------------------------|-----------------------------------------------------------------------------------------------|
| `x`  | number (0–100)            | Left edge of the photo frame as % of canvas width                                            |
| `y`  | number (0–100)            | Top edge of the photo frame as % of canvas height                                            |
| `d`  | number (0–100)            | Diameter / size of the photo frame as % of canvas width. Height always equals width.         |
| `sh` | `"circle"` \| `"square"`  | Shape of the photo frame                                                                      |
| `cr` | number (design px)        | Corner radius — **only present when `sh === "square"`**. Scale before use. Absent for circle.|
| `hb` | boolean                   | `true` = user has a background in their photo (show full). `false` = cutout/transparent photo.|
| `sw` | number (design px)        | Border width around the photo frame. `0` = no border. Scale before use.                      |
| `sc` | string (hex)              | Border colour e.g. `"#FFFFFF"`. Only relevant when `sw > 0`.                                 |

**How to render (RN):**

```jsx
const photoSize   = (ip.d / 100) * canvasWidth;
const photoLeft   = (ip.x / 100) * canvasWidth;
const photoTop    = (ip.y / 100) * canvasHeight;
const borderRadius = ip.sh === 'circle' ? photoSize / 2 : ip.cr * scale;
const borderWidth  = ip.sw * scale;  // 0 = no border

<View style={{
  position: 'absolute',
  left: photoLeft,
  top: photoTop,
  width: photoSize,
  height: photoSize,
  borderRadius,
  borderWidth: borderWidth > 0 ? borderWidth : undefined,
  borderColor: borderWidth > 0 ? ip.sc : undefined,
  overflow: 'hidden',
}}>
  <Image
    source={{ uri: userPhotoUri }}  // pass the actual user photo
    style={{ width: '100%', height: '100%' }}
    resizeMode="cover"
  />
</View>
```

**`hb` flag usage:**
- `hb: true` → user photo has a background. Show photo as-is (full rectangle clipped to circle/square).
- `hb: false` → user photo is a cutout / transparent PNG. Render without extra background fill.

---

## `np` — Name placeholder

```json
"np": {
  "y": 72,
  "h": 9,
  "st": { "ts": { ... } }
}
```

| Key | Type           | Description                                          |
|-----|----------------|------------------------------------------------------|
| `y` | number (0–100) | Top edge of the name band as % of canvas height      |
| `h` | number (0–100) | Height of the name band as % of canvas height        |

**Width and X are not in JSON** — they are fixed:
- Width = **80% of canvas width**
- X = centered → `(canvasWidth - bandWidth) / 2`

```jsx
const bandWidth  = canvasWidth * 0.80;
const bandHeight = (np.h / 100) * canvasHeight;
const bandLeft   = (canvasWidth - bandWidth) / 2;
const bandTop    = (np.y / 100) * canvasHeight;
```

---

## `np.st.ts` — Text style

All text styling lives under `np.st.ts`.

```json
"np": {
  "y": 72,
  "h": 9,
  "st": {
    "ts": {
      "c":  "#FFFFFF",
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
```

| Key    | Type                             | Description                                                         |
|--------|----------------------------------|---------------------------------------------------------------------|
| `c`    | string (hex)                     | Text colour e.g. `"#FFFFFF"`                                        |
| `fs`   | number (design px)               | Font size. **Scale before use.**                                    |
| `fw`   | number                           | Font weight e.g. `300`, `400`, `500`, `600`, `700`, `800`, `900`   |
| `ls`   | number (design px, can be 0)     | Letter spacing. **Scale before use.**                               |
| `ta`   | `"left"` \| `"center"` \| `"right"` | Text alignment                                                  |
| `shRn` | object \| `null`                 | Drop shadow. `null` = no shadow applied.                            |
| `stRn` | array (may be empty `[]`)        | Text stroke as shadow layers. Empty = no stroke.                    |

---

### `shRn` — Drop shadow

`null` when the designer set no shadow. When present:

```json
"shRn": {
  "textShadowOffset": { "width": 0, "height": 2 },
  "textShadowRadius": 8,
  "textShadowColor": "rgba(0,0,0,0.65)"
}
```

| Field               | Type                                    | Description                                    |
|---------------------|-----------------------------------------|------------------------------------------------|
| `textShadowOffset`  | `{ width: number, height: number }`     | X/Y offset in design px. **Scale before use.** |
| `textShadowRadius`  | number                                  | Blur radius in design px. **Scale before use.**|
| `textShadowColor`   | string (`rgba(r,g,b,a)`)               | Ready to use. Opacity is already baked in.     |

---

### `stRn` — Text stroke

React Native has no native text stroke. Stroke is simulated by rendering
one `<Text>` copy per shadow in the `stRn` array, all stacked behind the
main text. Empty array = no stroke.

Each item:

```json
{
  "textShadowOffset": { "width": 2.0, "height": 0.0 },
  "textShadowRadius": 0,
  "textShadowColor": "#000000"
}
```

| Field               | Type                                    | Description                                      |
|---------------------|-----------------------------------------|--------------------------------------------------|
| `textShadowOffset`  | `{ width: number, height: number }`     | Offset forming the stroke outline. **Scale.**    |
| `textShadowRadius`  | number                                  | Always `0` for stroke. No scaling needed.        |
| `textShadowColor`   | string (hex)                            | Stroke colour. Ready to use.                     |

For strokes ≤ 3px: 24 shadow items (every 15° around the text).
For strokes > 3px: 24 outer + 12 inner (36 items total) to fill gaps.

---

## Complete rendering code (RN Android)

```jsx
import { View, Text, Image, StyleSheet } from 'react-native';

function PosterTemplate({ json, outputWidth, userName, userPhotoUri }) {
  const outputHeight = outputWidth * (canvasHeightFromAr(json.ar) / 1080);
  const scale = outputWidth / 1080;
  const canvasWidth = outputWidth;
  const canvasHeight = outputHeight;

  const { ip, np } = json;
  const ts = np.st.ts;

  // ── Photo ──────────────────────────────────────────────────────────
  const photoSize   = (ip.d / 100) * canvasWidth;
  const photoLeft   = (ip.x / 100) * canvasWidth;
  const photoTop    = (ip.y / 100) * canvasHeight;
  const borderRadius = ip.sh === 'circle' ? photoSize / 2 : ip.cr * scale;
  const borderWidth  = ip.sw * scale;

  // ── Name band ──────────────────────────────────────────────────────
  const bandWidth  = canvasWidth * 0.80;
  const bandHeight = (np.h / 100) * canvasHeight;
  const bandLeft   = (canvasWidth - bandWidth) / 2;
  const bandTop    = (np.y / 100) * canvasHeight;

  // ── Text base style ────────────────────────────────────────────────
  const baseTextStyle = {
    color:         ts.c,
    fontSize:      ts.fs * scale,
    fontWeight:    String(ts.fw),
    letterSpacing: ts.ls * scale,
    textAlign:     ts.ta,
    width:         bandWidth,
  };

  // ── Shadow style ───────────────────────────────────────────────────
  const shadowStyle = ts.shRn ? {
    textShadowOffset: {
      width:  ts.shRn.textShadowOffset.width  * scale,
      height: ts.shRn.textShadowOffset.height * scale,
    },
    textShadowRadius: ts.shRn.textShadowRadius * scale,
    textShadowColor:  ts.shRn.textShadowColor,
  } : {};

  return (
    <View style={{ width: canvasWidth, height: canvasHeight }}>

      {/* Background */}
      {json.bg && (
        json.mt === 'image'
          ? <Image source={{ uri: json.bg }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          : <Video source={{ uri: json.bg }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      )}

      {/* Photo placeholder */}
      <View style={{
        position: 'absolute',
        left: photoLeft, top: photoTop,
        width: photoSize, height: photoSize,
        borderRadius,
        borderWidth: borderWidth > 0 ? borderWidth : 0,
        borderColor: borderWidth > 0 ? ip.sc : 'transparent',
        overflow: 'hidden',
      }}>
        {userPhotoUri && (
          <Image
            source={{ uri: userPhotoUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Name band */}
      <View style={{
        position: 'absolute',
        left: bandLeft, top: bandTop,
        width: bandWidth, height: bandHeight,
        alignItems: ts.ta === 'left' ? 'flex-start' : ts.ta === 'right' ? 'flex-end' : 'center',
        justifyContent: 'center',
      }}>

        {/* Stroke layers — render BEFORE main text (behind) */}
        {ts.stRn.map((s, i) => (
          <Text
            key={i}
            style={[
              baseTextStyle,
              StyleSheet.absoluteFill,
              {
                textShadowOffset: {
                  width:  s.textShadowOffset.width  * scale,
                  height: s.textShadowOffset.height * scale,
                },
                textShadowRadius: 0,
                textShadowColor: s.textShadowColor,
              },
            ]}
            numberOfLines={1}
          >
            {userName}
          </Text>
        ))}

        {/* Main text — on top, with optional drop shadow */}
        <Text
          style={[baseTextStyle, shadowStyle]}
          numberOfLines={1}
        >
          {userName}
        </Text>
      </View>

    </View>
  );
}

// Helper: get canvas height from ar string
function canvasHeightFromAr(ar) {
  const [, h] = ar.split(':').map(Number);
  return h;
}
```

---

## Full example JSON

```json
{
  "ar": "1080:1350",
  "t": true,
  "pc": ["Health"],
  "lg": ["English"],
  "bg": "data:image/jpeg;base64,...",
  "mt": "image",
  "ip": {
    "x": 36,
    "y": 8,
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
        "stRn": [
          { "textShadowOffset": { "width": 2.5,  "height": 0.0  }, "textShadowRadius": 0, "textShadowColor": "#000000" },
          { "textShadowOffset": { "width": 2.29, "height": 1.08 }, "textShadowRadius": 0, "textShadowColor": "#000000" },
          { "textShadowOffset": { "width": 1.77, "height": 1.77 }, "textShadowRadius": 0, "textShadowColor": "#000000" }
        ]
      }
    }
  }
}
```

> `stRn` normally contains 24 items (or 36 for thick strokes). Truncated here for readability.

---

## TypeScript type

```ts
import type { CompactTemplateJSON } from '@/templateSchema';
```

See `src/templateSchema.ts` for the full typed definition and key → meaning map.
