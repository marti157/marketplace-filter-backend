import User from '../models/user.model.js';

export default {
  getUser: (req, res, next) => {
    const { email, password } = req.params;

    User.findOne({ email, password }, 'id')
      .then((items) => {
        res.send(items);
      })
      .catch((err) => next(err));
  },
};
