import express from 'express';
import UsersController from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.get('/', UsersController.getUser);

export default usersRouter;
