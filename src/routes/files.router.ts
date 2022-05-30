import { Router } from 'express';
import uploadFile from '../middlewares/uploadFile';
import FileController from '../controllers/files.controller';

const router = Router();
const controller = new FileController();

router.post('/upload', uploadFile.array('files'), controller.uploadFile)

export default router;