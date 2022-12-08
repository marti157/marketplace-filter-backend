import Item from '../models/item.model.js';

export const listItems = (req, res, next) => {
  const { page, removed } = req.query;

  const sort = !removed ? { dateUpdated: -1 } : { updatedAt: -1 };

  Item.find({ removed: !!removed }, 'id title images price dateUpdated new removed')
    .sort(sort)
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

export const updateItems = (req, res, next) => {
  const { seen, timestamp } = req.query;

  if (seen === true) {
    Item.updateMany({ new: true, createdAt: { $lt: new Date(timestamp) } }, { new: false })
      .then(() => res.status(200).send())
      .catch((err) => next(err));
  } else {
    res.status(204).send();
  }
};

export const updateItem = (req, res, next) => {
  const { id } = req.params;
  const { removed } = req.query;

  Item.updateOne({ id }, { removed })
    .then(() => res.status(200).send())
    .catch((err) => next(err));
};
