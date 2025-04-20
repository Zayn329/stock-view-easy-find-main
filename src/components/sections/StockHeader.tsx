// import React, { useState, useEffect } from 'react';
// import { MoreHorizontal } from 'lucide-react';
// import { toast } from "sonner";
// import { useTicker } from '@/contexts/TickerContext';
// import axios from 'axios';

// interface StockData {
//   decision: string;
//   ticker: string;
// }

// const StockHeader = () => {
//   const [stockData, setStockData] = useState<StockData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { ticker } = useTicker();

//   useEffect(() => {
//     const fetchStockData = async () => {
//       try {
//         setLoading(true);
//         const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
//         const timeoutPromise = new Promise((_, reject) => 
//           setTimeout(() => reject(new Error('Request timed out')), 5000)
//         );
        
//         const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch stock data');
//         }
//         const data = await response.json();
//         setStockData(data);
//       } catch (error) {
//         console.error('Error fetching stock data:', error);
//         setStockData({ ticker, decision: 'Hold' });
//         toast.error("Failed to load stock data. Check if the API server is running.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockData();
//   }, [ticker]);

// // In your component
// const fetchStockData = async () => {
//   try {
//     console.log('Fetching with axios...');
//     const response = await axios.get('http://localhost:5000/predict', {
//       params: { ticker }
//     });
//     console.log('Axios response:', response.data);
//     setStockData({
//       ticker: response.data.ticker, 
//       decision: response.data.prediction
//     });
//   } catch (error) {
//     console.error('Axios error:', error);
//     setStockData({ ticker, decision: 'Hold' });
//     toast.error("Failed to load stock data.");
//   } finally {
//     setLoading(false);
//   }
// };

//   const getStabilityStatus = (decision: string) => {
//     switch (decision) {
//       case 'Buy':
//       case 'Strong Buy':
//         return { label: 'Bullish', color: 'bg-green-900 text-green-300' };
//       case 'Sell':
//       case 'Strong Sell':
//         return { label: 'Bearish', color: 'bg-red-900 text-red-300' };
//       case 'Hold':
//         return { label: 'Stable', color: 'bg-blue-900 text-blue-300' };
//       default:
//         return { label: 'Neutral', color: 'bg-gray-800 text-gray-300' };
//     }
//   };

//   const tickerToCompany: Record<string, string> = {
//     'AAPL': 'Apple Inc.',
//     'MSFT': 'Microsoft Corporation',
//     'GOOGL': 'Alphabet Inc.',
//     'AMZN': 'Amazon.com, Inc.',
//     'META': 'Meta Platforms, Inc.',
//     'TSLA': 'Tesla, Inc.',
//     'NFLX': 'Netflix, Inc.',
//     'NVDA': 'NVIDIA Corporation',
//     'PYPL': 'PayPal Holdings, Inc.',
//     'INTC': 'Intel Corporation'
//   };

//   const displayTicker = stockData?.ticker || ticker;
//   const companyName = tickerToCompany[displayTicker] || `${displayTicker} Corporation`;
//   const stabilityStatus = stockData?.decision ? getStabilityStatus(stockData.decision) : { label: 'Loading...', color: 'bg-gray-800 text-gray-300' };

//   return (
//     <div className="mb-4">
//       <div className="flex justify-between items-center mb-1">
//         <div className="flex items-center gap-2">
//           {loading ? (
//             <>
//               <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
//               <div className="h-5 bg-gray-700 rounded w-16 animate-pulse"></div>
//             </>
//           ) : (
//             <>
//               <h1 className="text-2xl font-bold">{companyName} ({displayTicker})</h1>
//               <span className={`px-2 rounded-full text-xs ${stabilityStatus.color}`}>{stabilityStatus.label}</span>
//             </>
//           )}
//         </div>
       
//       </div>
      
//       <div className="flex items-center gap-1">
//         <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
//           <span className="text-xs">TC</span>
//         </div>
//         <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center">
//           <span className="text-xs">LM</span>
//         </div>
//         <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
//           <span className="text-xs">+9</span>
//         </div>
//         <span className="text-xs text-gray-400 ml-2">Key Executives</span>
//       </div>
//     </div>
//   );
// };

