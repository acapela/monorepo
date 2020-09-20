import express, { Application } from 'express';

import { PORT, IS_PRODUCTION } from './config';
import * as logger from './logger';

function configureApp(): Application {
  const app = express();
  app.use(logger.middleware());
  return app;
}

function start() {
  const app = configureApp();
  app.listen(PORT, () => logger.info('App started', { port: PORT, production: IS_PRODUCTION }));
}

start();
