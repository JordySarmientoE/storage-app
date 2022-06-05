import { Router } from 'express';
import upload from '../middlewares/uploadFile.middleware';
import FileController from '../controllers/FileController';

const router = Router();

router.post('/upload', upload.array('files'), FileController.uploadFile)

export default router;