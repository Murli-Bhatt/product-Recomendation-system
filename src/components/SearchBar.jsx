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
  isDarkMode = true,
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
      {/* Expanded h-14 sm:h-16 Search Bar with Clean Glow & Theme Support */}
      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <div className="absolute left-4 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name, category, or features (e.g. gaming, ANC)..."
          className={`w-full h-14 sm:h-16 border rounded-2xl pl-12 pr-36 sm:pr-40 text-sm focus:outline-none transition-all shadow-xl ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-800/80 text-white placeholder-slate-500 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/30 shadow-indigo-500/10'
              : 'bg-white border-slate-200/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-indigo-500/5'
          }`}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
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
              className={`p-2.5 rounded-xl border transition-all ${
                isAiFormOpen
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : isDarkMode
                  ? 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/60 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-200/60'
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

      {/* Quick Filter Tags (Refined Outline Chips with Spark Icon) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-xs font-semibold flex items-center gap-1 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Filters:
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
                  ? isDarkMode
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/80 ring-1 ring-indigo-500/30 shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
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
