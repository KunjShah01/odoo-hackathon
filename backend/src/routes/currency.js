const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');
const auth = require('../middleware/auth');

// All currency routes require authentication
router.use(auth);

// GET /api/currency/rates
router.get('/rates', currencyController.getExchangeRates);

// POST /api/currency/convert
router.post('/convert', currencyController.convertCurrency);

module.exports = router;