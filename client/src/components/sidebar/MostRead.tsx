import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MostRead() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/most-viewed'],
  });
  
  return (
    <section className="bg-[#F8F8F8] p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 font-roboto border-b border-[#DDDDDD] pb-2">Most Read</h2>
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-[#BB1919] font-bold text-2xl leading-none">{index + 1}</span>
              <div className="w-full">
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>
          ))
        ) : articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={article.id} className="flex items-start space-x-3">
              <span className="text-[#BB1919] font-bold text-2xl leading-none">{index + 1}</span>
              <h3 className="font-medium">
                <Link href={`/article/${article.slug}`}>
                  <span className="hover:text-[#BB1919] cursor-pointer">{article.title}</span>
                </Link>
              </h3>
            </div>
          ))
        ) : (
          <p className="text-center py-2">No articles available.</p>
        )}
      </div>
    </section>
  );
}
