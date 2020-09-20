import express, { Application } from 'express';
import { promisify } from 'util';
import { Server, createServer } from 'http';
import securityMiddleware from 'helmet';
import { json } from 'body-parser';
import { createTerminus } from '@godaddy/terminus';

import { PORT, IS_PRODUCTION } from './config';
import * as logger from './logger';

function setupServer(): Server {
  const app = express();
  setupMiddleware(app);
  setupRoutes(app);

  const server = createServer(app);
  setupGracefulShutdown(server);

  return server;
}

function setupMiddleware(app: Application): void {
  app.use(securityMiddleware());
  app.use(logger.middleware());
  app.use(json());
}

function setupRoutes(app: Application): void {
  app.get('/', (_, res) => res.end('Hello, world'));
}

function setupGracefulShutdown(server: Server) {
  const closeServer = promisify(server.close.bind(server));

  createTerminus(server, {
    onSignal: async () => {
      await closeServer();
    },
  });
}

function start(): void {
  const server = setupServer();
  server.listen(PORT, () =>
    logger.info('Server started', { port: PORT, production: IS_PRODUCTION }),
  );
}

start();
