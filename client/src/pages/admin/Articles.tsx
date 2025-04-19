import { useState } from "react";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Eye, Edit, Trash2, ArrowDown, ArrowUp } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminArticles() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>("publishedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });

  // Fetch categories for filtering
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      await apiRequest(`/api/articles/${articleToDelete}`, {
        method: "DELETE",
      });

      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter and sort articles
  const filteredArticles = articles
    ? articles.filter((article: any) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
    if (sortField === "publishedAt") {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === "title") {
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    if (sortField === "views") {
      return sortDirection === "asc"
        ? (a.views || 0) - (b.views || 0)
        : (b.views || 0) - (a.views || 0);
    }
    
    return 0;
  });

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Articles | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Articles</h1>
          <p className="text-gray-600">Manage your news articles</p>
        </div>
        <Button
          onClick={() => setLocation("/admin/articles/create")}
          className="bg-[#BB1919] hover:bg-[#A10000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Article
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSearchTerm("")}>
                All Categories
              </DropdownMenuItem>
              {categories?.map((category: any) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSearchTerm(category.name)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="py-32 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[300px] cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title {renderSortIndicator("title")}
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("publishedAt")}
                    >
                      <div className="flex items-center">
                        Published {renderSortIndicator("publishedAt")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-center cursor-pointer"
                      onClick={() => handleSort("views")}
                    >
                      <div className="flex items-center justify-center">
                        Views {renderSortIndicator("views")}
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedArticles.length > 0 ? (
                    sortedArticles.map((article: any) => {
                      // Find the category name
                      const category = categories?.find((c: any) => c.id === article.categoryId);
                      
                      return (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">
                            <div className="line-clamp-1">{article.title}</div>
                          </TableCell>
                          <TableCell>
                            {category?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {article.views || 0}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                article.featured
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {article.featured ? "Featured" : "Published"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/article/${article.slug}`}>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  setLocation(`/admin/articles/edit/${article.id}`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setArticleToDelete(article.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <div className="rounded-full bg-gray-100 p-3 mb-3">
                            <Search className="h-6 w-6" />
                          </div>
                          <p className="text-lg font-medium mb-1">No articles found</p>
                          <p className="text-sm">
                            {searchTerm
                              ? `No results for "${searchTerm}"`
                              : "Start by creating your first article"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="link"
                              onClick={() => setSearchTerm("")}
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing {sortedArticles.length} of {articles?.length || 0} articles
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}