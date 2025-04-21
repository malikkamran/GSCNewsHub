import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Search, FileText, Tag, Calendar, Eye, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Article as BaseArticle, Category } from "@/lib/types";

// Extended Article interface with category property added by the search API
interface ArticleWithCategory extends BaseArticle {
  category?: Category;
  publishedBy?: string; // Add publishedBy field which might be returned by the search API
}

interface SearchResult {
  articles: ArticleWithCategory[];
  total: number;
}

// Utility function to highlight matched terms in text
function highlightSearchTerms(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  
  const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
  
  // If no valid terms, return original text
  if (terms.length === 0) return text;
  
  // Escape special regex characters in search terms
  const escapedTerms = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  // Create regex pattern with word boundaries where possible
  const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  
  // Split text by the pattern
  const parts = text.split(pattern);
  
  // Map parts to either regular text or highlighted spans
  return parts.map((part, index) => {
    // Check if this part matches any search term (case insensitive)
    const isMatch = terms.some(term => part.toLowerCase().includes(term));
    
    return isMatch ? (
      <span key={index} className="bg-yellow-100 font-medium">
        {part}
      </span>
    ) : (
      part
    );
  });
}

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "";
  
  // Track detailed match reasons
  const [matchReasons, setMatchReasons] = useState<{[key: number]: string[]}>({});
  
  // Use a separate function to handle search success to avoid TypeScript error with the onSuccess callback
  const processSearchResults = (data: SearchResult) => {
    // Extract basic match info from search results for the tooltip
    const reasons: {[key: number]: string[]} = {};
    
    data.articles.forEach((article: ArticleWithCategory) => {
      const articleReasons: string[] = [];
      
      // Check different parts of the article
      if (article.title.toLowerCase().includes(query.toLowerCase())) {
        articleReasons.push("Title match");
      }
      
      if (article.summary.toLowerCase().includes(query.toLowerCase())) {
        articleReasons.push("Summary match");
      }
      
      if (article.content.toLowerCase().includes(query.toLowerCase())) {
        articleReasons.push("Content match");
      }
      
      if (article.category && article.category.name.toLowerCase().includes(query.toLowerCase())) {
        articleReasons.push("Category match");
      }
      
      if (article.publishedBy && article.publishedBy.toLowerCase().includes(query.toLowerCase())) {
        articleReasons.push("Publisher match");
      }
      
      reasons[article.id] = articleReasons.length ? articleReasons : ["Relevant match"];
    });
    
    setMatchReasons(reasons);
  };

  const { data: searchResults, isLoading, error } = useQuery<SearchResult, Error>({
    queryKey: ["/api/search", query],
    enabled: query.length > 0
  });
  
  // Process search results whenever they change
  useEffect(() => {
    if (searchResults) {
      processSearchResults(searchResults);
    }
  }, [searchResults, query]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Search error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>{query ? `${query} - Search Results` : "Search"} | GSC Supply Chain News</title>
        <meta
          name="description"
          content={`Search results for "${query}" on GSC Supply Chain News - Find the latest supply chain articles and insights.`}
        />
      </Helmet>

      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Search className="mr-2 h-6 w-6 text-[#BB1919]" />
                {query ? "Search Results" : "Search GSC Supply Chain News"}
              </h1>
              
              {query && (
                <p className="text-lg text-gray-600">
                  {searchResults?.total 
                    ? `Showing ${searchResults.total} result${searchResults.total !== 1 ? 's' : ''} for "${query}"`
                    : isLoading 
                      ? "Searching..." 
                      : `No results found for "${query}"`}
                </p>
              )}
            </div>

            {/* Search form */}
            <div className="mb-8">
              <form 
                className="flex gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const searchQuery = formData.get("search") as string;
                  if (searchQuery.trim()) {
                    setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <div className="flex-1">
                  <input
                    type="text"
                    name="search"
                    defaultValue={query}
                    placeholder="Search for articles, topics, or keywords..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB1919]"
                  />
                </div>
                <Button type="submit" className="bg-[#BB1919] hover:bg-[#A00000]">
                  Search
                </Button>
              </form>
            </div>

            {/* Results area */}
            <div className="space-y-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : query && searchResults && searchResults.articles && searchResults.articles.length > 0 ? (
                // Search results
                searchResults.articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#BB1919]">
                          <a 
                            href={`/article/${article.slug}`} 
                            className="hover:underline"
                          >
                            {highlightSearchTerms(article.title, query)}
                          </a>
                        </h2>
                        
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3 gap-x-4 gap-y-2">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(article.publishedAt), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {article.views} views
                          </span>
                          <span className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {article.category ? (
                              <Badge 
                                variant="outline" 
                                className="bg-[#BB1919] text-white hover:bg-[#A00000] cursor-pointer"
                                onClick={() => article.category?.slug && setLocation(`/category/${article.category.slug}`)}
                              >
                                {article.category?.name || "Category"}
                              </Badge>
                            ) : (
                              <Badge 
                                variant="outline" 
                                className="bg-gray-500 text-white"
                              >
                                Uncategorized
                              </Badge>
                            )}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center cursor-help">
                                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                                  <span className="sr-only">Match info</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs bg-gray-900 text-white">
                                <div className="text-sm">
                                  <p className="font-semibold border-b pb-1 mb-1">Match information:</p>
                                  <ul className="list-disc pl-4 space-y-1 text-xs">
                                    {matchReasons[article.id]?.map((reason, idx) => (
                                      <li key={idx}>{reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {highlightSearchTerms(article.summary, query)}
                        </p>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="link" 
                            className="text-[#BB1919] p-0 hover:underline flex items-center"
                            onClick={() => setLocation(`/article/${article.slug}`)}
                          >
                            Read article
                            <FileText className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : query ? (
                // No results
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any articles matching "{query}". Please try another search term.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      className="border-[#BB1919] text-[#BB1919] hover:bg-[#BB1919] hover:text-white"
                      onClick={() => setLocation("/")}
                    >
                      Return to homepage
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty state - no search performed yet
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔎</div>
                  <h2 className="text-2xl font-semibold mb-2">Enter a search term</h2>
                  <p className="text-gray-600">
                    Type a keyword above to search for articles, topics, or specific content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}