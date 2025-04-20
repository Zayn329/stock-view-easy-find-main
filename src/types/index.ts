// src/types/index.ts (or define in Dashboard.tsx)
export interface Stock {
  _id: string; // Assuming MongoDB ID or similar unique identifier
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number; // Optional, depending on your data
  sector?: string;    // Optional
  // Add any other relevant fields returned by your API
}
