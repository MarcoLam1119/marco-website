
import React, { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'TWD', name: 'Taiwan Dollar' },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('HKD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setConvertedAmount((numAmount * exchangeRate).toFixed(2));
      } else {
        setConvertedAmount('');
      }
    }
  }, [amount, exchangeRate]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      const data = await response.json();
      const rate = data.rates[toCurrency];
      if (rate) {
        setExchangeRate(rate);
      } else {
        throw new Error('Exchange rate not available');
      }
    } catch (err) {
      setError(err.message);
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="panel tool" id="tool-currency">
      <h3>Currency Converter</h3>
      <div className="row">
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label htmlFor="fromCurrency">From</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={handleSwapCurrencies} style={{ marginTop: '20px' }}>
            ⇄
          </button>
        </div>
        <div>
          <label htmlFor="toCurrency">To</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div>
          <label htmlFor="convertedAmount">Converted Amount</label>
          <input
            id="convertedAmount"
            type="text"
            readOnly
            value={loading ? 'Loading...' : error ? 'Error' : convertedAmount}
          />
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exchangeRate && (
        <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
      )}
    </div>
  );
}
