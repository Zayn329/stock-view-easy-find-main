
import React from 'react';
import { ThumbsUp, Star, Info } from 'lucide-react';

interface AnalysisCardProps {
  type: 'positive' | 'neutral' | 'negative' | 'info';
  title: string;
  content?: string;
  percentage?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ type, title, content, percentage }) => {
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <ThumbsUp className="text-blue-400" size={24} />;
      case 'neutral':
        return <ThumbsUp className="text-gray-400 transform rotate-180" size={24} />;
      case 'negative':
        return <ThumbsUp className="text-gray-400 transform rotate-180" size={24} />;
      case 'info':
        return <Info className="text-gray-400" size={24} />;
      default:
        return <Star className="text-blue-400" size={24} />;
    }
  };

  return (
    <div className="stockify-card h-full">
      <div className="mb-4">
        {getIcon()}
      </div>
      <div className="mb-2">
        <h3 className="text-sm font-medium">
          {title}
        </h3>
      </div>
      {content && <p className="text-stockify-text-secondary text-xs">{content}</p>}
      {percentage && (
        <div className="mt-2">
          <span className="text-lg font-bold">{percentage}</span>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
