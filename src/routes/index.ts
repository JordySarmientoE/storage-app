import { Router } from 'express';
import files from './files.router';
import users from './user.router';

const router = Router();

router.use('/files', files);
router.use('/users', users);

export default router;