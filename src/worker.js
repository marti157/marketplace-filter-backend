import fs from 'fs';
import mongoose from 'mongoose';
import Item from './models/item.model.js';
import User from './models/user.model.js';
import { requesters, parsers } from '../endpoints/handlers.js';
import connect from './db/conn.js';

const readEndpoints = () => {
  const fileNames = fs.readdirSync('endpoints').filter((file) => file.match(/\.json$/));

  return fileNames.reduce(
    (result, fileName) => [...result, ...JSON.parse(fs.readFileSync(`endpoints/${fileName}`))],
    [],
  );
};

const main = async (endpoints) => {
  await connect();

  const requestPromises = [];

  /* REQUEST PHASE */
  endpoints.forEach((endpoint) => {
    requesters[endpoint.handler](endpoint, requestPromises);
  });

  let responses;

  try {
    responses = await Promise.all(requestPromises);
  } catch (err) {
    console.error('Error in request:', err.response.status);
  }

  /* RESULT PARSING PHASE */
  responses = responses.reduce(
    (result, response) => [...result, ...parsers[response.handler](response.data)],
    [],
  );

  /* RESULT INSERT PHASE */
  const dbPromises = responses.map((item) =>
    Item.findOne({ id: item.id }).then(async (result) => {
      if (result === null) {
        await Item.create(item);
        await User.updateMany({}, { $inc: { unseen: 1 } });
      }
    }),
  );

  try {
    await Promise.all(dbPromises);
  } catch (err) {
    console.error('Error with queries:', err);
  }

  mongoose.connection.close();
};

main(readEndpoints());
