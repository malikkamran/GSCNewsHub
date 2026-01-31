import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Article, Category } from "@/lib/types";
import { optimizeImageUrl } from "@/lib/image";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { getFallbackCover } from "@/lib/covers";

/**
 * TopStories component that displays 3 featured articles in a grid layout
 * with overlay text and category tags, following the BBC News style.
 */
export default function TopStories() {
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured?limit=5'],
    queryFn: async () => {
      const response = await fetch('/api/articles/featured?limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch featured articles');
      }
      return response.json();
    }
  });
  
  // Initialize Embla hooks unconditionally to keep consistent hook order across renders
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const intervalMs = 4000; // 4s within standard 3–5s
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    autoplayRef.current = window.setInterval(() => {
      emblaApi.scrollNext();
    }, intervalMs);
  }, [emblaApi]);
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);
  const onMouseEnter = () => stopAutoplay();
  const onMouseLeave = () => startAutoplay();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  
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
  const estimateReadTime = (text?: string) => {
    if (!text) return "2 min read";
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <Skeleton className="w-full aspect-[16/9]" />
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

  const displayArticles = featuredArticles.slice(0, 5);

  return (
    <section className="mb-8" aria-label="Top news slider">
      <div 
        className="relative md:w-2/3" 
        onMouseEnter={onMouseEnter} 
        onMouseLeave={onMouseLeave}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayArticles.map((a, idx) => (
              <div 
                key={a.id} 
                className="min-w-0 flex-[0_0_100%] md:flex-[0_0_100%] lg:flex-[0_0_100%] px-0"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${displayArticles.length}`}
              >
                <Link href={`/article/${a.slug}`}>
                  <div className="relative overflow-hidden rounded group cursor-pointer h-[300px] md:h-[400px]">
                    <img 
                      src={optimizeImageUrl(a.imageUrl, 1200, 80)} 
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackCover(a.categoryId, 1200, 800);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 md:p-6">
                      <h2 className="text-white text-xl md:text-3xl font-bold mb-2 leading-tight">
                        {a.title}
                      </h2>
                      <p className="text-white/90 mb-2 text-sm md:text-base line-clamp-2">
                        {a.summary}
                      </p>
                      <div className="text-white/80 text-xs md:text-sm flex items-center flex-wrap gap-x-2">
                        <span>{formatDate(a.publishedAt)}</span>
                        <span className="mx-2">|</span>
                        <span className="uppercase font-semibold">
                          {getCategoryName(a.categoryId)}
                        </span>
                        {(a as any).publishedBy && (
                          <>
                            <span className="mx-2">|</span>
                            <span>{(a as any).publishedBy}</span>
                          </>
                        )}
                        <span className="mx-2">|</span>
                        <span>{estimateReadTime(a.content)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next controls */}
        <button 
          type="button" 
          onClick={scrollPrev} 
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 focus:outline-none"
        >
          ‹
        </button>
        <button 
          type="button" 
          onClick={scrollNext} 
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 focus:outline-none"
        >
          ›
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-3" role="tablist" aria-label="Slide navigation">
          {displayArticles.map((_a, i) => (
            <button 
              key={i} 
              type="button" 
              role="tab" 
              aria-selected={selectedIndex === i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full ${selectedIndex === i ? 'bg-[#BB1919]' : 'bg-gray-300'} focus:outline-none`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
