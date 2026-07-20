import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export function RecommendationResults({
  recommendations,
  products,
  isLoading,
  error,
  onReset,
}) {
  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-white">Generating Smart Recommendations</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
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
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-white">Ready for AI Recommendations</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
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
      <div className="flex items-center justify-between bg-indigo-950/30 border border-indigo-900/40 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {recommendations.isDemoMode ? 'Demo Recommendation Result' : 'Groq AI Analysis'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{recommendations.summary}</p>
        </div>
        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
          />
        ))}
      </div>
    </div>
  );
}
