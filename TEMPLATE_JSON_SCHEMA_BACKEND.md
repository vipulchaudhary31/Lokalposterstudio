## Template JSON Schema — Backend Model & Key Map

Exported by **Poster Studio** web tool.  
Audience: **backend developers** who need to:
- understand the **full logical structure** of the template JSON, and  
- map from **compact keys** in the payload → **full internal model** in their service.

This file combines the content of:
- the full logical schema (expanded names), and  
- the compact → full key map,
into **one authoritative backend-facing document**.

---

### 1. Root object (expanded names)

Logical TypeScript-style interface (not a strict JSON Schema draft):

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

| Full name         | Type                  | Description                                                         |
|-------------------|-----------------------|---------------------------------------------------------------------|
| `xPercent`        | number (0–100)        | Left of photo frame as % of canvas width                           |
| `yPercent`        | number (0–100)        | Top of photo frame as % of canvas height                           |
| `diameterPercent` | number (0–100)        | Size of photo frame as % of canvas width                           |
| `shape`           | `'circle' \| 'square'`| Frame shape                                                         |
| `cornerRadiusPx`  | number \| undefined   | Corner radius (design px) — only for `shape === "square"`          |
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

| Full name  | Type          | Description                                        |
|------------|---------------|----------------------------------------------------|
| `yPercent` | number (0–100)| Top of name band as % of canvas height             |
| `styling`  | `NameStyling` | Text styling container (currently a single style)  |

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

| Full name         | Type                             | Description                                    |
|-------------------|----------------------------------|------------------------------------------------|
| `color`           | string (hex)                     | Text colour                                   |
| `fontSizePx`      | number                           | Base font size in design px                   |
| `fontWeight`      | number                           | Numeric weight (300/400/500/600/700/800/900)  |
| `letterSpacingPx` | number                           | Letter spacing in design px                   |
| `textAlign`       | `'left' \| 'center' \| 'right'`  | Text alignment                                |
| `shadow`          | `TextShadowFull \| null`         | Text drop shadow, `null` = no shadow          |
| `stroke`          | `TextStrokeFull`                 | Text stroke/outline settings                  |

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

| Full name      | Type    | Description                                       |
|----------------|---------|---------------------------------------------------|
| `offsetXPx`    | number  | Shadow X offset in design px                     |
| `offsetYPx`    | number  | Shadow Y offset in design px                     |
| `blurRadiusPx` | number  | Shadow blur radius in design px                  |
| `color`        | string  | Shadow colour as hex                             |
| `opacity`      | number  | Shadow opacity as float in \[0, 1]               |

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

### 7. Compact → Full key map

This section shows the **current compact keys in the JSON** and the full
field path they map to in the logical model above.

#### 7.1 Top-level keys

| Compact key | Full path             | Meaning                                                          |
|-------------|----------------------|------------------------------------------------------------------|
| `ar`        | `aspectRatio`        | Aspect ratio string, e.g. `"1080:1350"`                          |
| `t`         | `isProfileTemplate`  | Template type — `true` = Self/Profile, `false` = Wishes/Upload   |
| `pc`        | `primaryCategories`  | Primary categories (tags) selected in the editor                 |
| `lg`        | `languageTags`       | Language tags (e.g. `["English","Hindi"]`)                       |
| `bg`        | `backgroundImage`    | Background image/video as data URL, or `null`                    |
| `mt`        | `mediaType`          | Media type for `backgroundImage`: `"image"` or `"video"`         |
| `ip`        | `imagePlaceholder`   | Image (photo) placeholder object                                 |
| `np`        | `namePlaceholder`    | Name text placeholder object                                     |

#### 7.2 `ip` — Image placeholder

All under `ip`:

| Compact key | Full path                                   | Meaning                                                           |
|-------------|---------------------------------------------|-------------------------------------------------------------------|
| `ip.x`      | `imagePlaceholder.xPercent`                 | Photo frame left position as % of canvas width (0–100)           |
| `ip.y`      | `imagePlaceholder.yPercent`                 | Photo frame top position as % of canvas height (0–100)           |
| `ip.d`      | `imagePlaceholder.diameterPercent`          | Photo frame diameter/size as % of canvas width (0–100)           |
| `ip.sh`     | `imagePlaceholder.shape`                    | Photo frame shape — `"circle"` or `"square"`                     |
| `ip.cr`     | `imagePlaceholder.cornerRadiusPx`           | Corner radius in design px (only when `shape === "square"`)      |
| `ip.hb`     | `imagePlaceholder.hasBackground`            | Has background — `true` = full photo, `false` = cutout PNG       |
| `ip.sw`     | `imagePlaceholder.strokeWidthPx`            | Photo border (stroke) width in design px                         |
| `ip.sc`     | `imagePlaceholder.strokeColor`              | Photo border (stroke) colour as hex string                       |

