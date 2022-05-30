import { Router } from 'express';
import upload from '../middlewares/uploadFile';
import FileController from '../controllers/files.controller';

const router = Router();
const controller = new FileController();

router.post('/upload', upload.array('files'), controller.uploadFile)

export default router;