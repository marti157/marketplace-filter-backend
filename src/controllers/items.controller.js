import Item from '../models/item.model.js';

export const listItems = (req, res, next) => {
  const { page } = req.params;

  Item.find({ removed: false }, 'id title price new')
    .sort({ dateUpdated: 1 })
    .skip(page * 20)
    .limit(20)
    .then((items) => {
      res.send(items);
    })
    .catch((err) => next(err));
};

export const getItem = (req, res, next) => {
  const { id } = req.params;

  Item.findOne(
    { id },
    'id title description location price images link dateCreated dateUpdated removed',
  )
    .then((item) => {
      res.send(item);
    })
    .catch((err) => next(err));
};

export const updateItem = (req, res, next) => {
  next();
};
