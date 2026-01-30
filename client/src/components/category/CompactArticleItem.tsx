import { Link } from "wouter";
import { Article, Category } from "@/lib/types";
import { format } from "date-fns";
import { optimizeImageUrl } from "@/lib/image";

interface CompactArticleItemProps {
  article: Article;
  category?: Category;
}

export default function CompactArticleItem({ article, category }: CompactArticleItemProps) {
  const { title, slug, summary, imageUrl, publishedAt } = article;
  const formattedDate = format(new Date(publishedAt), "MMM d");

  return (
    <article className="flex gap-4 border-b pb-4 border-[#DDDDDD]" aria-label={title}>
      <Link href={`/article/${slug}`}>
        <a className="block shrink-0 focus:outline-none focus:ring-2 focus:ring-[#BB1919]" aria-label={title}>
          <div className="w-40 h-24 overflow-hidden rounded">
            <img
              src={optimizeImageUrl(imageUrl, 320, 80)}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/assets/article-placeholder.svg";
              }}
            />
          </div>
        </a>
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[1rem] leading-tight mb-1">
          <Link href={`/article/${slug}`}>
            <a className="hover:text-[#BB1919] focus:outline-none focus:ring-2 focus:ring-[#BB1919]">
              {title}
            </a>
          </Link>
        </h3>
        <p className="text-[#404040] text-[0.9375rem] leading-[1.35] line-clamp-3 mb-2">
          {summary}
        </p>
        <div className="flex items-center text-[0.8125rem] text-[#5A5A5A]">
          <span>{formattedDate}</span>
          <span className="mx-2">|</span>
          <Link href={`/category/${category?.slug || ''}`}>
            <a className="uppercase text-[#BB1919] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#BB1919]">
              {category?.name || 'General'}
            </a>
          </Link>
        </div>
      </div>
    </article>
  );
}
