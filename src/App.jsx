import React, { useState, useMemo } from 'react';
import productsData from './data/products.json';
import { getRecommendations } from './services/groqService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { RecommendationForm } from './components/RecommendationForm';
import { RecommendationResults } from './components/RecommendationResults';
import { useProductRecommender } from './hooks/useProductRecommender';
import { Sparkles, ShoppingBag, SlidersHorizontal, RefreshCw, Bot, AlertCircle } from 'lucide-react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState({
    label: 'All Products',
    query: '',
    maxPrice: null,
    category: 'All',
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAiRecommender, setShowAiRecommender] = useState(false);

  // States required by prompt for AI Search & Recommendation
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [reasoning, setReasoning] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  // Hook state for optional form-based recommender
  const {
    preferences,
    setPreferences,
    recommendations: formRecommendations,
    isLoading: isFormLoading,
    error: formError,
    fetchRecommendations: fetchFormRecommendations,
    resetRecommendations: resetFormRecommendations,
  } = useProductRecommender();

  // Execute Groq API search when user submits query in SearchBar
  const handleSearchSubmit = async (queryToSubmit) => {
    const query = (queryToSubmit !== undefined ? queryToSubmit : searchTerm).trim();

    if (!query) {
      handleResetFilters();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getRecommendations(query, productsData);
      setRecommendedIds(res.recommendedIds || []);
      setReasoning(
        res.reasoning || `AI matched ${res.recommendedIds?.length || 0} products for "${query}".`
      );
      setIsFiltered(true);
    } catch (err) {
      console.error('Search AI Error:', err);
      setError('An error occurred while getting recommendations. Showing standard search results.');
      setIsFiltered(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all filters and return to full catalog
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setActiveQuickFilter({ label: 'All Products', query: '', maxPrice: null, category: 'All' });
    setRecommendedIds([]);
    setReasoning('');
    setIsFiltered(false);
    setError(null);
  };

  // Filter products list based on AI recommendedIds (if filtered) + category pill
  const displayedProducts = useMemo(() => {
    if (isFiltered) {
      const recSet = new Set(recommendedIds);
      return productsData.filter((p) => recSet.has(String(p.id)));
    }

    return productsData.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesMaxPrice =
        !activeQuickFilter.maxPrice || product.price <= activeQuickFilter.maxPrice;

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesMaxPrice && matchesSearch;
    });
  }, [isFiltered, recommendedIds, selectedCategory, activeQuickFilter, searchTerm]);

  const categories = ['All', 'Phones', 'Laptops', 'Headphones', 'Smartwatches'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section & SearchBar */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Tech Store & AI Assistant
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Explore Cutting-Edge Tech Gear
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Search our catalog using natural language. Groq AI will analyze your query and filter matching products instantly.
          </p>

          {/* SearchBar Component */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            activeFilterTag={activeQuickFilter}
            onSelectQuickFilter={(filter) => {
              setActiveQuickFilter(filter);
              if (filter.category) setSelectedCategory(filter.category);
            }}
            isLoading={isLoading}
          />

          <div className="pt-2">
            <button
              onClick={() => setShowAiRecommender(!showAiRecommender)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showAiRecommender ? 'Hide Custom Criteria Form' : 'Open Custom Criteria Form'}
            </button>
          </div>
        </section>

        {/* Form-based Custom Criteria Section */}
        {showAiRecommender && (
          <section className="bg-slate-900/50 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Groq AI Detailed Preference Form</h2>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-full font-mono">
                llama-3.3-70b-versatile
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <RecommendationForm
                  preferences={preferences}
                  setPreferences={setPreferences}
                  onSubmit={() => fetchFormRecommendations(preferences)}
                  isLoading={isFormLoading}
                />
              </div>

              <div className="lg:col-span-8">
                <RecommendationResults
                  recommendations={formRecommendations}
                  products={productsData}
                  isLoading={isFormLoading}
                  error={formError}
                  onReset={resetFormRecommendations}
                />
              </div>
            </div>
          </section>
        )}

        {/* AI Reasoning Badge & Active Filters Header */}
        <section className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 flex items-center justify-between text-rose-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs"
              >
                Clear
              </button>
            </div>
          )}

          {/* AI Reasoning Badge */}
          {isFiltered && reasoning && (
            <div className="bg-indigo-950/50 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-indigo-950/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      AI Reasoning Insights
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                      {displayedProducts.length} Items Found
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium">
                    {reasoning}
                  </p>
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700/60 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                Reset Filters
              </button>
            </div>
          )}

          {/* Catalog Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">
                {isFiltered ? 'AI Filtered Products' : 'All Products'}
              </h2>
              <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 font-medium">
                {displayedProducts.length} of {productsData.length} items
              </span>
            </div>

            {/* Category Pills & Reset Button */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3 h-3" /> Clear AI Filter
                </button>
              )}

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    if (isFiltered) {
                      setIsFiltered(false);
                      setReasoning('');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category && !isFiltered
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* ProductGrid Component */}
          <ProductGrid
            products={displayedProducts}
            isLoading={isLoading}
            onResetSearch={handleResetFilters}
          />
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Built with Vite, React, Tailwind CSS, & Groq SDK</p>
      </footer>
    </div>
  );
}
