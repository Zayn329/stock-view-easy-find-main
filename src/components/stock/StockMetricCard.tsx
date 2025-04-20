
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface StockMetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
}

const StockMetricCard: React.FC<StockMetricCardProps> = ({ 
  title, value, change, changeDirection 
}) => {
  const getChangeColor = () => {
    if (changeDirection === 'up') return 'text-green-500';
    if (changeDirection === 'down') return 'text-red-500';
    return 'text-stockify-text-secondary';
  };

  return (
    <div className="stockify-card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-stockify-text-secondary text-sm">{title}</h3>
        <button className="text-stockify-text-secondary">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="flex items-end gap-2">
        <h2 className="text-2xl font-bold">{value}</h2>
        {change && (
          <span className={`text-sm pb-0.5 ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StockMetricCard;
