
import React from 'react';
import StockCard from './StockCard';
import { StockInfo } from '@/types/stock';

interface StockListProps {
  stocks: StockInfo[];
  loading: boolean;
}

const StockList: React.FC<StockListProps> = ({ stocks, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-stockify-accent"></div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
};

export default StockList;
