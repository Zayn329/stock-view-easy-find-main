// // src/components/sections/StockMetrics.tsx
// import React, { useState, useEffect } from 'react';
// import StockMetricCard from '../stock/StockMetricCard';
// import { toast } from "sonner";
// import { useTicker } from '@/contexts/TickerContext';

// // --- Updated Interface to include 'name' ---
// interface StockData {
//   current_price: number;
//   market_cap: number;
//   p_e_ratio: number | null;
//   dividend_yield: number;
//   ticker: string;
//   prediction: string;
//   name: string; // <-- Add name field
// }

// // --- Updated Mock data to include 'name' ---
// const mockStockData: StockData = {
//   current_price: 198.85,
//   market_cap: 2987144773632,
//   p_e_ratio: 28.5,
//   dividend_yield: 0.53,
//   ticker: "AAPL",
//   prediction: "Hold",
//   name: "Apple Inc.", // <-- Add mock name
// };

// const StockMetrics = () => {
//   const [stockData, setStockData] = useState<StockData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [apiAvailable, setApiAvailable] = useState(true);
//   const { ticker } = useTicker();

//   useEffect(() => {
//     const fetchStockData = async () => {
//       if (!ticker) {
//         setLoading(false);
//         setStockData(null);
//         console.warn("StockMetrics: Ticker is undefined.");
//         return;
//       }

//       try {
//         setLoading(true);
//         setApiAvailable(true);
//         const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
//         const timeoutPromise = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error('Request timed out')), 5000)
//         );

//         const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

//         if (!response.ok) {
//           throw new Error(`Failed to fetch stock data (Status: ${response.status})`);
//         }

//         const data = await response.json();

//         // --- Updated validation to include 'name' ---
//         if (
//           typeof data.current_price === 'number' &&
//           typeof data.market_cap === 'number' &&
//           (typeof data.p_e_ratio === 'number' || data.p_e_ratio === null) &&
//           typeof data.dividend_yield === 'number' &&
//           typeof data.ticker === 'string' &&
//           typeof data.prediction === 'string' &&
//           typeof data.name === 'string' // <-- Add check for name
//         ) {
//           setStockData(data);
//         } else {
//           console.error("Invalid data format received from /predict:", data);
//           throw new Error('Invalid data format received');
//         }

//       } catch (error) {
//         console.error('Error fetching stock data:', error);

//         // Create mock data with the current ticker and a generic name
//         const mockData = { ...mockStockData, ticker, name: `${ticker} Company` }; // <-- Update mock data creation
//         setStockData(mockData);
//         setApiAvailable(false);

//         toast.error(
//           `Using demo data for ${ticker}. API server error or timeout. Ensure Flask API is running.`,
//           { duration: 6000 }
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockData();
//   }, [ticker]);

//   // Format market cap function remains the same
//   const formatMarketCap = (marketCap: number): string => {
//     // ... (implementation is fine)
//     if (marketCap >= 1e12) {
//       return `$${(marketCap / 1e12).toFixed(1)}T`;
//     } else if (marketCap >= 1e9) {
//       return `$${(marketCap / 1e9).toFixed(1)}B`;
//     } else if (marketCap >= 1e6) {
//       return `$${(marketCap / 1e6).toFixed(1)}M`;
//     }
//     return `$${marketCap.toLocaleString()}`;
//   };

//   // Loading State UI remains the same
//   if (loading) {
//     // ... (loading skeleton is fine)
//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="stockify-card animate-pulse p-4">
//             <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
//             <div className="h-6 bg-gray-700 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Render block remains the same (doesn't use name directly)
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//       <StockMetricCard
//         title="Price"
//         value={stockData && typeof stockData.current_price === 'number'
//                  ? `$${stockData.current_price.toFixed(2)}`
//                  : "N/A"}
//         changeDirection="neutral"
//       />
//       <StockMetricCard
//         title="Market Cap"
//         value={stockData && typeof stockData.market_cap === 'number'
//                  ? formatMarketCap(stockData.market_cap)
//                  : "N/A"}
//         changeDirection="neutral"
//       />
//       <StockMetricCard
//         title="P/E Ratio"
//         value={stockData && typeof stockData.p_e_ratio === 'number'
//                  ? stockData.p_e_ratio.toFixed(2)
//                  : "N/A"}
//         changeDirection="neutral"
//       />
//       <StockMetricCard
//         title="Dividend Yield"
//         value={stockData && typeof stockData.dividend_yield === 'number'
//                  ? `${stockData.dividend_yield.toFixed(2)}%`
//                  : "N/A"}
//         changeDirection="neutral"
//       />
//       {!apiAvailable && stockData && (
//         <div className="col-span-full text-amber-400 text-sm mt-2">
//           ⚠️ Using demo data for {stockData.ticker}. To see real data, ensure your Flask API is running at http://localhost:5000
//         </div>
//       )}
//        {!stockData && !loading && (
//          <div className="col-span-full text-gray-400 text-sm mt-2">
//            No data available for the selected ticker.
//          </div>
//        )}
//     </div>
//   );
// };

// export default StockMetrics;
// src/components/sections/StockMetrics.tsx
import React, { useState, useEffect } from 'react';
import StockMetricCard from '../stock/StockMetricCard';
import { toast } from "sonner";
import { useTicker } from '@/contexts/TickerContext';

