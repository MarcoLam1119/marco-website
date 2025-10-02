
import React, { useState, useEffect } from 'react';
import { store } from '../../utils/storage.js';

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

// 離線備用匯率數據
const OFFLINE_EXCHANGE_RATES = {
  'HKD': { 'CNY': 0.92, 'USD': 0.13, 'EUR': 0.12, 'JPY': 19.5, 'GBP': 0.10, 'CAD': 0.17, 'AUD': 0.19, 'CHF': 0.11, 'TWD': 4.1 },
  'USD': { 'HKD': 7.83, 'CNY': 7.20, 'EUR': 0.92, 'JPY': 150, 'GBP': 0.79, 'CAD': 1.35, 'AUD': 1.52, 'CHF': 0.88, 'TWD': 32.1 },
  'CNY': { 'HKD': 1.09, 'USD': 0.14, 'EUR': 0.13, 'JPY': 20.8, 'GBP': 0.11, 'CAD': 0.19, 'AUD': 0.21, 'CHF': 0.12, 'TWD': 4.5 },
  'EUR': { 'HKD': 8.45, 'USD': 1.08, 'CNY': 7.78, 'JPY': 163, 'GBP': 0.86, 'CAD': 1.47, 'AUD': 1.65, 'CHF': 0.96, 'TWD': 34.9 },
  'JPY': { 'HKD': 0.051, 'USD': 0.0067, 'CNY': 0.048, 'EUR': 0.0061, 'GBP': 0.0053, 'CAD': 0.0090, 'AUD': 0.010, 'CHF': 0.0059, 'TWD': 0.21 },
  'GBP': { 'HKD': 9.83, 'USD': 1.26, 'CNY': 9.05, 'EUR': 1.16, 'JPY': 189, 'CAD': 1.71, 'AUD': 1.92, 'CHF': 1.11, 'TWD': 40.6 },
  'CAD': { 'HKD': 5.75, 'USD': 0.74, 'CNY': 5.29, 'EUR': 0.68, 'JPY': 111, 'GBP': 0.58, 'AUD': 1.12, 'CHF': 0.65, 'TWD': 23.8 },
  'AUD': { 'HKD': 5.13, 'USD': 0.66, 'CNY': 4.72, 'EUR': 0.61, 'JPY': 99, 'GBP': 0.52, 'CAD': 0.89, 'CHF': 0.58, 'TWD': 21.2 },
  'CHF': { 'HKD': 8.85, 'USD': 1.14, 'CNY': 8.20, 'EUR': 1.04, 'JPY': 170, 'GBP': 0.90, 'CAD': 1.54, 'AUD': 1.73, 'TWD': 36.5 },
  'TWD': { 'HKD': 0.24, 'USD': 0.031, 'CNY': 0.22, 'EUR': 0.029, 'JPY': 4.7, 'GBP': 0.025, 'CAD': 0.042, 'AUD': 0.047, 'CHF': 0.027 }
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('HKD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [usingOfflineRates, setUsingOfflineRates] = useState(false);

  // 監聽網絡狀態
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setUsingOfflineRates(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setUsingOfflineRates(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    setUsingOfflineRates(false);
    
    try {
      // 如果在線，嘗試從 API 獲取匯率
      if (isOnline) {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        const rate = data.rates[toCurrency];
        if (rate) {
          setExchangeRate(rate);
          // 緩存成功的匯率數據
          const cachedRates = store.get('EXCHANGE_RATES', {});
          cachedRates[fromCurrency] = data.rates;
          store.set('EXCHANGE_RATES', cachedRates);
          return;
        }
      }
      
      // 如果離線或 API 失敗，嘗試使用緩存或離線數據
      const cachedRates = store.get('EXCHANGE_RATES', {});
      if (cachedRates[fromCurrency] && cachedRates[fromCurrency][toCurrency]) {
        setExchangeRate(cachedRates[fromCurrency][toCurrency]);
        setUsingOfflineRates(true);
      } else if (OFFLINE_EXCHANGE_RATES[fromCurrency] && OFFLINE_EXCHANGE_RATES[fromCurrency][toCurrency]) {
        setExchangeRate(OFFLINE_EXCHANGE_RATES[fromCurrency][toCurrency]);
        setUsingOfflineRates(true);
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
          <button onClick={handleSwapCurrencies} style={{ marginLeft: '50%' ,transform: 'translateX(-50%)'}}>
            ⇄
          </button>
          <label htmlFor="toCurrency">To </label>
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
        <div>
          <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
          {usingOfflineRates && (
            <p style={{ color: 'orange', fontSize: '0.9em' }}>
              ⚠️ 使用離線匯率數據，可能與實際匯率有差異
            </p>
          )}
          {!isOnline && (
            <p style={{ color: 'gray', fontSize: '0.9em' }}>
              🔴 當前處於離線模式
            </p>
          )}
        </div>
      )}
    </div>
  );
}
