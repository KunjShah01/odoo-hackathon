# Additional Unsplash Avatar URLs

Use these professional human avatar URLs as alternatives or for additional users:

## Male Avatars
1. `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces`
   - Professional, confident look

2. `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces`
   - Casual, friendly

3. `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces`
   - Business professional

4. `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces`
   - Young professional

5. `https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=faces`
   - Outdoor, natural light

## Female Avatars
1. `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces`
   - Professional, warm smile

2. `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces`
   - Business casual

3. `https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=faces`
   - Professional headshot

4. `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces`
   - Casual, friendly

5. `https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces`
   - Modern professional

## Diverse & Inclusive
1. `https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=faces`
   - South Asian male

2. `https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces`
   - African American female

3. `https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=faces`
   - Asian female

4. `https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop&crop=faces`
   - Middle Eastern male

5. `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces`
   - Latina female

## Team/Group Suggestions
For different roles in your expense management app:

### Employees
- Use casual, friendly avatars (#2, #4 from male/female lists)

### Managers
- Use professional business avatars (#1, #3 from male/female lists)

### Admins
- Use confident, authoritative avatars (#1 from male, #3 from female)

## URL Parameters Explained
- `w=400&h=400` - Sets width and height to 400px (square)
- `fit=crop` - Crops the image to fit dimensions
- `crop=faces` - Focuses the crop on faces in the photo

## How to Use
Replace the avatar URL in `AuthContext.tsx`:

```typescript
avatar: 'https://images.unsplash.com/photo-YOUR-PHOTO-ID?w=400&h=400&fit=crop&crop=faces'
```

## Random Avatar Assignment
For variety, you can randomly assign avatars on signup:

```typescript
const avatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces',
  // ... add more
];
const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
```

---
**Note**: All URLs are from Unsplash and are free to use under the Unsplash License.
