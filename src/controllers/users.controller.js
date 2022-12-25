import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

dotenv.config({ path: './config.env' });
const { JWT_SECRET } = process.env;

export default {
  getUser: (req, res, next) => {
    const { email, password } = req.query;

    User.findOne({ email, password }, { email: 1 })
      .then((result) => {
        if (result === null) {
          res.status(401).send();
        } else {
          const token = jwt.sign({ email: result.email }, JWT_SECRET, {
            expiresIn: 259200,
          });

          res.send({ token });
        }
      })
      .catch((err) => next(err));
  },
};
