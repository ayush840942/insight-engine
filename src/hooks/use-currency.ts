import { useState, useEffect } from "react";

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // rate relative to INR (1 INR = X units)
  country: string;
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  IN: { code: "INR", symbol: "₹", rate: 1, country: "India" },
  US: { code: "USD", symbol: "$", rate: 0.012, country: "United States" },
  GB: { code: "GBP", symbol: "£", rate: 0.0095, country: "United Kingdom" },
  EU: { code: "EUR", symbol: "€", rate: 0.011, country: "Europe" },
  DE: { code: "EUR", symbol: "€", rate: 0.011, country: "Germany" },
  FR: { code: "EUR", symbol: "€", rate: 0.011, country: "France" },
  IT: { code: "EUR", symbol: "€", rate: 0.011, country: "Italy" },
  ES: { code: "EUR", symbol: "€", rate: 0.011, country: "Spain" },
  NL: { code: "EUR", symbol: "€", rate: 0.011, country: "Netherlands" },
  CA: { code: "CAD", symbol: "CA$", rate: 0.016, country: "Canada" },
  AU: { code: "AUD", symbol: "A$", rate: 0.018, country: "Australia" },
  JP: { code: "JPY", symbol: "¥", rate: 1.78, country: "Japan" },
  SG: { code: "SGD", symbol: "S$", rate: 0.016, country: "Singapore" },
  AE: { code: "AED", symbol: "د.إ", rate: 0.044, country: "UAE" },
  BR: { code: "BRL", symbol: "R$", rate: 0.06, country: "Brazil" },
  MX: { code: "MXN", symbol: "MX$", rate: 0.2, country: "Mexico" },
  KR: { code: "KRW", symbol: "₩", rate: 16.3, country: "South Korea" },
  ID: { code: "IDR", symbol: "Rp", rate: 189, country: "Indonesia" },
  MY: { code: "MYR", symbol: "RM", rate: 0.053, country: "Malaysia" },
  PH: { code: "PHP", symbol: "₱", rate: 0.67, country: "Philippines" },
  TH: { code: "THB", symbol: "฿", rate: 0.41, country: "Thailand" },
  ZA: { code: "ZAR", symbol: "R", rate: 0.22, country: "South Africa" },
  NG: { code: "NGN", symbol: "₦", rate: 18.5, country: "Nigeria" },
  BD: { code: "BDT", symbol: "৳", rate: 1.43, country: "Bangladesh" },
  PK: { code: "PKR", symbol: "Rs", rate: 3.32, country: "Pakistan" },
  LK: { code: "LKR", symbol: "Rs", rate: 3.54, country: "Sri Lanka" },
};

const DEFAULT_CURRENCY: CurrencyInfo = CURRENCY_MAP.US;

// Base prices in INR (calculated for 70%+ profit margin)
// Costs: ~₹11/analysis + overhead. Margin targets: Starter 74%, Pro 70%, Agency 71%
const BASE_PRICES_INR = {
  free: 0,
  starter: 1999,
  pro: 4999,
  agency: 19999,
};

function formatPrice(amount: number, currency: CurrencyInfo): string {
  if (amount === 0) return `${currency.symbol}0`;

  // For JPY, KRW, IDR etc. - no decimals
  const noDecimalCurrencies = ["JPY", "KRW", "IDR", "NGN"];
  const roundedAmount = noDecimalCurrencies.includes(currency.code)
    ? Math.round(amount)
    : Math.round(amount * 100) / 100;

  // Format with locale
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: noDecimalCurrencies.includes(currency.code) ? 0 : 0,
      maximumFractionDigits: noDecimalCurrencies.includes(currency.code) ? 0 : 2,
    }).format(roundedAmount);
  } catch {
    return `${currency.symbol}${roundedAmount.toLocaleString()}`;
  }
}

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCY_MAP.IN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Use free IP geolocation API
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error("Geo failed");
        const data = await res.json();
        const countryCode = data.country_code;
        setCurrency(CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY);
      } catch {
        // Fallback to INR
        setCurrency(CURRENCY_MAP.IN);
      } finally {
        setLoading(false);
      }
    };
    detectCountry();
  }, []);

  const getPrice = (planId: string): string => {
    const baseINR = BASE_PRICES_INR[planId as keyof typeof BASE_PRICES_INR] ?? 0;
    const converted = baseINR * currency.rate;
    return formatPrice(converted, currency);
  };

  const getRazorpayAmount = (planId: string): number => {
    const baseINR = BASE_PRICES_INR[planId as keyof typeof BASE_PRICES_INR] ?? 0;
    const converted = baseINR * currency.rate;
    // Razorpay needs smallest unit (paise, cents, etc.)
    const noSubunit = ["JPY", "KRW"];
    return noSubunit.includes(currency.code) ? Math.round(converted) : Math.round(converted * 100);
  };

  return { currency, loading, getPrice, getRazorpayAmount };
}
