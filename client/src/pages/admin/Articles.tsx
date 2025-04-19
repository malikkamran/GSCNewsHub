import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { Search, Filter, Plus, Edit, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const perPage = 10;

  // Extract filter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter === "featured") {
      setCategoryFilter("featured");
    }
  }, []);

  // Fetch all articles
  const {
    data: articles = [],
    isLoading: articlesLoading,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });

  // Fetch all categories for filtering
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
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

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter === "featured") {
      return matchesSearch && article.featured;
    } else if (categoryFilter) {
      return matchesSearch && article.categoryId === parseInt(categoryFilter);
    }
    
    return matchesSearch;
  });

  // Paginate the filtered articles
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / perPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Calculate pagination numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Determine start and end pages to show
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
      
      // Adjust to show 3 pages in the middle
      if (startPage === 2) endPage = Math.min(4, totalPages - 1);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) pages.push('...');
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Articles | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Article Management</h1>
          <p className="text-gray-600">Manage all news articles</p>
        </div>
        <Link href="/admin/articles/create">
          <Button className="bg-[#BB1919] hover:bg-[#A10000]">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="featured">Featured Articles</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Table */}
      {articlesLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-md shadow p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first article."}
          </p>
          <Link href="/admin/articles/create">
            <Button className="bg-[#BB1919] hover:bg-[#A10000]">
              <Plus className="mr-2 h-4 w-4" />
              Create New Article
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-md border shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-24 text-center">Featured</TableHead>
                  <TableHead className="w-28 text-center">Views</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles.map((article: any) => {
                  const category = categories.find(
                    (c: any) => c.id === article.categoryId
                  );
                  
                  return (
                    <TableRow key={article.id}>
                      <TableCell className="text-center font-medium">
                        {article.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {article.summary}
                        </div>
                      </TableCell>
                      <TableCell>
                        {category ? (
                          <Badge variant="outline" className="bg-gray-100">
                            {category.name}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100">
                            Uncategorized
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(article.publishedAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        {article.featured ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {article.views || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end items-center space-x-1">
                          <Link href={`/admin/articles/edit/${article.id}`}>
                            <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <a
                            href={`/article/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </a>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-50">
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
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filteredArticles.length)} of{" "}
                {filteredArticles.length} articles
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {getPageNumbers().map((pageNum, i) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${i}`} className="mx-1">...</span>
                  ) : (
                    <Button
                      key={`page-${pageNum}`}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(Number(pageNum))}
                      className={page === pageNum ? "bg-[#BB1919] hover:bg-[#A10000]" : ""}
                    >
                      {pageNum}
                    </Button>
                  )
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}