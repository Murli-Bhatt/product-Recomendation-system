import React from 'react';
import { Sparkles, ShoppingBag, Cpu } from 'lucide-react';

export function Header() {
  const apiKeyPresent = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Groq Recommender
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">AI-Powered Shopping Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">Model:</span>
            <span className="text-indigo-400 font-mono font-medium">llama-3.3-70b</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-950">
            <span className={`w-2 h-2 rounded-full ${apiKeyPresent ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={apiKeyPresent ? 'text-emerald-400' : 'text-amber-400'}>
              {apiKeyPresent ? 'Groq Active' : 'Demo Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
