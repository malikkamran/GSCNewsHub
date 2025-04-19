import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// Create a validation schema for articles
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  categoryId: z.coerce.number(),
  featured: z.boolean().default(false),
  publishedAt: z.date().optional().default(() => new Date()),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  articleId?: number;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!articleId;

  // Fetch categories for the select dropdown
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Fetch article details if in edit mode
  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: [`/api/articles/${articleId}`],
    retry: false,
    enabled: isEditMode,
  });

  // Set up form with validation
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      imageUrl: "",
      categoryId: undefined,
      featured: false,
    },
  });

  // Load article data into form when it's available
  useEffect(() => {
    if (article && isEditMode) {
      form.reset({
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        imageUrl: article.imageUrl,
        categoryId: article.categoryId,
        featured: article.featured,
      });
    }
  }, [article, form, isEditMode]);

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
      if (isEditMode) {
        // Update existing article
        await apiRequest(`/api/articles/${articleId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });

        toast({
          title: "Article updated",
          description: "The article has been successfully updated.",
        });
      } else {
        // Create new article
        await apiRequest("/api/articles", {
          method: "POST",
          body: JSON.stringify(data),
        });

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
      setLocation("/admin/articles");
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

  const isLoading = categoriesLoading || (isEditMode && articleLoading);

  return (
    <div>
      <Helmet>
        <title>{isEditMode ? "Edit Article" : "Create Article"} | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {isEditMode ? "Edit Article" : "Create Article"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update article details and content"
            : "Add a new article to the site"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main form */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>
                      Enter the main content and details for this article
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter article title..."
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
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="enter-url-slug..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be used in the article URL
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
                              placeholder="Brief summary of the article..."
                              className="resize-y min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A short preview shown in article listings
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
                              placeholder="Full article content..."
                              className="resize-y min-h-[300px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Article Settings</CardTitle>
                    <CardDescription>
                      Configure additional article properties
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => {
                              field.onChange(Number(value));
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
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
                            Enter the URL of the featured image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Article</FormLabel>
                            <FormDescription>
                              This article will be highlighted on the homepage
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/admin/articles")}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-[#BB1919] hover:bg-[#A10000]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {isEditMode ? "Update Article" : "Create Article"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-4">
                  <div>
                    <h3 className="font-medium">Writing Guidelines</h3>
                    <p className="text-gray-500 mt-1">
                      Keep headlines clear and concise. Use active voice and focus on key facts.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">SEO Best Practices</h3>
                    <p className="text-gray-500 mt-1">
                      Include relevant keywords naturally in your title, summary, and content.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Featured Articles</h3>
                    <p className="text-gray-500 mt-1">
                      Featured articles appear prominently on the homepage. Use this for important breaking news.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}