# Dark Mode Configuration Guide

## Overview
The application now has a fully functional dark mode with easy customization. Dark mode is toggled by clicking the avatar and using the theme switch.

## How Dark Mode Works

### 1. Tailwind Configuration
File: `frontend/tailwind.config.js`
```javascript
export default {
  darkMode: 'class', // Enables class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. Theme Toggle Component
File: `frontend/src/components/ThemeSwitch.tsx`
- Toggles the `dark` class on `document.documentElement` (the `<html>` element)
- Persists the theme choice to `localStorage` with key `'theme'`
- Shows sun icon for light mode, moon icon for dark mode

### 3. Dark Mode Classes
All components use Tailwind's `dark:` prefix for dark mode styles:

#### Example Usage:
```tsx
// Light mode: white background, dark mode: dark gray background
className="bg-white dark:bg-slate-800"

// Light mode: dark text, dark mode: light text
className="text-slate-900 dark:text-slate-100"

// Light mode: light gray border, dark mode: darker border
className="border-slate-200 dark:border-slate-700"
```

## Customization Guide

### Color Palette for Dark Mode

#### Current Dark Mode Colors:
- **Backgrounds:**
  - Page: `dark:bg-slate-900` (very dark gray)
  - Cards/Nav: `dark:bg-slate-800` (dark gray)
  - Hover: `dark:bg-slate-700` (medium gray)

- **Text:**
  - Primary: `dark:text-slate-100` (almost white)
  - Secondary: `dark:text-slate-300` (light gray)
  - Tertiary: `dark:text-slate-400` (medium gray)

- **Borders:**
  - Primary: `dark:border-slate-700` (dark gray)
  - Subtle: `dark:border-slate-600` (medium gray)

- **Accents:**
  - Primary (Indigo): `dark:bg-indigo-900` / `dark:text-indigo-400`
  - Success (Teal): `dark:bg-teal-900` / `dark:text-teal-300`
  - Danger (Red): `dark:text-red-400`

### How to Customize Colors

#### Option 1: Change Existing Dark Mode Classes
Find and replace in your components:

**Example: Change background from slate to gray:**
```bash
# Find: dark:bg-slate-900
# Replace with: dark:bg-gray-900
```

**Example: Change accent from indigo to purple:**
```bash
# Find: dark:bg-indigo-900
# Replace with: dark:bg-purple-900
```

#### Option 2: Extend Tailwind Theme
Edit `frontend/tailwind.config.js`:

```javascript
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Add custom dark mode colors
        'dark-primary': '#1a1a2e',
        'dark-secondary': '#16213e',
        'dark-accent': '#0f3460',
      }
    },
  },
  plugins: [],
};
```

Then use in components:
```tsx
className="bg-white dark:bg-dark-primary"
```

### Common Customization Tasks

#### 1. Make Dark Mode Darker
Replace `dark:bg-slate-900` with `dark:bg-black` or `dark:bg-gray-950`

#### 2. Make Dark Mode Lighter (Softer)
Replace `dark:bg-slate-900` with `dark:bg-slate-800`

#### 3. Change Accent Color
Replace all `dark:bg-indigo-*` with `dark:bg-blue-*` or `dark:bg-purple-*`

#### 4. Increase Contrast
- Use `dark:text-white` instead of `dark:text-slate-100`
- Use `dark:bg-black` instead of `dark:bg-slate-900`

#### 5. Reduce Contrast (Softer on Eyes)
- Use `dark:text-slate-300` instead of `dark:text-slate-100`
- Use `dark:bg-slate-800` instead of `dark:bg-slate-900`

## Files with Dark Mode Classes

### Core Layout Files:
1. `frontend/src/components/Layout.tsx` - Main navigation and layout
2. `frontend/src/components/ThemeSwitch.tsx` - Theme toggle component
3. `frontend/src/components/ProfileModal.tsx` - Profile modal

### To Add Dark Mode to Other Components:

#### Step 1: Identify Elements
Find elements with background colors, text colors, and borders.

#### Step 2: Add Dark Classes
```tsx
// Before:
<div className="bg-white text-slate-900 border-slate-200">

// After:
<div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700">
```

#### Step 3: Test
Toggle dark mode and check all elements are visible and properly styled.

## Quick Reference

### Background Colors
```
bg-white dark:bg-slate-800           // Cards, modals
bg-slate-50 dark:bg-slate-900        // Page background
bg-slate-100 dark:bg-slate-700       // Subtle backgrounds
hover:bg-slate-50 dark:hover:bg-slate-700  // Hover states
```

### Text Colors
```
text-slate-900 dark:text-slate-100   // Primary text
text-slate-600 dark:text-slate-300   // Secondary text
text-slate-500 dark:text-slate-400   // Tertiary text/labels
```

### Border Colors
```
border-slate-200 dark:border-slate-700   // Primary borders
border-slate-100 dark:border-slate-600   // Subtle borders
```

### Interactive States
```
hover:bg-slate-50 dark:hover:bg-slate-700
focus:ring-indigo-400 dark:focus:ring-indigo-500
```

## Testing Dark Mode

1. **Start the app:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Toggle dark mode:**
   - Click the avatar in the top right
   - Click the theme switch (sun/moon icon)

3. **Check persistence:**
   - Refresh the page - theme should remain the same
   - Open DevTools > Application > Local Storage
   - Check for `theme: "dark"` or `theme: "light"`

## Troubleshooting

### Dark Mode Not Working?
1. **Check Tailwind config:**
   Ensure `darkMode: 'class'` is set in `tailwind.config.js`

2. **Check HTML element:**
   Open DevTools and inspect `<html>` element
   It should have `class="dark"` when dark mode is active

3. **Rebuild styles:**
   ```bash
   cd frontend
   npm run dev
   ```

### Colors Not Changing?
1. Check if the element has `dark:` classes
2. Verify the specificity isn't overridden by other styles
3. Clear browser cache and rebuild

## Best Practices

1. **Always pair light and dark:**
   ```tsx
   // Good:
   className="bg-white dark:bg-slate-800"
   
   // Bad (missing dark):
   className="bg-white"
   ```

2. **Maintain contrast:**
   Ensure text is readable in both modes

3. **Test all states:**
   Check hover, focus, active, disabled states in both modes

4. **Use semantic colors:**
   - Success: green
   - Error: red
   - Warning: yellow
   - Info: blue

---

**Quick Toggle:** Click Avatar → Theme Switch
**Persistence:** Theme choice saved to localStorage
**Global Control:** All components automatically respond to dark mode
