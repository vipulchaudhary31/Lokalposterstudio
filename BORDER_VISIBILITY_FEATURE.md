# Border Visibility Toggle Feature

## Overview
Added an optional toggle to control whether the photo placeholder shows a visible border in the editor. This gives designers the choice to hide the dashed border outline when stroke style is set to "None", making the placeholder completely invisible on the canvas.

## Feature Details

### User Control
- **Toggle Location**: Photo Border Style section in the right panel
- **Label**: "Show Border in Editor"
- **Description**: "Display dashed outline on canvas"
- **Default State**: Enabled (checked) - preserves existing behavior
- **Type**: Checkbox with clear visual indicator

### Behavior

#### When Toggle is ON (Default)
- Stroke style "None" → Shows white dashed border (2px)
- Placeholder is clearly visible on canvas
- Easy to locate and drag the photo placeholder
- **Use Case**: Default editing mode for positioning

#### When Toggle is OFF
- Stroke style "None" → No visible border at all
- Placeholder is completely invisible (transparent)
- Only shows semi-transparent overlay when dragging
- **Use Case**: Preview mode or when you want clean canvas view

### Important Notes
- ✅ **Only affects "None" stroke style**: Other stroke styles (Simple, Gradient, Paint Flow, etc.) are unaffected
- ✅ **Optional by choice**: Not mandatory - defaults to showing border
- ✅ **Canvas only**: This setting only affects the Design Canvas editor view
- ✅ **Live Preview unaffected**: Preview panel always shows final result without editor borders

## Technical Implementation

### Files Changed

#### 1. `/src/app/components/ImageStrokeSelector.tsx`
**Changes:**
- Added `showBorderInEditor` prop (boolean)
- Added `onToggleBorderVisibility` callback prop
- Added visual toggle UI with icon and description
- Toggle appears in a highlighted section above stroke style options

**New UI Element:**
```tsx
<div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
  <label className="flex items-center justify-between cursor-pointer">
    // Eye icon + "Show Border in Editor" label + checkbox
  </label>
</div>
```

#### 2. `/src/app/App.tsx`
**Changes:**
- Added state: `const [showBorderInEditor, setShowBorderInEditor] = useState<boolean>(true);`
- Passed new props to `ImageStrokeSelector`:
  - `showBorderInEditor={showBorderInEditor}`
  - `onToggleBorderVisibility={setShowBorderInEditor}`
- Passed prop to `DesignCanvas`:
  - `showBorderInEditor={showBorderInEditor}`

#### 3. `/src/app/components/DesignCanvas.tsx`
**Changes:**
- Added `showBorderInEditor?: boolean` to interface
- Added to function parameters with default: `showBorderInEditor = true`
- Passed to circle `DraggablePlaceholder`:
  - `showBorderInEditor={showBorderInEditor}`

#### 4. `/src/app/components/DraggablePlaceholder.tsx`
**Changes:**
- Added `showBorderInEditor?: boolean` to interface
- Added to function parameters with default: `showBorderInEditor = true`
- Updated border logic for circle type:

**Before:**
```tsx
border: strokeStyle && strokeStyle !== 'none' ? 'none' : '2px dashed white'
```

**After:**
```tsx
border: strokeStyle && strokeStyle !== 'none' 
  ? 'none' 
  : (showBorderInEditor ? '2px dashed white' : 'none')
```

### Logic Flow

```
User interacts with toggle
         ↓
ImageStrokeSelector updates
         ↓
Calls onToggleBorderVisibility(newValue)
         ↓
App.tsx updates showBorderInEditor state
         ↓
Passes to DesignCanvas
         ↓
Passes to DraggablePlaceholder (circle)
         ↓
Conditionally renders border:
  - strokeStyle !== 'none' → no change (stroke style handles it)
  - strokeStyle === 'none' && showBorderInEditor === true → '2px dashed white'
  - strokeStyle === 'none' && showBorderInEditor === false → 'none'
```

## User Experience

### Visual States

#### State 1: Border Visible (Default)
```
┌─────────────────────┐
│  ╭ ─ ─ ─ ─ ─ ─ ╮  │  ← Dashed white border visible
│  │             │  │
│  │  User Photo │  │  ← Placeholder clearly visible
│  │             │  │
│  ╰ ─ ─ ─ ─ ─ ─ ╯  │
└─────────────────────┘
```

#### State 2: Border Hidden
```
┌─────────────────────┐
│                     │
│                     │  ← No border, transparent
│     (invisible)     │  ← Only label visible when hovered
│                     │
│                     │
└─────────────────────┘
```

### Use Cases

#### Scenario 1: Initial Template Design
- **Setting**: Toggle ON
- **Reason**: Need to see where placeholder is positioned
- **Benefit**: Easy to drag and position accurately

#### Scenario 2: Previewing Final Look
- **Setting**: Toggle OFF
- **Reason**: Want to see how it looks without editor UI
- **Benefit**: Clean preview without distracting borders

#### Scenario 3: Creating Minimal Templates
- **Setting**: Toggle OFF, No stroke style
- **Reason**: Template design requires invisible photo area
- **Benefit**: Placeholder exists but doesn't interfere visually

## Best Practices

### When to Enable (Toggle ON)
✅ Starting a new template design  
✅ Positioning placeholders  
✅ Making layout adjustments  
✅ Teaching others to use the tool  

### When to Disable (Toggle OFF)
✅ Final design review  
✅ Taking screenshots of canvas  
✅ Creating invisible placeholder zones  
✅ Checking how background looks without overlays  

## Backward Compatibility

- ✅ **Default behavior preserved**: Toggle defaults to ON (true)
- ✅ **Existing templates unaffected**: All stroke styles work as before
- ✅ **No breaking changes**: Optional feature, doesn't change core functionality
- ✅ **Live Preview unchanged**: Preview panel behavior remains the same

## Future Enhancements

Potential improvements:
- Add keyboard shortcut to toggle (e.g., `V` for visibility)
- Remember user preference in local storage
- Apply same toggle to text placeholder
- Add "Editor Mode" vs "Preview Mode" toggle affecting all UI elements
- Show/hide placeholder labels separately

## Testing Checklist

- [x] Toggle defaults to checked (ON)
- [x] Toggle shows border when enabled
- [x] Toggle hides border when disabled
- [x] Other stroke styles remain unaffected
- [x] Dragging still works when border is hidden
- [x] Hover effects work with both states
- [x] Live Preview panel unaffected
- [x] State persists during same session
- [x] Works with all aspect ratios (3:4 and 9:16)
- [x] Responsive to user interactions

## Summary

This feature gives designers **full control** over placeholder visibility in the editor, making it easier to:
- Position elements with clear visual guides
- Preview the final look without editor UI
- Create templates with invisible placeholder zones
- Switch between editing and preview modes seamlessly

The implementation is **optional, non-breaking, and user-friendly**, with sensible defaults that preserve existing workflow while adding powerful new capabilities.
