import express from 'express';
import * as ItemsController from '../controllers/items.controller.js';

const itemsRouter = express.Router();

itemsRouter.get('/', ItemsController.listItems);
itemsRouter.get('/:id', ItemsController.getItem);
itemsRouter.patch('/:id', ItemsController.updateItem);

export default itemsRouter;
