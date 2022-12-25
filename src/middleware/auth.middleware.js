import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config({ path: './config.env' });
const { JWT_SECRET } = process.env;

export default function authorize(req, res, next) {
  const jwtToken = req.headers['x-access-token'];

  if (!jwtToken) return res.status(401).send({ error: 'Token not present in headers.' });

  jwt.verify(jwtToken, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });

    User.findOne({ email: payload.email })
      .then((result) => {
        if (result === null) {
          res.status(401).send();
        } else {
          next();
        }
      })
      .catch((err2) => next(err2));
  });
}
