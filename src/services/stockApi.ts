
// import { StockInfo } from '@/types/stock';
// import { toast } from 'sonner';

// // Mock data that resembles the image provided
// const mockStocks: StockInfo[] = [
//   {
//     symbol: 'AAPL',
//     name: 'Apple Inc.',
//     description: 'Technology company that designs, manufactures, and markets smartphones, personal computers, and more.',
//     sector: 'Technology',
//     marketCap: 2900000000000,
//     price: 178.72,
//     change: -0.32,
//     changePercent: -0.18
//   },
//   {
//     symbol: 'MSFT',
//     name: 'Microsoft Corp.',
//     description: 'Technology company that develops, licenses, and supports a range of software products and services.',
//     sector: 'Technology',
//     marketCap: 2800000000000,
//     price: 378.85,
//     change: 2.15,
//     changePercent: 0.57
//   },
//   {
//     symbol: 'AMZN',
//     name: 'Amazon.com Inc.',
//     description: 'E-commerce and cloud computing company that offers a wide range of products and services.',
//     sector: 'Consumer',
//     marketCap: 1700000000000,
//     price: 169.53,
//     change: 1.20,
//     changePercent: 0.71
//   },
//   {
//     symbol: 'TSLA',
//     name: 'Tesla Inc.',
//     description: 'Automotive and energy company that designs, manufactures, and sells electric vehicles and energy storage products.',
//     sector: 'Automotive',
//     marketCap: 548000000000,
//     price: 172.63,
//     change: -1.82,
//     changePercent: -1.04
//   },
//   {
//     symbol: 'GOOGL',
//     name: 'Alphabet Inc.',
//     description: 'Holding company that owns Google and several former Google subsidiaries.',
//     sector: 'Technology',
//     marketCap: 1900000000000,
//     price: 154.92,
//     change: 0.25,
//     changePercent: 0.16
//   },
//   {
//     symbol: 'FB',
//     name: 'Facebook Inc.',
//     description: 'Social media company that owns and operates Facebook, Instagram, WhatsApp, and other products and services.',
//     sector: 'Technology',
//     marketCap: 1200000000000,
//     price: 472.34,
//     change: 7.69,
//     changePercent: 1.65
//   },
//   {
//     symbol: 'NFLX',
//     name: 'Netflix Inc.',
//     description: 'Streaming entertainment service that offers TV shows, movies, documentaries, and more.',
//     sector: 'Consumer',
//     marketCap: 275000000000,
//     price: 625.68,
//     change: 5.43,
//     changePercent: 0.88
//   },
//   {
//     symbol: 'NVDA',
//     name: 'NVIDIA Corp.',
//     description: 'Technology company that designs and manufactures graphics processing units (GPUs) for gaming and professional markets.',
//     sector: 'Technology',
//     marketCap: 2400000000000,
//     price: 950.15,
//     change: 12.75,
//     changePercent: 1.36
//   },
//   {
//     symbol: 'PYPL',
//     name: 'PayPal Holdings Inc.',
//     description: 'Financial platform and digital payments company that enables digital and mobile payments on behalf of consumers and merchants.',
//     sector: 'Finance',
//     marketCap: 66000000000,
//     price: 62.98,
//     change: -0.12,
//     changePercent: -0.19
//   },
//   {
//     symbol: 'ADBE',
//     name: 'Adobe Inc.',
//     description: 'Software company that offers products and services for content creation, marketing, and document management.',
//     sector: 'Technology',
//     marketCap: 225000000000,
//     price: 488.76,
//     change: 3.45,
//     changePercent: 0.71
//   },
// ];

// // In a real app, this would call a real API with your API key
// // For this demo, we'll use the mock data
// export const searchStocks = async (query: string): Promise<StockInfo[]> => {
//   try {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 800));
    
//     // If empty query, return all stocks
//     if (!query.trim()) {
//       return mockStocks;
//     }
    
//     // Filter stocks based on query
//     const results = mockStocks.filter(
//       stock => 
//         stock.name.toLowerCase().includes(query.toLowerCase()) ||
//         stock.symbol.toLowerCase().includes(query.toLowerCase())
//     );
    
//     return results;
//   } catch (error) {
//     console.error('Error searching stocks:', error);
//     toast.error('Failed to search stocks. Please try again.');
//     return [];
//   }
// };

// // Filter function for the UI
// export const filterStocks = (
//   stocks: StockInfo[], 
//   sector: string, 
//   marketCap: string
// ): StockInfo[] => {
//   return stocks.filter(stock => {
//     // Filter by sector
//     const sectorMatch = sector === 'All' || stock.sector === sector;
    
//     // Filter by market cap
//     let marketCapMatch = true;
//     if (marketCap !== 'All' && stock.marketCap) {
//       if (marketCap === 'Large Cap (>$10B)' && stock.marketCap < 10000000000) {
//         marketCapMatch = false;
//       } else if (
//         marketCap === 'Mid Cap ($2B-$10B)' && 
//         (stock.marketCap < 2000000000 || stock.marketCap > 10000000000)
//       ) {
//         marketCapMatch = false;
//       } else if (marketCap === 'Small Cap (<$2B)' && stock.marketCap > 2000000000) {
//         marketCapMatch = false;
//       }
//     }
    
//     return sectorMatch && marketCapMatch;
//   });
// };
import axios from 'axios'; // Import axios
import { StockInfo, StockSuggestion } from '@/types/stock';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000'; // Your Flask backend URL

