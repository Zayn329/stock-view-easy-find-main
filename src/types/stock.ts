// src/types/stock.ts (or .d.ts)

// Keep your existing StockInfo type/interface
export interface StockInfo {
  symbol: string;
  name: string;
  sector?: string; // Optional if not always present
  marketCap?: number; // Optional if not always present
  price?: number; // Optional
  changePercent?: number; // Optional
  change?: number; // Option
  description?: string; // Optional
  
  // ... add any other properties you expect from searchStocks/filterStocks
}

// --- ADD THIS EXPORTED TYPE ---
export interface StockSuggestion {
  value: string;
  label: string;
  description?: string;
}

// --- END ADDITION ---

// ... any other types you might have in this file
