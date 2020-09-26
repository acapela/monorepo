import request from 'supertest';

import { setupServer } from './app';

describe('Application', () => {
  const app = setupServer();

  it('has 404s set up correctly', async () => {
    await request(app)
      .post('/a-route-that-probably-does-not-exist')
      .expect((response) => {
        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Not found');
      });
  });
});
