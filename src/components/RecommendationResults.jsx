import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export function RecommendationResults({
  recommendations,
  products,
  isLoading,
  error,
  onReset,
  isDarkMode = true,
}) {
  if (isLoading) {
    return (
      <div className={`border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold">Generating Smart Recommendations</h3>
        <p className={`text-sm max-w-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Groq AI is processing your preferences and scanning product features...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-base font-semibold text-rose-200">Recommendation Failed</h3>
        <p className="text-xs text-rose-300/80 mt-1 max-w-md">{error}</p>
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className={`border rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px] transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold">Ready for AI Recommendations</h3>
        <p className={`text-xs max-w-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Adjust parameters on the left and click "Get AI Recommendations" to receive tailored suggestions powered by Groq.
        </p>
      </div>
    );
  }

  // Map recommendation objects back to full product details
  const recMap = new Map(
    recommendations.recommendations.map((rec) => [rec.productId, rec])
  );

  const recommendedProducts = products.filter((p) => recMap.has(p.id));

  return (
    <div className="space-y-6">
      <div className={`border rounded-2xl p-4 flex items-center justify-between transition-colors ${
        isDarkMode
          ? 'bg-indigo-950/30 border-indigo-900/40 text-slate-100'
          : 'bg-indigo-50/80 border-indigo-200 text-slate-900'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
              {recommendations.isDemoMode ? 'Demo Recommendation Result' : 'Groq AI Analysis'}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {recommendations.summary}
          </p>
        </div>
        <button
          onClick={onReset}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="Reset recommendations"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            matchData={recMap.get(product.id)}
            isRecommended={true}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
