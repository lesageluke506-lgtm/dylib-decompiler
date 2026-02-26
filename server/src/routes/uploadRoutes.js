import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-rar-compressed',
      'application/gzip',
      'application/x-gzip',
      'text/plain',
      'application/json',
      'text/javascript',
      'application/x-dex'
    ];
    
    if (allowedMimes.includes(file.mimetype) || 
        ['.apk', '.dylib', '.jar', '.zip', '.rar', '.tar', '.gz', '.dex', '.js', '.json'].some(ext => file.originalname.endsWith(ext))) {
      cb(null, true);
    } else {
      cb(new Error(`File type not supported: ${file.mimetype}`));
    }
  }
});

// Upload endpoint
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    filename: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  });
});

export default router;
