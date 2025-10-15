import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSearchTemplates?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSearchTemplates }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleIconSearch = () => {
    handleSearch();
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={handleIconSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer z-10"
          >
            <Search className="w-5 h-5" />
          </button>
          <Input
            type="text"
            placeholder="Search by vertical, ad size, type, products, frames... (e.g., '300x250', 'banner', 'mobile')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 glass border-glass-border bg-glass/30 focus:ring-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={onSearchTemplates}
            className="btn-futuristic text-white px-6"
          >
            Search Templates
          </Button>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {['300x250', '728x90', '320x50', 'banner', 'mobile', 'animated'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag);
              onSearch(tag);
            }}
            className="px-3 py-1 text-xs bg-glass/50 border border-glass-border rounded-full hover:bg-primary/20 hover:border-primary/30 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
};