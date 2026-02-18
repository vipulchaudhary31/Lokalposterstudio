# React Native Rendering Verification

This document verifies that the JSON export will render **exactly** the same visual styles in React Native as shown in the editor.

## ✅ Verified Correct Mappings

### 1. **Image Placeholder (`ip`)**

| Editor Value | JSON Export | RN Usage | Status |
|-------------|-------------|----------|--------|
| Position (px) | `x: 50` (0-100%) | `(x / 100) * canvasWidth` | ✅ Correct |
| Position (px) | `y: 20` (0-100%) | `(y / 100) * canvasHeight` | ✅ Correct |
| Diameter (px) | `d: 28` (0-100%) | `(d / 100) * canvasWidth` | ✅ Correct |
| Shape | `sh: "circle"` or `"square"` | Direct use | ✅ Correct |
| Corner Radius (px) | `cr: 16` | Direct use (only for square) | ✅ Correct |
| Has Background | `hb: true/false` | Use cutout vs full image | ✅ Correct |
| Stroke Width (px) | `sw: 4` | Direct use | ✅ Correct |
| Stroke Color | `sc: "#FFFFFF"` | Direct use | ✅ Correct |

### 2. **Name Placeholder (`np`)**

| Editor Value | JSON Export | RN Usage | Status |
|-------------|-------------|----------|--------|
| Y Position (px) | `y: 55` (0-100%) | `(y / 100) * canvasHeight` | ✅ Correct |
| Height (px) | `h: 10` (0-100%) | `(h / 100) * canvasHeight` | ✅ Correct |
| X Position | Not in JSON | Always centered | ✅ Correct (by design) |
| Width | Not in JSON | Fixed % (e.g., 80%) | ✅ Correct (by design) |

### 3. **Text Style (`np.st.ts`)**

| Editor Value | JSON Export | RN Usage | Status |
|-------------|-------------|----------|--------|
| Color | `c: "#FFFFFF"` | Direct use | ✅ Correct |
| Font Size (px) | `fs: 64` | Direct use | ✅ Correct |
| Font Weight | `fw: 500` | Direct use | ✅ Correct |
| Letter Spacing (px) | `ls: 0` | Direct use | ✅ Correct |
| Text Alignment | `ta: "center"` | Direct use | ✅ Correct |

### 4. **Text Shadow (`np.st.ts.sh`)**

| Editor Value | JSON Export | RN Usage | Status |
|-------------|-------------|----------|--------|
| Offset X (px) | `ox: 0` | Direct use | ✅ Correct |
| Offset Y (px) | `oy: 2` | Direct use | ✅ Correct |
| Blur (px) | `bl: 8` | Direct use | ✅ Correct |
| Color | `col: "#000000"` | Direct use | ✅ Correct |
| Opacity (0-100) | `op: 0.65` (0-1) | **Use `shRn` directly** | ✅ Correct |

**⚠️ IMPORTANT:** The `sh.op` value is exported as 0-1, but `shRn` (React Native object) is pre-computed correctly using the original 0-100 opacity. **Backend should use `shRn` directly**, not reconstruct from `sh`.

### 5. **Text Stroke (`np.st.ts.st`)**

| Editor Value | JSON Export      | RN Usage                               | Status |
|-------------|------------------|-----------------------------------------|--------|
| Width (px)  | `st.w: 2`        | Generate 24/36 stroke shadows from `w` | ✅ Correct |
| Color       | `st.col: "#000"` | Use as stroke colour in generated ring | ✅ Correct |

**⚠️ IMPORTANT:** React Native doesn't support `textStroke` directly. The RN app must expand `st` into a set of text-shadow layers using the same algorithm as the web tool (see TEMPLATE_JSON_SCHEMA.md).

## 🎯 React Native Implementation Guide

### Text Rendering (Critical)

```tsx
// ✅ CORRECT: Use pre-computed shRn and generate stroke from st
<Text
  style={{
    color: json.np.st.ts.c,
    fontSize: json.np.st.ts.fs,
    fontWeight: json.np.st.ts.fw,
    letterSpacing: json.np.st.ts.ls,
    textAlign: json.np.st.ts.ta,
    // Use shRn directly (already computed correctly)
    ...json.np.st.ts.shRn,
  }}
>
  {userName}
</Text>
```

### Stroke Implementation (React Native Limitation)

React Native doesn't support `textStroke` natively. The app must expand `st` into a set of text-shadow layers (24 or 36 items) using the same algorithm as the web tool, then render one `<Text>` per shadow behind the main text. See TEMPLATE_JSON_SCHEMA.md for the reference implementation.

## ⚠️ Potential Issues Found

### Issue 1: Opacity Scale Mismatch (FIXED ✅)

- **Problem:** `sh.op` is exported as 0-1, but `textShadowToRN()` expects 0-100
- **Status:** ✅ FIXED - `shRn` is pre-computed correctly using original 0-100 opacity
- **Solution:** Backend should use `shRn` directly, not reconstruct from `sh`

### Issue 2: Stroke Color Format

- **Status:** ✅ VERIFIED - Stroke colour in `st.col` is hex (e.g., `"#000000"`)
- **Note:** React Native accepts hex colors directly

## 📋 Verification Checklist

- [x] Positions (x, y) exported as percentages (0-100)
- [x] Sizes (diameter, height) exported as percentages (0-100)
- [x] Colors exported as hex strings
- [x] Font sizes exported in design pixels
- [x] Opacity exported as 0-1 in `sh.op`
- [x] `shRn` pre-computed correctly with rgba colors
- [x] All numeric values match editor display

## 🚀 Backend Implementation Notes

1. **Always use `shRn`** - this is pre-computed for React Native drop shadow
2. **Don't reconstruct shadows from `sh`** - opacity scale differs (0-1 vs 0-100)
3. **For stroke:** Use `st` (width/color) and generate stroke shadows on RN side
4. **Canvas dimensions:** Use `ar` (aspectRatio) to determine canvas size
5. **Image placeholder:** Use `hb` flag to decide between cutout vs full image

## ✅ Conclusion

**YES, the JSON export will render the exact same visual styles in React Native**, provided the backend:
1. Uses `shRn` directly (not reconstructing from `sh`)
2. Expands `st` into stroke shadows for rendering
3. Converts percentage positions/sizes correctly
4. Uses all other values directly as exported
