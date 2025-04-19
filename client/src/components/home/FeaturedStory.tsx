import { useQuery } from "@tanstack/react-query";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/common/ArticleCard";

export default function FeaturedStory() {
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Get the featured article
  const featuredArticle = featuredArticles?.[0];

  // Find the category for the featured article
  const category = featuredArticle 
    ? categories?.find(c => c.id === featuredArticle.categoryId) 
    : undefined;
  
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Top Story</h2>
      
      {isLoading ? (
        <div className="border-b pb-6 border-[#DDDDDD]">
          <Skeleton className="w-full aspect-video mb-3" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ) : featuredArticle ? (
        <ArticleCard 
          article={featuredArticle} 
          category={category}
          size="large" 
          showCategory={true} 
          showSummary={true}
        />
      ) : (
        <div className="text-center py-8 border-b border-[#DDDDDD]">
          <p>No featured stories available at this time.</p>
        </div>
      )}
    </section>
  );
}
