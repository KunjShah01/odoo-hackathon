/**
 * Currency Service
 * Handles currency detection, conversion, and country information
 * Uses external APIs for real-time data
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Country {
  name: string;
  currencies: Record<string, { name: string; symbol: string }>;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  date: string;
}

// Cache for API responses
let countriesCache: Country[] | null = null;
const exchangeRatesCache: Map<string, { rates: ExchangeRates; timestamp: number }> = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch all countries and their currencies
 * API: https://restcountries.com/v3.1/all?fields=name,currencies
 */
export async function fetchCountriesAndCurrencies(): Promise<Country[]> {
  // Return cached data if available
  if (countriesCache && countriesCache.length > 0) {
    return countriesCache;
  }

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data
    countriesCache = data.map((country: { name: { common: string }; currencies?: Record<string, { name: string; symbol: string }> }) => ({
      name: country.name.common,
      currencies: country.currencies || {},
    }));

    return countriesCache || [];
  } catch (error) {
    console.error('Error fetching countries and currencies:', error);
    // Return fallback data
    return getFallbackCountries();
  }
}

/**
 * Get currency information for a specific country
 */
export async function getCurrencyForCountry(countryName: string): Promise<Currency | null> {
  const countries = await fetchCountriesAndCurrencies();
  
  const country = countries.find(c => 
    c.name.toLowerCase() === countryName.toLowerCase() ||
    c.name.toLowerCase().includes(countryName.toLowerCase())
  );

  if (!country || !country.currencies) {
    return null;
  }

  // Get the first currency (most countries have one primary currency)
  const currencyCode = Object.keys(country.currencies)[0];
  const currencyInfo = country.currencies[currencyCode];

  return {
    code: currencyCode,
    name: currencyInfo.name,
    symbol: currencyInfo.symbol || currencyCode,
  };
}

/**
 * Fetch exchange rates for a base currency
 * API: https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}
 */
export async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Check cache
  const cached = exchangeRatesCache.get(baseCurrency);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.rates;
  }

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();
    
    const rates: ExchangeRates = {
      base: data.base,
      rates: data.rates,
      date: data.date,
    };

    // Cache the results
    exchangeRatesCache.set(baseCurrency, {
      rates,
      timestamp: now,
    });

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return fallback rates
    return getFallbackExchangeRates(baseCurrency);
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ convertedAmount: number; rate: number; date: string }> {
  if (fromCurrency === toCurrency) {
    return {
      convertedAmount: amount,
      rate: 1,
      date: new Date().toISOString().split('T')[0],
    };
  }

  try {
    const exchangeRates = await fetchExchangeRates(fromCurrency);
    const rate = exchangeRates.rates[toCurrency];

    if (!rate) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    const convertedAmount = amount * rate;

    return {
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      rate: parseFloat(rate.toFixed(4)),
      date: exchangeRates.date,
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw new Error(`Failed to convert ${fromCurrency} to ${toCurrency}`);
  }
}

/**
 * Get all available currencies
 */
export async function getAllCurrencies(): Promise<Currency[]> {
  const countries = await fetchCountriesAndCurrencies();
  const currencyMap = new Map<string, Currency>();

  countries.forEach(country => {
    if (country.currencies) {
      Object.entries(country.currencies).forEach(([code, info]) => {
        if (!currencyMap.has(code)) {
          currencyMap.set(code, {
            code,
            name: info.name,
            symbol: info.symbol || code,
          });
        }
      });
    }
  });

  return Array.from(currencyMap.values()).sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Detect currency from country name
 */
export async function detectCurrencyFromCountry(countryName: string): Promise<string> {
  const currency = await getCurrencyForCountry(countryName);
  return currency?.code || 'USD';
}

/**
 * Get popular currencies (most commonly used)
 */
export function getPopularCurrencies(): Currency[] {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  ];
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    // Fallback formatting
    const popularCurrencies = getPopularCurrencies();
    const currency = popularCurrencies.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Fallback countries data in case API fails
 */
function getFallbackCountries(): Country[] {
  return [
    { name: 'United States', currencies: { USD: { name: 'US Dollar', symbol: '$' } } },
    { name: 'United Kingdom', currencies: { GBP: { name: 'British Pound', symbol: '£' } } },
    { name: 'European Union', currencies: { EUR: { name: 'Euro', symbol: '€' } } },
    { name: 'Japan', currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } } },
    { name: 'India', currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } } },
    { name: 'Canada', currencies: { CAD: { name: 'Canadian Dollar', symbol: 'C$' } } },
    { name: 'Australia', currencies: { AUD: { name: 'Australian Dollar', symbol: 'A$' } } },
    { name: 'Switzerland', currencies: { CHF: { name: 'Swiss Franc', symbol: 'CHF' } } },
    { name: 'China', currencies: { CNY: { name: 'Chinese Yuan', symbol: '¥' } } },
    { name: 'Sweden', currencies: { SEK: { name: 'Swedish Krona', symbol: 'kr' } } },
  ];
}

/**
 * Fallback exchange rates in case API fails
 */
function getFallbackExchangeRates(baseCurrency: string): ExchangeRates {
  // These are approximate rates and should only be used as fallback
  const baseRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.50,
      INR: 83.12,
      CAD: 1.36,
      AUD: 1.53,
      CHF: 0.88,
      CNY: 7.24,
      SEK: 10.68,
    },
  };

  const rates = baseRates[baseCurrency] || baseRates.USD;

  return {
    base: baseCurrency,
    rates: { ...rates, [baseCurrency]: 1 },
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  countriesCache = null;
  exchangeRatesCache.clear();
}

export default {
  fetchCountriesAndCurrencies,
  getCurrencyForCountry,
  fetchExchangeRates,
  convertCurrency,
  getAllCurrencies,
  detectCurrencyFromCountry,
  getPopularCurrencies,
  formatCurrency,
  clearCache,
};
