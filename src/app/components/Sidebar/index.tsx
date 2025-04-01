import React, { useState } from 'react';
import { SearchIcon, Settings2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function Sidebar({
  searchTerm,
  setSearchTerm,
  setSelectedFilter,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);

  const handleFilterChange = (value: string) => {
    setFilters((prevFilters) => {
      const newFilters = prevFilters.includes(value)
        ? prevFilters.filter((f) => f !== value)
        : [...prevFilters, value];

      setSelectedFilter(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="flex w-full flex-col z-50">
      <aside
        className={`fixed inset-y-0 left-0 z-10 hidden transition-all durration-300 ${isExpanded ? 'w-62' : 'w-14'} border-r bg-gray-800 sm:flex`}
      >
        <nav className="flex flex-col items-end gap-4 px-2 py-5">
          <Button
            variant="ghost"
            className="mb-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Menu className="h-5 w-5 text-[#F3F3F3] cursor-pointer" />
          </Button>
          <div className="flex flex-col gap-4 w-full px-2 mt-4">
            <div className="flex items-center gap-2 w-full">
              <SearchIcon
                className="h-5 w-5 text-[#F3F3F3] cursor-pointer"
                onClick={() => setIsExpanded(true)}
              />
              {isExpanded && (
                <Input
                  className="w-full bg-[#F3F3F3] text-[#000] cursor-pointer"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              )}
            </div>
            <div className="flex items-center gap-2 w-full">
              <Settings2
                className="h-5 w-5 text-[#F3F3F3] cursor-pointer"
                onClick={() => setIsExpanded(true)}
              />
              {isExpanded ? (
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-6">
                    {['operando', 'parado', 'manutencao'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer text-[#F3F3F3]"
                      >
                        <Checkbox
                          checked={filters.includes(option)}
                          onCheckedChange={() => handleFilterChange(option)}
                          className="border-[#F3F3F3] border-2"
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}
