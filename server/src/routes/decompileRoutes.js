import express from 'express';
import { decompileAPK, decompileDylib, decompileJar, analyzeFile, beautifyCode, downloadDylibProject, batchDecompileDylib, fetchWebsite } from '../controllers/decompileController.js';

const router = express.Router();

router.post('/apk', decompileAPK);
router.post('/dylib', decompileDylib);
router.post('/dylib/batch', batchDecompileDylib);
router.post('/dylib/download', downloadDylibProject);
router.post('/jar', decompileJar);
router.post('/analyze', analyzeFile);
router.post('/beautify', beautifyCode);
router.post('/fetch', fetchWebsite);

export default router;
