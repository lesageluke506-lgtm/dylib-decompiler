# Website Decompiler - Advanced Features Guide

## Table of Contents
1. [Tools Overview](#tools-overview)
2. [Advanced File Analysis](#advanced-file-analysis)
3. [Batch Processing](#batch-processing)
4. [Automation](#automation)
5. [Performance Optimization](#performance-optimization)

---

## Tools Overview

### 1. **APK Decompiler** 📱
Extract and analyze Android applications

**What it does:**
- Extracts all files from APK packages
- Parses AndroidManifest.xml
- Lists resources and code files
- Shows app metadata

**Use cases:**
- Android app reverse engineering
- Security analysis
- App structure examination
- Resource extraction

**Max file size:** 500MB

---

### 2. **Dylib Analyzer** 🔗
Examine macOS dynamic libraries

**What it does:**
- Analyzes Mach-O binary headers
- Extracts embedded strings
- Identifies architecture (32/64-bit)
- Shows symbol information

**Use cases:**
- macOS library analysis
- Security research
- Dependency examination
- String extraction

**Supported architectures:**
- 64-bit (arm64, x86_64)
- 32-bit (i386)

---

### 3. **JAR Decompiler** ☕
Decompose Java archive files

**What it does:**
- Extracts JAR contents
- Parses MANIFEST.MF
- Lists classes and resources
- Shows package structure

**Use cases:**
- Java application analysis
- Library examination
- Code structure review
- Dependency analysis

---

### 4. **Universal File Analyzer** 📦
Identify and analyze any file type

**Supported formats:**
- ZIP, RAR, GZIP, TAR
- ELF, Mach-O executables
- Java classes
- PDF documents
- Image files (PNG, JPEG, GIF)
- Audio files (MP3)
- Custom binaries

**Features:**
- Magic byte detection
- File metadata extraction
- Entropy calculation
- Compression detection

---

### 5. **Code Beautifier** ✨
Format and prettify minified code

**Capabilities:**
- JavaScript/ES6 beautification
- Custom indent settings
- Preserve newlines option
- Multiple language support

**Before:**
```javascript
const x=()=>{console.log('hello');const y=10;return y;};
```

**After:**
```javascript
const x = () => {
    console.log('hello');
    const y = 10;
    return y;
};
```

---

## Advanced File Analysis

### Binary Analysis

The system can analyze binary files and extract:

1. **Magic Bytes** - File type identification
2. **File Entropy** - Compression level detection
3. **Strings** - Embedded text extraction
4. **Headers** - Architecture and format information
5. **Sections** - Code, data, and resource sections

### File Type Detection

| Signature | File Type | Handler |
|-----------|-----------|---------|
| `504b0304` | ZIP/APK/JAR | Archive |
| `7f454c46` | ELF Binary | Binary Analysis |
| `cafebabe` | Java Class | Bytecode |
| `feedfacf` | Mach-O 64-bit | Binary Analysis |
| `1f8b08` | GZIP | Compression |

---

## Batch Processing

### Processing Multiple Files

**Manual Batch:**
1. Upload first file
2. Wait for results
3. Export results
4. Repeat for next file

**Recommended workflow:**
- Process 5-10 files per session
- Clear extracted files between batches
- Monitor disk usage

### Sample Processing Speed

| Task | Size | Time |
|------|------|------|
| Small APK | 5-10MB | 2-5s |
| Medium APK | 25-50MB | 10-20s |
| Large APK | 100MB+ | 30-60s |
| Dylib Analysis | Any | 1-3s |
| Code Beautify | < 1MB | < 1s |

---

## Automation

### Using the API

#### Example: Batch Process APKs

```bash
#!/bin/bash

for apk in *.apk; do
    echo "Processing $apk..."
    
    # Upload
    RESPONSE=$(curl -X POST \
      -F "file=@$apk" \
      http://localhost:5000/api/upload)
    
    FILE_PATH=$(echo $RESPONSE | jq -r '.path')
    FILENAME=$(echo $RESPONSE | jq -r '.filename')
    
    # Decompile
    RESULT=$(curl -X POST \
      -H "Content-Type: application/json" \
      -d "{\"filePath\": \"$FILE_PATH\"}" \
      http://localhost:5000/api/decompile/apk)
    
    # Save results
    echo $RESULT > "results_${FILENAME}.json"
    echo "✓ Completed $apk"
done
```

#### Python Automation Example

```python
import requests
import json
import os

API_URL = 'http://localhost:5000/api'

def process_apk(apk_path):
    """Process a single APK file"""
    
    # Upload
    with open(apk_path, 'rb') as f:
        upload_response = requests.post(
            f'{API_URL}/upload',
            files={'file': f}
        )
    
    file_path = upload_response.json()['path']
    
    # Decompile
    result = requests.post(
        f'{API_URL}/decompile/apk',
        json={'filePath': file_path}
    )
    
    return result.json()

# Process multiple files
apks = [f for f in os.listdir('.') if f.endswith('.apk')]
for apk in apks:
    print(f"Processing {apk}...")
    results = process_apk(apk)
    with open(f'{apk}.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"✓ Saved results to {apk}.json")
```

---

## Performance Optimization

### 1. **Memory Management**
- Restart server every 100 files (large files)
- Monitor RAM usage
- Clear old extracted files weekly

### 2. **Disk Space**
- Remove `extracted/` folder files periodically
- Keep upload folder clean
- Archive completed analyses

### 3. **Processing Speed**
- Process files in parallel using API
- Use smaller chunk sizes for very large files
- Pre-filter by file type

### 4. **Network Optimization**
- For remote servers: use compression
- Batch multiple small requests
- Consider WebSocket for real-time progress

---

## Advanced Configuration

### Server Environment Variables

Create `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
HOST=0.0.0.0

# File Handling
MAX_FILE_SIZE=500MB
UPLOAD_DIR=./uploads
EXTRACTED_DIR=./extracted
TEMP_DIR=./temp

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/server.log

# Security
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT=100/15min
```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name decompiler.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

---

## Troubleshooting Advanced Issues

### Out of Memory
```bash
# Increase Node.js heap size
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Large File Processing
```bash
# Create a cleanup script to remove old files
pwsh -Command "Get-ChildItem -Path './extracted' -OlderThan (Get-Date).AddDays(-7) | Remove-Item"
```

### CORS Issues
Add to server cors configuration:
```javascript
cors({
  origin: ['http://localhost:3000', 'http://yourfrontend.com'],
  credentials: true
})
```

---

## Future Enhancements

Planned features:
- APKTool integration for better decompilation
- WebAssembly (WASM) decompiler
- IL2CPP decompiler for Unity games
- Batch processing UI
- Malware detection integration
- Advanced code analysis tools
- Database for file history
- REST API documentation (Swagger)

---

## Support Resources

- **GitHub Issues**: Report bugs and request features
- **Stack Overflow**: Tag `website-decompiler`
- **Documentation**: See README.md and API_DOCUMENTATION.md
- **Community Samples**: Check examples/ folder

---

**Version**: 1.0.0  
**Last Updated**: February 2026
