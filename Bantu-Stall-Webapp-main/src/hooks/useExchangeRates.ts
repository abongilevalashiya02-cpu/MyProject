import { useEffect, useState } from 'react';

const SUPPORTED_CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD'];

export function useExchangeRates(base: string = 'ZAR') {
  const [rates, setRates] = useState<Record<string, number>>({ [base]: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Use a free exchange rate API that doesn't require API key
    fetch(`https://api.exchangerate-api.com/v4/latest/${base}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          // Filter only supported currencies
          const supportedRates = SUPPORTED_CURRENCIES.reduce((acc, currency) => {
            if (data.rates[currency]) {
              acc[currency] = data.rates[currency];
            }
            return acc;
          }, {} as Record<string, number>);
          
          setRates({ [base]: 1, ...supportedRates });
        } else {
          // Fallback rates if API fails
          setRates({
            ZAR: base === 'ZAR' ? 1 : 18.5,
            USD: base === 'USD' ? 1 : 0.054,
            EUR: base === 'EUR' ? 1 : 0.049,
            GBP: base === 'GBP' ? 1 : 0.043,
            JPY: base === 'JPY' ? 1 : 7.8,
            CNY: base === 'CNY' ? 1 : 0.39,
            AUD: base === 'AUD' ? 1 : 0.082,
            CAD: base === 'CAD' ? 1 : 0.073
          });
          setError('Using approximate rates');
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback rates
        setRates({
          ZAR: base === 'ZAR' ? 1 : 18.5,
          USD: base === 'USD' ? 1 : 0.054,
          EUR: base === 'EUR' ? 1 : 0.049,
          GBP: base === 'GBP' ? 1 : 0.043,
          JPY: base === 'JPY' ? 1 : 7.8,
          CNY: base === 'CNY' ? 1 : 0.39,
          AUD: base === 'AUD' ? 1 : 0.082,
          CAD: base === 'CAD' ? 1 : 0.073
        });
        setError('Using approximate rates');
        setLoading(false);
      });
  }, [base]);

  return { rates, loading, error, SUPPORTED_CURRENCIES };
}
