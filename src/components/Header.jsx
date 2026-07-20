import React from 'react';
import { Sparkles, ShoppingCart, Sun, Moon } from 'lucide-react';

export function Header({
  cartCount = 0,
  onOpenCart,
  isDarkMode = true,
  onToggleTheme,
}) {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      isDarkMode
        ? 'bg-slate-950/80 border-slate-800/80 text-white'
        : 'bg-white/80 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Left */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight leading-none transition-colors ${isDarkMode ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'}`}>
              AI Recommender
            </h1>
            <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Shopping Intelligence</p>
          </div>
        </div>

        {/* Right Controls: Cart Icon with Badge + Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Cart Icon with Badge */}
          <button
            onClick={onOpenCart}
            className={`relative p-2.5 rounded-xl border transition-all duration-200 group ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-indigo-500/50'
            }`}
            title="Open Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 transition-colors group-hover:text-indigo-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-indigo-600/40 ring-2 ring-slate-950 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
