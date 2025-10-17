import express from 'express';
import { uploadSingle,uploadMultiple } from '../middleware/upload.middleware.js';
import { uploadSingleImage,uploadMultipleImages,deleteImage } from '../Controllers/file.controller.js';

const router = express.Router();


router.post("/upload-single", uploadSingle, uploadSingleImage);
router.post("/upload-multiple", uploadMultiple, uploadMultipleImages);
router.delete("/delete", deleteImage);

export default router;