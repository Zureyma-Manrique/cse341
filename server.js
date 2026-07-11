const express = require('express');
const cors = require('cors'); // Necesario si abres el HTML como archivo local (file://)
const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use('/', require('./routes/index'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});