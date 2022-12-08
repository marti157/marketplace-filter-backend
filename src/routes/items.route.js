import express from 'express';
import { query } from 'express-validator';
import checkValidation from '../middleware/validation.middleware.js';
import * as ItemsController from '../controllers/items.controller.js';

const itemsRouter = express.Router();

itemsRouter.get(
  '/',
  query('page').optional({ checkFalsy: true }).toInt(),
  query('removed').optional({ checkFalsy: true }).toBoolean(),
  checkValidation,
  ItemsController.listItems,
);
itemsRouter.patch(
  '/',
  query('seen').exists().toBoolean(),
  query('timestamp').isLength({ min: 9, max: 30 }),
  checkValidation,
  ItemsController.updateItems,
);

itemsRouter.get('/:id', ItemsController.getItem);
itemsRouter.patch(
  '/:id',
  query('removed').exists().toBoolean(),
  checkValidation,
  ItemsController.updateItem,
);

export default itemsRouter;
