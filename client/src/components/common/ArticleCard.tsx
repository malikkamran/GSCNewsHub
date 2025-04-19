import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { format } from "date-fns";

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
  const { title, slug, summary, imageUrl, publishedAt } = article;
  
  // Format the date - use MMM d format like "Apr 19" instead of relative time
  const publishedDate = new Date(publishedAt);
  const formattedDate = format(publishedDate, "MMM d");
  
  // Container styling
  let containerClass = "border-b pb-4 border-[#DDDDDD]";
  
  // Title styling based on size
  let titleSizeClass = "font-bold mb-2 font-roboto leading-tight";
  
  if (size === "small") {
    titleSizeClass += " text-base";
  } else if (size === "medium") {
    titleSizeClass += " text-xl";
  } else if (size === "large") {
    titleSizeClass += " text-2xl lg:text-3xl";
    containerClass += " pb-6";
  }
  
  return (
    <article className={containerClass}>
      <div className="relative aspect-video mb-3 overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showCategory && category && size === "large" && (
          <div className="absolute top-0 left-0 bg-[#BB1919] text-white px-2 py-1 text-xs font-bold">
            {category.name.toUpperCase()}
          </div>
        )}
      </div>
      <h3 className={titleSizeClass}>
        <Link href={`/article/${slug}`}>
          <span className="hover:text-[#BB1919] cursor-pointer">{title}</span>
        </Link>
      </h3>
      {showSummary && (
        <p className="text-gray-700 mb-3 text-sm leading-snug">{summary}</p>
      )}
      <div className="flex items-center text-xs text-gray-500">
        <span>{formattedDate}</span>
        {showCategory && category && size !== "large" && (
          <>
            <span className="mx-2">|</span>
            <span>
              <Link href={`/category/${category.slug}`}>
                <span className="uppercase text-[#BB1919] font-semibold cursor-pointer hover:underline">{category.name}</span>
              </Link>
            </span>
          </>
        )}
      </div>
    </article>
  );
}
