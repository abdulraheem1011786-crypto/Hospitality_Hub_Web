# Test and Fix Guide

## Issues Fixed

### 1. **ImageController 500 Error on GET /api/admin/images/venue/{venueType}/{venueId}**
- **Problem**: The controller was trying to validate URL parameters as if they were request body parameters
- **Solution**: Updated `getVenueImages()` to properly validate URL parameters before database query
- **Files**: Backend/app/Http/Controllers/Admin/ImageController.php

### 2. **addEventListener null error at line 52 in admin-event-halls.js**
- **Problem**: The code tried to attach event listeners to modal elements that don't exist until the modal is opened
- **Solution**: 
  - Separated modal event listener setup into `setupImageModalListeners()` function
  - Call this function from `manageImages()` after rendering the modal
  - Only attach listeners to elements that exist
- **Files**: 
  - Backend/public/admin/js/pages/admin-hotels.js
  - Backend/public/admin/js/pages/admin-high-tea.js
  - Backend/public/admin/js/pages/admin-event-halls.js

### 3. **Drag-and-drop and file upload not working**
- **Problem**: `setupUploadListeners()` was returning early if elements weren't found, but had missing console logging for debugging
- **Solution**:
  - Added comprehensive console logging to track element creation and event attachment
  - Fixed the return condition to check all required elements
  - Added `e.stopPropagation()` to drag-drop handlers for better event handling
  - Added error logging to show which elements are missing
- **Files**: Backend/public/admin/js/components/image-gallery.js

## Testing Steps

### 1. Clear Browser Cache
```
Press Ctrl+Shift+Delete or Cmd+Shift+Delete
Select "All time" and clear
```

### 2. Hard Refresh Admin Page
```
Go to: http://hospitalityhub.test/admin/admin.html
Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### 3. Open Browser Console
```
Press F12 or Right-Click → Inspect → Console tab
```

### 4. Test Image Upload

#### Step A: Login
- Username: admin@hospitalityhub.pk
- Password: admin123

#### Step B: Go to Hotels
- Click "Hotels" in left menu
- Should see list of hotels

#### Step C: Click Image Icon on Any Hotel
- Click the 📷 (image icon) on any hotel row
- Should see modal dialog open
- Check console for any errors
- **Expected in console**:
  ```
  setupUploadListeners called for venue: hotel 1
  Found elements: {
    uploadArea: true,
    imageInput: true,
    uploadBtn: true,
    previewContainer: true
  }
  ```

#### Step D: Test Drag & Drop
- Drag image file to "Click to select images or drag and drop" area
- Should see file preview appear
- Check console for:
  ```
  handleFileSelection called with 1 files
  Checking file: filename.jpg Type: image/jpeg Size: XXXXX
  ```

#### Step E: Test File Selection
- Click on the upload area
- Select 1-3 image files
- Should see previews
- Upload button should enable

#### Step F: Test Upload
- Click "Upload Images" button
- Should see spinner
- Should see success message
- Should see images appear in gallery below
- Check console for:
  ```
  uploadImages called: { venueType: 'hotel', venueId: 1, fileCount: 1 }
  Calling AdminImageService.uploadImages...
  Upload successful: {...}
  Calling onUploadSuccess callback
  ```

## Console Debugging

### If Drag-Drop Doesn't Work
Look for console message:
```
setupUploadListeners called for venue: hotel 1
Found elements: {
  uploadArea: false,    ← If false, elements aren't rendering
  imageInput: false,
  uploadBtn: false,
  previewContainer: false
}
```

**Fix**: This means the HTML isn't rendering properly. Check that:
1. AdminImageGallery is defined and loaded
2. Modal elements exist (check browser Inspector)
3. Try refreshing page

### If Upload Fails
Look for console error like:
```
Upload error: NetworkError: Failed to fetch
```

**Fix**: Check:
1. Is server running?
2. Is API working? (Test in console: `await fetch('/api/hotels')`)
3. Are routes registered? (Check: `php artisan route:list`)

### If "Set as Featured" or "Delete" Doesn't Work
Look for error in console when clicking buttons.

**Fix**: 
1. Check that AdminImageService is loaded
2. Check that API token is valid (check localStorage.getItem('adminToken'))
3. Check network tab for API response

## Quick Test Commands

### In Browser Console

#### Test 1: Check if modules are loaded
```javascript
console.log('AdminHotelsPage:', typeof AdminHotelsPage);
console.log('AdminImageService:', typeof AdminImageService);
console.log('AdminImageGallery:', typeof AdminImageGallery);
```

#### Test 2: Check if token exists
```javascript
console.log('Token:', localStorage.getItem('adminToken'));
```

#### Test 3: Test API directly
```javascript
fetch('/api/admin/images/venue/hotel/1', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
    }
}).then(r => r.json()).then(d => console.log(d))
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot read properties of null (reading 'addEventListener')" | Modal elements missing when page loads | Refresh page, clear browser cache |
| 500 error on /api/admin/images/venue/hotel/1 | ImageController validation failed | Check server logs: `tail -f storage/logs/laravel.log` |
| File input won't open | setupUploadListeners not finding elements | Check console for "Found elements: {uploadArea: false, ...}" |
| Drag-drop highlights nothing | Event listeners not attached | Check console for "setupUploadListeners called..." message |
| Upload shows "Upload failed: ..." | API error | Check network tab and server logs |
| Images don't display after upload | Storage symlink missing | Run: `php artisan storage:link` |

## If Everything Fails: Reset

```bash
# 1. Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 2. Delete any uploaded images (optional)
rm -rf storage/app/public/uploads/venues/*

# 3. Restart Laravel
php artisan serve (if using built-in server)
# or restart Apache in XAMPP

# 4. Hard refresh browser
Ctrl+Shift+R
```

## Files Modified in This Session

1. **Backend/app/Http/Controllers/Admin/ImageController.php**
   - Fixed `getVenueImages()` method to validate URL parameters correctly

2. **Backend/public/admin/js/components/image-gallery.js**
   - Enhanced `setupUploadListeners()` with console logging
   - Fixed element existence checks
   - Added `e.stopPropagation()` to drag handlers
   - Enhanced `handleFileSelection()` with logging
   - Enhanced `uploadImages()` with logging

3. **Backend/public/admin/js/pages/admin-hotels.js**
   - Split `setupEventListeners()` to avoid null reference errors
   - Added `setupImageModalListeners()` function
   - Enhanced `manageImages()` with error handling

4. **Backend/public/admin/js/pages/admin-high-tea.js**
   - Same changes as admin-hotels.js

5. **Backend/public/admin/js/pages/admin-event-halls.js**
   - Same changes as admin-hotels.js
