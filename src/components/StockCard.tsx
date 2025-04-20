
import React from 'react';
import { StockInfo } from '@/types/stock';

interface StockCardProps {
  stock: StockInfo;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  return (
    <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <h3 className="text-lg font-semibold mb-1">{stock.name}</h3>
      <p className="text-sm text-stockify-muted mb-2">{stock.description}</p>
    </div>
  );
};

export default StockCard;
