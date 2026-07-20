import React from 'react';
import { Star, Tag, ShoppingCart } from 'lucide-react';

export function ProductCard({ product, onAddToCart, isDarkMode = true }) {
  if (!product) return null;

  return (
    <div
      className={`h-full group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800/80 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 text-slate-100'
          : 'bg-white border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-300 text-slate-900'
      }`}
    >
      <div className="flex-1 flex flex-col">
        {/* Crisp Product Image (No dark gradient overlay) */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950/20 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Card Body with Refined Text Hierarchy */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
            </div>

            <h3 className={`text-base font-bold line-clamp-1 transition-colors ${
              isDarkMode ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'
            }`}>
              {product.name}
            </h3>

            <p className={`text-xs line-clamp-2 leading-relaxed ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Card Footer with Dominant Price & Add to Cart Button */}
      <div className={`p-5 pt-0 flex items-center justify-between gap-3 border-t mt-2 ${
        isDarkMode ? 'border-slate-800/60' : 'border-slate-100'
      }`}>
        <div className="flex flex-col">
          <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Price</span>
          <span className={`text-xl font-extrabold font-mono leading-none ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ${product.price}
          </span>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-600/25 active:scale-95 shrink-0"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
