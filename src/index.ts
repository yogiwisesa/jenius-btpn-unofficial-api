import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import AppRouter from './AppRouter';

import './controllers/JeniusController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('source-map-support').install();

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.set('port', port);

app.use(bodyParser.json());
app.use(AppRouter.getInstance());

app.listen(port, () => {
  console.log(`listening on: ${port}`);
});
