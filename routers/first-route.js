import fastifyPlugin from 'fastify-plugin';

/**
 * Encapsulates the routes
 * @param {import('fastify').FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routers(fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection');
  /**
   * @type {import('fastify').RouterShorthandOptions}
   * @const
   */
  const opts = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.get('/', opts, async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/animals/:animal', async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal });
    if (!result) {
      throw new Error('Invalid value');
    }
    return result;
  });
  // validate animalBody with JSONSchema
  const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
      animal: { type: 'string' },
    },
  };

  const schema = {
    body: animalBodyJsonSchema,
  };

  fastify.post('/animals', { schema }, async (request, reply) => {
    // we can use the `request.body` object to get the data sent by the client
    console.log(request.body);
    const result = await collection.insertOne({ animal: request.body.animal });
    return result;
  });
}

export default fastifyPlugin(routers);
