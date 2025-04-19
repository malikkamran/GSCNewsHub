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
import { ChevronRight, Search, FileText, Tag, Calendar, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Article } from "@/lib/types";

interface SearchResult {
  articles: Article[];
  total: number;
}

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "";
  
  const { data: searchResults, isLoading, error } = useQuery<SearchResult>({
    queryKey: ["/api/search", query],
    enabled: query.length > 0,
  });
  
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
              ) : query && searchResults?.articles?.length > 0 ? (
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
                            {article.title}
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
                            <Badge 
                              variant="outline" 
                              className="bg-[#BB1919] text-white hover:bg-[#A00000]"
                            >
                              {article.categoryId}
                            </Badge>
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {article.summary}
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