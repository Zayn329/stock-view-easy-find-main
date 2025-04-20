
import React from 'react';
import StockHeader from './StockHeader';
import StockMetrics from './StockMetrics';
import AIAnalysis from './AIAnalysis';
import MarketSentiment from './MarketSentiment';
import PriceChartSection from './PriceChartSection';

const MainContent = () => {
  return (
    <div className="col-span-12 lg:col-span-9">
      {/* Stock header */}
      <StockHeader />
      
      {/* Stock metrics */}
      <StockMetrics />
      
      {/* AI Analysis and Market Sentiment side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AIAnalysis />
        <MarketSentiment />
      </div>
      
      {/* Chart */}
      <PriceChartSection />
    </div>
  );
};

export default MainContent;
