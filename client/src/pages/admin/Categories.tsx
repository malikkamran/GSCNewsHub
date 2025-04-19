import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Folder,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  Loader2,
  Save,
  AlertTriangle,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Category form schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleCountByCategory, setArticleCountByCategory] = useState<Record<number, number>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Fetch article counts for each category
  const {
    data: articles = [],
  } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
    onSuccess: (data) => {
      const countMap: Record<number, number> = {};
      data.forEach((article: any) => {
        countMap[article.categoryId] = (countMap[article.categoryId] || 0) + 1;
      });
      setArticleCountByCategory(countMap);
    },
  });

  // Form setup
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Generate slug from category name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    
    // Only auto-generate slug if it's empty or hasn't been modified
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("name"))) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Create or update category
  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && editCategoryId) {
        // Update existing category
        await apiRequest(`/api/categories/${editCategoryId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });

        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
        });
      } else {
        // Create new category
        await apiRequest("/api/categories", {
          method: "POST",
          body: JSON.stringify(data),
        });

        toast({
          title: "Category created",
          description: "The category has been successfully created.",
        });
      }

      // Reset form and state
      form.reset({
        name: "",
        slug: "",
      });
      setIsEditing(false);
      setEditCategoryId(null);

      // Refresh categories
      queryClient.invalidateQueries({
        queryKey: ["/api/categories"],
      });
    } catch (error) {
      console.error("Error submitting category:", error);
      toast({
        title: "Error",
        description: "Failed to save the category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit a category
  const handleEdit = (id: number) => {
    const category = categories.find((c: any) => c.id === id);
    if (category) {
      setIsEditing(true);
      setEditCategoryId(id);
      form.reset({
        name: category.name,
        slug: category.slug,
      });
    }
  };

  // Delete a category
  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/api/categories/${id}`, {
        method: "DELETE",
      });
      
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      });
      
      // Refresh categories
      queryClient.invalidateQueries({
        queryKey: ["/api/categories"],
      });
      
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete the category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Confirm category deletion
  const confirmDelete = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };
  
  // Get category details by ID
  const getCategoryById = (id: number) => {
    return categories.find((cat: any) => cat.id === id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditCategoryId(null);
    form.reset({
      name: "",
      slug: "",
    });
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Categories | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Categories</h1>
        <p className="text-gray-600">Manage content categories for your articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Form */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Category" : "Create Category"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update an existing category" 
                  : "Create a new category for your articles"}
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category name"
                            {...field}
                            onChange={handleNameChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Displayed name for the category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="url-friendly-slug"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used in URLs. Auto-generated from name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#BB1919] hover:bg-[#A10000]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Update Category
                          </span>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-[#BB1919] hover:bg-[#A10000]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Category
                        </span>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-500">
              <p>
                Categories help organize your content and make it easier for readers to find related articles.
              </p>
              <p>
                Each category has a name (displayed to users) and a slug (used in URLs).
              </p>
              <div className="flex items-start space-x-2 mt-4">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-md">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-amber-800 font-medium">Important Note</p>
                  <p className="text-xs mt-1">
                    Deleting a category that has articles will cause those articles to become uncategorized.
                    Consider editing the category instead of deleting it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>
                Manage your existing content categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
                </div>
              ) : (
                <>
                  {categories.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-3 mb-4">
                        <Folder className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-4">
                        Create your first category to organize your articles. Categories help readers navigate and find related content.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Articles</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map((category: any) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                                  {category.slug}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge variant={articleCountByCategory[category.id] ? "default" : "outline"}>
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {articleCountByCategory[category.id] || 0}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEdit(category.id)}
                                    disabled={isSubmitting}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => confirmDelete(category.id)}
                                    disabled={isSubmitting}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Category
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {categoryToDelete && (
            <div className="border rounded-md p-4 my-4 bg-gray-50">
              <h3 className="font-semibold text-base mb-2">
                {getCategoryById(categoryToDelete)?.name}
              </h3>
              
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                <span className="font-medium">URL Slug:</span>
                <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                  {getCategoryById(categoryToDelete)?.slug}
                </code>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Articles in this category:</span>
                <Badge variant="default" className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {articleCountByCategory[categoryToDelete] || 0}
                </Badge>
              </div>
              
              {articleCountByCategory[categoryToDelete] > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Warning</p>
                      <p className="text-xs text-amber-800 mt-1">
                        This category has {articleCountByCategory[categoryToDelete]} article(s).
                        Deleting it will leave these articles uncategorized until you assign them
                        to a different category. Consider editing this category instead of deleting it.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {articleCountByCategory[categoryToDelete || 0] > 0 ? 
                "Delete Anyway" : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}