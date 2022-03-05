const express = require('express');
const router = express.Router();
const cajeroController = require('../controllers/cajeros.controller')

router.post('/cajeros', cajeroController.cajeros)

module.exports = router