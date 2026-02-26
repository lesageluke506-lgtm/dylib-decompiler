# 🚀 Getting Started - Website Decompiler

Welcome to the **Website Decompiler** - your all-in-one tool for APK, Dylib, JAR, and file analysis!

## What You Have

Your complete application includes:

### Backend Server ✓
- Express.js REST API
- File upload handling (500MB max)
- APK/Dylib/JAR decompilers
- Code beautification
- Binary analysis tools

### Frontend Application ✓
- Modern React-based UI
- Drag-and-drop file upload
- Real-time results display
- Multiple analysis tools
- Code beautification interface

### Documentation ✓
- README.md - Main documentation
- API_DOCUMENTATION.md - Complete API reference
- QUICKSTART.md - Quick setup guide
- ADVANCED_GUIDE.md - Advanced features
- This file - Getting started guide

---

## Quick Start (2 Minutes)

### On Windows

**Option 1: Automated (Easiest)**
```powershell
# Navigate to project folder in PowerShell
cd "path\to\XDMenu_ColorSize (1)ded.tar-1"

# Double-click: start-all.bat
# OR run in terminal:
." .\start-all.bat
```

**Option 2: Manual Start**

Terminal 1:
```powershell
cd server
npm install
npm start
```

Terminal 2:
```powershell
cd client
npm install
npm start
```

### On macOS/Linux

```bash
cd "path/to/project"

# Terminal 1
cd server && npm install && npm start

# Terminal 2 (new terminal)
cd client && npm install && npm start
```

### Using Docker

```bash
docker-compose up
```

---

## What to Do Next

### 1. **Start the Application**
Once both servers are running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 2. **Try the Tools**

#### Decompile an APK
1. Go to "Decompiler" tab
2. Click "APK Decompiler" area
3. Select an `.apk` file
4. Click "Decompile APK"
5. View results

#### Analyze a Dylib
1. Click "Dylib Analyzer" area
2. Select a `.dylib` file
3. Click "Analyze Dylib"
4. See extracted strings and metadata

#### Beautify Code
1. Go to "Tools" tab
2. Paste minified code
3. Click "Beautify Code"
4. Click "Copy Result"

#### Analyze Any File
1. Click "Universal File Analyzer"
2. Upload any file type
3. View file type, size, and metadata

---

## File Locations & Organization

```
XDMenu_ColorSize (1)ded.tar-1/
├── server/                      # Backend server (port 5000)
│   ├── src/
│   │   ├── index.js            # Main server file
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API endpoints
│   │   └── utils/              # Helper functions
│   ├── uploads/                # Uploaded files (TEMP)
│   ├── extracted/              # Extracted outputs (TEMP)
│   └── package.json
│
├── client/                      # Frontend (port 3000)
│   ├── public/
│   │   └── index.html          # Web interface
│   └── package.json
│
├── start-all.bat               # AUTO START (Windows)
├── start-all.js                # AUTO START (macOS/Linux)
├── setup.bat                   # SETUP (Windows)
├── setup.sh                    # SETUP (macOS/Linux)
│
├── README.md                   # Full documentation
├── API_DOCUMENTATION.md        # API reference
├── QUICKSTART.md              # Quick setup
├── ADVANCED_GUIDE.md          # Advanced features
├── GETTING_STARTED.md         # This file
│
└── docker-compose.yml         # Docker configuration
```

---

## Common Tasks

### Task 1: Decompile an Android App

1. Start the application
2. Open your browser to http://localhost:3000
3. **Decompiler** tab → **APK Decompiler**
4. Click the upload area or drag your `.apk` file
5. Click **"Decompile APK"**
6. Wait for results (2-30 seconds depending on file size)
7. Review AndroidManifest.xml and file structure
8. Export the file list if needed

### Task 2: Extract Strings from a Library

1. Navigate to **Dylib Analyzer**
2. Select your `.dylib` file
3. Click **"Analyze Dylib"**
4. View extracted strings from the library
5. Use for reverse engineering or analysis

### Task 3: Analyze Multiple Files

1. Process one file at a time
2. Export results after each analysis
3. **Pro tip**: Automate with the REST API (see ADVANCED_GUIDE.md)

### Task 4: Format Minified code

1. Go to **Tools** tab
2. Paste your minified JavaScript
3. Click **"Beautify Code"**
4. Copy the formatted result
5. Use in your project

---

## API Quick Reference

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Upload a File
```bash
curl -X POST -F "file=@app.apk" \
  http://localhost:5000/api/upload
```

### Decompile APK
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"filePath\": \"/path/to/app.apk\"}" \
  http://localhost:5000/api/decompile/apk
```

### Beautify Code
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"const x=1;\"}" \
  http://localhost:5000/api/decompile/beautify
```

See API_DOCUMENTATION.md for complete API reference.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+V` | Paste code in beautifier |
| `Tab` | Navigate between tabs |
| `Enter` | Submit form |
| `Ctrl+S` | Save results (in browser) |

---

## Troubleshooting

### "Cannot connect to server"
✅ **Solution**: Ensure backend is running on port 5000
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID [PID] /F

# Restart server
cd server && npm start
```

### "File upload fails"
✅ **Solution**: Check file size and format
- Maximum: 500MB
- Formats: .apk, .dylib, .jar, .zip, .rar, etc.
- Ensure write permissions in `uploads/` folder

### "Out of memory"
✅ **Solution**: Restart the server and process smaller files

### "Module not found" error
✅ **Solution**: Reinstall dependencies
```powershell
cd server
npm install

cd ../client
npm install
```

---

## Environment Details

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk**: 5GB free space
- **Browser**: Chrome, Firefox, Safari, Edge (latest)

---

## Security Notes

⚠️ **Important:**
- This application processes files locally
- Uploaded files are temporary (in `uploads/` folder)
- No files are sent to external services
- Use for legitimate purposes only
- Respect intellectual property and licenses

---

## Next Steps

1. ✅ Start the application
2. ✅ Test with a sample file
3. ✅ Read API_DOCUMENTATION.md for automation
4. ✅ Check ADVANCED_GUIDE.md for advanced features
5. ✅ Customize server configuration in `server/.env`

---

## Need Help?

📚 **Resources:**
- README.md - Full documentation
- API_DOCUMENTATION.md - API reference  
- QUICKSTART.md - Quick setup
- ADVANCED_GUIDE.md - Advanced usage
- Browser Console (F12) - Error messages
- Server Console - Log messages

💬 **Support:**
- Check the troubleshooting section above
- Review console logs for error details
- Ensure all dependencies are installed
- Try with smaller test files first

---

## Tips for Best Results

1. **Start with small files** (< 50MB) for testing
2. **Keep uploads folder clean** - delete old files
3. **Clear extracted folder** weekly for production
4. **Monitor disk space** for large operations
5. **Use batch processing** for multiple files (see ADVANCED_GUIDE.md)
6. **Check server logs** if something goes wrong
7. **Test API with small requests** first

---

## What Can You Do?

### ✅ WITH This Tool:
- Analyze APK files for research
- Study library structures
- Beautify code for readability
- Extract metadata from files
- Learn about app architecture
- Debug app configurations

### ❌ NOT Permitted:
- Illegal distribution of copyrighted code
- Bypassing security measures
- Creating malware
- Stealing intellectual property
- Reverse engineering without permission

---

**Congratulations!** 🎉

You now have a fully functional website decompiler. Start with a small test file and explore the capabilities. Happy analyzing!

---

**Version**: 1.0.0  
**Release Date**: February 2026  
**Status**: ✅ Production Ready