// Mock data that resembles the image provided
const mockStocks: StockInfo[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Technology company that designs, manufactures, and markets smartphones, personal computers, and more.',
    sector: 'Technology',
    marketCap: 2900000000000,
    price: 178.72,
    change: -0.32,
    changePercent: -0.18
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    description: 'Technology company that develops, licenses, and supports a range of software products and services.',
    sector: 'Technology',
    marketCap: 2800000000000,
    price: 378.85,
    change: 2.15,
    changePercent: 0.57
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    description: 'E-commerce and cloud computing company that offers a wide range of products and services.',
    sector: 'Consumer',
    marketCap: 1700000000000,
    price: 169.53,
    change: 1.20,
    changePercent: 0.71
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    description: 'Automotive and energy company that designs, manufactures, and sells electric vehicles and energy storage products.',
    sector: 'Automotive',
    marketCap: 548000000000,
    price: 172.63,
    change: -1.82,
    changePercent: -1.04
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Holding company that owns Google and several former Google subsidiaries.',
    sector: 'Technology',
    marketCap: 1900000000000,
    price: 154.92,
    change: 0.25,
    changePercent: 0.16
  },
  {
    symbol: 'FB', // Note: Meta Platforms now uses META, but keeping FB for mock data consistency if needed
    name: 'Meta Platforms Inc.',
    description: 'Social media company that owns and operates Facebook, Instagram, WhatsApp, and other products and services.',
    sector: 'Technology',
    marketCap: 1200000000000,
    price: 472.34,
    change: 7.69,
    changePercent: 1.65
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    description: 'Streaming entertainment service that offers TV shows, movies, documentaries, and more.',
    sector: 'Consumer',
    marketCap: 275000000000,
    price: 625.68,
    change: 5.43,
    changePercent: 0.88
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    description: 'Technology company that designs and manufactures graphics processing units (GPUs) for gaming and professional markets.',
    sector: 'Technology',
    marketCap: 2400000000000,
    price: 950.15,
    change: 12.75,
    changePercent: 1.36
  },
  {
    symbol: 'PYPL',
    name: 'PayPal Holdings Inc.',
    description: 'Financial platform and digital payments company that enables digital and mobile payments on behalf of consumers and merchants.',
    sector: 'Finance',
    marketCap: 66000000000,
    price: 62.98,
    change: -0.12,
    changePercent: -0.19
  },
  {
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    description: 'Software company that offers products and services for content creation, marketing, and document management.',
    sector: 'Technology',
    marketCap: 225000000000,
    price: 488.76,
    change: 3.45,
    changePercent: 0.71
  },
];

// In a real app, this would call a real API with your API key
// For this demo, we'll use the mock data
export const searchStocks = async (query: string): Promise<StockInfo[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced delay for better UX

    // If empty query, return all stocks (or a default set)
    if (!query.trim()) {
      return mockStocks; // Or return [] if you prefer not showing anything
    }

    // Filter stocks based on query
    const queryLower = query.toLowerCase().trim();
    const results = mockStocks.filter(
      stock =>
        stock.name.toLowerCase().includes(queryLower) ||
        stock.symbol.toLowerCase().includes(queryLower)
    );

    return results;
  } catch (error) {
    console.error('Error searching stocks:', error);
    toast.error('Failed to search stocks. Please try again.');
    return [];
  }
};

// Filter function for the UI (remains the same)
export const filterStocks = (
  stocks: StockInfo[],
  sector: string,
  marketCap: string
): StockInfo[] => {
  return stocks.filter(stock => {
    // Filter by sector
    const sectorMatch = sector === 'All' || stock.sector === sector;

    // Filter by market cap
    let marketCapMatch = true;
    if (marketCap !== 'All' && stock.marketCap != null) { // Check for null/undefined marketCap
      if (marketCap === 'Large Cap (>$10B)' && stock.marketCap < 10000000000) {
        marketCapMatch = false;
      } else if (
        marketCap === 'Mid Cap ($2B-$10B)' &&
        (stock.marketCap < 2000000000 || stock.marketCap > 10000000000)
      ) {
        marketCapMatch = false;
      } else if (marketCap === 'Small Cap (<$2B)' && stock.marketCap >= 2000000000) { // Use >= for small cap upper bound
        marketCapMatch = false;
      }
    }

    return sectorMatch && marketCapMatch;
  });
}; // <-- Correctly closing the filterStocks function

export const suggestStocks = async (query: string, limit: number = 10): Promise<StockSuggestion[]> => { // Default limit matches Flask
  if (!query.trim()) {
    return []; // Don't fetch if query is empty
  }
  try {
    // --- Use the correct endpoint: /search ---
    const response = await axios.get<StockSuggestion[]>(`${API_BASE_URL}/search`, { // Changed '/suggest' to '/search'
      params: { query, limit },
    });
    // Assuming your Flask '/search' endpoint returns data in the format expected by StockSuggestion[]
    // The Flask code returns [{'value': 'TICKER', 'label': 'TICKER (Name)'}]
    // Ensure your StockSuggestion type matches this structure:
    // type StockSuggestion = { value: string; label: string; };
    return response.data;

  } catch (error) {
    console.error('Error fetching stock suggestions:', error); // Log the actual error object
    // Check if it's an Axios error to potentially provide more details
    if (axios.isAxiosError(error)) {
        // You could add more specific handling based on error.response?.status if needed
        toast.error(`Failed to fetch suggestions: ${error.message}`);
    } else {
        toast.error('Failed to fetch suggestions due to an unexpected error.');
    }
    return []; // Return empty array on error
  }
};

