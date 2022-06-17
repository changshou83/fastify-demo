import { test } from 'tap';
import build from '../app.js';

await test('requests the "/" route', async t => {
  const app = build();

  t.teardown(() => app.close());

  try {
    // use the .inject method to make a fake request
    const response = await app.inject({}).get('/');
    t.equal(response.statusCode, 200);
    t.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8'
    );
    t.same(response.json(), { hello: 'world' });
  } catch (err) {
    t.error(err);
  }
});
