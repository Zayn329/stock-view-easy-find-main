// import React, { useState, useEffect } from 'react';
// import { toast } from "sonner";
// import { useTicker } from '@/contexts/TickerContext';


// const AIAnalysis = () => {
//   const [decision, setDecision] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { ticker } = useTicker();

//   useEffect(() => {
//     const fetchDecision = async () => {
//       setLoading(true);
//       setDecision(null);

//       if (!ticker) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5000/predict?ticker=${ticker}`);
//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }
//         const data = await response.json();
//         if (typeof data.decision === 'string') {
//           setDecision(data.decision);
//         } else {
//           throw new Error('Invalid data format received from API');
//         }
//       } catch (error) {
//         console.error('Error fetching AI analysis:', error);
//         setDecision("Hold");
//         toast.error(`Failed to load AI analysis for ${ticker}. Using default 'Hold'. Check API server.`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDecision();
//   }, [ticker]);

//   // Loading State
//   if (loading) {
//     return (
//       <div>
//         <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//         {/* Updated loading state for new layout */}
//         <div className="stockify-card animate-pulse p-4">
//           <div className="flex flex-col items-center space-y-3"> {/* Column layout */}
//             <div className="h-12 w-12 bg-gray-700 rounded-full mb-2"></div> {/* Larger Icon placeholder */}
//             <div className="h-5 bg-gray-700 rounded w-3/4 mb-1"></div> {/* Text placeholder 1 */}
//             <div className="h-4 bg-gray-700 rounded w-1/2"></div>      {/* Text placeholder 2 */}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No Ticker Selected State
//   if (!ticker) {
//      return (
//       <div>
//         <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//         <div className="stockify-card p-4">
//            <p className="text-gray-400 text-center">Select a stock ticker to view AI analysis.</p>
//         </div>
//       </div>
//     );
//   }

//   // Error/Default State or Normal State
//   if (!decision) {
//        return (
//         <div>
//           <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//           <div className="stockify-card p-4">
//              <p className="text-gray-400 text-center">Could not retrieve analysis.</p>
//           </div>
//         </div>
//       );

      
//   }

//   // Determine the summary text and icon based on the decision
//   const getDecisionDetails = (dec: string): { summary: string; icon: string; colorClass: string } => {
//     switch (dec) {
//       case 'Buy':
//       case 'Strong Buy':
//         return {
//           summary: 'with Growth Potential and Low Risk.',
//           icon: '🚀',
//           colorClass: 'text-green-400'
//         };
//       case 'Sell':
//       case 'Strong Sell':
//         return {
//           summary: 'due to Concerning Metrics and High Risk.',
//           icon: '📉',
//           colorClass: 'text-red-400'
//         };
//       case 'Hold':
//       default:
//         return {
//           summary: 'with Moderate Potential and Balanced Risk.',
//           icon: '⚖️',
//           colorClass: 'text-yellow-400'
//         };
//     }
//   };

//   const { summary: summaryText, icon: decisionIcon, colorClass } = getDecisionDetails(decision);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>

//       {/* Decision card with icon above centered text */}
//       <div className={`stockify-card p-4 border-l-4 ${colorClass.replace('text-', 'border-')}`}>
//         {/* Flex container: column layout, centered items, vertical spacing */}
//         <div className="flex flex-col items-center space-y-7"> {/* Changed to flex-col, items-center, space-y-2 */}

//           {/* Emoji Icon - Made larger */}
//           <span className="text-8xl mb-1">{decisionIcon}</span> {/* Increased size (e.g., text-5xl) and added margin-bottom */}

//           {/* Text Content - Centered */}
//           <div className="text-center"> {/* Added text-center */}
//             <h3 className={`font-semibold text-base ${colorClass}`}>
//               AI Suggests: <span className="font-bold">{decision}</span>
//             </h3>
//             <p className="text-sm text-gray-300">{summaryText}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIAnalysis;
// src/components/sections/AIAnalysis.tsx

//1.0 pm

// import React, { useState, useEffect } from 'react';
// import { toast } from "sonner";
// import { useTicker } from '@/contexts/TickerContext';

// const AIAnalysis = () => {
//   // State variable name 'decision' is fine conceptually,
//   // we just need to read from the correct API field.
//   const [decision, setDecision] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { ticker } = useTicker();

