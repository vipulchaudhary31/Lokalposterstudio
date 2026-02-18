## Template JSON Key Map (Compact → Meaning)

This file is a **pure key → meaning reference** for the exported template JSON.
Use it when converting between short/compact keys and their full meaning in
your React Native app or backend.

It mirrors `CompactTemplateJSON` in `src/templateSchema.ts` and
`TEMPLATE_JSON_SCHEMA.md`, but without any rendering code or extra text.

---

### Top-level keys

| Key | Path | Meaning |
|-----|------|---------|
| `ar` | `ar` | Aspect ratio string, e.g. `"1080:1350"` |
| `t`  | `t`  | Template type — `true` = Self/Profile, `false` = Wishes/Upload |
| `pc` | `pc` | Primary categories (tags) selected in the editor |
| `lg` | `lg` | Language tags (e.g. `["English","Hindi"]`) |
| `bg` | `bg` | Background image/video as data URL, or `null` |
| `mt` | `mt` | Media type for `bg`: `"image"` or `"video"` |
| `ip` | `ip` | Image (photo) placeholder object |
| `np` | `np` | Name text placeholder object |

---

### `ip` — Image placeholder

All under `ip`:

| Key | Path | Meaning |
|-----|------|---------|
| `x`  | `ip.x`  | Photo frame left position as % of canvas width (0–100) |
| `y`  | `ip.y`  | Photo frame top position as % of canvas height (0–100) |
| `d`  | `ip.d`  | Photo frame diameter/size as % of canvas width (0–100) |
| `sh` | `ip.sh` | Photo frame shape — `"circle"` or `"square"` |
| `cr` | `ip.cr` | Corner radius in design px (only when `sh === "square"`) |
| `hb` | `ip.hb` | Has background — `true` = full photo, `false` = cutout PNG |
| `sw` | `ip.sw` | Photo border (stroke) width in design px |
| `sc` | `ip.sc` | Photo border (stroke) colour as hex string |

---

### `np` — Name placeholder

Top-level under `np`:

| Key | Path | Meaning |
|-----|------|---------|
| `y` | `np.y` | Name band top position as % of canvas height (0–100) |
| `st` | `np.st` | Styling container (text style object lives at `np.st.ts`) |

---

### `np.st.ts` — Text style (main object)

All under `np.st.ts`:

| Key | Path | Meaning |
|-----|------|---------|
| `c`   | `np.st.ts.c`   | Text colour as hex (e.g. `"#FFFFFF"`) |
| `fs`  | `np.st.ts.fs`  | Font size in design px |
| `fw`  | `np.st.ts.fw`  | Font weight as numeric value (e.g. `400`, `700`) |
| `ls`  | `np.st.ts.ls`  | Letter spacing in design px |
| `ta`  | `np.st.ts.ta`  | Text alignment — `"left"`, `"center"`, or `"right"` |
| `sh`  | `np.st.ts.sh`  | Compact text shadow object (or `null`) |
| `st`  | `np.st.ts.st`  | Compact text stroke object |

---

### `np.st.ts.sh` — Text shadow (compact)

When `sh` is not `null`, these are the keys under `np.st.ts.sh`:

| Key | Path | Meaning |
|-----|------|---------|
| `ox`  | `np.st.ts.sh.ox`  | Shadow offset X in design px |
| `oy`  | `np.st.ts.sh.oy`  | Shadow offset Y in design px |
| `bl`  | `np.st.ts.sh.bl`  | Shadow blur radius in design px |
| `col` | `np.st.ts.sh.col` | Shadow colour as hex (e.g. `"#000000"`) |
| `op`  | `np.st.ts.sh.op`  | Shadow opacity as a 0–1 float (e.g. `0.65`) |

If `sh` is `null`, the text has **no** shadow.

---

### `np.st.ts.st` — Text stroke (compact)

These keys live under `np.st.ts.st`:

| Key | Path | Meaning |
|-----|------|---------|
| `w`   | `np.st.ts.st.w`   | Stroke width in design px (0 = no stroke) |
| `col` | `np.st.ts.st.col` | Stroke colour as hex (e.g. `"#000000"`) |

When `w === 0`, there is effectively **no stroke**.

---

### Quick reference summary

- **Aspect & background**: `ar`, `bg`, `mt`
- **Template meta**: `t`, `pc`, `lg`
- **Photo frame**: `ip.x`, `ip.y`, `ip.d`, `ip.sh`, `ip.cr`, `ip.hb`, `ip.sw`, `ip.sc`
- **Name band**: `np.y`
- **Text style**: `np.st.ts.c`, `fs`, `fw`, `ls`, `ta`
- **Shadow**: `np.st.ts.sh.ox`, `oy`, `bl`, `col`, `op` (or `sh = null`)
- **Stroke**: `np.st.ts.st.w`, `col`

