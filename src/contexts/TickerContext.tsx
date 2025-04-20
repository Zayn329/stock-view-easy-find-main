
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface TickerContextType {
//   ticker: string;
//   setTicker: (ticker: string) => void;
// }

// const TickerContext = createContext<TickerContextType | undefined>(undefined);

// export const TickerProvider = ({ children }: { children: ReactNode }) => {
//   const [ticker, setTicker] = useState<string>("AAPL"); // Default ticker

//   return (
//     <TickerContext.Provider value={{ ticker, setTicker }}>
//       {children}
//     </TickerContext.Provider>
//   );
// };

// export const useTicker = (): TickerContextType => {
//   const context = useContext(TickerContext);
//   if (context === undefined) {
//     throw new Error('useTicker must be used within a TickerProvider');
//   }
//   return context;
// };
// src/contexts/TickerContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'; // Import useEffect

interface TickerContextType {
  ticker: string;
  // setTicker is likely not needed by consumers if the provider manages it based on props
  // setTicker: (ticker: string) => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

// --- CHANGE: Modify TickerProvider ---
// Accept the ticker from the parent component (StockDetailWrapper) as a prop
export const TickerProvider = ({ ticker: initialTicker, children }: { ticker: string; children: ReactNode }) => {
  // Initialize state with the ticker passed from the parent
  const [ticker, setTicker] = useState<string>(initialTicker);

  // Add useEffect to update the context's state if the prop changes
  // This handles cases where the user might navigate between stock pages
  // without a full page reload (less common with this setup, but good practice)
  useEffect(() => {
    setTicker(initialTicker);
  }, [initialTicker]); // Re-run effect if the initialTicker prop changes

  // Provide the current ticker state to children
  // Removed setTicker from the value as it's managed internally based on the prop now
  return (
    <TickerContext.Provider value={{ ticker }}>
      {children}
    </TickerContext.Provider>
  );
};
// --- END CHANGE ---

export const useTicker = (): TickerContextType => {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error('useTicker must be used within a TickerProvider');
  }
  return context;
};
