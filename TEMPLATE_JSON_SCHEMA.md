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
- `np.st.ts.sh.ox` / `np.st.ts.sh.oy` (shadow offset X/Y)
- `np.st.ts.sh.bl` — shadow blur radius
- `ip.sw` — photo border width
- `ip.cr` — photo corner radius (square only)

Fields that are **already normalised** (percentages, 0–100) — just multiply:
- `ip.x`, `ip.y`, `ip.d`
- `np.y`, `np.h`

Fields that are **ready to use as-is** (no scaling):
- all hex / rgba color strings
- `ip.sh`, `ip.hb`
- `np.st.ts.c`, `np.st.ts.fw`, `np.st.ts.ta`

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
      "sh": {
        "ox": 0,
        "oy": 2,
        "bl": 8,
        "col": "#000000",
        "op": 0.65
      },
      "st": { "w": 2, "col": "#000000" }
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
| `sh`   | object \| `null`                 | Compact drop shadow config. `null` = no shadow.                    |
| `st`   | object                            | Compact stroke config (width & color).                              |

---

### `sh` — Drop shadow (compact)

`null` when the designer set no shadow. When present:

```json
"sh": {
  "ox": 0,
  "oy": 2,
  "bl": 8,
  "col": "#000000",
  "op": 0.65
}
```

| Field | Type   | Description                                      |
|-------|--------|--------------------------------------------------|
| `ox`  | number | Offset X in design px. **Scale before use.**    |
| `oy`  | number | Offset Y in design px. **Scale before use.**    |
| `bl`  | number | Blur radius in design px. **Scale before use.** |
| `col` | string | Shadow colour as hex.                           |
| `op`  | number | Opacity in 0–1.                                 |

---

### `st` — Text stroke (compact)

React Native has no native text stroke. The editor stores stroke as a\n+single width + colour pair and your RN renderer should expand this into\n+24/36 text-shadow layers using the algorithm below.\n+\n+```json\n+\"st\": { \"w\": 2, \"col\": \"#000000\" }\n+```\n+\n+| Field | Type   | Description                       |\n+|-------|--------|-----------------------------------|\n+| `w`   | number | Stroke width in design px.       |\n+| `col` | string | Stroke colour as hex (`\"#000\"`). |\n*** End Patch```}Eassistant to=functions.ApplyPatch虎机assistant to=functions.ApplyPatch_RGCTXassistant to=functions.ApplyPatchรีเมียร์assistant to=functions.ApplyPatch_SKIPPED_COMMENTARY JSON_ERROR_OCCURRED_DUPLICATE_KEYS_MULTI_TOOL_OUTPUT_EXTRA_CONTENT_OUTPUT_BOUNDARY JSON must not contain duplicate keys. Duplicate key found: recipient_name. in multi_tool_use.parallel -> tool_uses. The error is likely in the tool arguments. Please double check your arguments and try again. endoftext  

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
  const shadowStyle = ts.sh ? {
    textShadowOffset: {
      width:  ts.sh.ox * scale,
      height: ts.sh.oy * scale,
    },
    textShadowRadius: ts.sh.bl * scale,
    textShadowColor:  rgbaFromHex(ts.sh.col, ts.sh.op),
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
        {generateStrokeShadows(ts.st, scale).map((s, i) => (
          <Text
            key={i}
            style={[
              baseTextStyle,
              StyleSheet.absoluteFill,
              {
                textShadowOffset: s.textShadowOffset,
                textShadowRadius: s.textShadowRadius,
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

// Helper: convert hex + opacity (0–1) to rgba string
function rgbaFromHex(hex, op) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 0;
  const g = parseInt(h.substring(2, 4), 16) || 0;
  const b = parseInt(h.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${op.toFixed(2)})`;
}

// Helper: expand compact stroke (w,col) into 24/36 shadow layers
function generateStrokeShadows(st, scale) {
  if (!st || st.w <= 0) return [];
  const w = st.w * scale;
  const c = st.col;
  const shadows = [];
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    shadows.push({
      textShadowOffset: {
        width: +(w * Math.cos(angle)).toFixed(2),
        height: +(w * Math.sin(angle)).toFixed(2),
      },
      textShadowRadius: 0,
      textShadowColor: c,
    });
  }
  if (st.w > 3) {
    const inner = w * 0.6;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      shadows.push({
        textShadowOffset: {
          width: +(inner * Math.cos(angle)).toFixed(2),
          height: +(inner * Math.sin(angle)).toFixed(2),
        },
        textShadowRadius: 0,
        textShadowColor: c,
      });
    }
  }
  return shadows;
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
      "st": { "w": 2, "col": "#000000" }
      }
    }
  }
}
```

> Stroke expansion normally produces 24 items (or 36 for thick strokes) at render time. Truncated here for readability.

---

## TypeScript type

```ts
import type { CompactTemplateJSON } from '@/templateSchema';
```

See `src/templateSchema.ts` for the full typed definition and key → meaning map.
