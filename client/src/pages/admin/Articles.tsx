import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import {
  FileText,
  Search,
  Edit,
  Trash2,
  Star,
  Plus,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check, 
  CheckCircle,
  X,
  ArrowUpDown,
  BarChart,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ArticlesPage() {
  // State for UI and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [articleToDeleteDetails, setArticleToDeleteDetails] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const itemsPerPage = 10;
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, sortBy]);
  
  // Fetch articles - add status filter to the query when it's set
  const {
    data: articles = [],
    isLoading: articlesLoading,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: [statusFilter !== "all" 
      ? `/api/articles?status=${statusFilter}` 
      : "/api/articles"],
    retry: false,
    refetchOnWindowFocus: false
  });
  
  // Fetch categories for filter dropdown
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });
  
  const isLoading = articlesLoading || categoriesLoading;

  // Handle deleting an article
  const handleDelete = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/articles/${id}`);
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
      
      // Refresh article list - invalidate all article queries
      queryClient.invalidateQueries({
        queryKey: ["/api/articles"],
        exact: false
      });
      
      // Clear state
      setShowDeleteDialog(false);
      setArticleToDelete(null);
      setArticleToDeleteDetails(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Confirm article deletion
  const confirmDelete = (id: number) => {
    const articleDetails = articles.find((article: any) => article.id === id);
    setArticleToDelete(id);
    setArticleToDeleteDetails(articleDetails);
    setShowDeleteDialog(true);
  };

  // Navigate to edit article page
  const handleEdit = (id: number) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  // Log received articles and their statuses
  useEffect(() => {
    if (articles && articles.length > 0) {
      console.log("Received articles:", articles.length);
      console.log("Articles with statuses:", articles.map((a: any) => ({ id: a.id, status: a.status || 'unknown' })));
    }
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = articles.filter((article: any) => {
    // Filter by search term (title or summary)
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || 
                          article.categoryId.toString() === categoryFilter;
    
    // Filter by status - ensure we correctly check for the status property
    const matchesStatus = statusFilter === "all" || 
                         (article.status && article.status === statusFilter);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "most-views":
        return b.views - a.views;
      case "featured":
        return Number(b.featured) - Number(a.featured);
      default:
        return 0;
    }
  });

  // Paginate articles
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Articles | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Articles</h1>
          <p className="text-gray-600">Manage all published articles</p>
        </div>
        
        <Button className="bg-[#BB1919] hover:bg-[#A10000]" onClick={() => navigate("/admin/articles/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles by title or content"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-40">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-36">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  // When changing status filter, invalidate and refetch
                  queryClient.invalidateQueries({
                    queryKey: ["/api/articles"],
                    exact: false
                  });
                }}
              >
                <SelectTrigger>
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <span className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="most-views">Most Views</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Filter summary and reset */}
        {(searchTerm || categoryFilter !== "all" || statusFilter !== "all" || sortBy !== "newest") && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="text-gray-500">Filters:</div>
            
            {searchTerm && (
              <Badge variant="outline" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {categoryFilter !== "all" && (
              <Badge variant="outline" className="gap-1">
                Category: {getCategoryName(parseInt(categoryFilter, 10))}
                <button onClick={() => setCategoryFilter("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {statusFilter !== "all" && (
              <Badge variant="outline" className="gap-1">
                Status: {statusFilter === "published" ? "Published" : "Draft"}
                <button onClick={() => setStatusFilter("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {sortBy !== "newest" && (
              <Badge variant="outline" className="gap-1">
                Sort: {
                  sortBy === "title-asc" ? "Title (A-Z)" :
                  sortBy === "title-desc" ? "Title (Z-A)" :
                  sortBy === "oldest" ? "Oldest First" :
                  sortBy === "most-views" ? "Most Views" :
                  sortBy === "featured" ? "Featured First" : ""
                }
                <button onClick={() => setSortBy("newest")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setSortBy("newest");
              }}
            >
              Reset All
            </Button>
          </div>
        )}
      </div>

      {/* Articles Table */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
        </div>
      ) : (
        <>
          {paginatedArticles.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? 
                  "No articles match your search criteria. Try adjusting your filters." : 
                  "You haven't created any articles yet."}
              </p>
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  className="bg-[#BB1919] hover:bg-[#A10000]"
                  onClick={() => navigate("/admin/articles/create")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Article
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Published</TableHead>
                      <TableHead className="hidden lg:table-cell">Publisher</TableHead>
                      <TableHead className="hidden md:table-cell">Views</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedArticles.map((article: any) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div className="flex items-start space-x-3">
                            {article.featured && (
                              <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium">{article.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[250px]">
                                {article.summary}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryName(article.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={article.status === "published" ? "default" : "secondary"}
                            className={article.status === "published" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {article.status === "published" ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            {format(new Date(article.publishedAt), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {article.publishedBy || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center text-sm text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {article.views}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <BarChart className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleEdit(article.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(article.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, sortedArticles.length)} of{" "}
                    {sortedArticles.length} articles
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "bg-[#BB1919] hover:bg-[#A10000]" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Article
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {articleToDeleteDetails && (
            <div className="border rounded-md p-4 my-4 bg-gray-50">
              <h3 className="font-semibold text-base mb-2">{articleToDeleteDetails.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Category:</span> 
                  {getCategoryName(articleToDeleteDetails.categoryId)}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Status:</span>
                  <Badge variant={articleToDeleteDetails.status === "published" ? "default" : "outline"} className={articleToDeleteDetails.status === "published" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                    {articleToDeleteDetails.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                {articleToDeleteDetails.featured && (
                  <div className="flex items-center text-yellow-600">
                    <span className="font-medium w-24">Featured:</span>
                    <Star className="h-4 w-4" />
                    <span className="ml-1">This is a featured article</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Views:</span> 
                  {articleToDeleteDetails.views}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Published:</span> 
                  {new Date(articleToDeleteDetails.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Publisher:</span> 
                  {articleToDeleteDetails.publishedBy || "Unknown"}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => articleToDelete && handleDelete(articleToDelete)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}