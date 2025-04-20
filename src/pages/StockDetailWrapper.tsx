// // src/pages/StockDetailWrapper.tsx (or StockDetailPage.tsx)

// import React from 'react';
// import { useParams } from 'react-router-dom';
// import MainContent from '@/components/sections/MainContent';
// // import Sidebar from '@/components/sections/Sidebar'; // Uncomment if you have a sidebar that also needs the ticker
// import { TickerProvider } from '@/contexts/TickerContext'; // Make sure this context exists and is correctly set up
// import { Loader2 } from 'lucide-react';

// const StockDetailWrapper = () => {
//   // Extract the 'ticker' parameter from the URL
//   const { ticker } = useParams<{ ticker: string }>();

//   // Handle case where ticker might not be available (e.g., route mismatch, though unlikely)
//   if (!ticker) {
//     // You could redirect, show an error, or just a loading state
//     return (
//       <div className="flex justify-center items-center h-screen text-stockify-muted bg-stockify-dark">
//         <Loader2 className="h-8 w-8 animate-spin mr-3" />
//         <span>Invalid stock ticker specified.</span>
//       </div>
//     );
//   }

//   // Convert ticker to uppercase for consistency
//   const upperCaseTicker = ticker.toUpperCase();

//   return (
//     // Provide the extracted ticker to all children via the TickerContext
//     <TickerProvider ticker={upperCaseTicker}>
//       <div className="min-h-screen bg-stockify-dark text-stockify-fg">
//         {/* You might want a consistent header/navbar here */}
//         {/* <AppHeader /> */}

//         <main className="container mx-auto p-4">
//           {/* Layout structure for main content and potential sidebar */}
//           <div className="grid grid-cols-12 gap-6">
//             {/* Render MainContent - it will consume the ticker from the context */}
//             <MainContent />

//             {/* Render Sidebar if needed - it can also consume the ticker from context */}
//             {/* <div className="col-span-12 lg:col-span-3"> */}
//             {/*   <Sidebar /> */}
//             {/* </div> */}
//           </div>
//         </main>
//       </div>
//     </TickerProvider>
//   );
// };

// export default StockDetailWrapper;
// src/pages/StockDetailWrapper.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import MainContent from '@/components/sections/MainContent';
import NewsSection from '@/components/sections/NewsSection'; // Import NewsSection
import { TickerProvider } from '@/contexts/TickerContext';
import { Loader2 } from 'lucide-react';

const StockDetailWrapper = () => {
  const { ticker } = useParams<{ ticker: string }>();

  if (!ticker) {
    return (
      <div className="flex justify-center items-center h-screen text-stockify-muted bg-stockify-dark">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span>Invalid stock ticker specified.</span>
      </div>
    );
  }

  const upperCaseTicker = ticker.toUpperCase();

  return (
    <TickerProvider ticker={upperCaseTicker}>
      <div className="min-h-screen bg-stockify-dark text-stockify-fg">
        {/* Optional Header could go here */}
        <main className="container mx-auto p-4">
          {/* --- MODIFIED: Render NewsSection first for left alignment --- */}
          <div className="grid grid-cols-12 gap-6">
            {/* News section (sidebar - now on the left) */}
            <NewsSection />

            {/* Main content area (now on the right) */}
            <MainContent />
          </div>
          {/* --- END MODIFICATION --- */}
        </main>
      </div>
    </TickerProvider>
  );
};

export default StockDetailWrapper;