// Interface defining the structure *after* parsing/cleaning API data
interface StockData {
  current_price: number | null; // Allow null if API might not return it
  market_cap: number | null;    // Allow null
  p_e_ratio: number | null;     // P/E can be null
  dividend_yield: number | null; // Dividend yield as a number (or null)
  ticker: string;
  name: string;
  // prediction: string; // Prediction is handled by AIAnalysis, not strictly needed here
}

// Mock data reflecting the interface structure
const mockStockData: StockData = {
  current_price: 198.85,
  market_cap: 2987144773632,
  p_e_ratio: 28.5,
  dividend_yield: 0.53, // Store as number
  ticker: "AAPL",
  name: "Apple Inc.",
};

// Helper function to parse potentially stringified numbers or "N/A"
const parseMetric = (value: any): number | null => {
  if (value === null || value === undefined || value === "N/A") {
    return null;
  }
  if (typeof value === 'number') {
    return isNaN(value) ? null : value; // Handle NaN explicitly
  }
  if (typeof value === 'string') {
    // Remove common non-numeric characters like '$', '%', ','
    const cleanedValue = value.replace(/[%$,]/g, '').trim();
    const number = parseFloat(cleanedValue);
    return isNaN(number) ? null : number;
  }
  return null; // Return null if type is unexpected
};


const StockMetrics = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true); // Track if API fetch was successful
  const { ticker } = useTicker();

  useEffect(() => {
    const fetchStockData = async () => {
      if (!ticker) {
        setLoading(false);
        setStockData(null); // Clear data if no ticker
        console.warn("StockMetrics: Ticker is undefined or null.");
        return;
      }

      setLoading(true);
      setStockData(null); // Clear previous data on new fetch
      setApiAvailable(true); // Assume API is available initially

      try {
        console.log(`StockMetrics: Fetching data for ticker: ${ticker}`);
        const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out after 5 seconds')), 5000)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!response.ok) {
          let errorBody = `Failed to fetch stock data (Status: ${response.status})`;
           try {
               const errorData = await response.json();
               if (errorData && errorData.error) {
                   errorBody += `: ${errorData.error}`;
               }
           } catch (parseError) {
               // Ignore if response body isn't valid JSON
           }
          throw new Error(errorBody);
        }

        const rawData = await response.json();
        console.log("StockMetrics: Received raw data from /predict:", rawData);

        // --- Validate and Parse Data ---
        // Check for essential fields first
        if (typeof rawData.ticker !== 'string' || typeof rawData.name !== 'string') {
            console.error("StockMetrics: Invalid data format - missing ticker or name.", rawData);
            throw new Error('Invalid data format: Missing ticker or name');
        }

        // Parse metrics using the helper function
        const parsedData: StockData = {
            ticker: rawData.ticker,
            name: rawData.name,
            current_price: parseMetric(rawData.current_price),
            market_cap: parseMetric(rawData.market_cap),
            p_e_ratio: parseMetric(rawData.p_e_ratio),
            // Special handling for dividend yield if it's already a percentage from API
            // If API returns "1.23%", parseMetric handles it. If it returns 0.0123, use that.
            dividend_yield: parseMetric(rawData.dividend_yield),
        };

        console.log("StockMetrics: Parsed data:", parsedData);
        setStockData(parsedData);

      } catch (error: any) {
        console.error('StockMetrics: Error fetching or processing stock data:', error);

        // Create mock data using the current ticker
        const mockDataForTicker: StockData = {
            ...mockStockData, // Use base mock data
            ticker: ticker, // Set the current ticker
            name: `${ticker} (Demo Data)`, // Indicate it's mock data
        };
        setStockData(mockDataForTicker);
        setApiAvailable(false); // Mark API as unavailable

        toast.error(
          `API Error: ${error.message}. Using demo data for ${ticker}.`,
          { duration: 6000 }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker]); // Re-run effect when ticker changes

  // Format market cap function (no changes needed)
  const formatMarketCap = (marketCap: number | null): string => {
    if (marketCap === null) return "N/A";
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  // --- Loading State UI (no changes needed) ---
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stockify-card animate-pulse p-4">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // --- Render Metrics ---
  // Use the parsed stockData state which now has numbers or null
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StockMetricCard
        title="Price"
        value={stockData?.current_price !== null
                 ? `$${stockData.current_price.toFixed(2)}`
                 : "N/A"}
        changeDirection="neutral"
      />
      <StockMetricCard
        title="Market Cap"
        value={formatMarketCap(stockData?.market_cap ?? null)} // Pass null if undefined
        changeDirection="neutral"
      />
      <StockMetricCard
        title="P/E Ratio"
        value={stockData?.p_e_ratio !== null
                 ? stockData.p_e_ratio.toFixed(2)
                 : "N/A"}
        changeDirection="neutral"
      />
      <StockMetricCard
        title="Dividend Yield"
        // Display the parsed number as a percentage
        value={stockData?.dividend_yield !== null
                 ? `${stockData.dividend_yield.toFixed(2)}%`
                 : "N/A"}
        changeDirection="neutral"
      />
      {/* Display API unavailable message */}
      {!apiAvailable && stockData && (
        <div className="col-span-full text-amber-400 text-sm mt-2">
          ⚠️ Using demo data for {stockData.ticker}. To see real data, ensure your Flask API is running at http://localhost:5000
        </div>
      )}
      {/* Display message if no data is available after loading */}
       {!stockData && !loading && (
         <div className="col-span-full text-gray-400 text-sm mt-2">
           No data available for the selected ticker.
         </div>
       )}
    </div>
  );
};

export default StockMetrics;
