import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connect from './db/conn.js';
import itemsRouter from './routes/items.route.js';
import usersRouter from './routes/users.route.js';

dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);

app.get('/*', (_, res) => {
  const { pathname: root } = new URL('..', import.meta.url);
  res.sendFile('./public/index.html', { root });
});

connect();

app.listen(PORT, () => {
  console.log(`> Server is running on port: ${PORT}`);
});
