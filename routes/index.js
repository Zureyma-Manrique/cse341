const express = require('express');
const router = express.Router();
const profController = require('../controllers/professional');

// El frontend probablemente hace una petición GET a la raíz o a una ruta específica
router.get('/', profController.getData);

module.exports = router;