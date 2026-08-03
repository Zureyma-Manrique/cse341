require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { initDb } = require('./db/connect');
const mainRoutes = require('./routes/index');
const swaggerSpec = require('./config/swagger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger UI docs, published at /api-docs as required by the assignment
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Paws & Paths API is running. Visit /api-docs for documentation.');
});

app.use('/', mainRoutes);

app.use(notFound);
app.use(errorHandler);

initDb((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
  }
});