// export default StockHeader;
// src/components/sections/StockHeader.tsx
import React, { useState, useEffect } from 'react';
// import { MoreHorizontal } from 'lucide-react'; // Not used
import { toast } from "sonner";
import { useTicker } from '@/contexts/TickerContext';
// Remove axios if not used elsewhere
// import axios from 'axios';

// --- Updated Interface to include 'name' and use 'prediction' ---
interface StockData {
  prediction: string; // Changed from decision
  ticker: string;
  name: string; // <-- Add name field
}

const StockHeader = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const { ticker } = useTicker(); // Ticker from context (e.g., AAPL)

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setStockData(null); // Reset on new fetch

      if (!ticker) {
        setLoading(false);
        console.warn("StockHeader: Ticker is undefined.");
        return;
      }

      try {
        const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 5000)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!response.ok) {
          throw new Error(`Failed to fetch stock data (Status: ${response.status})`);
        }
        const data = await response.json();

        // --- Updated validation to include 'name' and check 'prediction' ---
        if (
            typeof data.prediction === 'string' && // Check prediction
            typeof data.ticker === 'string' &&
            typeof data.name === 'string' // <-- Add check for name
           ) {
          setStockData(data);
        } else {
           console.error("Invalid data format received from /predict for header:", data);
           throw new Error('Invalid data format received');
        }

      } catch (error) {
        console.error('Error fetching stock data for header:', error);
        // Fallback uses ticker and generic name/prediction
        setStockData({ ticker, prediction: 'Hold', name: `${ticker} Info` }); // <-- Update fallback
        toast.error("Failed to load stock header data. Check API server or console.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [ticker]);


  // --- REMOVE the duplicate axios fetchStockData function ---
  // const fetchStockData = async () => { ... };


  // --- Update getStabilityStatus to use 'prediction' state ---
  const getStabilityStatus = (prediction: string) => {
    // Use lowercase for robust comparison
    switch (prediction?.toLowerCase()) {
      case 'buy':
      case 'strong buy':
        return { label: 'Bullish', color: 'bg-green-900 text-green-300' };
      case 'sell':
      case 'strong sell':
        return { label: 'Bearish', color: 'bg-red-900 text-red-300' };
      case 'hold':
        return { label: 'Stable', color: 'bg-blue-900 text-blue-300' };
      default:
        return { label: 'Neutral', color: 'bg-gray-800 text-gray-300' };
    }
  };

  // --- REMOVE the tickerToCompany map ---
  // const tickerToCompany: Record<string, string> = { ... };

  // --- Update display logic ---
  // Use ticker from context as the definitive ticker symbol
  const displayTicker = ticker || "---";
  // Use name from fetched stockData if available, otherwise fallback
  const companyName = loading ? "Loading..." : (stockData?.name || `${displayTicker} Info`);
  // Use prediction from fetched stockData for stability status
  const stabilityStatus = !loading && stockData?.prediction
      ? getStabilityStatus(stockData.prediction)
      : { label: 'Loading...', color: 'bg-gray-800 text-gray-300' };


  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 flex-wrap"> {/* Added flex-wrap */}
          {loading ? (
            <>
              {/* Loading placeholders */}
              <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-16 animate-pulse"></div>
            </>
          ) : (
            <>
              {/* Display fetched name and context ticker */}
              <h1 className="text-2xl font-bold">{companyName} ({displayTicker})</h1>
              {/* Render stability status only if prediction was loaded */}
              {stockData?.prediction && (
                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stabilityStatus.color}`}>
                    {stabilityStatus.label}
                 </span>
              )}
              {/* Optionally show N/A if prediction couldn't be loaded */}
              {!stockData?.prediction && !loading && (
                 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                    N/A
                 </span>
              )}
            </>
          )}
        </div>
        {/* Removed MoreHorizontal button */}
      </div>

      {/* Key Executives section - seems static, likely fine */}
      <div className="flex items-center gap-1 text-sm text-stockify-muted">
        <span>Key Executives:</span>
        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center ml-2">
          <span className="text-xs font-medium text-white">TC</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-800">LM</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
          <span className="text-xs font-medium text-white">+9</span>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
