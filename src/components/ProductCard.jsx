import React from 'react';
import { Star, Tag } from 'lucide-react';

export function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="h-full group rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          <span className="absolute bottom-3 right-3 text-sm font-bold text-white bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-800">
            ${product.price}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
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

      <div className="px-5 pb-5 pt-1">
        <button className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 border border-slate-700/50 hover:border-indigo-500/50 shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
