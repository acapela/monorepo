import express, { Application, json } from 'express';
import 'express-async-errors'; // patches express to handle errors from async functions, must be right after express
import { promisify } from 'util';
import { Server, createServer } from 'http';
import securityMiddleware from 'helmet';
import { createTerminus as gracefulShutdown } from '@godaddy/terminus';

import { PORT, IS_PRODUCTION } from './config';
import * as logger from './logger';
import database from './database';
import { errorHandling, notFoundRouteHandling } from './errors';
import './firebase';

import { router as authenticationRoutes } from './authentication';

function setupServer(): Server {
  const app = express();
  setupMiddleware(app);
  setupRoutes(app);
  setupErrorHandling(app);

  const server = createServer(app);
  setupGracefulShutdown(server);

  return server;
}

function setupMiddleware(app: Application): void {
  app.use(securityMiddleware());
  app.use(logger.middleware);
  app.use(json());
}

function setupRoutes(app: Application): void {
  app.use('/api', authenticationRoutes);
}

function setupErrorHandling(app: Application): void {
  app.use(notFoundRouteHandling);
  app.use(errorHandling);
}

function setupGracefulShutdown(server: Server) {
  const closeServer = promisify(server.close.bind(server));

  gracefulShutdown(server, {
    onSignal: () => {
      return Promise.all([database.destroy(), closeServer()]);
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
