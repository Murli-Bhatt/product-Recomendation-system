import React, { useState, useMemo, useEffect } from 'react';
import productsData from './data/products.json';
import { getRecommendations } from './services/groqService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { RecommendationForm } from './components/RecommendationForm';
import { RecommendationResults } from './components/RecommendationResults';
import { CartDrawer } from './components/CartDrawer';
import { useProductRecommender } from './hooks/useProductRecommender';
import { Sparkles, ShoppingBag, RefreshCw, Bot, AlertCircle } from 'lucide-react';

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

  // Theme & Cart State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Dynamically sync document.body background and text color to theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617'; // slate-950
      document.body.style.color = '#f8fafc'; // slate-50
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc'; // slate-50
      document.body.style.color = '#0f172a'; // slate-900
    }
  }, [isDarkMode]);

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

  // Cart Management Handlers
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

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
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
          : 'bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-50 to-slate-100 text-slate-900 selection:bg-indigo-600 selection:text-white'
      }`}
    >
      {/* Navbar Header with Theme & Cart Controls */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        isDarkMode={isDarkMode}
      />

      {/* Standardized Container Max Width and Padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Clean Hero Section & Integrated SearchBar */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] transition-colors ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Explore Cutting-Edge Tech Gear
          </h1>

          {/* SearchBar with expanded h-14 sm:h-16 height and clean glow */}
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
            onToggleAiForm={() => setShowAiRecommender(!showAiRecommender)}
            isAiFormOpen={showAiRecommender}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* Custom Preference Criteria Section */}
        {showAiRecommender && (
          <section className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 backdrop-blur-xl shadow-2xl transition-colors ${
            isDarkMode
              ? 'bg-slate-900/60 border-indigo-500/30 shadow-indigo-950/20'
              : 'bg-white border-indigo-200 shadow-indigo-100/50'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Groq AI Detailed Preference Form
                </h2>
              </div>
              <span className="text-xs text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">
                llama-3.3-70b-versatile
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-4">
                <RecommendationForm
                  preferences={preferences}
                  setPreferences={setPreferences}
                  onSubmit={() => fetchFormRecommendations(preferences)}
                  isLoading={isFormLoading}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="lg:col-span-8">
                <RecommendationResults
                  recommendations={formRecommendations}
                  products={productsData}
                  isLoading={isFormLoading}
                  error={formError}
                  onReset={resetFormRecommendations}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </section>
        )}

        {/* AI Reasoning Insights & Catalog Grid Section (py-16 sm:py-20 spacing) */}
        <section className="space-y-8 pt-4 sm:pt-8">
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
            <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-colors ${
              isDarkMode
                ? 'bg-indigo-950/50 border-indigo-500/40 shadow-indigo-950/30'
                : 'bg-indigo-50 border-indigo-200 shadow-indigo-100'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 shrink-0">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      AI Reasoning Insights
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono">
                      {displayedProducts.length} Items Found
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm mt-0.5 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {reasoning}
                  </p>
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={handleResetFilters}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border shrink-0 ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                Reset Filters
              </button>
            </div>
          )}

          {/* Catalog Controls Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 transition-colors ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-indigo-500 shrink-0" />
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isFiltered ? 'AI Filtered Products' : 'All Products'}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-normal shrink-0 transition-colors ${
                isDarkMode
                  ? 'bg-slate-900/90 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {displayedProducts.length} of {productsData.length} items
              </span>
            </div>

            {/* Category Pills & Reset Button */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category && !isFiltered
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                      : isDarkMode
                      ? 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
            onAddToCart={handleAddToCart}
            isDarkMode={isDarkMode}
          />
        </section>
      </main>

      <footer className={`border-t py-6 text-center text-xs transition-colors ${
        isDarkMode ? 'border-slate-900 bg-slate-950 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <p>Built with Vite, React, Tailwind CSS, & Groq SDK</p>
      </footer>
    </div>
  );
}
