## Full Template JSON Schema (Expanded Keys)

This file documents **all possible keys** in the exported template JSON,
using **full, descriptive names**, independent of the compact keys used
in `TEMPLATE_JSON_SCHEMA.md`.

Use this as a master list when:
- deciding which properties your app needs for a particular use‑case
- mapping from compact keys → full internal model
- checking what optional fields exist.

> Note: this is a logical schema, not a strict JSON Schema draft.

---

### 1. Root object

Top-level structure (expanded names):

```ts
interface TemplateJSONFull {
  aspectRatio: string;
  isProfileTemplate: boolean;
  primaryCategories: string[];
  languageTags: string[];
  backgroundImage: string | null;
  mediaType: 'image' | 'video';
  imagePlaceholder: ImagePlaceholder;
  namePlaceholder: NamePlaceholder;
}
```

Key descriptions:

| Full name           | Type                        | Description                                                        |
|---------------------|-----------------------------|--------------------------------------------------------------------|
| `aspectRatio`       | string                      | `"width:height"` e.g. `"1080:1350"`                               |
| `isProfileTemplate` | boolean                     | `true` = Self/Profile, `false` = Wishes/Upload                    |
| `primaryCategories` | string[]                    | Tags chosen in the editor (Self/Wishes categories)                |
| `languageTags`      | string[]                    | Language labels (e.g. `["English","Hindi"]`)                      |
| `backgroundImage`   | string \| null              | Background image/video as data URL or `null`                      |
| `mediaType`         | `'image'` \| `'video'`      | How to interpret `backgroundImage`                                |
| `imagePlaceholder`  | `ImagePlaceholder`          | Photo frame position/shape/border config                          |
| `namePlaceholder`   | `NamePlaceholder`           | Name text band position + text styling                            |

---

### 2. `ImagePlaceholder`

```ts
interface ImagePlaceholder {
  xPercent: number;          // 0–100
  yPercent: number;          // 0–100
  diameterPercent: number;   // 0–100
  shape: 'circle' | 'square';
  cornerRadiusPx?: number;   // only for shape === 'square'
  hasBackground: boolean;
  strokeWidthPx: number;
  strokeColor: string;       // hex
}
```

All variants:

| Full name         | Type                  | Description                                                         |
|-------------------|-----------------------|---------------------------------------------------------------------|
| `xPercent`        | number (0–100)        | Left of photo frame as % of canvas width                           |
| `yPercent`        | number (0–100)        | Top of photo frame as % of canvas height                           |
| `diameterPercent` | number (0–100)        | Size of photo frame as % of canvas width                           |
| `shape`           | `'circle'|'square'`   | Frame shape                                                         |
| `cornerRadiusPx`  | number \| undefined   | Corner radius (design px) — only for `shape === 'square'`          |
| `hasBackground`   | boolean               | `true` = user photo keeps background, `false` = cutout/PNG         |
| `strokeWidthPx`   | number                | Photo border width (design px, 0 = none)                           |
| `strokeColor`     | string (hex)          | Photo border colour                                                |

---

### 3. `NamePlaceholder`

```ts
interface NamePlaceholder {
  yPercent: number;          // 0–100
  styling: NameStyling;
}
```

| Full name        | Type               | Description                                        |
|------------------|--------------------|----------------------------------------------------|
| `yPercent`       | number (0–100)     | Top of name band as % of canvas height             |
| `styling`        | `NameStyling`      | Text styling container (currently a single style)  |

---

### 4. `NameStyling` and `TextStyleFull`

```ts
interface NameStyling {
  textStyle: TextStyleFull;
}

interface TextStyleFull {
  color: string;                 // hex
  fontSizePx: number;            // design px
  fontWeight: number;            // e.g. 400, 600, 700
  letterSpacingPx: number;       // design px
  textAlign: 'left' | 'center' | 'right';
  shadow: TextShadowFull | null;
  stroke: TextStrokeFull;
}
```

All fields with meanings:

| Full name          | Type                             | Description                                    |
|--------------------|----------------------------------|------------------------------------------------|
| `color`            | string (hex)                     | Text colour                                   |
| `fontSizePx`       | number                           | Base font size in design px                   |
| `fontWeight`       | number                           | Numeric weight (300/400/500/600/700/800/900)  |
| `letterSpacingPx`  | number                           | Letter spacing in design px                   |
| `textAlign`        | `'left'|'center'|'right'`        | Text alignment                                |
| `shadow`           | `TextShadowFull \| null`         | Text drop shadow, `null` = no shadow          |
| `stroke`           | `TextStrokeFull`                 | Text stroke/outline settings                  |

---

### 5. `TextShadowFull` (from compact `sh`)

```ts
interface TextShadowFull {
  offsetXPx: number;   // design px
  offsetYPx: number;   // design px
  blurRadiusPx: number;// design px
  color: string;       // hex
  opacity: number;     // 0–1
}
```

| Full name       | Type    | Description                                       |
|-----------------|---------|---------------------------------------------------|
| `offsetXPx`     | number  | Shadow X offset in design px                     |
| `offsetYPx`     | number  | Shadow Y offset in design px                     |
| `blurRadiusPx`  | number  | Shadow blur radius in design px                  |
| `color`         | string  | Shadow colour as hex                             |
| `opacity`       | number  | Shadow opacity as float in [0, 1]                |

When `shadow` is `null`, all of the above are absent (no shadow applied).

---

### 6. `TextStrokeFull` (from compact `st`)

```ts
interface TextStrokeFull {
  widthPx: number;     // design px
  color: string;       // hex
}
```

| Full name | Type   | Description                            |
|-----------|--------|----------------------------------------|
| `widthPx` | number | Stroke width in design px (0 = none)  |
| `color`   | string | Stroke colour as hex (e.g. `"#000"`)  |

If `widthPx` is `0`, the visual result is “no stroke”.

---

### 7. Compact → Full quick index

This section shows the **current compact keys** and the full name they map to.

| Compact key      | Full path                                      |
|------------------|-------------------------------------------------|
| `ar`             | `aspectRatio`                                  |
| `t`              | `isProfileTemplate`                            |
| `pc`             | `primaryCategories`                            |
| `lg`             | `languageTags`                                 |
| `bg`             | `backgroundImage`                              |
| `mt`             | `mediaType`                                    |
| `ip.x`           | `imagePlaceholder.xPercent`                    |
| `ip.y`           | `imagePlaceholder.yPercent`                    |
| `ip.d`           | `imagePlaceholder.diameterPercent`             |
| `ip.sh`          | `imagePlaceholder.shape`                       |
| `ip.cr`          | `imagePlaceholder.cornerRadiusPx`              |
| `ip.hb`          | `imagePlaceholder.hasBackground`               |
| `ip.sw`          | `imagePlaceholder.strokeWidthPx`               |
| `ip.sc`          | `imagePlaceholder.strokeColor`                 |
| `np.y`           | `namePlaceholder.yPercent`                     |
| `np.st.ts.c`     | `namePlaceholder.styling.textStyle.color`      |
| `np.st.ts.fs`    | `namePlaceholder.styling.textStyle.fontSizePx` |
| `np.st.ts.fw`    | `namePlaceholder.styling.textStyle.fontWeight` |
| `np.st.ts.ls`    | `namePlaceholder.styling.textStyle.letterSpacingPx` |
| `np.st.ts.ta`    | `namePlaceholder.styling.textStyle.textAlign`  |
| `np.st.ts.sh`    | `namePlaceholder.styling.textStyle.shadow`     |
| `np.st.ts.st`    | `namePlaceholder.styling.textStyle.stroke`     |

