import { Router } from 'express';
import { check } from 'express-validator';
import UserController from '../controllers/UserController';
import fieldValidator from '../middlewares/fieldValidator.middleware';

const router = Router();

router.get('/', UserController.getAll)

router.post('/',
    [check('name', 'El nombre es requerido').notEmpty(),
    check('email', 'El correo es requerido').notEmpty(),
    check('password', 'La contraseña es requerido').notEmpty(),
    fieldValidator],
    UserController.create)

export default router;