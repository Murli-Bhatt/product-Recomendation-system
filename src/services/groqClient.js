import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

// Initialize Groq SDK client
export const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Required for client-side API requests in Vite
});

/**
 * Request AI-powered product recommendations based on user preferences and product catalog.
 * @param {Array} products - List of available catalog products
 * @param {Object} preferences - User preferences (category, budget, targetUse, description)
 * @returns {Promise<Array>} Recommended products with reasons
 */
export async function getProductRecommendations(products, preferences) {
  if (!apiKey) {
    throw new Error('Groq API Key is missing. Please set VITE_GROQ_API_KEY in your .env file.');
  }

  const prompt = `
You are an expert AI Shopping Assistant and Product Recommender.
Analyze the following product catalog and user preferences to recommend the top 3 best-matching products.

User Preferences:
- Preferred Category: ${preferences.category || 'Any'}
- Maximum Budget: $${preferences.budget || 'Unlimited'}
- Intended Use: ${preferences.targetUse || 'General use'}
- User Notes: ${preferences.description || 'None'}

Catalog Products:
${JSON.stringify(products, null, 2)}

Return your response in pure JSON format without markdown code fences, matching this schema:
{
  "recommendations": [
    {
      "productId": "id of recommended product",
      "matchScore": 95,
      "reason": "Clear explanation of why this fits user preferences",
      "keyHighlight": "Standout feature relevant to user request"
    }
  ],
  "summary": "Brief summary of recommendations"
}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an intelligent product recommendation engine. Always respond in valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Received empty response from Groq API');
  }

  return JSON.parse(content);
}
