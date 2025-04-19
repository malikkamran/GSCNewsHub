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
  
  // Title styling based on size - using BBC News standards
  let titleSizeClass = "font-semibold mb-2 leading-tight";
  
  if (size === "small") {
    titleSizeClass += " text-[1rem]"; // 16px
  } else if (size === "medium") {
    titleSizeClass += " text-[1.125rem]"; // 18px
  } else if (size === "large") {
    titleSizeClass += " text-[1.25rem] lg:text-[1.5rem]"; // 20px/24px
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
        {showCategory && category && (
          <div className="category-tag">
            {category.name.toUpperCase()}
          </div>
        )}
      </div>
      <h3 className={titleSizeClass} style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
        <Link href={`/article/${slug}`}>
          <span className="hover:text-[#BB1919] cursor-pointer">{title}</span>
        </Link>
      </h3>
      {showSummary && (
        <p className="text-[#404040] mb-3 text-[0.9375rem] leading-[1.35]" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>{summary}</p>
      )}
      <div className="flex items-center text-[0.8125rem] text-[#5A5A5A]" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
        <span>{formattedDate}</span>
        <span className="mx-2">|</span>
        <span>
          <Link href={`/category/${category?.slug || ''}`}>
            <span className="uppercase text-[#BB1919] font-semibold cursor-pointer hover:underline">
              {category?.name || 'General'}
            </span>
          </Link>
        </span>
      </div>
    </article>
  );
}
