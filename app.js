import Fastify from 'fastify';
import firstRouter from './routers/first-route.js';
import dbConnector from './plugins/db-connector.js';

function build(opts = {}) {
  const app = Fastify(opts);
  app.register(dbConnector);
  app.register(firstRouter);

  return app;
}

export default build;
