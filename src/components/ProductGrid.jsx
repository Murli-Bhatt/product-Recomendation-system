import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageSearch, RefreshCw } from 'lucide-react';

export function ProductGrid({
  products = [],
  isLoading = false,
  onResetSearch,
  onAddToCart,
  isDarkMode = true,
}) {
  // Skeleton loader for loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border overflow-hidden animate-pulse flex flex-col justify-between ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className={`aspect-video w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`h-3 w-20 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-4 w-12 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
                <div className={`h-5 w-3/4 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className="space-y-1.5 pt-1">
                  <div className={`h-3 w-full rounded ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
                  <div className={`h-3 w-5/6 rounded ${isDarkMode ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className={`h-10 w-full rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state if no products match
  if (!products || products.length === 0) {
    return (
      <div
        className={`border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[320px] space-y-4 ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <PackageSearch className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold">No Products Found</h3>
          <p className={`text-xs max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            We couldn't find any products matching your query or selected filters. Try searching for something else or clear your filters.
          </p>
        </div>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters & Search
          </button>
        )}
      </div>
    );
  }

  // Responsive CSS grid of cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}
