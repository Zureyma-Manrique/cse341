// docs/swagger.js
// Run with: npm run swagger
// Scans server.js + routes/*.js and (re)generates docs/swagger-output.json,
// which swagger-ui-express serves at GET /api-docs.

const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'Calendar Agent API',
    description:
      'Automated Calendar Agent that uses an LLM (Gemini 2.5 Flash) to generate agile ' +
      'user stories from natural-language prompts, pending human review, then syncs ' +
      'approved stories to a calendar.',
    version: '1.0.0',
  },
  host: isProd ? process.env.RENDER_HOST || 'your-app.onrender.com' : `localhost:${process.env.PORT || 3000}`,
  schemes: isProd ? ['https'] : ['http'],
  tags: [
    { name: 'User Stories', description: 'AI-generated agile user stories awaiting review' },
    { name: 'Projects', description: 'Projects that group user stories and provide AI context' },
  ],
  definitions: {
    GeneratePromptRequest: {
      prompt: 'Plan a two-week sprint to add user authentication with OAuth login and password reset.',
    },
    UpdateStoryRequest: {
      status: 'approved',
      title: 'Add OAuth login endpoint',
      description: 'As a user, I want to log in with Google, so that I skip creating a new password.',
      estimatedHours: 8,
      scheduledDate: '2026-08-10',
      projectName: 'Calendar Agent',
    },
    CreateProjectRequest: {
      projectName: 'Calendar Agent',
      context: 'Internal tool that turns sprint planning prompts into scheduled tasks.',
    },
  },
};

const outputFile = './docs/swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated at docs/swagger-output.json');
});
