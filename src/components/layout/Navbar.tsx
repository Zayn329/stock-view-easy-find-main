
import React, { useState } from 'react';
import { Search, Grid3X3, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useTicker } from '@/context/TickerContext';
import { toast } from "sonner";

const Navbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const { setTicker } = useTicker();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      toast.error("Please enter a valid stock ticker");
      return;
    }

    // Update the ticker in context
    setTicker(searchInput.toUpperCase().trim());
    toast.success(`Loading data for ${searchInput.toUpperCase().trim()}`);
    setSearchInput('');
    setIsSearchOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <button className="p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-stockify-highlight rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <span className="font-bold text-xl">Stockify</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4 relative">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="text"
              placeholder="Enter stock ticker (e.g., AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500 mr-2 w-full"
              autoFocus
            />
            <button type="submit" className="p-2 bg-blue-500 rounded-md">
              <Search size={20} />
            </button>
            <button type="button" className="p-2 ml-2 bg-gray-700 rounded-md" onClick={() => setIsSearchOpen(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button className="p-2" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>
        )}
        <button className="p-2">
          <Grid3X3 size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden">
          <User size={16} className="text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
