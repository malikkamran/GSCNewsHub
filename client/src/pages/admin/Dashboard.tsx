import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Edit,
  ExternalLink,
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  // Fetch dashboard data
  const {
    data: articles = [],
    isLoading: articlesLoading,
  } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const isLoading = articlesLoading || categoriesLoading;
  
  // Calculate stats
  const totalArticles = articles.length || 0;
  const totalCategories = categories.length || 0;
  
  // Sort articles by views (most viewed first)
  const mostViewedArticles = [...articles]
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, 5);
    
  // Sort articles by publish date (most recent first)
  const recentArticles = [...articles]
    .sort((a: any, b: any) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 5);
    
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  // Count articles by category
  const articlesByCategory = categories.map((category: any) => {
    return {
      ...category,
      count: articles.filter((article: any) => article.categoryId === category.id).length,
    };
  }).sort((a: any, b: any) => b.count - a.count);

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | GSC Supply Chain News CMS</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-600">Overview and metrics of your news site</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArticles}</div>
                <p className="text-xs text-muted-foreground">
                  Articles published across {totalCategories} categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FolderOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">
                  Content organization categories
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/categories">
                    <span className="flex items-center text-xs text-blue-600">
                      Manage Categories
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Featured Articles</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {articles.filter((a: any) => a.featured).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Articles marked as featured
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {articles.reduce((total: number, article: any) => total + article.views, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total article views
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
            {/* Most Viewed Articles Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Most Viewed Articles</CardTitle>
                  <BarChart className="h-4 w-4 text-gray-500" />
                </div>
                <CardDescription>
                  Articles with highest view counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mostViewedArticles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mostViewedArticles.map((article: any) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div className="font-medium truncate max-w-[250px]">
                              {article.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getCategoryName(article.categoryId)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Eye className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{article.views}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No article view data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Articles Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Articles</CardTitle>
                  <LineChart className="h-4 w-4 text-gray-500" />
                </div>
                <CardDescription>
                  Recently published articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentArticles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead className="text-right">Published</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentArticles.map((article: any) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div className="font-medium truncate max-w-[250px]">
                              {article.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getCategoryName(article.categoryId)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">
                                {format(new Date(article.publishedAt), "MMM d, yyyy")}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No articles published yet
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/articles">
                    <span className="flex items-center text-xs">
                      View All Articles
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </span>
                  </Link>
                </Button>
                <Button className="bg-[#BB1919] hover:bg-[#A10000]" size="sm" asChild>
                  <Link to="/admin/articles/create">
                    <span className="flex items-center text-xs">
                      Create Article
                      <Edit className="ml-1 h-3 w-3" />
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Categories Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Category Distribution</CardTitle>
                <PieChart className="h-4 w-4 text-gray-500" />
              </div>
              <CardDescription>
                Article distribution across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {articlesByCategory.length > 0 ? (
                <div className="space-y-4">
                  {articlesByCategory.map((category: any) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 font-normal">
                          {category.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.count} article{category.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="w-1/2 bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-[#BB1919] h-2.5 rounded-full"
                          style={{
                            width: `${Math.max(
                              5,
                              (category.count / totalArticles) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No categories or articles available yet
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}