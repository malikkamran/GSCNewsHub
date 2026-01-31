import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { format } from "date-fns";
import { optimizeImageUrl } from "@/lib/image";
import { getFallbackCover } from "@/lib/covers";

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
  showCategory = false,
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
    titleSizeClass += " text-[1.375rem] lg:text-[1.625rem]"; // slightly toned for balance
    containerClass += " pb-5";
  }
  
  if (size === "large") {
    return (
      <article className={containerClass}>
        <h3 className={`${titleSizeClass} title-lg-3clamp`} style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
          <Link href={`/article/${slug}`}>
            <span className="hover:text-[#BB1919] cursor-pointer">{title}</span>
          </Link>
        </h3>
        {showSummary && (
          <p className="summary-3clamp mb-3" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>{summary}</p>
        )}
        <div className="relative mb-3 overflow-hidden rounded">
          <div className="w-full" style={{ maxHeight: 360 }}>
            <img 
              src={optimizeImageUrl(imageUrl, 900, 80)} 
              alt={title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src = getFallbackCover(category?.id, 1200, 800);
              }}
              loading="lazy"
            />
          </div>
          
        </div>
        <div className="flex items-center text-[0.85rem] text-[#5A5A5A]" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
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

  return (
    <article className={containerClass}>
      <div className="relative aspect-[16/9] mb-3 overflow-hidden group rounded">
        <img 
          src={optimizeImageUrl(imageUrl, 600, 80)} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = getFallbackCover(category?.id, 1200, 800);
          }}
          loading="lazy"
        />
        
      </div>
      <h3 className={`${titleSizeClass} title-md-2clamp`} style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
        <Link href={`/article/${slug}`}>
          <span className="hover:text-[#BB1919] cursor-pointer">{title}</span>
        </Link>
      </h3>
      {showSummary && (
        <p className="summary-2clamp mb-3" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>{summary}</p>
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
