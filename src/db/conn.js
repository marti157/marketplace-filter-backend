import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: 'config.env' });
const { ATLAS_URI } = process.env;

export default async function connect() {
  return mongoose
    .connect(ATLAS_URI, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('> Connected to database');
    })
    .catch((err) => console.log(err));
}
