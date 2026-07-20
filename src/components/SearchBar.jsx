import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Loader2, SlidersHorizontal } from 'lucide-react';

export function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  activeFilterTag,
  onSelectQuickFilter,
  isLoading = false,
  onToggleAiForm,
  isAiFormOpen = false,
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
      {/* 56px Search Bar with Backdrop Glow */}
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name, category, or features (e.g. gaming, ANC)..."
          className="w-full h-[56px] bg-slate-900/90 border border-slate-800 focus:border-indigo-500/80 rounded-2xl pl-12 pr-36 sm:pr-40 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shadow-xl shadow-indigo-500/10 backdrop-blur-md transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
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

          {/* Embedded Custom Criteria Form Toggle Button */}
          {onToggleAiForm && (
            <button
              type="button"
              onClick={onToggleAiForm}
              className={`p-2 rounded-xl border transition-all ${
                isAiFormOpen
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/60 hover:bg-slate-800'
              }`}
              title={isAiFormOpen ? 'Close Custom Criteria Form' : 'Open Custom Criteria Form'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Primary Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30 disabled:opacity-70 flex items-center gap-1.5 min-w-[76px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span className="hidden sm:inline">Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick Filter Tags (Subtle Outlined Chips with Spark Icon) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Filters:
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
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/80 ring-1 ring-indigo-500/30 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900'
              } disabled:opacity-50 flex items-center gap-1.5`}
            >
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
