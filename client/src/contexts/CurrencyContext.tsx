import { createContext, useContext, useState, ReactNode } from "react";

const CURRENCY_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  CHF: 0.97,
  SEK: 11.42,
  NOK: 11.65,
  DKK: 7.46,
  PLN: 4.32,
  CZK: 25.15,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
  convert: (eurPrice: number) => number;
  symbol: string;
  formatPrice: (eurPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  setCurrency: () => {},
  convert: (p) => p,
  symbol: "€",
  formatPrice: (p) => `€${p.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("divielle-currency") || "EUR";
    }
    return "EUR";
  });

  const handleSetCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem("divielle-currency", c);
  };

  const convert = (eurPrice: number): number => {
    const rate = CURRENCY_RATES[currency] || 1;
    return Math.round(eurPrice * rate * 100) / 100;
  };

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const formatPrice = (eurPrice: number): string => {
    const converted = convert(eurPrice);
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, convert, symbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export const CURRENCIES = Object.keys(CURRENCY_RATES);
