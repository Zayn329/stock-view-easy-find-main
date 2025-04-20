
import React, { useState, useEffect } from 'react';
import AnalysisCard from '../stock/AnalysisCard';
import { toast } from "sonner";
import { useTicker } from '@/contexts/TickerContext';

interface NewsItem {
  title: string;
  content: string;
  date: string;
  url: string;
  image_url: string;
  entities: Array<{
    sentiment_score: number;
    highlights?: Array<{
      sentiment: number;
      highlight: string;
    }>;
    symbol?: string;
  }>;
}

interface NewsResponse {
  news: NewsItem[];
}

// Mock data to use when API is not available
const mockNewsData: NewsItem[] = [
  {
    title: "Apple Releases New iPhone Model",
    content: "Apple announces the latest iPhone with revolutionary features.",
    date: "2025-04-08",
    url: "https://example.com/news/1",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
    entities: [{
      sentiment_score: 0.8,
      highlights: [{ sentiment: 0.8, highlight: "revolutionary features" }]
    }]
  },
  {
    title: "Apple Stock Hits All-Time High",
    content: "Investors celebrate as Apple reaches record stock price.",
    date: "2025-04-07",
    url: "https://example.com/news/2",
    image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    entities: [{
      sentiment_score: 0.9,
      highlights: [{ sentiment: 0.9, highlight: "record stock price" }]
    }]
  },
  {
    title: "Market Analysis for Tech Stocks",
    content: "Experts analyze the latest trends in technology stocks.",
    date: "2025-04-06",
    url: "https://example.com/news/3",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    entities: [{
      sentiment_score: 0.2,
      highlights: [{ sentiment: 0.2, highlight: "latest trends" }]
    }]
  }
];

const MarketSentiment = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ticker } = useTicker();
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const fetchNewsSentiment = async () => {
      try {
        setLoading(true);
        console.log(`Fetching sentiment data for ${ticker} from http://localhost:5001/news?symbol=${ticker}&days_back=30&limit=10`);
        
        // Increase timeout to 15 seconds as sentiment analysis might take longer
        const fetchPromise = fetch(`http://localhost:5001/news?symbol=${ticker}&days_back=30&limit=10`);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 15000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news sentiment data: ${response.status} ${response.statusText}`);
        }
        
        const data: NewsResponse = await response.json();
        console.log("Received news data:", data);
        
        if (!data.news || !Array.isArray(data.news)) {
          throw new Error('Invalid data format received from API');
        }
        
        setNewsData(data.news);
        setApiAvailable(true);
      } catch (error) {
        console.error('Error fetching news sentiment:', error);
        toast.error("Failed to load market sentiment. Check if the API server is running on port 5001.");
        
        // Use mock data as fallback
        setNewsData(mockNewsData);
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsSentiment();
  }, [ticker]);

  const calculateSentiments = () => {
    if (!newsData.length) return { positive: 0, neutral: 0, negative: 0 };
    
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let total = 0;
    
    newsData.forEach(item => {
      if (!item.entities || !item.entities.length) return;
      
      item.entities.forEach(entity => {
        // Only include entities related to our ticker (if symbol is available)
        if (entity.symbol && entity.symbol !== ticker) return;
        
        if (entity.sentiment_score > 0.1) {
          positiveCount++;
        } else if (entity.sentiment_score < -0.1) {
          negativeCount++;
        } else {
          neutralCount++;
        }
        total++;
        
        // Also check highlights if available
        if (entity.highlights && Array.isArray(entity.highlights)) {
          entity.highlights.forEach(highlight => {
            if (highlight.sentiment > 0.1) {
              positiveCount++;
            } else if (highlight.sentiment < -0.1) {
              negativeCount++;
            } else {
              neutralCount++;
            }
            total++;
          });
        }
      });
    });
    
    return {
      positive: total === 0 ? 0 : Math.round((positiveCount / total) * 100),
      neutral: total === 0 ? 0 : Math.round((neutralCount / total) * 100),
      negative: total === 0 ? 0 : Math.round((negativeCount / total) * 100)
    };
  };

  const extractKeyDrivers = (): string => {
    if (!newsData.length) return "Insufficient data";
    
    // Get the most recent news titles
    const recentNews = newsData.slice(0, 3).map(item => item.title.toLowerCase());
    
    // Look for specific keywords in titles
    if (recentNews.some(title => title.includes('earnings') || title.includes('financial'))) {
      return "Recent earnings reports and financial performance";
    } else if (recentNews.some(title => title.includes('partnership') || title.includes('collaboration'))) {
      return "Strategic partnerships and collaborations";
    } else if (recentNews.some(title => title.includes('innovation') || title.includes('technology'))) {
      return "Technology innovation and advancement";
    } else if (recentNews.some(title => title.includes('tariff') || title.includes('trade'))) {
      return "Tariff policies and trade relations";
    } else {
      return "Market trends and industry developments";
    }
  };

  const calculateOverallSentiment = (): { score: number; text: string } => {
    if (!newsData.length) return { score: 50, text: "Neutral" };
    
    let totalScore = 0;
    let count = 0;
    
    newsData.forEach(item => {
      if (!item.entities || !item.entities.length) return;
      
      item.entities.forEach(entity => {
        // Only include entities related to our ticker (if symbol is available)
        if (entity.symbol && entity.symbol !== ticker) return;
        
        totalScore += entity.sentiment_score;
        count++;
        
        // Also use highlights if available
        if (entity.highlights && Array.isArray(entity.highlights)) {
          entity.highlights.forEach(highlight => {
            totalScore += highlight.sentiment;
            count++;
          });
        }
      });
    });
    
    const averageScore = count === 0 ? 0 : totalScore / count;
    // Convert from range [-1, 1] to [0, 100]
    const normalizedScore = Math.round((averageScore + 1) * 50);
    
    let sentimentText = "Neutral";
    if (normalizedScore >= 65) sentimentText = "Positive";
    if (normalizedScore >= 80) sentimentText = "Very Positive";
    if (normalizedScore < 35) sentimentText = "Negative";
    if (normalizedScore < 20) sentimentText = "Very Negative";
    
    return { score: normalizedScore, text: sentimentText };
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-3">Market Sentiment Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="stockify-card animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sentiments = calculateSentiments();
  const keyDrivers = extractKeyDrivers();
  const overallSentiment = calculateOverallSentiment();

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Market Sentiment Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <AnalysisCard 
          type="positive" 
          title="Positive Sentiment:" 
          percentage={`${sentiments.positive}%`}
        />
        <AnalysisCard 
          type="neutral" 
          title="Neutral Sentiment:" 
          percentage={`${sentiments.neutral}%`}
        />
        <AnalysisCard 
          type="negative" 
          title="Negative Sentiment:" 
          percentage={`${sentiments.negative}%`}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AnalysisCard 
          type="info" 
          title={`Key Drivers: ${keyDrivers}`}
        />
        <AnalysisCard 
          type="positive" 
          title="Sentiment Score:" 
          percentage={`${overallSentiment.score}%`}
        />
        <AnalysisCard 
          type={overallSentiment.score >= 65 ? "positive" : overallSentiment.score <= 35 ? "negative" : "neutral"} 
          title={`Overall Sentiment: ${overallSentiment.text}`}
        />
      </div>
      
      {!apiAvailable && (
        <div className="text-amber-400 text-sm mt-4">
          ⚠️ Using mock sentiment data. To see real sentiment analysis, ensure your Flask API is running at http://localhost:5001
        </div>
      )}
    </div>
  );
};

export default MarketSentiment;
