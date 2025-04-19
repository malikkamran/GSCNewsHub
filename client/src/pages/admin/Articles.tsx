import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  List,
  Eye,
  Calendar,
  Filter,
  X,
  StarIcon,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ArticlesPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [featuredFilter, setFeaturedFilter] = useState<string>("");
  
  // Get all articles with pagination
  const { 
    data: articles = [], 
    isLoading: articlesLoading,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });
  
  // Get all categories for filter dropdown
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });
  
  // Handle delete article
  const handleDeleteArticle = async (id: number) => {
    try {
      await apiRequest(`/api/articles/${id}`, {
        method: "DELETE",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["/api/articles"],
      });
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Create a new article
  const handleCreateArticle = () => {
    setLocation("/admin/articles/create");
  };
  
  // Edit an article
  const handleEditArticle = (id: number) => {
    setLocation(`/admin/articles/edit/${id}`);
  };
  
  // Handle clearing filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setFeaturedFilter("");
  };
  
  // Filter articles based on search and category
  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = 
      !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      !categoryFilter || 
      article.categoryId.toString() === categoryFilter;
      
    const matchesFeatured = 
      featuredFilter === "" ||
      (featuredFilter === "true" && article.featured) ||
      (featuredFilter === "false" && !article.featured);
      
    return matchesSearch && matchesCategory && matchesFeatured;
  });
  
  // Sort articles by publication date (newest first)
  const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedArticles.length / pageSize);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Articles | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Article Management</h1>
          <p className="text-gray-600">Manage your news articles</p>
        </div>
        <Button 
          onClick={handleCreateArticle}
          className="bg-[#BB1919] hover:bg-[#A10000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Filters</CardTitle>
            {(searchQuery || categoryFilter || featuredFilter) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by featured status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Articles</SelectItem>
                  <SelectItem value="true">Featured Only</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            {filteredArticles.length > 0 
              ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredArticles.length)} of ${filteredArticles.length} articles`
              : "No articles found"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articlesLoading || categoriesLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <List className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Articles</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || categoryFilter || featuredFilter
                  ? "No articles match your search criteria"
                  : "Get started by creating your first article"
                }
              </p>
              {(searchQuery || categoryFilter || featuredFilter) && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedArticles.map((article: any) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium flex items-center gap-1">
                            {article.title}
                            {article.featured && (
                              <Badge className="ml-1" variant="outline">
                                <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {article.summary}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {getCategoryName(article.categoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(article.publishedAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{article.views}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleEditArticle(article.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this article? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteArticle(article.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredArticles.length > pageSize && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </AdminLayout>
  );
}