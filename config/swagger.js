const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Karibu Groceries LTD API',
      version: '1.0.0',
      description: 'API documentation for Karibu Groceries LTD',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API route files where Swagger annotations are defined
};

const specs = swaggerJsdoc(options);
module.exports = specs;