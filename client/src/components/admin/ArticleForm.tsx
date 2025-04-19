import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ChevronLeft, Save, Loader2, Check, Calendar, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Article } from "@/lib/types";

// Create a schema for article form
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters").regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(200, "Summary cannot exceed 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  categoryId: z.coerce.number().min(1, "Please select a category"),
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("published"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  articleId?: number;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeaturedDialog, setShowFeaturedDialog] = useState(false);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [pendingFeaturedValue, setPendingFeaturedValue] = useState(false);
  const [selectedArticleToReplace, setSelectedArticleToReplace] = useState<number | null>(null);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Get all categories for dropdown
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });
  
  // Get featured articles to check if we already have 3
  const { 
    data: featuredArticles = [], 
    isLoading: featuredLoading 
  } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured", { limit: 10 }],
    queryFn: async () => {
      const response = await fetch('/api/articles/featured?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch featured articles');
      }
      return response.json();
    }
  });

  // Create form with validation
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      imageUrl: "",
      categoryId: 0,
      featured: false,
      status: "published",
    },
  });

  // Fetch article data when editing
  useEffect(() => {
    async function fetchArticle() {
      if (!articleId) return;
      
      setIsLoading(true);
      try {
        const response = await apiRequest("GET", `/api/articles/${articleId}`);
        const article = await response.json();
        
        if (article) {
          form.reset({
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            content: article.content,
            imageUrl: article.imageUrl,
            categoryId: article.categoryId,
            featured: article.featured,
            status: article.status || "published",
          });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: "Failed to load article data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [articleId, form, toast]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    
    // Only auto-generate slug if it's empty or hasn't been modified
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("title"))) {
      form.setValue("slug", generateSlug(title));
    }
  };

  // Handle form submission
  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);

    try {
      // Add the publisher information to the data
      const dataWithPublisher = {
        ...data,
        publishedBy: user?.username || "admin"
      };
      
      if (articleId) {
        // Update existing article
        await apiRequest("PUT", `/api/articles/${articleId}`, dataWithPublisher);

        toast({
          title: "Article updated",
          description: "The article has been successfully updated.",
        });
      } else {
        // Create new article
        await apiRequest("POST", "/api/articles", dataWithPublisher);

        toast({
          title: "Article created",
          description: "The article has been successfully created.",
        });
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["/api/articles"],
      });

      // Redirect to articles list
      navigate("/admin/articles");
    } catch (error) {
      console.error("Error submitting article:", error);
      toast({
        title: "Error",
        description: "Failed to save the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to articles list
  const handleCancel = () => {
    navigate("/admin/articles");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {articleId ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-gray-600">
            {articleId ? "Update existing article content and metadata" : "Publish a new article on the site"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>
                      Create the main content for your article
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a descriptive title"
                              {...field}
                              onChange={handleTitleChange}
                            />
                          </FormControl>
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
                            This will be used for the article URL. Auto-generated from title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Summary</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief summary of the article (appears in previews)"
                              className="resize-none h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <span className={field.value.length > 200 ? "text-red-500" : "text-gray-500"}>
                              {field.value.length}/200 characters
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your article content here..."
                              className="resize-none min-h-[300px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                    <CardDescription>
                      Article settings and categorization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL to the main image for this article
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value, 10))}
                            value={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Article</FormLabel>
                            <FormDescription>
                              Featured articles appear prominently on the homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                // If turning on featured and we already have 3+ featured articles
                                if (checked && !field.value) {
                                  setPendingFeaturedValue(checked);
                                  
                                  // Filter out current article if we're editing
                                  const otherFeaturedArticles = articleId 
                                    ? featuredArticles.filter(a => a.id !== articleId)
                                    : featuredArticles;
                                    
                                  if (otherFeaturedArticles.length >= 3) {
                                    // If we already have 3 featured articles, show replace dialog
                                    setShowReplaceDialog(true);
                                  } else {
                                    // Otherwise just show confirmation dialog
                                    setShowFeaturedDialog(true);
                                  }
                                } else {
                                  // If turning off, no confirmation needed
                                  field.onChange(checked);
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Standard confirmation dialog for setting article as featured */}
                    <AlertDialog open={showFeaturedDialog} onOpenChange={setShowFeaturedDialog}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            Set as Featured Article?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Featured articles appear prominently in the Top Stories section on the homepage.
                            Up to 3 articles can be featured at the same time.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setPendingFeaturedValue(false)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              form.setValue("featured", pendingFeaturedValue);
                            }}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    {/* Replace dialog for when we have more than 3 featured articles */}
                    <AlertDialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
                      <AlertDialogContent className="max-w-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            Select Article to Replace
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You already have 3 featured articles. To add a new featured article, 
                            please select which existing featured article you want to replace:
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        
                        <div className="my-4 max-h-[300px] overflow-y-auto">
                          <RadioGroup 
                            value={selectedArticleToReplace?.toString()} 
                            onValueChange={(value) => setSelectedArticleToReplace(parseInt(value))}
                            className="space-y-4"
                          >
                            {featuredArticles
                              .filter(article => !articleId || article.id !== articleId)
                              .map(article => (
                                <div key={article.id} className="flex items-start space-x-3 border rounded-md p-3">
                                  <RadioGroupItem value={article.id.toString()} id={`article-${article.id}`} className="mt-1" />
                                  <div className="flex-1">
                                    <label htmlFor={`article-${article.id}`} className="flex flex-col cursor-pointer">
                                      <span className="font-medium text-base">{article.title}</span>
                                      <span className="text-sm text-gray-500 line-clamp-2">{article.summary}</span>
                                    </label>
                                  </div>
                                </div>
                              ))
                            }
                          </RadioGroup>
                        </div>
                        
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => {
                            setPendingFeaturedValue(false);
                            setSelectedArticleToReplace(null);
                          }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={async () => {
                              if (selectedArticleToReplace) {
                                try {
                                  // Unfeature the selected article
                                  const articleToUpdate = featuredArticles.find(a => a.id === selectedArticleToReplace);
                                  if (articleToUpdate) {
                                    await apiRequest("PUT", `/api/articles/${selectedArticleToReplace}`, {
                                      ...articleToUpdate,
                                      featured: false
                                    });
                                    
                                    // Set current article as featured
                                    form.setValue("featured", true);
                                    
                                    // Invalidate queries to refresh data
                                    queryClient.invalidateQueries({
                                      queryKey: ["/api/articles/featured"],
                                    });
                                    
                                    toast({
                                      title: "Featured article updated",
                                      description: `"${articleToUpdate.title}" has been replaced as a featured article.`,
                                    });
                                  }
                                } catch (error) {
                                  console.error("Error updating featured articles:", error);
                                  toast({
                                    title: "Error",
                                    description: "Failed to update featured articles. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }
                              setSelectedArticleToReplace(null);
                            }}
                            disabled={!selectedArticleToReplace}
                          >
                            Replace Selected Article
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Publication Status</FormLabel>
                          <FormControl>
                            <div className="flex flex-col space-y-1 rounded-lg border p-4">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={field.value === "published"}
                                  onChange={() => field.onChange("published")}
                                  className="h-4 w-4 text-[#BB1919]"
                                />
                                <div>
                                  <div className="font-medium">Published</div>
                                  <div className="text-sm text-gray-500">
                                    Article will be visible to all users
                                  </div>
                                </div>
                              </label>
                              <div className="my-2 border-t"></div>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  checked={field.value === "draft"}
                                  onChange={() => field.onChange("draft")}
                                  className="h-4 w-4 text-[#BB1919]"
                                />
                                <div>
                                  <div className="font-medium">Draft</div>
                                  <div className="text-sm text-gray-500">
                                    Save as draft (not visible to users)
                                  </div>
                                </div>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {articleId && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
                        <Calendar className="h-4 w-4" />
                        <span>Published: {format(new Date(), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Image Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {form.watch("imageUrl") ? (
                      <div className="aspect-video w-full overflow-hidden rounded-md">
                        <img
                          src={form.watch("imageUrl")}
                          alt="Article preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image URL provided</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
                    {articleId ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    {articleId ? "Update Article" : "Create Article"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}