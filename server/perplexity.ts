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
      
      // Try regular JSON parsing first
      try {
        // Check if the response is JSON inside a markdown code block
        const jsonCodeBlockMatch = aiResponseText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
        let jsonText = aiResponseText;
        
        if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
          console.log("Found JSON in code block, extracting...");
          jsonText = jsonCodeBlockMatch[1].trim();
        }
        
        const aiResponse = JSON.parse(jsonText) as EnhancedSearchResult;
        
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
      } catch (jsonError) {
        // If JSON parsing fails, try to extract information from markdown format
        console.log("Attempting to parse markdown-formatted response");
        
        // Extract enhanced query from different formats
        let enhancedQuery = originalQuery;
        
        // Try JSON format first - with quotes
        const enhancedQueryJsonMatch = aiResponseText.match(/enhancedQuery['":\s]*["']([^"']+)["']/i);
        if (enhancedQueryJsonMatch && enhancedQueryJsonMatch[1]) {
          enhancedQuery = enhancedQueryJsonMatch[1];
        } else {
          // Try markdown format - look for patterns like "- **enhancedQuery**: text"
          const enhancedQueryMdMatch = aiResponseText.match(/-\s*\*\*enhancedQuery\*\*:\s*(?:"([^"]+)"|"?([^"\n]+)"?)/i);
          if (enhancedQueryMdMatch) {
            // Use either the quoted match or the unquoted match
            enhancedQuery = enhancedQueryMdMatch[1] || enhancedQueryMdMatch[2] || originalQuery;
          }
        }
        
        // Extract related terms - using a non-greedy pattern without 's' flag
        let relatedTerms: string[] = [];
        // Look for JSON array format first
        const jsonArrayMatch = aiResponseText.match(/relatedTerms['":\s]*\[(.*?)\]/i);
        
        if (jsonArrayMatch && jsonArrayMatch[1]) {
          const termsText = jsonArrayMatch[1];
          // Match all quoted strings inside the array
          const matches = termsText.match(/"([^"]+)"|'([^']+)'/g);
          if (matches) {
            relatedTerms = matches.map(m => m.replace(/["']/g, ''));
          }
        } 
        
        // If no results, try to find markdown list format (- item1\n- item2)
        if (relatedTerms.length === 0) {
          const listMatches = aiResponseText.match(/relatedTerms.*?\n((?:-\s*(?:.*?)\n)+)/i);
          if (listMatches && listMatches[1]) {
            // Extract items from bulleted list
            const listText = listMatches[1];
            const listItems = listText.match(/-\s*(.*?)(?:\n|$)/g);
            if (listItems) {
              relatedTerms = listItems.map(item => {
                // Clean up the item text - remove dash, whitespace, and quotes
                return item.replace(/^-\s*/, '').replace(/["']/g, '').trim();
              }).filter(item => item.length > 0);
            }
          }
        }
        
        // Extract enhancement type
        const typeMatch = aiResponseText.match(/enhancementType['":\s]*["']([^"']+)["']/i);
        let enhancementType: 'semantic' | 'natural-language' | 'standard' = 'standard';
        
        if (typeMatch) {
          const extractedType = typeMatch[1].toLowerCase();
          if (extractedType === 'semantic' || extractedType === 'natural-language') {
            enhancementType = extractedType as 'semantic' | 'natural-language';
          }
        }
        
        // Extract confidence score
        const scoreMatch = aiResponseText.match(/confidenceScore['":\s]*([\d.]+)/i);
        const confidenceScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0.8;
        
        // Extract query context - try multiple formats
        let queryContext: string | undefined = undefined;
        
        // Try JSON format first
        const contextJsonMatch = aiResponseText.match(/queryContext['":\s]*["']([^"']+)["']/i);
        if (contextJsonMatch && contextJsonMatch[1]) {
          queryContext = contextJsonMatch[1];
        } else {
          // Try markdown format (- **queryContext**: text)
          const contextMdMatch = aiResponseText.match(/-\s*\*\*queryContext\*\*:\s*(?:"([^"]+)"|([^"\n]+))/i);
          if (contextMdMatch) {
            queryContext = (contextMdMatch[1] || contextMdMatch[2] || "").trim();
          } else {
            // Look for paragraphs after headings that mention context
            const contextParagraphMatch = aiResponseText.match(/(?:###\s*(?:Context|Query Context|User(?:\s*is)?)).*?\n(.*?)(?:\n\n|\n###|$)/i);
            if (contextParagraphMatch && contextParagraphMatch[1]) {
              queryContext = contextParagraphMatch[1].trim();
            }
          }
        }
        
        console.log(`Enhanced query (from markdown): "${enhancedQuery}"`);
        console.log(`Related terms (from markdown): ${relatedTerms.join(', ')}`);
        
        return {
          enhancedQuery,
          relatedTerms,
          enhancementType,
          confidenceScore: Math.max(0, Math.min(1, confidenceScore)),
          queryContext
        };
      }
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