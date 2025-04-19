import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  category?: Category;
  size?: "small" | "medium" | "large";
  showCategory?: boolean;
  showSummary?: boolean;
}

export default function ArticleCard({ 
  article, 
  category,
  size = "medium",
  showCategory = true,
  showSummary = true
}: ArticleCardProps) {
  const { title, slug, summary, imageUrl, publishedAt, categoryId } = article;
  
  // Format the date
  const publishedDate = new Date(publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: false });
  
  // Size variants
  const imageSizeClass = size === "large" 
    ? "aspect-video mb-3" 
    : size === "medium" 
      ? "aspect-video mb-3" 
      : "aspect-video mb-3";
  
  const titleSizeClass = size === "large" 
    ? "text-3xl font-bold mb-2 font-roboto" 
    : size === "medium" 
      ? "text-xl font-bold mb-2 font-roboto" 
      : "text-lg font-bold mb-2 font-roboto";
  
  return (
    <article className="border-b pb-4 border-[#DDDDDD]">
      <div className={`relative ${imageSizeClass}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className={titleSizeClass}>
        <Link href={`/article/${slug}`}>
          <span className="hover:text-[#BB1919] cursor-pointer">{title}</span>
        </Link>
      </h3>
      {showSummary && (
        <p className="text-gray-600 mb-3 text-sm">{summary}</p>
      )}
      <div className="flex items-center text-sm text-gray-500">
        <span>{timeAgo} ago</span>
        {showCategory && category && (
          <>
            <span className="mx-2">|</span>
            <span>
              <Link href={`/category/${category.slug}`}>
                <span className="hover:text-[#BB1919] cursor-pointer">{category.name}</span>
              </Link>
            </span>
          </>
        )}
      </div>
    </article>
  );
}