//   useEffect(() => {
//     const fetchDecision = async () => {
//       setLoading(true);
//       setDecision(null);

//       if (!ticker) {
//         setLoading(false);
//         console.warn("AIAnalysis: Ticker is undefined."); // Added warning
//         return;
//       }

//       try {
//         // Fetch remains the same
//         const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
//         const timeoutPromise = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error('Request timed out')), 5000) // Added timeout
//         );

//         const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }
//         const data = await response.json();

//         // --- CHANGE: Check for 'prediction' instead of 'decision' ---
//         if (typeof data.prediction === 'string') {
//           // --- CHANGE: Set state using 'prediction' ---
//           setDecision(data.prediction);
//         } else {
//           // Error message remains relevant if 'prediction' is missing or not a string
//           console.error("Invalid data format received from /predict for AI analysis:", data); // Log the data
//           throw new Error('Invalid data format received from API');
//         }
//       } catch (error) {
//         console.error('Error fetching AI analysis:', error);
//         // Fallback decision remains 'Hold'
//         setDecision("Hold");
//         toast.error(`Failed to load AI analysis for ${ticker}. Using default 'Hold'. Check API server or console.`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDecision();
//   }, [ticker]);

//   // Loading State
//   if (loading) {
//     return (
//       <div>
//         <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//         <div className="stockify-card animate-pulse p-4">
//           <div className="flex flex-col items-center space-y-3">
//             <div className="h-12 w-12 bg-gray-700 rounded-full mb-2"></div>
//             <div className="h-5 bg-gray-700 rounded w-3/4 mb-1"></div>
//             <div className="h-4 bg-gray-700 rounded w-1/2"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No Ticker Selected State
//   if (!ticker) {
//      return (
//       <div>
//         <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//         <div className="stockify-card p-4">
//            <p className="text-gray-400 text-center">Select a stock ticker to view AI analysis.</p>
//         </div>
//       </div>
//     );
//   }

//   // Error/Default State or Normal State
//   if (!decision) {
//        return (
//         <div>
//           <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//           <div className="stockify-card p-4">
//              <p className="text-gray-400 text-center">Could not retrieve analysis.</p>
//           </div>
//         </div>
//       );
//   }

//   // Determine the summary text and icon based on the decision
//   // This function should work correctly as it uses the 'decision' state variable
//   const getDecisionDetails = (dec: string): { summary: string; icon: string; colorClass: string } => {
//     // --- Make comparison case-insensitive for robustness ---
//     switch (dec?.toLowerCase()) {
//       case 'buy':
//       case 'strong buy':
//         return {
//           summary: 'with Growth Potential and Low Risk.',
//           icon: '🚀',
//           colorClass: 'text-green-400'
//         };
//       case 'sell':
//       case 'strong sell':
//         return {
//           summary: 'due to Concerning Metrics and High Risk.',
//           icon: '📉',
//           colorClass: 'text-red-400'
//         };
//       case 'hold':
//       default:
//         return {
//           summary: 'with Moderate Potential and Balanced Risk.',
//           icon: '⚖️',
//           colorClass: 'text-yellow-400'
//         };
//     }
//   };

//   const { summary: summaryText, icon: decisionIcon, colorClass } = getDecisionDetails(decision);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
//       <div className={`stockify-card p-4 border-l-4 ${colorClass.replace('text-', 'border-')}`}>
//         <div className="flex flex-col items-center space-y-7">
//           <span className="text-8xl mb-1">{decisionIcon}</span>
//           <div className="text-center">
//             <h3 className={`font-semibold text-base ${colorClass}`}>
//               AI Suggests: <span className="font-bold">{decision}</span>
//             </h3>
//             <p className="text-sm text-gray-300">{summaryText}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIAnalysis;

// src/components/sections/AIAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useTicker } from '@/contexts/TickerContext';

