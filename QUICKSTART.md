# Quick Start Guide

## 🚀 First Run on Windows

### Option 1: Automated Setup (Easiest)
1. Double-click `setup.bat`
2. Wait for npm packages to install
3. Open two new terminals in the project directory:
   - **Terminal 1**: Type `cd server && npm start`
   - **Terminal 2**: Type `cd client && npm start`
4. Frontend opens at http://localhost:3000

### Option 2: Manual Setup
1. Open PowerShell in the project folder
2. Run:
   ```powershell
   cd server
   npm install
   npm start
   ```
3. Open another PowerShell window:
   ```powershell
   cd client
   npm install
   npm start
   ```

## 🐧 First Run on macOS/Linux

1. Make setup script executable:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. Start the backend:
   ```bash
   cd server
   npm start
   ```

3. In another terminal, start the frontend:
   ```bash
   cd client
   npm start
   ```

## 🐳 Using Docker

```bash
docker-compose up
```

Access at http://localhost:3000

## Features Overview

### 📱 APK Decompiler
- Extract Android application packages
- View AndroidManifest.xml
- Analyze app resources and code structure

### 🔗 Dylib Analyzer
- Examine macOS dynamic libraries
- Extract embedded strings
- Analyze Mach-O headers

### ☕ JAR Decompiler
- Decompose Java archives
- Extract manifest information
- List all contained classes and resources

### 📦 Universal File Analyzer
- Identify file types by magic bytes
- Show file metadata
- Support for ZIP, RAR, ELF, PDF, and more

### ✨ Code Tools
- Beautify minified JavaScript
- Format code automatically
- Copy results to clipboard

## File Size Limits

- Maximum upload: 500MB
- Recommended: Under 100MB for faster processing

## Troubleshooting

### "Cannot find npm"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Port 5000 is already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### "CORS error when uploading"
- Ensure backend is running on http://localhost:5000
- Check firewall settings

### Files not uploading
- Check file size (max 500MB)
- Ensure write permissions in `uploads/` folder
- Try a smaller file first

## Performance Tips

1. **Large Files**: Split into smaller parts
2. **Batch Processing**: Process similar files together
3. **Cleanup**: Delete old extracted files periodically from `extracted/` folder
4. **Memory**: Restart server if it becomes slow

## Next Steps

1. Upload your first file
2. Click the appropriate decompile button
3. Wait for results (usually 5-30 seconds)
4. Download or copy the extracted data

## Advanced Configuration

Edit `server/.env`:
```env
PORT=5000                    # Server port
NODE_ENV=development         # development or production
MAX_FILE_SIZE=500MB         # Maximum upload size
```

## Support & Updates

- Check README.md for API documentation
- Review console (F12) for error messages
- Ensure all dependencies are up to date: `npm update`

---

**Happy Decompiling!** 🎉
