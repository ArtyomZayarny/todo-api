import express, { Router } from 'express';
import { userController } from '../modules/user/index.ts';

const router: Router = express.Router();

router.route('/').post(userController.createUser).get(userController.getUsers);

export default router;
