import { Router } from 'express';
import upload from '../middlewares/uploadFile.middleware';
import FileController from '../controllers/FileController';
import { check } from 'express-validator';
import fieldValidator from '../middlewares/fieldValidator.middleware';

const router = Router();

router.get('/', FileController.getAll)

router.post('/', upload.array('files'), FileController.uploadFile)

router.put('/',
    [check('id', 'Es requerido el owner').notEmpty(),
    check('newName', 'Es requerido el nuevo nombre').notEmpty(),
    check('fileName', 'Es requerido el actual nombre').notEmpty(),
    fieldValidator],
    FileController.updateFile)

router.delete('/',
    [check('files', 'Es requerido los nombres de archivos').isArray(),
    check('id', 'Es requerido el owner').notEmpty(),
    fieldValidator], 
    FileController.deleteFiles)

router.get("/:fileName", FileController.get)

export default router;