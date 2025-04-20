
import React from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface NewsItemProps {
  number: number;
  title: string;
  imageSrc: string;
  url?: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ number, title, imageSrc, url }) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card 
      className={`flex items-center gap-2 p-2 mb-2 bg-stockify-card ${url ? 'cursor-pointer hover:bg-stockify-card/80' : ''}`}
      onClick={handleClick}
    >
      <div className="text-lg font-bold text-stockify-text-secondary w-5">{number}</div>
      <div className="flex-1">
        <h3 className="text-xs sm:text-sm">{title}</h3>
      </div>
      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      {url && (
        <div className="text-stockify-text-secondary">
          <ExternalLink size={14} />
        </div>
      )}
    </Card>
  );
};

export default NewsItem;
