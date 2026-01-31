import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { formatDistanceToNow, format } from "date-fns";
import { Article, Category } from "@/lib/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import AdBanner from "@/components/layout/AdBanner";
import MostRead from "@/components/sidebar/MostRead";
import FeaturedVideo from "@/components/sidebar/FeaturedVideo";
import ExpertAnalysis from "@/components/sidebar/ExpertAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { optimizeImageUrl } from "@/lib/image";
import { getFallbackCover } from "@/lib/covers";

export default function ArticlePage() {
  const { slug } = useParams();
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/slug/${slug}`],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const category = article 
    ? categories?.find(c => c.id === article.categoryId) 
    : undefined;
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: article?.title || "Article", active: true }
  ];
  
  // Format the date
  const publishedDate = article?.publishedAt ? new Date(article.publishedAt) : null;
  const timeAgo = publishedDate ? formatDistanceToNow(publishedDate, { addSuffix: false }) : '';
  const formattedDate = publishedDate ? format(publishedDate, 'MMMM d, yyyy') : '';
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    const key = `article-style-${slug || ''}`;
    const existing = document.querySelectorAll(`style[data-article-style="${key}"]`);
    existing.forEach((el) => el.parentElement?.removeChild(el));
    if (!article?.content) {
      setHtmlContent(null);
      return;
    }
    const content = article.content.trim();
    if (!content.startsWith('<')) {
      setHtmlContent(null);
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const styleTexts = Array.from(doc.head?.querySelectorAll('style') || []).map(s => s.textContent || '');
    const css = styleTexts.join('\n').trim();
    if (css.length > 0) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-article-style', key);
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }
    const bodyHtml = doc.body?.innerHTML || content;
    setHtmlContent(bodyHtml);
    return () => {
      const cleanup = document.querySelectorAll(`style[data-article-style="${key}"]`);
      cleanup.forEach((el) => el.parentElement?.removeChild(el));
    };
  }, [article?.content, slug]);
  
  return (
    <>
      <Helmet>
        <title>{article?.title || "Article"} - GSC Supply Chain News</title>
        <meta name="description" content={article?.summary || "Read the latest article from GSC Supply Chain News."} />
      </Helmet>
      
      
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 mt-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-8/12">
            {isLoading ? (
              <article>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="w-full aspect-video mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
              </article>
            ) : !article ? (
              <div className="text-center py-8">
                <p>Article not found.</p>
              </div>
            ) : (
              <article>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 font-roboto">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  <span>{timeAgo} ago</span>
                  <span className="mx-2">|</span>
                  <span>{formattedDate}</span>
                  {category && (
                    <>
                      <span className="mx-2">|</span>
                      <span className="text-[#BB1919]">{category.name}</span>
                    </>
                  )}
                </div>
                
                <div className="relative aspect-video mb-6">
                  <img 
                    src={optimizeImageUrl(article.imageUrl, 1200, 80)} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getFallbackCover(category?.id, 1200, 800);
                    }}
                  />
                </div>
                
                <div className="prose max-w-none">
                  {htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  ) : (
                    article.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  )}
                </div>
                
                {/* In-article Ad */}
                <AdBanner slot="article-content" className="my-8" />
              </article>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-4/12">
            {/* Sidebar Ad */}
            <AdBanner slot="sidebar-top" className="mb-6" />
            
            <MostRead />
            <FeaturedVideo />
            
            {/* Second Sidebar Ad */}
            <AdBanner slot="sidebar-middle" className="mb-6" />
            
            <ExpertAnalysis />
          </div>
        </div>
      </main>
      
      {/* Bottom Ad Banner */}
      <div className="container mx-auto">
        <AdBanner slot="bottom-leaderboard" className="my-4" />
      </div>
    </>
  );
}
