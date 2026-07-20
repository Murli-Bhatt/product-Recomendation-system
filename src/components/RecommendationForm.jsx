import React from 'react';
import { CATEGORIES } from '../data/sampleProducts';
import { Sliders, Sparkles, DollarSign, Target, FileText } from 'lucide-react';

export function RecommendationForm({
  preferences,
  setPreferences,
  onSubmit,
  isLoading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Your Preferences</h2>
        </div>
        <span className="text-xs text-slate-500">Customize AI Matching</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Target Category
          </label>
          <select
            name="category"
            value={preferences.category}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-2">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Budget
            </span>
            <span className="text-emerald-400 font-bold">${preferences.budget}</span>
          </div>
          <input
            type="range"
            name="budget"
            min="50"
            max="1000"
            step="25"
            value={preferences.budget}
            onChange={handleChange}
            className="w-full accent-indigo-500 cursor-pointer bg-slate-950 h-2 rounded-lg"
          />
        </div>

        {/* Target Use */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-400" /> Primary Use Case
          </label>
          <input
            type="text"
            name="targetUse"
            value={preferences.targetUse}
            onChange={handleChange}
            placeholder="e.g. Remote work, Gym fitness, Espresso making"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> Specific Requirements
          </label>
          <textarea
            name="description"
            rows="3"
            value={preferences.description}
            onChange={handleChange}
            placeholder="e.g. Needs long battery life and lightweight design"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Catalog with Groq...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Get AI Recommendations</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
