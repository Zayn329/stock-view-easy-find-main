
import React from 'react';
import PriceChart from '../stock/PriceChart';

// Mock data for the chart
const chartData = Array.from({ length: 20 }, (_, i) => ({
  name: `Point ${i}`,
  price: 150 + Math.random() * 60 - 30 + (i * 2),
}));

const PriceChartSection = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historical Price Trend</h2>
      <PriceChart 
        data={chartData} 
        title="Price" 
        price="$180" 
        change="+2%" 
      />
    </div>
  );
};

export default PriceChartSection;
