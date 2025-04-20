
import React, { useState, useEffect } from 'react';
import NewsItem from '../stock/NewsItem';
import { toast } from "sonner";
import { useTicker } from '@/contexts/TickerContext';

interface NewsItem {
  title: string;
  content: string;
  date: string;
  url: string;
  image_url: string;
}

interface NewsResponse {
  news: NewsItem[];
}

// Mock data to use when API is not available
const mockNewsData: NewsItem[] = [
  { 
    title: "Apple Releases New iPhone Model", 
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=300&auto=format&fit=crop", 
    content: "Apple announces the latest iPhone with revolutionary features.", 
    date: "2025-04-08", 
    url: "https://example.com/news/1" 
  },
  { 
    title: "Apple Stock Hits All-Time High", 
    image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=300&auto=format&fit=crop", 
    content: "Investors celebrate as Apple reaches record stock price.", 
    date: "2025-04-07", 
    url: "https://example.com/news/2" 
  },
  { 
    title: "Apple Invests in AI Technology", 
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=300&auto=format&fit=crop", 
    content: "New AI initiatives announced at Apple developer conference.", 
    date: "2025-04-06", 
    url: "https://example.com/news/3" 
  },
  { 
    title: "Apple Expands Market in Asia", 
    image_url: "https://images.unsplash.com/photo-1528475775637-ed767f76e6b6?q=80&w=300&auto=format&fit=crop", 
    content: "New stores opening across Asian markets as demand grows.", 
    date: "2025-04-05", 
    url: "https://example.com/news/4" 
  },
  { 
    title: "Analysts Predict Growth for Apple", 
    image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop", 
    content: "Financial experts project continued success for Apple products.", 
    date: "2025-04-04", 
    url: "https://example.com/news/5" 
  }
];

const NewsSection = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const { ticker } = useTicker();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Add a timeout to the fetch to avoid long waits if API is not running
        const fetchPromise = fetch(`http://localhost:5001/news?symbol=${ticker}&days_back=30&limit=5`);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 5000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (!response.ok) {
          throw new Error('Failed to fetch news data');
        }
        
        const data: NewsResponse = await response.json();
        setNewsData(data.news);
        setApiAvailable(true);
      } catch (error) {
        console.error('Error fetching news:', error);
        
        // Use mock data if API is not available
        setNewsData(mockNewsData);
        setApiAvailable(false);
        
        toast.error(
          "Using demo news data. API server not detected at http://localhost:5001. Make sure to run your Flask news API.",
          { duration: 6000 }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [ticker]); // Re-fetch when ticker changes

  return (
    <div className="col-span-12 lg:col-span-3 pr-0">
      <h2 className="text-xl font-bold mb-2">Latest News on {ticker}</h2>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-2 mb-2 bg-stockify-card rounded-lg animate-pulse">
              <div className="w-5 h-5 bg-gray-700 rounded"></div>
              <div className="flex-1 h-5 bg-gray-700 rounded"></div>
              <div className="w-10 h-10 bg-gray-700 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {newsData.map((news, index) => (
              <NewsItem 
                key={index}
                number={index + 1} 
                title={news.title} 
                imageSrc={news.image_url || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop"} 
                url={news.url}
              />
            ))}
          </div>
          
          {!apiAvailable && (
            <div className="text-amber-400 text-sm mt-4">
              ⚠️ Using demo news. To see real news, ensure your Flask API is running at http://localhost:5001
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsSection;
