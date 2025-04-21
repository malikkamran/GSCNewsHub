import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { Article, Category } from "@/lib/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import AdBanner from "@/components/layout/AdBanner";
import ArticleCard from "@/components/common/ArticleCard";
import MostRead from "@/components/sidebar/MostRead";
import FeaturedVideo from "@/components/sidebar/FeaturedVideo";
import ExpertAnalysis from "@/components/sidebar/ExpertAnalysis";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const { slug } = useParams();
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const category = categories?.find(c => c.slug === slug);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: category ? [`/api/articles/category/${category.id}`, '10'] : null,
    enabled: !!category,
  });
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category?.name || "Category", active: true }
  ];
  
  return (
    <>
      <Helmet>
        <title>{category?.name || "Category"} - GSC Supply Chain News</title>
        <meta name="description" content={`Latest ${category?.name || "category"} news and updates from GSC Supply Chain News.`} />
      </Helmet>
      
      
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 mt-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-8/12">
            <h1 className="text-3xl font-bold mb-6 font-roboto border-b pb-2 border-[#DDDDDD]">
              {category?.name || "Category"}
            </h1>
            
            {isLoading ? (
              <div className="space-y-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="border-b pb-6 border-[#DDDDDD]">
                    <Skeleton className="w-full aspect-video mb-3" />
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !category ? (
              <div className="text-center py-8">
                <p>Category not found.</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-8">
                {articles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    category={category}
                    size="large"
                    showCategory={true}
                    showSummary={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No articles available in this category.</p>
              </div>
            )}
            
            {/* In-content Ad */}
            <AdBanner slot="in-article" format="horizontal" className="my-8" />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-4/12">
            {/* Sidebar Ad */}
            <AdBanner slot="sidebar-top" format="rectangle" className="mb-6" />
            
            <MostRead />
            <FeaturedVideo />
            
            {/* Second Sidebar Ad */}
            <AdBanner slot="sidebar-middle" format="rectangle" className="mb-6" />
            
            <ExpertAnalysis />
          </div>
        </div>
      </main>
      
      {/* Bottom Ad Banner */}
      <div className="container mx-auto">
        <AdBanner slot="bottom-leaderboard" format="horizontal" className="my-4" />
      </div>
    </>
  );
}
