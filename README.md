# Website Decompiler - Full Stack Application

A comprehensive file decompilation and analysis tool with support for APK, Dylib, JAR, and other file formats.

## Features

- **APK Decompilation** - Extract and analyze Android application packages
- **Dylib Analysis** - Examine macOS dynamic libraries and extract strings
- **JAR Decompilation** - Decompose Java archive files
- **Universal File Analysis** - Identify and analyze any file type
- **Code Beautification** - Format and prettify minified code
- **Web-Based Interface** - Modern, responsive UI for file analysis

## Project Structure

```
.
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.js       # Main server file
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   └── utils/         # Helper functions
│   ├── uploads/           # Uploaded files storage
│   ├── extracted/         # Extracted file storage
│   └── package.json
│
├── client/                 # Frontend
│   ├── public/
│   │   └── index.html     # Main HTML file
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Minimum 2GB free disk space for file processing

## Installation

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

## Running the Application

### Start BackendServer

```bash
cd server
npm start
# Or with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Start Frontend

In a new terminal:

```bash
cd client
npm start
# Or:
npm run dev
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### File Upload
- **POST** `/api/upload` - Upload files for decompilation

### Decompilation Tools
- **POST** `/api/decompile/apk` - Decompile APK files
- **POST** `/api/decompile/dylib` - Analyze Dylib files
- **POST** `/api/decompile/jar` - Decompile JAR files
- **POST** `/api/decompile/analyze` - Analyze any file type
- **POST** `/api/decompile/beautify` - Beautify code

### Health Check
- **GET** `/api/health` - Server status

## Usage

1. **Upload a File**: Click the upload area or drag and drop a file
2. **Decompile**: Click the appropriate decompile button
3. **View Results**: Analyze extracted files and metadata
4. **Export**: Copy results to clipboard or download

## Supported File Formats

| Format | Extension | Features |
|--------|-----------|----------|
| APK | .apk | Full decompilation & manifest extraction |
| Dylib | .dylib | Binary analysis & string extraction |
| JAR | .jar | Archive decomposition & manifest reading |
| ZIP | .zip | Universal archive extraction |
| RAR | .rar | Archive extraction |
| Executables | .elf, .exe | Binary analysis |
| Others | * | File type identification & magic bytes |

## Configuration

Create a `.env` file in the server directory:

```env
PORT=5000
MAX_FILE_SIZE=500MB
NODE_ENV=development
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :[PORT]
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :[PORT]
kill -9 [PID]
```

### File Upload Fails
- Check file size (max 500MB)
- Ensure write permissions in `uploads/` directory
- Check available disk space

### Server Connection Error
- Verify server is running on port 5000
- Check firewall settings
- Clear browser cache and reload

## Performance Tips

- Split large APK files before analysis
- Use the code beautifier for batch processing
- Clear extracted files periodically from `extracted/` directory
- Monitor disk space for large operations

## Future Enhancements

- [ ] APKTool integration for better decompilation
- [ ] IL2CPP decompiler support
- [ ] WebAssembly (WASM) decompiler
- [ ] Batch file processing
- [ ] Cloud-based file storage
- [ ] Advanced code analysis and pattern matching
- [ ] Malware detection integration
- [ ] REST API documentation (Swagger)

## Security Notes

- This tool processes files locally
- Uploaded files are stored temporarily and can be deleted
- No files are sent to external services
- Use within legal boundaries and respect intellectual property

## License

MIT License - Use freely for educational purposes

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs (F12 in browser)
3. Check server logs in terminal

---

**Version**: 1.0.0  
**Last Updated**: February 2026
