import React, { useState, useEffect } from 'react';
import { Search, X, Tag, Loader2 } from 'lucide-react';

export function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  activeFilterTag,
  onSelectQuickFilter,
  isLoading = false,
}) {
  const [inputValue, setInputValue] = useState(searchTerm || '');

  useEffect(() => {
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  const quickFilterTags = [
    { label: 'All Products', query: '', maxPrice: null, category: 'All' },
    { label: 'Phones under $500', query: 'phone under $500', maxPrice: 500, category: 'Phones' },
    { label: 'Laptops for gaming', query: 'gaming laptop', maxPrice: null, category: 'Laptops' },
    { label: 'Wireless Headphones', query: 'wireless headphones', maxPrice: null, category: 'Headphones' },
    { label: 'Smartwatches', query: 'smartwatch', maxPrice: null, category: 'Smartwatches' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
    if (onSearchSubmit) onSearchSubmit(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchTerm('');
    if (onSelectQuickFilter) {
      onSelectQuickFilter(quickFilterTags[0]);
    }
    if (onSearchSubmit) onSearchSubmit('');
  };

  const handleTagClick = (tag) => {
    setInputValue(tag.query);
    setSearchTerm(tag.query);
    if (onSelectQuickFilter) {
      onSelectQuickFilter(tag);
    }
    if (onSearchSubmit) onSearchSubmit(tag.query);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-indigo-400" />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products by name, category, or features (e.g., gaming, ANC, titanium)..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-12 pr-32 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-lg"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-indigo-600/30 disabled:opacity-70 flex items-center gap-1.5 min-w-[76px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Tag className="w-3.5 h-3.5 text-indigo-400" /> Quick Filters:
        </span>
        {quickFilterTags.map((tag) => {
          const isSelected = activeFilterTag?.label === tag.label;
          return (
            <button
              key={tag.label}
              type="button"
              disabled={isLoading}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/60 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              } disabled:opacity-50`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
