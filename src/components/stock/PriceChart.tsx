
import React from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

interface PriceChartProps {
  data: Array<{ name: string; price: number }>;
  title: string;
  price: string;
  change: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, title, price, change }) => {
  return (
    <div className="stockify-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-stockify-text-secondary text-sm">{title}</h3>
        <button className="text-stockify-text-secondary">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="flex items-end gap-2 mb-4">
        <h2 className="text-2xl font-bold">{price}</h2>
        <span className="text-sm pb-0.5 text-stockify-text-secondary">
          {change}
        </span>
      </div>
      
      <div className="flex mb-2 space-x-2 text-xs">
        <button className="text-stockify-text-secondary">Jul</button>
        <button className="text-stockify-text-secondary">Jun</button>
        <button className="text-stockify-text-secondary">Apr</button>
        <button className="text-stockify-text-secondary">Feb</button>
      </div>

      <div className="h-40 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <XAxis dataKey="name" hide />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b5bf5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs text-stockify-text-secondary mt-2">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
      </div>
    </div>
  );
};

export default PriceChart;
