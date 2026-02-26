# API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: Your deployed server URL

## Authentication
No authentication required for v1.0 (implement as needed)

## Content-Type
All POST requests require: `Content-Type: application/json`

---

## Endpoints

### 1. Health Check
Check if server is running

**Request**
```
GET /api/health
```

**Response**
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-25T10:30:00.000Z"
}
```

---

### 2. File Upload
Upload a file for processing

**Request**
```
POST /api/upload
Content-Type: multipart/form-data

file: <binary file content>
```

**Response**
```json
{
  "success": true,
  "filename": "app.apk",
  "path": "/path/to/uploaded/file",
  "size": 25600000,
  "uploadedAt": "2026-02-25T10:30:00.000Z"
}
```

**Error Response**
```json
{
  "error": "File type not supported"
}
```

---

### 3. APK Decompilation
Decompile Android APK files

**Request**
```
POST /api/decompile/apk
Content-Type: application/json

{
  "filePath": "/path/to/uploaded/app.apk"
}
```

**Response**
```json
{
  "success": true,
  "type": "APK",
  "files": [
    {
      "name": "AndroidManifest.xml",
      "path": "extracted/apk-1645...",
      "size": 5120
    }
  ],
  "totalFiles": 245,
  "manifest": "<?xml version=\"1.0\"...>",
  "extractedPath": "/path/to/extracted",
  "message": "APK extracted successfully with 245 files"
}
```

---

### 4. Dylib Analysis
Analyze macOS dynamic libraries

**Request**
```
POST /api/decompile/dylib
Content-Type: application/json

{
  "filePath": "/path/to/library.dylib"
}
```

**Response**
```json
{
  "success": true,
  "type": "Dylib",
  "filename": "library.dylib",
  "size": 1024000,
  "machOHeader": {
    "magic": "0xfeedfacf",
    "architecture": "64-bit"
  },
  "strings": [
    "NSString",
    "CFBundleIdentifier",
    "init",
    "dealloc"
  ],
  "totalStrings": 512,
  "message": "Dylib analyzed successfully"
}
```

---

### 5. JAR Decompilation
Extract and analyze Java archives

**Request**
```
POST /api/decompile/jar
Content-Type: application/json

{
  "filePath": "/path/to/library.jar"
}
```

**Response**
```json
{
  "success": true,
  "type": "JAR",
  "files": [
    {
      "name": "App.class",
      "path": "extracted/jar-1645...",
      "size": 2048
    }
  ],
  "totalFiles": 50,
  "manifest": "Manifest-Version: 1.0\n...",
  "extractedPath": "/path/to/extracted",
  "message": "JAR extracted successfully with 50 files"
}
```

---

### 6. File Analysis
Generic file type detection and analysis

**Request**
```
POST /api/decompile/analyze
Content-Type: application/json

{
  "filePath": "/path/to/any/file.bin"
}
```

**Response**
```json
{
  "success": true,
  "filename": "file.bin",
  "size": 2048000,
  "magicBytes": "504b0304",
  "type": "ZIP/APK/JAR",
  "createdAt": "2026-02-25T09:00:00.000Z",
  "modifiedAt": "2026-02-25T10:30:00.000Z"
}
```

---

### 7. Code Beautification
Format and beautify minified code

**Request**
```
POST /api/decompile/beautify
Content-Type: application/json

{
  "code": "const x=()=>{console.log('hello');};",
  "language": "js"
}
```

**Response**
```json
{
  "success": true,
  "original": "const x=()=>{console.log('hello');};",
  "beautified": "const x = () => {\n    console.log('hello');\n};",
  "language": "js"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| HTTP Status | Meaning | Solution |
|-------------|---------|----------|
| 400 | Bad Request | Check your request format and parameters |
| 413 | Payload Too Large | File exceeds 500MB limit |
| 415 | Unsupported Media Type | File format not supported |
| 500 | Server Error | Server encountered an error, check logs |

---

## Request Examples

### cURL - Upload and Decompile APK

```bash
# Upload APK
RESPONSE=$(curl -X POST \
  -F "file=@app.apk" \
  http://localhost:5000/api/upload)

FILE_PATH=$(echo $RESPONSE | jq -r '.path')

# Decompile APK
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"filePath\": \"$FILE_PATH\"}" \
  http://localhost:5000/api/decompile/apk
```

### JavaScript/Fetch - Upload and Analyze

```javascript
const file = document.getElementById('fileInput').files[0];
const formData = new FormData();
formData.append('file', file);

// Upload
const uploadRes = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});

const uploadData = await uploadRes.json();

// Analyze
const analyzeRes = await fetch('http://localhost:5000/api/decompile/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ filePath: uploadData.path })
});

const result = await analyzeRes.json();
console.log(result);
```

### Python - Beautify Code

```python
import requests
import json

code = "const x=()=>{console.log('hello');}"

response = requests.post(
    'http://localhost:5000/api/decompile/beautify',
    headers={'Content-Type': 'application/json'},
    json={
        'code': code,
        'language': 'js'
    }
)

result = response.json()
print(result['beautified'])
```

---

## Rate Limiting

Currently no rate limiting (implement as needed for production)

---

## File Size Limits

- **Maximum upload**: 500MB
- **Recommended**: Under 100MB for optimal performance
- **Large files**: Consider splitting before upload

---

## Supported File Formats

| Format | Extension | Handler |
|--------|-----------|---------|
| Android Package | .apk | apktool |
| Java Archive | .jar | unzipper |
| Dylib | .dylib | binary analyzer |
| ZIP | .zip | unzipper |
| RAR | .rar | archive handler |
| ELF Binary | .elf | binary analyzer |
| Mach-O | .dylib, .app | binary analyzer |

---

## Response Times

Approximate processing times:

| Task | Time | Notes |
|------|------|-------|
| Small APK (< 10MB) | 2-5s | Standard extraction |
| Large APK (50-100MB) | 15-30s | With resource extraction |
| Dylib Analysis | 1-3s | String extraction |
| Code Beautification | < 1s | Depends on code size |

---

## Versioning

**Current Version**: 1.0.0
- No breaking changes expected in v1.x

**Future Versions**:
- v2.0: Authentication & API keys
- v2.1: Batch processing
- v3.0: Advanced decompilation tools

---

## Support

For issues:
1. Check server logs
2. Verify file format is supported
3. Test with smaller files first
4. Check request format matches documentation
