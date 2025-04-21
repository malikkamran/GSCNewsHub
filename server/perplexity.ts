import fetch from 'node-fetch';

if (!process.env.PERPLEXITY_API_KEY) {
  console.warn("Warning: PERPLEXITY_API_KEY is not set. AI-enhanced search will be limited.");
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: {
    message: {
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface EnhancedSearchResult {
  enhancedQuery: string;
  relatedTerms: string[];
  enhancementType: 'semantic' | 'natural-language' | 'standard';
  confidenceScore: number;
  queryContext?: string;
}

/**
 * Enhances a search query using Perplexity AI
 * @param originalQuery - The original user search query
 * @returns Enhanced search query information
 */
export async function enhanceSearchQuery(originalQuery: string): Promise<EnhancedSearchResult> {
  // Default response with original query if API call fails
  const defaultResponse: EnhancedSearchResult = {
    enhancedQuery: originalQuery,
    relatedTerms: [],
    enhancementType: 'standard',
    confidenceScore: 1.0
  };

  try {
    if (!process.env.PERPLEXITY_API_KEY || originalQuery.trim().length === 0) {
      return defaultResponse;
    }

    console.log(`Enhancing search query: "${originalQuery}"`);
    
    const systemPrompt = `You are a specialized search query analyzer for a supply chain news website.
Your job is to analyze user search queries and:
1. Determine if this is a natural language question or a keyword search
2. Extract the most relevant supply chain/logistics keywords
3. Identify related terms that should also be searched
4. Provide a confidence score (0.0-1.0) for your understanding
5. Generate a clean, enhanced search query that will yield the best results

Format your response as a JSON object with these properties:
- enhancedQuery: String - The enhanced search query
- relatedTerms: Array of Strings - Related keywords
- enhancementType: String - Either "semantic" for meaning-based enhancement or "natural-language" for question parsing
- confidenceScore: Number - From 0.0 to 1.0
- queryContext: String - Brief explanation of what you think the user is looking for`;

    const messages: PerplexityMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: originalQuery }
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages,
        temperature: 0.2,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`);
      const errorData = await response.text();
      console.error(`Error details: ${errorData}`);
      return defaultResponse;
    }

    const data = await response.json() as PerplexityResponse;

    // Parse the AI response
    try {
      const aiResponseText = data.choices[0].message.content;
      const aiResponse = JSON.parse(aiResponseText) as EnhancedSearchResult;
      
      console.log(`Enhanced query: "${aiResponse.enhancedQuery}"`);
      console.log(`Related terms: ${aiResponse.relatedTerms.join(', ')}`);
      
      return {
        enhancedQuery: aiResponse.enhancedQuery || originalQuery,
        relatedTerms: Array.isArray(aiResponse.relatedTerms) ? aiResponse.relatedTerms : [],
        enhancementType: aiResponse.enhancementType || 'standard',
        confidenceScore: typeof aiResponse.confidenceScore === 'number' ? 
          Math.max(0, Math.min(1, aiResponse.confidenceScore)) : 0.8,
        queryContext: aiResponse.queryContext
      };
    } catch (err) {
      console.error('Error parsing AI response:', err);
      console.error('Raw response:', data.choices[0].message.content);
      return defaultResponse;
    }
  } catch (error) {
    console.error('Error enhancing search query:', error);
    return defaultResponse;
  }
}