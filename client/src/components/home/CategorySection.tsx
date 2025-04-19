import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/common/ArticleCard";

interface CategorySectionProps {
  categorySlug: string;
}

export default function CategorySection({ categorySlug }: CategorySectionProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const category = categories?.find(c => c.slug === categorySlug);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: category ? [`/api/articles/category/${category.id}`, '3'] : [],
    enabled: !!category,
  });
  
  // Get the first 3 articles for this category
  const categoryArticles = articles?.slice(0, 3);
  
  if (!category) {
    return null;
  }
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">{category.name}</h2>
        <Link href={`/category/${category.slug}`}>
          <span className="text-[#BB1919] text-sm hover:underline cursor-pointer">View all</span>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border-b pb-4 border-[#DDDDDD]">
              <Skeleton className="w-full aspect-video mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : categoryArticles && categoryArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {categoryArticles.map((article: Article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              category={category}
              size="small"
              showCategory={false}
              showSummary={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-b border-[#DDDDDD]">
          <p>No {category.name.toLowerCase()} articles available at this time.</p>
        </div>
      )}
    </section>
  );
}
