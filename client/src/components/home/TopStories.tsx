import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

/**
 * TopStories component that displays 3 featured articles in a grid layout
 * with overlay text and category tags, following the BBC News style.
 */
export default function TopStories() {
  // Get 3 featured articles
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
    queryFn: async () => {
      const response = await fetch('/api/articles/featured?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch featured articles');
      }
      return response.json();
    }
  });
  
  // Get categories for displaying category names
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Function to get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'General';
  };
  
  // Function to format date to "MMM d, yyyy" format (e.g., "Apr 19, 2025")
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-3 lg:col-span-2">
          <Skeleton className="w-full aspect-[16/9]" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="w-full aspect-[16/9] mb-4" />
          <Skeleton className="w-full aspect-[16/9]" />
        </div>
      </div>
    );
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <div className="text-center py-8 mb-8 border border-gray-200 rounded">
        <p>No featured stories available at this time.</p>
      </div>
    );
  }

  // Ensure we have exactly 3 articles to display
  const displayArticles = featuredArticles.slice(0, 3);
  const mainArticle = displayArticles[0];
  const secondaryArticles = displayArticles.slice(1);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main large article (2/3 width on desktop) */}
        {mainArticle && (
          <div className="md:col-span-3 lg:col-span-2">
            <Link href={`/article/${mainArticle.slug}`}>
              <div className="relative overflow-hidden rounded group cursor-pointer h-[300px] md:h-[400px]">
                {/* Background image */}
                <img 
                  src={mainArticle.imageUrl} 
                  alt={mainArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 md:p-6">
                  {/* Category tag */}
                  <div className="bg-[#BB1919] text-white text-xs font-bold px-3 py-1 uppercase self-start mb-2">
                    {getCategoryName(mainArticle.categoryId)}
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-white text-xl md:text-3xl font-bold mb-2 leading-tight">
                    {mainArticle.title}
                  </h2>
                  
                  {/* Summary */}
                  <p className="text-white/90 mb-2 text-sm md:text-base line-clamp-2">
                    {mainArticle.summary}
                  </p>
                  
                  {/* Date */}
                  <div className="text-white/70 text-xs md:text-sm">
                    {formatDate(mainArticle.publishedAt)}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        {/* Secondary articles (vertical stack, 1/3 width on desktop) */}
        <div className="md:col-span-3 lg:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            {secondaryArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <div className="relative overflow-hidden rounded group cursor-pointer h-[200px]">
                  {/* Background image */}
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    {/* Category tag */}
                    <div className="bg-[#BB1919] text-white text-xs font-bold px-2 py-1 uppercase self-start mb-2">
                      {getCategoryName(article.categoryId)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white text-lg font-bold mb-1 leading-tight">
                      {article.title}
                    </h3>
                    
                    {/* Date */}
                    <div className="text-white/70 text-xs">
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}