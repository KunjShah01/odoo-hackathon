# Debugging Guide for Authentication Issues

## Issue
After signing up or logging in, users are not being redirected to the main application page. They remain on the login/signup page.

## Changes Made

### 1. Fixed API Base URL ✅
- **File**: `frontend/src/services/api.ts`
- **Change**: Updated `API_BASE_URL` from `http://localhost:3000/api` to `http://localhost:3001/api`
- **Reason**: Backend is running on port 3001, not 3000

### 2. Improved AuthContext State Management ✅
- **File**: `frontend/src/context/AuthContext.tsx`
- **Changes**:
  - Removed `setIsLoading` from login/signup functions (was causing race conditions)
  - Added comprehensive console logging to track auth flow
  - Ensured localStorage is set BEFORE setState to avoid timing issues

### 3. Added Debug Logging ✅
- **Files**: 
  - `frontend/src/context/AuthContext.tsx`
  - `frontend/src/pages/Login.tsx`
  - `frontend/src/App.tsx`
- **Purpose**: Track the authentication flow and identify where it's failing

## How to Test

### 1. Open Browser Developer Tools
- Press `F12` or right-click > Inspect
- Go to the **Console** tab

### 2. Try to Sign Up
1. Go to http://localhost:5175
2. Click "Don't have an account? Sign up"
3. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Company ID: `123e4567-e89b-12d3-a456-426614174000`
   - Email: test123@example.com
   - Password: password123
4. Click "Sign Up"

### 3. Check Console Logs
You should see logs in this order:
```
AuthContext: Starting signup...
AuthContext: Signup response received: {message: "User created successfully", user: {...}, token: "..."}
AuthContext: Setting user state: {id: "...", email: "...", firstName: "...", lastName: "...", role: "employee"}
AuthContext: User state set successfully
Authentication successful
AppContent render - user: {id: "...", ...} isLoading: false
```

### 4. Try to Login
1. If still on login page, try logging in with credentials you just created
2. Watch console for similar logs

## Expected Behavior

After successful authentication:
1. ✅ User data stored in localStorage
2. ✅ JWT token stored in localStorage
3. ✅ User state updated in AuthContext
4. ✅ App.tsx detects user is not null
5. ✅ Login page disappears
6. ✅ Dashboard appears based on user role

## Common Issues to Check

### Issue 1: CORS Error
**Symptom**: Console shows "CORS policy" error
**Solution**: Check backend CORS configuration in `backend/src/index.js`

### Issue 2: Network Error
**Symptom**: Console shows "Failed to fetch" or "Network error"
**Solutions**:
- Verify backend is running: Check if `http://localhost:3001/health` responds
- Check if database is running
- Verify firewall isn't blocking connections

### Issue 3: Authentication Error
**Symptom**: Error message displayed on login form
**Solutions**:
- Check if email/password are correct
- For signup, verify Company ID is a valid UUID
- Check backend logs for errors

### Issue 4: Not Redirecting After Login
**Symptom**: Login succeeds but stays on login page
**Check**:
- Browser console for "AppContent render" logs
- localStorage has both `user` and `authToken` keys (F12 > Application > Local Storage)
- User object is not null in console logs
- No React errors in console

## Verification Commands

### Check Backend Status
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3001/health
```

### Check Frontend is Running
Open browser to: http://localhost:5175

### Check Database Connection
```bash
# In backend directory
npm test
```

## Files Structure

### Pages Created ✅
- `frontend/src/pages/Login.tsx` - Authentication page
- `frontend/src/pages/EmployeeDashboard.tsx` - Employee view
- `frontend/src/pages/ManagerApprovals.tsx` - Manager view
- `frontend/src/pages/AdminPanel.tsx` - Admin view

### Components Created ✅
- `frontend/src/components/Layout.tsx` - Main layout wrapper
- `frontend/src/components/AddExpenseModal.tsx` - Add/edit expense
- `frontend/src/components/ExpenseDetailModal.tsx` - View expense details
- Various UI components in `frontend/src/components/ui/`

## Next Steps

1. **Clear Browser Cache**: Sometimes old cached data causes issues
   - Press `Ctrl + Shift + Delete`
   - Clear "Cached images and files"
   - Or use Incognito mode

2. **Clear localStorage**: 
   - F12 > Console
   - Run: `localStorage.clear()`
   - Refresh page

3. **Restart Servers**:
   ```bash
   # Stop both frontend and backend (Ctrl+C in terminals)
   # Then restart:
   cd c:\odoo-hackathon\backend
   npm start
   
   cd c:\odoo-hackathon\frontend
   npm run dev
   ```

4. **Check Browser Console**: Look for the debug logs we added

## Backend Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login existing user
- `GET /api/expenses` - Get user expenses (requires auth)
- `POST /api/expenses` - Create expense (requires auth)
- `GET /api/approvals` - Get approvals for managers (requires auth)

## Database Tables

- `users` - User accounts
- `expenses` - Expense submissions
- `approvals` - Approval workflows
- `companies` - Company information

## Success Criteria

✅ All sections/pages are created and working
✅ User can sign up and create an account
✅ User can log in with credentials
✅ After login, user is redirected to dashboard
✅ Dashboard shows based on user role (Employee/Manager/Admin)
✅ User can navigate between different views
✅ User can logout and return to login page

## Contact

If issues persist after checking all the above:
1. Check all console logs for errors
2. Verify network tab in dev tools shows successful API calls
3. Check backend terminal for any errors
4. Verify database is accessible and seeded with data
