import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

// Initialize Groq SDK client safely
export const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

/**
 * Recommend product IDs matching user requirements using Groq Llama 3.3 model.
 * 
 * @param {string} userQuery - The user's prompt or preference description
 * @param {Array} productCatalog - Complete list of catalog items
 * @returns {Promise<{ recommendedIds: string[], reasoning: string, isFallback?: boolean, error?: string }>}
 */
export async function getRecommendations(userQuery, productCatalog) {
  // Check offline status first
  if (typeof window !== 'undefined' && navigator && !navigator.onLine) {
    return handleFallback(
      userQuery,
      productCatalog,
      'You are currently offline. Showing local catalog matches.'
    );
  }

  // Gracefully handle missing API key without throwing raw errors to UI
  if (!apiKey || apiKey.trim() === '') {
    return handleFallback(
      userQuery,
      productCatalog,
      'Groq API Key is missing in .env. Displaying smart fallback recommendations.'
    );
  }

  const queryText = (userQuery || '').trim();
  if (!queryText) {
    return {
      recommendedIds: productCatalog.map((p) => String(p.id)),
      reasoning: 'Displaying full product catalog.',
      isFallback: true,
    };
  }

  const systemPrompt = `You are a strict product filtering assistant. You will be provided with a catalog of products in JSON format.

Product Catalog:
${JSON.stringify(productCatalog, null, 2)}

Strict Rules:
1. Match the user's requirements strictly against the products provided in the catalog.
2. Return ONLY product IDs ("id" field) that exist in the provided catalog. DO NOT invent or fabricate any product IDs.
3. If no product matches the criteria, return an empty array for recommendedIds.
4. You MUST respond strictly in valid JSON format matching this exact schema:
{
  "recommendedIds": ["id1", "id2"],
  "reasoning": "Brief explanation of why these products match the request."
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: queryText,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2, // Low temperature for deterministic anti-hallucination output
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response received from Groq API');
    }

    const parsed = JSON.parse(content);

    // Anti-hallucination double check: Filter returned IDs against actual catalog IDs
    const validCatalogIds = new Set(productCatalog.map((p) => String(p.id)));
    const safeRecommendedIds = Array.isArray(parsed.recommendedIds)
      ? parsed.recommendedIds.map(String).filter((id) => validCatalogIds.has(id))
      : [];

    return {
      recommendedIds: safeRecommendedIds,
      reasoning:
        safeRecommendedIds.length > 0
          ? parsed.reasoning || `AI matched ${safeRecommendedIds.length} products.`
          : `No products in catalog matched "${queryText}".`,
      isFallback: false,
    };
  } catch (error) {
    console.error('Groq API Service Error:', error);

    let message = 'Unable to connect to Groq AI engine. Showing filtered catalog items.';
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      message = 'Groq API rate limit reached. Displaying local fallback matches.';
    } else if (error?.status === 401 || error?.message?.includes('API key')) {
      message = 'Invalid Groq API Key. Displaying local fallback matches.';
    }

    return handleFallback(queryText, productCatalog, message);
  }
}

/**
 * Fallback recommendation algorithm when API is unavailable or unconfigured
 */
function handleFallback(userQuery, catalog, reasonMessage) {
  const queryLower = (userQuery || '').toLowerCase();
  const matched = catalog.filter((p) => {
    if (!queryLower) return true;
    return (
      p.name.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower)
    );
  });

  const fallbackIds = (matched.length > 0 ? matched : catalog)
    .slice(0, 3)
    .map((p) => String(p.id));

  return {
    recommendedIds: fallbackIds,
    reasoning: reasonMessage,
    isFallback: true,
  };
}
