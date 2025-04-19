import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FileText, FolderPlus, Users, Eye, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // Get articles count
  const { data: articlesData } = useQuery({
    queryKey: ["/api/articles"],
    retry: false,
  });
  
  // Get categories count
  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });
  
  const stats = [
    {
      title: "Total Articles",
      value: articlesData?.length || 0,
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-700",
      link: "/admin/articles",
    },
    {
      title: "Categories",
      value: categoriesData?.length || 0,
      icon: <FolderPlus className="h-6 w-6" />,
      color: "bg-green-50 text-green-700",
      link: "/admin/categories",
    },
    {
      title: "Admin Users",
      value: 2,
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-700",
      link: "/admin/users",
    },
    {
      title: "Page Views",
      value: "12.5K",
      icon: <Eye className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-700",
      link: "/admin/analytics",
    },
  ];
  
  // Get most viewed articles
  const { data: mostViewedArticles } = useQuery({
    queryKey: ["/api/articles/most-viewed"],
    retry: false,
  });
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | GSC Supply Chain News CMS</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome to the GSC News content management system.</p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-md ${stat.color}`}>{stat.icon}</div>
                <Link href={stat.link}>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#BB1919]">View</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the CMS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                  <div className="bg-green-50 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Article "{i === 1 ? 'Red Sea Crisis Impact' : i === 2 ? 'Supply Chain Resilience' : i === 3 ? 'Sustainable Logistics' : 'Warehousing Trends'}" was {i % 2 === 0 ? 'edited' : 'created'}</p>
                    <p className="text-xs text-gray-500">{i === 1 ? '2 minutes' : i === 2 ? '3 hours' : i === 3 ? 'Yesterday' : '2 days'} ago by Admin</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most viewed articles */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Most Viewed Articles</CardTitle>
                <CardDescription>Articles with highest view counts</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-[#BB1919]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostViewedArticles?.slice(0, 5).map((article: any, index: number) => (
                <div key={article.id} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                  <div className="bg-gray-100 text-gray-800 flex items-center justify-center w-8 h-8 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                    <div className="flex items-center mt-1">
                      <Eye className="h-3 w-3 text-gray-500 mr-1" />
                      <p className="text-xs text-gray-500">{article.views || 0} views</p>
                    </div>
                  </div>
                  <Link href={`/admin/articles/edit/${article.id}`}>
                    <a className="text-xs font-medium text-[#BB1919] hover:underline">Edit</a>
                  </Link>
                </div>
              ))}
              
              {!mostViewedArticles?.length && (
                <p className="text-sm text-gray-500 py-4 text-center">No articles found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}