const AIAnalysis = () => {
  // State variable name 'decision' is fine conceptually,
  // we just need to read from the correct API field.
  const [decision, setDecision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { ticker } = useTicker();

  useEffect(() => {
    const fetchDecision = async () => {
      setLoading(true);
      setDecision(null); // Reset decision on new fetch

      if (!ticker) {
        setLoading(false);
        console.warn("AIAnalysis: Ticker is undefined or null."); // Added warning
        return; // Exit early if no ticker
      }

      console.log(`AIAnalysis: Fetching prediction for ticker: ${ticker}`); // Log ticker being fetched

      try {
        // Add a timeout mechanism using Promise.race
        const fetchPromise = fetch(`http://localhost:5000/predict?ticker=${ticker}`);
        const timeoutPromise = new Promise<never>((_, reject) => // Use <never> for timeout promise
          setTimeout(() => reject(new Error('Request timed out after 5 seconds')), 5000)
        );

        // Race the fetch against the timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response; // Assert type as Response

        if (!response.ok) {
           // Try to get more specific error info if possible
           let errorBody = `API request failed with status ${response.status}`;
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

        const data = await response.json();
        console.log("AIAnalysis: Received data from /predict:", data); // Log received data

        // --- CHANGE: Check for 'prediction' instead of 'decision' ---
        if (typeof data.prediction === 'string') {
          // --- CHANGE: Set state using 'prediction' ---
          setDecision(data.prediction);
        } else {
          // Error message remains relevant if 'prediction' is missing or not a string
          console.error("AIAnalysis: Invalid data format received from /predict. 'prediction' key missing or not a string:", data);
          throw new Error('Invalid data format received from API');
        }
      } catch (error: any) { // Catch error explicitly as 'any' or 'unknown'
        console.error('AIAnalysis: Error fetching AI analysis:', error);
        // Fallback decision remains 'Hold'
        setDecision("Hold"); // Set default on error
        toast.error(`Failed to load AI analysis for ${ticker}: ${error.message}. Using default 'Hold'.`); // Show more specific error
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [ticker]); // Dependency array is correct

  // --- Loading State ---
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
        {/* Keep the existing loading skeleton */}
        <div className="stockify-card animate-pulse p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 bg-gray-700 rounded-full mb-2"></div>
            <div className="h-5 bg-gray-700 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- No Ticker Selected State ---
  if (!ticker) {
     return (
      <div>
        <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
        <div className="stockify-card p-4">
           <p className="text-gray-400 text-center">Select a stock ticker to view AI analysis.</p>
        </div>
      </div>
    );
  }

  // --- Error/Default State (if decision is still null after loading) or Normal State ---
  // This handles cases where fetch failed but didn't set the default 'Hold' for some reason,
  // or if the initial state wasn't properly cleared.
  if (!decision) {
       return (
        <div>
          <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
          <div className="stockify-card p-4">
             {/* More specific message */}
             <p className="text-gray-400 text-center">Could not retrieve analysis. Please try again or check the console.</p>
          </div>
        </div>
      );
  }

  // --- Determine the summary text and icon based on the decision ---
  const getDecisionDetails = (dec: string): { summary: string; icon: string; colorClass: string } => {
    // --- Make comparison case-insensitive for robustness ---
    switch (dec?.toLowerCase()) { // Use optional chaining and toLowerCase
      case 'buy':
      case 'strong buy':
        return {
          summary: 'with Growth Potential and Low Risk.',
          icon: '🚀',
          colorClass: 'text-green-400'
        };
      case 'sell':
      case 'strong sell':
        return {
          summary: 'due to Concerning Metrics and High Risk.',
          icon: '📉',
          colorClass: 'text-red-400'
        };
      case 'hold':
      // Add specific handling for potential error strings from Flask if needed
      case 'unknown prediction index':
      case 'unknown prediction':
      case 'prediction label error':
      default: // Default to 'Hold' visuals for safety
        return {
          summary: 'with Moderate Potential and Balanced Risk.',
          icon: '⚖️',
          colorClass: 'text-yellow-400'
        };
    }
  };

  // Get details based on the current 'decision' state
  const { summary: summaryText, icon: decisionIcon, colorClass } = getDecisionDetails(decision);

  // --- Render the card ---
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">AI-Based Analysis</h2>
      {/* Use dynamic border color based on decision */}
      <div className={`stockify-card p-4 border-l-4 ${colorClass.replace('text-', 'border-')}`}>
        <div className="flex flex-col items-center space-y-7">
          {/* Icon */}
          <span className="text-8xl mb-1">{decisionIcon}</span>
          {/* Text Content */}
          <div className="text-center">
            <h3 className={`font-semibold text-base ${colorClass}`}>
              {/* Display the actual decision string received */}
              AI Suggests: <span className="font-bold">{decision}</span>
            </h3>
            <p className="text-sm text-gray-300">{summaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
