const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paws & Paths API',
      version: '1.0.0',
      description:
        'Backend API for Paws & Paths, a dog walking scheduler that connects dog owners with professional dog walkers. Covers the Users, Dogs, WalkSchedules, and Reviews collections, plus Google OAuth login. POST/PUT on WalkSchedules and Reviews require an active login session (see /auth/google).'
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'https://cse341-0zfq.onrender.com',
        description: 'Render deployment'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
