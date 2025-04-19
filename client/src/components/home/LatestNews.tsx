import { useQuery } from "@tanstack/react-query";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/common/ArticleCard";

export default function LatestNews() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Get the latest articles, exclude featured ones
  const latestArticles = articles?.filter(article => !article.featured).slice(0, 4);
  
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Latest News</h2>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="border-b pb-4 border-[#DDDDDD]">
              <Skeleton className="w-full aspect-video mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
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
      ) : latestArticles && latestArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {latestArticles.map(article => {
            const category = categories?.find(c => c.id === article.categoryId);
            return (
              <ArticleCard 
                key={article.id} 
                article={article} 
                category={category}
                size="medium"
                showCategory={true}
                showSummary={true}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border-b border-[#DDDDDD]">
          <p>No latest news available at this time.</p>
        </div>
      )}
    </section>
  );
}
