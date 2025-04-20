
import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Removed useRef as AsyncSelect handles dropdown state
import { useNavigate } from 'react-router-dom';
import { Filter, ChevronDown, Loader2, User, Settings, LogOut, Search } from 'lucide-react'; // *** Add Search back ***
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // No longer needed
import AsyncSelect from 'react-select/async'; // *** IMPORT AsyncSelect ***
import { StockSuggestion } from '@/types/stock'; // *** IMPORT StockSuggestion ***
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { searchStocks, filterStocks, suggestStocks } from '@/services/stockApi'; // Keep suggestStocks
import { StockInfo } from '@/types/stock';
import StockCard from '@/components/StockCard';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SingleValue } from 'react-select'; // *** IMPORT SingleValue type ***

const Logo = () => <div className="text-xl font-bold text-stockify-primary">Stockify</div>;

// Define market cap options
const marketCapOptions = [
  'All',
  'Large Cap (>$10B)',
  'Mid Cap ($2B-$10B)',
  'Small Cap (<$2B)',
];

// Helper to get unique sectors from data
const getUniqueSectors = (stocks: StockInfo[]): string[] => {
  const sectors = new Set(stocks.map(stock => stock.sector).filter(Boolean));
  return ['All', ...Array.from(sectors)];
};

const Dashboard = () => {
  // --- Hooks ---
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- State ---
  // const [searchQuery, setSearchQuery] = useState(''); // Removed, AsyncSelect handles its input
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMarketCap, setSelectedMarketCap] = useState('All');
  const [allStocks, setAllStocks] = useState<StockInfo[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // --- NEW State for AsyncSelect ---
  const [selectedTickerOption, setSelectedTickerOption] = useState<SingleValue<StockSuggestion>>(null);
  // --- END NEW State ---

  // --- Effects ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const stocks = await searchStocks('');
        setAllStocks(stocks);
        setAvailableSectors(getUniqueSectors(stocks));
      } catch (error) {
        console.error("Failed to fetch initial stock data:", error);
        setAllStocks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- Memoized Filtering (for displayed grid) ---
  const filteredStocks = useMemo(() => {
    setIsFiltering(true);
    let results = allStocks;
    // Apply dropdown filters
    results = filterStocks(results, selectedSector, selectedMarketCap);
    setIsFiltering(false);
    return results;
    // Removed searchQuery dependency
  }, [selectedSector, selectedMarketCap, allStocks]);

  // --- *** Define formatOptionLabel function HERE *** ---
  const formatOptionLabel = (option: StockSuggestion) => (
    <div>
      <div>{option.label}</div>
      {option.description && ( // Conditionally render description if it exists
        <div style={{
          fontSize: '0.8em', // Smaller font size
          color: '#9ca3af', // Gray color (Tailwind gray-400 equivalent)
          marginTop: '2px', // Small top margin
          whiteSpace: 'normal', // Allow text wrapping
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2, // Limit to 2 lines
          WebkitBoxOrient: 'vertical',
         }}>
          {option.description}
        </div>
      )}
    </div>
  );
  // --- *** END formatOptionLabel definition *** ---

  // --- Function to load suggestions for AsyncSelect ---
  const loadStockSuggestions = useCallback(async (inputValue: string): Promise<StockSuggestion[]> => {
    if (!inputValue || inputValue.length < 1) { // Don't search for empty/short strings
      return [];
    }
    try {
      // Call your API service function
      const suggestions = await suggestStocks(inputValue);
      return suggestions;
    } catch (error) {
      console.error("Error fetching stock suggestions:", error);
      return []; // Return empty array on error
    }
  }, []); // Empty dependency array, suggestStocks is stable

  // --- Handler for when a suggestion is selected ---
  const handleTickerChange = (selectedOption: SingleValue<StockSuggestion>) => {
    setSelectedTickerOption(selectedOption); // Update state

    if (selectedOption) {
      const rawTicker = selectedOption.value.trim().toUpperCase();
      let finalTicker = rawTicker;

      // Append .NS if necessary
      if (!rawTicker.toUpperCase().endsWith('.NS')) {
        finalTicker = `${rawTicker}.NS`;
        console.log(`Appending .NS. Navigating to: ${finalTicker}`);
      } else {
        console.log(`Using existing .NS. Navigating to: ${finalTicker}`);
      }
      navigate(`/stock/${finalTicker}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- Custom Styles for react-select (Optional, adjust as needed) ---
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--stockify-input)', // Use CSS variables if defined
      borderColor: 'var(--stockify-border)',
      borderRadius: '9999px', // full rounded
      minHeight: '40px', // Match input height
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'var(--stockify-primary)',
      },
      paddingLeft: '28px', // Space for icon
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white', // Input text color
      margin: '0',
      padding: '0',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af', // Placeholder color (Tailwind gray-400)
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'black', // Selected value text color
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--stockify-card)',
      borderColor: 'var(--stockify-border)',
      borderRadius: '0.375rem', // md rounded
      marginTop: '4px',
      zIndex: 30, // Ensure dropdown is above other elements
    }),
    option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--stockify-primary)' // Selected option background
        : state.isFocused
        ? 'rgba(75, 85, 99, 0.5)' // Focused option background (Tailwind gray-800/50)
        : 'var(--stockify-card)',
      color: state.isSelected ? 'white' : 'var(--stockify-fg)', // Text color
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'var(--stockify-primary)', // Active option background
      },
    }),
    // Add other parts like dropdownIndicator, clearIndicator if needed
  };


  // --- Render ---
  return (
    <div className="min-h-screen bg-stockify-dark text-stockify-fg">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 sticky top-0 bg-stockify-dark/90 backdrop-blur-sm z-20">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Logo />

          {/* --- *** REPLACE Input form with AsyncSelect HERE *** --- */}
          <div className="relative flex-grow max-w-lg">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stockify-muted pointer-events-none z-10" // Ensure icon is above input field visually
              size={18}
              aria-hidden="true"
            />
            <AsyncSelect
              cacheOptions // Caches results for the same search term
              loadOptions={loadStockSuggestions} // Function to fetch suggestions
              defaultOptions // You might load some initial options here if desired
              onChange={handleTickerChange} // Function to handle selection
              value={selectedTickerOption} // Controlled component value
              placeholder="Search for a stock (e.g., AAPL, Apple)..."
              formatOptionLabel={formatOptionLabel} // Use the custom label formatter
              styles={customSelectStyles} // Apply custom styles
              noOptionsMessage={({ inputValue }) =>
                !inputValue ? 'Start typing to search...' : 'No matching stocks found'
              }
              loadingMessage={() => 'Loading...'}
              // Other react-select props as needed (e.g., isClearable)
              classNamePrefix="react-select" // Optional: for easier CSS targeting if needed
            />
          </div>
          {/* --- *** END AsyncSelect replacement *** --- */}


          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800/50">
                 <div className="w-8 h-8 rounded-full bg-stockify-primary flex items-center justify-center text-white">
                   {user?.username ? user.username.charAt(0).toUpperCase() : <User size={18} />}
                 </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-stockify-card border-gray-700 text-stockify-fg">
              {user && (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                    <p className="text-xs text-stockify-muted truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                </>
              )}
              <DropdownMenuItem
                onClick={() => navigate('/account-settings')}
                className="cursor-pointer hover:bg-gray-800/50 flex items-center gap-2 py-2"
              >
                <Settings size={16} className="text-stockify-muted" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-gray-800/50 flex items-center gap-2 py-2 text-red-400 hover:text-red-300"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* Filters Section (Remains the same) */}
      <div className="container mx-auto p-4 flex flex-wrap gap-3 items-center border-b border-gray-800 pb-4 mb-4">
        <div className="flex items-center mr-2">
          <Filter size={16} className="mr-2 text-stockify-muted" aria-hidden="true" />
          <span className="text-sm text-stockify-muted font-medium">Filters:</span>
        </div>
        {/* Sector Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-stockify-card border-gray-700 hover:bg-gray-800/60">
              Sector: {selectedSector}
              <ChevronDown size={16} className="ml-2" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-stockify-card border-gray-700 text-stockify-fg max-h-60 overflow-y-auto">
            {availableSectors.map((sectorOption) => (
              <DropdownMenuItem
                key={sectorOption}
                onClick={() => setSelectedSector(sectorOption)}
                className={`cursor-pointer hover:bg-gray-800/50 ${selectedSector === sectorOption ? 'bg-gray-800 font-semibold' : ''}`}
              >
                {sectorOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Market Cap Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-stockify-card border-gray-700 hover:bg-gray-800/60">
              Market Cap: {selectedMarketCap}
              <ChevronDown size={16} className="ml-2" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-stockify-card border-gray-700 text-stockify-fg">
            {marketCapOptions.map((capOption) => (
              <DropdownMenuItem
                key={capOption}
                onClick={() => setSelectedMarketCap(capOption)}
                 className={`cursor-pointer hover:bg-gray-800/50 ${selectedMarketCap === capOption ? 'bg-gray-800 font-semibold' : ''}`}
              >
                {capOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content Area - Stocks Grid */}
      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center mt-20 text-stockify-muted">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            Loading initial stock data...
          </div>
        ) : filteredStocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <Link
                to={`/stock/${stock.symbol}`} // Ensure symbol includes .NS if needed here too
                key={stock.symbol}
                className="block rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stockify-dark focus:ring-stockify-primary transition-shadow duration-150 ease-in-out hover:shadow-lg bg-stockify-card"
                aria-label={`View details for ${stock.name}`}
              >
                 <StockCard stock={stock} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mt-10">
            <p className="text-lg text-stockify-muted">
              {selectedSector !== 'All' || selectedMarketCap !== 'All'
                ? 'No stocks match your current filters.'
                : 'No stock data available.'}
            </p>
            {(selectedSector !== 'All' || selectedMarketCap !== 'All') && (
                 <Button variant="link" className="mt-2 text-stockify-primary" onClick={() => { setSelectedSector('All'); setSelectedMarketCap('All'); }}>
                    Clear Filters
                 </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;