#### 7.3 `np` — Name placeholder

Top-level under `np`:

| Compact key | Full path                           | Meaning                                                  |
|-------------|-------------------------------------|----------------------------------------------------------|
| `np.y`      | `namePlaceholder.yPercent`          | Name band top position as % of canvas height (0–100)    |
| `np.st`     | `namePlaceholder.styling`           | Styling container (text style object lives at `.ts`)    |

#### 7.4 `np.st.ts` — Text style (main object)

All under `np.st.ts`:

| Compact key   | Full path                                        | Meaning                                                   |
|---------------|--------------------------------------------------|-----------------------------------------------------------|
| `np.st.ts.c`  | `namePlaceholder.styling.textStyle.color`        | Text colour as hex (e.g. `"#FFFFFF"`)                    |
| `np.st.ts.fs` | `namePlaceholder.styling.textStyle.fontSizePx`   | Font size in design px                                   |
| `np.st.ts.fw` | `namePlaceholder.styling.textStyle.fontWeight`   | Font weight as numeric value (e.g. `400`, `700`)         |
| `np.st.ts.ls` | `namePlaceholder.styling.textStyle.letterSpacingPx` | Letter spacing in design px                          |
| `np.st.ts.ta` | `namePlaceholder.styling.textStyle.textAlign`    | Text alignment — `"left"`, `"center"`, or `"right"`      |
| `np.st.ts.sh` | `namePlaceholder.styling.textStyle.shadow`       | Compact text shadow object (or `null`)                   |
| `np.st.ts.st` | `namePlaceholder.styling.textStyle.stroke`       | Compact text stroke object                               |

#### 7.5 `np.st.ts.sh` — Text shadow (compact)

When `sh` is not `null`, these are the keys under `np.st.ts.sh`:

| Compact key      | Full path                                             | Meaning                                      |
|------------------|-------------------------------------------------------|----------------------------------------------|
| `np.st.ts.sh.ox` | `namePlaceholder.styling.textStyle.shadow.offsetXPx`  | Shadow offset X in design px                 |
| `np.st.ts.sh.oy` | `namePlaceholder.styling.textStyle.shadow.offsetYPx`  | Shadow offset Y in design px                 |
| `np.st.ts.sh.bl` | `namePlaceholder.styling.textStyle.shadow.blurRadiusPx` | Shadow blur radius in design px           |
| `np.st.ts.sh.col`| `namePlaceholder.styling.textStyle.shadow.color`      | Shadow colour as hex                         |
| `np.st.ts.sh.op` | `namePlaceholder.styling.textStyle.shadow.opacity`    | Shadow opacity as a 0–1 float (e.g. `0.65`) |

If `sh` is `null`, the text has **no** shadow.

#### 7.6 `np.st.ts.st` — Text stroke (compact)

These keys live under `np.st.ts.st`:

| Compact key       | Full path                                          | Meaning                                      |
|-------------------|----------------------------------------------------|----------------------------------------------|
| `np.st.ts.st.w`   | `namePlaceholder.styling.textStyle.stroke.widthPx` | Stroke width in design px (0 = no stroke)    |
| `np.st.ts.st.col` | `namePlaceholder.styling.textStyle.stroke.color`   | Stroke colour as hex (e.g. `"#000000"`)      |

When `w === 0`, there is effectively **no stroke**.

---

### 8. Quick backend summary

- **Use the expanded interfaces** (`TemplateJSONFull`, `ImagePlaceholder`, `NamePlaceholder`, etc.)
  as your internal backend model.
- Use the **compact → full map** above to decode the compact payload you receive
  from the Poster Studio web tool into that internal model.
- All rendering-specific React Native details live in  
  `TEMPLATE_JSON_SCHEMA_FRONTEND.md` (frontend guide); this backend document
  is only about **data shape and meaning**.

