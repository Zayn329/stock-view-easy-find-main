// c:\Users\zainp\Desktop\stock-view-easy-find-main - Copy\stock-view-easy-find-main\src\components\layout\Navbar.tsx
import React, { useState } from 'react'; // Added useState
import { User, Menu, Search } from 'lucide-react'; // Added Search
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';
// Removed useTicker import as we navigate directly

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const username = user?.name || user?.username || 'User';

  // --- Add Search State ---
  const [searchInput, setSearchInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // --- End Search State ---

  // --- Modified Search Handler ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTicker = searchInput.trim().toUpperCase(); // Get ticker, trim whitespace, convert to uppercase

    if (!rawTicker) {
      toast.error("Please enter a valid stock ticker");
      return;
    }

    let finalTicker = rawTicker;
    // Append .NS if not already present (consistent with Dashboard logic)
    if (!rawTicker.endsWith('.NS')) {
      finalTicker = `${rawTicker}.NS`;
    }

    // Clear input and close search UI
    setSearchInput('');
    setIsSearchOpen(false);

    // Navigate to the stock detail page
    navigate(`/stock/${finalTicker}`);
  };
  // --- End Modified Search Handler ---

  const handleAccountSettingsClick = () => {
    if (isLoggedIn) {
      navigate('/account-settings');
    } else {
      toast.info("Please log in to access account settings.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
      {/* Left side - Menu Dropdown & Logo */}
      <div className="flex items-center gap-2">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle menu">
              <Menu size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer hover:bg-gray-700"
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleAccountSettingsClick}
              className="cursor-pointer hover:bg-gray-700"
            >
              Account Settings
            </DropdownMenuItem>
            {isLoggedIn && (
              <>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-gray-700 text-red-400 hover:text-red-300"
                >
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <span className="font-bold text-xl flex items-center gap-1">
            ✧
            <span>Stockify</span>
          </span>
        </Link>
      </div>

      {/* Right side - Search, User Avatar/Login */}
      <div className="flex items-center gap-4 relative">
        {/* --- Search Input/Button --- */}
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="text"
              placeholder="Enter ticker..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8 bg-gray-800 text-white border-gray-700 focus:border-blue-500 mr-2 w-40 sm:w-auto" // Adjusted width
              autoFocus
              aria-label="Stock ticker search input"
            />
            {/* Hidden submit button for Enter key */}
             <button type="submit" style={{ display: 'none' }} aria-hidden="true"></button>
             {/* Visible Search Icon Button (optional, could be part of Input decoration) */}
             <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300" aria-label="Submit search">
               <Search size={18} />
             </Button>
            <Button type="button" size="sm" variant="ghost" className="h-8 ml-1 text-gray-400 hover:text-gray-200" onClick={() => setIsSearchOpen(false)} aria-label="Cancel search">
              Cancel
            </Button>
          </form>
        ) : (
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
            <Search size={20} />
          </Button>
        )}
        {/* --- End Search Input/Button --- */}

        {/* User Avatar/Login Button */}
        {isLoggedIn ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  aria-label="User profile"
                  onClick={() => navigate('/account-settings')}
                >
                  <User size={16} className="text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white border-gray-700">
                <p>{username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="bg-transparent border-gray-600 hover:bg-gray-700">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
