import config from 'config';

import * as logger from './logger';
import { setupServer } from './app';

function start(): void {
  const server = setupServer();
  const port = config.get('port');
  server.listen(port, () =>
    logger.info('Server started', {
      port,
      production: process.env.NODE_ENV === 'production',
    })
  );
}

start();
