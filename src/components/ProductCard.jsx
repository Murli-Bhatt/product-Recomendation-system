import React from 'react';
import { Star, Tag, ShoppingCart } from 'lucide-react';

export function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="h-full group rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {/* Product Image without dark gradient overlays */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-900/40 font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {product.name}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Card Footer with Price and Add to Cart Button */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/40 mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium">Price</span>
          <span className="text-lg font-extrabold text-white font-mono leading-none">
            ${product.price}
          </span>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-600/25 active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
