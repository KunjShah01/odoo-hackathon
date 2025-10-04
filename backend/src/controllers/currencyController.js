const axios = require('axios');
const Joi = require('joi');

// Allow-list of supported ISO currency codes (add or refine as needed)
const ALLOWED_CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "NZD", "SEK",
  "MXN", "SGD", "HKD", "NOK", "KRW", "TRY", "RUB", "INR", "BRL", "ZAR"
];

const convertSchema = Joi.object({
  from: Joi.string().length(3).required(),
  to: Joi.string().length(3).required(),
  amount: Joi.number().positive().required()
});

const getExchangeRates = async (req, res) => {
  try {
    let { base = 'USD' } = req.query;
    // Normalize and validate base currency
    if (typeof base === "string") {
      base = base.toUpperCase();
    } else {
      base = "USD";
    }
    if (!ALLOWED_CURRENCIES.includes(base)) {
      return res.status(400).json({ error: `Currency ${base} not supported` });
    }

    // Using a free exchange rate API (you may want to use a paid service for production)
    const response = await axios.get(`${process.env.CURRENCY_API_URL}/${base}`, {
      timeout: 5000
    });

    res.json({
      base: response.data.base,
      rates: response.data.rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get exchange rates error:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
};

const convertCurrency = async (req, res) => {
  try {
    const { error, value } = convertSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { from, to, amount } = value;

    // Get exchange rates
    const response = await axios.get(`${process.env.CURRENCY_API_URL}/${from}`, {
      timeout: 5000
    });

    const rates = response.data.rates;

    if (!rates[to]) {
      return res.status(400).json({ error: `Currency ${to} not supported` });
    }

    const convertedAmount = amount * rates[to];

    res.json({
      from,
      to,
      originalAmount: amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
      rate: rates[to],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Convert currency error:', error);

    if (error.response && error.response.status === 404) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    res.status(500).json({ error: 'Failed to convert currency' });
  }
};

module.exports = {
  getExchangeRates,
  convertCurrency
};