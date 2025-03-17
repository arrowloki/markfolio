
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search bookmarks..." 
}) => {
  const [query, setQuery] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className="relative glass-input rounded-xl overflow-hidden pr-10 focus-within:ring-2 focus-within:ring-ring transition-all">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="block w-full bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 pl-10 text-sm"
        placeholder={placeholder}
        aria-label="Search"
      />
      
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
