# Developer Debugging Guide - Enhanced API Logging

**Last Updated:** 2025-10-24  
**For:** Solo Developer Debugging

---

## What Was Implemented

Enhanced API logging has been added to make debugging easier for solo development. Every API request and response is now logged to the console with detailed information.

---

## Console Output Examples

### ✅ Successful API Call

When an API call succeeds, you'll see:

```
✅ API SUCCESS: POST /auth/otp/request
  📊 Status Code: 200
  📦 Response Data: {
    "message": "OTP sent successfully"
  }
  📋 Request Data: {"identifier":"test@ayska.co"}
  🔗 Full URL: http://localhost:8000/api/v1/auth/otp/request
  ⏱️ Duration: 245ms
  ⏱️ Timestamp: 2025-10-24T14:32:15.123Z
```

### 🔴 Failed API Call

When an API call fails, you'll see:

```
🔴 API ERROR: POST /auth/otp/request
  📊 Status Code: 404
  📦 Response Data: {
    "error": "user_not_found",
    "message": "Account not found. Contact your admin.",
    "status": 404
  }
  📋 Request Data: {"identifier":"nonexistent@email.com"}
  🔗 Full URL: http://localhost:8000/api/v1/auth/otp/request
  ⏱️ Timestamp: 2025-10-24T14:32:15.123Z
  💬 User Message: Account not found. Contact your admin.
```

---

## What Information Is Logged

### For Successful Requests:

1. **HTTP Method & Endpoint** - What API was called
2. **Status Code** - HTTP status (200, 201, etc.)
3. **Response Data** - Full JSON response from backend
4. **Request Data** - What data was sent to the backend
5. **Full URL** - Complete API endpoint URL
6. **Duration** - How long the request took in milliseconds
7. **Timestamp** - When the request completed

### For Failed Requests:

1. **HTTP Method & Endpoint** - What API failed
2. **Status Code** - HTTP status (404, 401, 500, etc.) or "No Response" for network errors
3. **Response Data** - Full error response from backend
4. **Request Data** - What data was sent
5. **Full URL** - Complete API endpoint URL
6. **Timestamp** - When the error occurred
7. **User Message** - The human-readable message shown to users

---

## Where Logs Appear

### Development Mode:

- **React Native Debugger Console** (if using Chrome DevTools)
- **Terminal/Metro Bundler** console
- **Flipper** console (if connected)
- **VS Code Debug Console** (if using VS Code debugger)

### Production Mode:

- **No logs appear** (all logging is behind `__DEV__` checks for performance)

---

## Files Modified

1. **`src/interceptors/AyskaErrorInterceptor.ts`** (Lines 37-57)
   - Enhanced error logging with detailed information
   - Uses `console.group()` for organized output
   - All logs behind `__DEV__` check

2. **`src/api/HttpClient.ts`** (Lines 23-80)
   - Added request timing metadata
   - Enhanced success response logging
   - Calculates and displays request duration
   - All logs behind `__DEV__` check

---

## Debugging Workflow

### Step 1: Reproduce the Issue

1. Open your app in development mode
2. Open console (Metro bundler terminal or React Native Debugger)
3. Perform the action that causes the issue

### Step 2: Find the Relevant Log

Look for:

- 🔴 for errors
- ✅ for successful calls
- The API endpoint that's failing

### Step 3: Analyze the Information

- **Status Code** - Tells you what type of error (404 = not found, 401 = auth, 500 = server)
- **Response Data** - Exact error from backend
- **Request Data** - Verify you're sending correct data
- **Duration** - If slow (>2000ms), might be network issue
- **User Message** - What error message users see

### Step 4: Common Debugging Scenarios

#### "User sees wrong error message"

1. Find the 🔴 error log
2. Check **User Message** vs **Response Data.message**
3. If different, error mapping might need adjustment

#### "API call is failing"

1. Find the 🔴 error log
2. Check **Status Code**
   - 404: Endpoint might be wrong or resource doesn't exist
   - 401: Authentication issue
   - 422: Validation error (check Request Data)
   - 500: Backend server error
3. Check **Response Data** for backend's error details

#### "App is slow"

1. Find the ✅ success logs
2. Check **Duration**
   - <500ms: Fast
   - 500-1000ms: Acceptable
   - > 1000ms: Slow (investigate network or backend)

#### "Request not reaching backend"

1. Look for 🔴 with **Status Code: No Response**
2. This means network error or backend is down
3. Check **Full URL** to verify correct endpoint

---

## Performance Impact

### Development:

- **Minimal** - Logs only in `__DEV__` mode
- **Console output** may slow down if many rapid requests
- **No impact** on app performance itself

### Production:

- **Zero impact** - All logging code is stripped out when not in `__DEV__` mode
- No console logs appear
- No performance overhead

---

## Complementary Tools

Use these tools alongside the enhanced logging:

### Primary Debugging Tool: **Flipper**

1. Download: https://fbflipper.com/
2. Open Flipper app
3. Run your app - it will auto-connect
4. View:
   - **Network tab** - See all API calls with timing
   - **React DevTools** - Inspect components
   - **Redux** - See all actions and state changes
   - **AsyncStorage** - View stored data

### React DevTools Standalone:

```bash
npm install -g react-devtools
react-devtools
```

### VS Code Debugger:

- Install "React Native Tools" extension
- Set breakpoints in code
- Step through execution

---

## Tips for Solo Development

### 1. Keep Console Visible

Always have terminal/console visible when testing to catch errors immediately.

### 2. Search Console Logs

Use Cmd+F (Mac) or Ctrl+F (Windows) to search for:

- Specific endpoints: `/auth/otp/request`
- Status codes: `404`, `500`
- Error types: `🔴 API ERROR`

### 3. Clear Console Between Tests

Clear console before testing to see only relevant logs:

```javascript
// In React Native Debugger console
clear();
```

### 4. Copy Logs for Reference

Right-click log → Copy → Paste into notes for later reference

### 5. Pattern Recognition

After a few days, you'll recognize error patterns quickly:

- "Account not found" = User doesn't exist
- "Invalid OTP" = Wrong verification code
- "No Response" = Backend is down or network issue

---

## Troubleshooting

### Not Seeing Logs?

1. **Check you're in development mode**

   ```bash
   # Should see __DEV__ = true
   npm start
   ```

2. **Check console is connected**
   - Open React Native Debugger
   - Or check Metro bundler terminal

3. **Verify `__DEV__` is true**
   Add temporary log to check:
   ```typescript
   console.log('DEV MODE:', __DEV__);
   ```

### Logs Too Verbose?

If too many logs, you can temporarily disable:

- Comment out the logging blocks in ErrorInterceptor or HttpClient
- Or filter console to only show errors: `console.log('🔴')` in browser console

### Want More Detail?

To add more information, edit:

- `src/interceptors/AyskaErrorInterceptor.ts` (lines 38-56)
- `src/api/HttpClient.ts` (lines 43-65)

Add more `console.log()` statements with information you need.

---

## Next Steps

With enhanced logging in place, you can now:

1. ✅ **See every API call** in real-time
2. ✅ **Debug errors** quickly with full context
3. ✅ **Monitor performance** with request durations
4. ✅ **Verify data flow** between frontend and backend

**Recommended Next Actions:**

1. Install Flipper for visual debugging
2. Test the logging with a few API calls
3. Proceed with Phase 1 critical fixes (422 validation, 401 role handling)

---

**Questions or Issues?**
Check the logs first - they now contain all the information you need to debug any API-related issue!
