Avatar Images for ExpenseFlow App

## Current Avatar Files (Located in /public/assets/avatars/)
- avatar1.svg - Blue/Indigo gradient avatar (Login default)
- avatar2.svg - Orange/Amber gradient avatar (Signup default)
- avatar3.svg - Green gradient avatar
- default.svg - Gray gradient avatar (Fallback)

## Why SVG Format?
✅ Scales perfectly at any size
✅ Works flawlessly in light AND dark mode
✅ Small file size, fast loading
✅ Easy to customize colors
✅ Crisp, professional appearance

## How to Replace with Real Photos

### Option 1: Replace the .svg files with PNG/JPG
1. Navigate to: `frontend/public/assets/avatars/`
2. Replace avatar1.svg, avatar2.svg, avatar3.svg with your own image files
3. Recommended size: 128x128 pixels or larger (square)
4. Format: PNG, JPG, or keep SVG for best results
5. The UI will automatically display them as circular avatars

### Option 2: Add more avatars
1. Add new image files to `frontend/public/assets/avatars/`
2. Name them avatar4.svg, avatar5.png, etc.
3. Update AuthContext.tsx to use the new avatar paths

### Option 3: Use real photos from stock sites
You can download professional avatar photos from:
- Unsplash (https://unsplash.com) - Free, high-quality
- Pexels (https://pexels.com) - Free stock photos
- Generated.photos (https://generated.photos) - AI-generated faces

## Usage in Code

Current usage in AuthContext.tsx:
```typescript
// Login user
avatar: '/assets/avatars/avatar1.svg'

// Signup user
avatar: '/assets/avatars/avatar2.svg'

// Fallback
avatar: '/assets/avatars/default.svg'
```

To change, edit: `frontend/src/context/AuthContext.tsx`

## Tips
- Use square images (1:1 aspect ratio)
- Minimum 128x128px, recommended 256x256px or 512x512px
- Supported formats: PNG, JPG, SVG, WebP
- Images are displayed as circles in the UI automatically
- Dark mode compatible - avatars work in both light and dark themes
