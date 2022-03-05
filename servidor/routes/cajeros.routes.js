const express = require('express');
const router = express.Router();
const cajeroController = require('../controllers/cajeros.controller')

router.post('/cajeros', cajeroController.cajeros)

router.get('/cajeros/redes', cajeroController.redes)

module.exports = router