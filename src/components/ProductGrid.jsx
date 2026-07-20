import React from 'react';
import { ProductCard } from './ProductCard';
import { PackageSearch, RefreshCw } from 'lucide-react';

export function ProductGrid({ products = [], isLoading = false, onResetSearch }) {
  // Skeleton loader for loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden animate-pulse flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video w-full bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-800 rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-slate-800 rounded" />
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full bg-slate-800/60 rounded" />
                  <div className="h-3 w-5/6 bg-slate-800/60 rounded" />
                </div>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="h-8 w-full bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state if no products match
  if (!products || products.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
          <PackageSearch className="w-7 h-7 text-indigo-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">No Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            We couldn't find any products matching your query or selected filters. Try searching for something else or clear your filters.
          </p>
        </div>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
