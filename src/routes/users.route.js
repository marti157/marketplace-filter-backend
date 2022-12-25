import express from 'express';
import { query } from 'express-validator';
import checkValidation from '../middleware/validation.middleware.js';
import UsersController from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.get(
  '/',
  query('email').isLength({ min: 5, max: 64 }),
  query('password').isLength({ min: 64, max: 128 }),
  checkValidation,
  UsersController.getUser,
);

export default usersRouter;
