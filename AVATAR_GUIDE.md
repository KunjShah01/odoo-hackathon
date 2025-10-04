# Avatar Images - Quick Guide

## Location
All avatar files are in: `frontend/public/assets/avatars/`

## Current Files
- `avatar1.svg` - Blue/Indigo avatar (used for Login)
- `avatar2.svg` - Orange avatar (used for Signup)
- `avatar3.svg` - Green avatar (extra)
- `default.svg` - Gray avatar (fallback)

## Format
Currently using SVG files for:
- ✅ Perfect rendering in light AND dark mode
- ✅ No image loading issues
- ✅ Crisp at any size
- ✅ Small file size

## How to Replace with Real Photos

### Option 1: Use SVG (Recommended)
Keep the current setup - SVG avatars work perfectly in both themes!

### Option 2: Use PNG/JPG Images
1. Get square images (128x128px or larger)
2. Replace the `.svg` files with `.png` or `.jpg` files
3. Update the file extensions in code:
   - `frontend/src/context/AuthContext.tsx` (lines 47, 71)
   - `frontend/src/components/ProfileModal.tsx` (line 19)

Example:
```tsx
// Change from:
avatar: '/assets/avatars/avatar1.svg'
// To:
avatar: '/assets/avatars/avatar1.png'
```

## Customizing SVG Avatar Colors

Edit the SVG files directly to change colors:

### avatar1.svg (Blue):
```svg
<circle cx="64" cy="64" r="64" fill="#6366F1"/>  <!-- Background color -->
```

Change `#6366F1` to any hex color:
- Purple: `#A855F7`
- Pink: `#EC4899`
- Red: `#EF4444`
- Green: `#10B981`

### Simple Color Presets
- **Professional Blue**: `#3B82F6`
- **Corporate Navy**: `#1E40AF`
- **Creative Purple**: `#8B5CF6`
- **Friendly Teal**: `#14B8A6`
- **Energetic Orange**: `#F97316`

## Testing
After making changes:
1. Refresh browser (Ctrl+F5)
2. Check light mode
3. Toggle to dark mode (click avatar → theme switch)
4. Verify avatar is visible in both modes

## Current Status
✅ Avatars working in dark mode
✅ Avatars working in light mode
✅ Clean SVG format
✅ Easy to customize
