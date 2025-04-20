
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FiltersProps {
  selectedSector: string;
  selectedMarketCap: string;
  setSector: (sector: string) => void;
  setMarketCap: (marketCap: string) => void;
}

const sectors = [
  'All',
  'Technology',
  'Finance',
  'Healthcare',
  'Consumer',
  'Energy',
  'Automotive',
];

const marketCaps = [
  'All',
  'Large Cap (>$10B)',
  'Mid Cap ($2B-$10B)',
  'Small Cap (<$2B)',
];

const Filters: React.FC<FiltersProps> = ({
  selectedSector,
  selectedMarketCap,
  setSector,
  setMarketCap,
}) => {
  return (
    <div className="flex gap-4 py-4 px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white">
            <span>Sector: {selectedSector}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          {sectors.map((sector) => (
            <DropdownMenuItem 
              key={sector} 
              onClick={() => setSector(sector)}
              className="hover:bg-gray-700"
            >
              {sector}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white">
            <span>Market Cap: {selectedMarketCap}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          {marketCaps.map((cap) => (
            <DropdownMenuItem 
              key={cap} 
              onClick={() => setMarketCap(cap)}
              className="hover:bg-gray-700"
            >
              {cap}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Filters;
