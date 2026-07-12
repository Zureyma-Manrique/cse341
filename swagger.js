const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description:
      'CSE 341 Contacts API — CRUD operations for a contacts collection stored in MongoDB.',
  },
  host: process.env.RENDER_HOST || 'localhost:8080',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// Generates swagger-output.json, then starts the server so you can
// immediately confirm the docs at /api-docs.
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');
});
