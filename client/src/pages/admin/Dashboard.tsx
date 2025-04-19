import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { ChevronRight, Edit, Eye, BarChart3, Users, FileText, Newspaper } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  const { toast } = useToast();

  // Fetch articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Calculate dashboard stats
  const totalArticles = articles.length || 0;
  const featuredArticles = articles.filter((article: any) => article.featured).length || 0;
  const totalCategories = categories.length || 0;

  // Get recent articles
  const recentArticles = [...articles]
    .sort((a: any, b: any) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 5);

  // Get most viewed articles
  const mostViewedArticles = [...articles]
    .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome to the GSC Supply Chain News CMS</p>
        </div>
        <Link href="/admin/articles/create">
          <Button className="bg-[#BB1919] hover:bg-[#A10000]">
            New Article
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-9 w-9 text-[#BB1919] mr-3" />
              <div className="text-3xl font-bold">{totalArticles}</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/admin/articles">
              <Button variant="ghost" className="text-[#BB1919] hover:text-[#A10000] p-0">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Featured Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Newspaper className="h-9 w-9 text-[#BB1919] mr-3" />
              <div className="text-3xl font-bold">{featuredArticles}</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/admin/articles?filter=featured">
              <Button variant="ghost" className="text-[#BB1919] hover:text-[#A10000] p-0">
                View featured
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-9 w-9 text-[#BB1919] mr-3" />
              <div className="text-3xl font-bold">{totalCategories}</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/admin/categories">
              <Button variant="ghost" className="text-[#BB1919] hover:text-[#A10000] p-0">
                Manage categories
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-9 w-9 text-[#BB1919] mr-3" />
              <div className="text-3xl font-bold">-</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" className="text-[#BB1919] hover:text-[#A10000] p-0">
              Coming soon
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Latest published content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articlesLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : recentArticles.length > 0 ? (
                recentArticles.slice(0, 5).map((article: any) => (
                  <div key={article.id} className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{article.title}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-1">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span>•</span>
                        <span>{categories.find((c: any) => c.id === article.categoryId)?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link href={`/admin/articles/edit/${article.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No articles published yet.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/articles">
              <Button variant="outline">View All Articles</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Most Viewed Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Articles</CardTitle>
            <CardDescription>Articles with highest view counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articlesLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : mostViewedArticles.length > 0 ? (
                mostViewedArticles.map((article: any) => (
                  <div key={article.id} className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{article.title}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-1">
                        <span>{article.views || 0} views</span>
                        <span>•</span>
                        <span>{categories.find((c: any) => c.id === article.categoryId)?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link href={`/admin/articles/edit/${article.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No viewed articles yet.</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                toast({
                  title: "Analytics coming soon",
                  description: "Detailed analytics will be available in a future update.",
                });
              }}
            >
              View Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}