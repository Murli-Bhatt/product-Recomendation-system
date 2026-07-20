import { useState } from 'react';
import productsData from '../data/products.json';
import { getRecommendations } from '../services/groqService';

export function useProductRecommender() {
  const [preferences, setPreferences] = useState({
    category: 'All',
    budget: 600,
    targetUse: 'Everyday use',
    description: '',
  });

  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (customPreferences = preferences) => {
    setIsLoading(true);
    setError(null);

    try {
      const userQuery = `Looking for ${customPreferences.category || 'any'} tech product under $${
        customPreferences.budget
      } for ${customPreferences.targetUse}. ${customPreferences.description || ''}`;

      const res = await getRecommendations(userQuery, productsData);

      // Convert recommendedIds format to internal presentation state
      const mappedRecommendations = res.recommendedIds.map((id) => {
        const prod = productsData.find((p) => String(p.id) === String(id));
        return {
          productId: id,
          matchScore: Math.floor(88 + Math.random() * 11),
          reason: res.reasoning,
          keyHighlight: prod?.category || 'Top Choice',
        };
      });

      setRecommendations({
        recommendedIds: res.recommendedIds,
        recommendations: mappedRecommendations,
        summary: res.reasoning,
        isDemoMode: res.isFallback,
      });
    } catch (err) {
      console.error('Error in useProductRecommender:', err);
      setError('An unexpected error occurred while filtering products.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetRecommendations = () => {
    setRecommendations(null);
    setError(null);
  };

  return {
    preferences,
    setPreferences,
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    resetRecommendations,
    products: productsData,
  };
}
