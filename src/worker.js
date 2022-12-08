import fs from 'fs';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import sharp from 'sharp';
import Item from './models/item.model.js';
import { requesters, parsers } from '../endpoints/handlers.js';
import connect from './db/conn.js';

dotenv.config({ path: './config.env' });
const { MAX_IMAGES, IMAGE_OUTPUT, MAX_UPDATE_PAGES } = process.env;

const NUM_PAGES = process.argv[2] === 'populate' ? MAX_UPDATE_PAGES : 1;

const readEndpoints = () => {
  const fileNames = fs.readdirSync('endpoints').filter((file) => file.match(/\.json$/));

  return fileNames.reduce(
    (result, fileName) => [...result, ...JSON.parse(fs.readFileSync(`endpoints/${fileName}`))],
    [],
  );
};

const downloadImages = async (itemId, images) => {
  const fileNames = [];

  const promises = images.map(async (image, i) => {
    const fileName = `${itemId}_${i}.jpg`;

    try {
      const response = await axios({
        method: 'get',
        url: image,
        responseType: 'arraybuffer',
      });

      await sharp(response.data)
        .resize(320)
        .jpeg({ mozjpeg: true })
        .toFile(`${IMAGE_OUTPUT}/${fileName}`);

      fileNames.push(fileName);
    } catch (err) {
      console.error('Error processing images:', fileName, err);
    }
  });

  await Promise.all(promises);

  await Item.updateOne({ id: itemId }, { images: fileNames });
};

const main = async (endpoints) => {
  await connect();

  const requestPromises = [];

  /* REQUEST PHASE */
  endpoints.forEach((endpoint) => {
    requesters[endpoint.handler](endpoint, requestPromises, NUM_PAGES);
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

  let newItems = 0;

  /* RESULT INSERT PHASE */
  const dbPromises = responses.map(
    (item) =>
      new Promise((resolve) => {
        Item.findOne({ id: item.id }).then((result) => {
          if (result === null) {
            // eslint-disable-next-line no-param-reassign
            item.images = item.images.slice(0, MAX_IMAGES);
            Item.create(item)
              .then(() => {
                newItems += 1;
                resolve(downloadImages(item.id, item.images));
              })
              .catch((err) => {
                console.error('Error with single db query:', err);
                resolve();
              });
          } else {
            resolve();
          }
        });
      }),
  );

  console.log('New items:', newItems);

  let imageQueryPromises;

  try {
    imageQueryPromises = await Promise.all(dbPromises);
  } catch (err) {
    console.error('Error with db queries:', err);
  }

  /* DOWNLOAD AND STORE IMAGES FOR NEW ITEMS */
  try {
    await Promise.all(imageQueryPromises);
  } catch (err) {
    console.error('Error with image queries:', err);
  }

  await mongoose.connection.close();

  process.exit(1);
};

main(readEndpoints());
