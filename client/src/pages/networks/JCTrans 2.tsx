import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from "@/components/layout/AdBanner";
import ArticleCard from "@/components/common/ArticleCard";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function NetworkJCTrans() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find(c => c.slug === "jc-trans-networks");

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: category ? [`/api/articles/category/${category.id}`, '8'] : [],
    enabled: !!category,
  });

  const latest = articles?.slice(0, 4) ?? [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Logistics Networks", href: "/category/logistics-networks" },
    { label: "JC Trans Networks", active: true }
  ];

  return (
    <>
      <Helmet>
        <title>JC Trans Networks — Network Page | GSC Supply Chain News</title>
        <meta name="description" content="Discover JCtrans: a B2B platform for freight forwarders with risk protection, settlement services, and global events." />
        <meta name="keywords" content="JCtrans, logistics platform, freight forwarders, risk protection, settlement, JC Pay, conferences" />
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 py-6 mt-2">
        <section className="rounded-md overflow-hidden mb-8">
          <div className="bg-[#0b5f54] text-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block bg-white/10 px-3 py-1 rounded text-sm">Platform Profile</span>
              <a href="https://www.jctrans.com/en/" target="_blank" rel="noreferrer" className="text-white underline text-sm">Official Site</a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">JCtrans</h1>
            <p className="text-white/90 max-w-3xl">
              JCtrans positions itself as a leading B2B platform for freight forwarders—providing member directories, market insights,
              business cooperation tools, conferences, and cooperation risk protection
              (source: jctrans.com).
            </p>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Programs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Risk Protection</h3>
              <p className="text-[#404040]">Strict reviews, blacklist warnings, and cooperation protection up to $150,000.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">JC Pay Settlement</h3>
              <p className="text-[#404040]">Cross‑border payment and settlement services to reduce fees and friction.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Directory & Events</h3>
              <p className="text-[#404040]">Global directory, market insights, and high‑end conferences for growth.</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-8/12">
            <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">News & Updates</h2>
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-b pb-4 border-[#DDDDDD]">
                    <Skeleton className="w-full aspect-video mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                  </div>
                ))}
              </div>
            ) : latest.length > 0 && category ? (
              <div className="grid gap-6 md:grid-cols-2">
                {latest.map((article: Article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    category={category}
                    size="medium"
                    showCategory={true}
                    showSummary={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-b border-[#DDDDDD]">
                <p>No recent updates for JC Trans.</p>
              </div>
            )}

            <AdBanner slot="category-content" className="my-8" />
          </div>

          <div className="lg:w-4/12">
            <AdBanner slot="sidebar-top" className="mb-6" />
            <div className="bg-white border border-[#DDDDDD] p-4 space-y-3">
              <h3 className="text-xl font-semibold">About JCtrans</h3>
              <p className="text-[#404040]">
                JCtrans notes strict entry reviews, risk control, blacklist warnings, and cooperation risk protection (up to $150,000 per member),
                alongside JC Pay settlement services and high‑end events
                (source: jctrans.com).
              </p>
              <h4 className="font-semibold">Member Offerings</h4>
              <ul className="list-disc ml-5 text-[#404040]">
                <li>Member directory with resources across 170+ countries</li>
                <li>Risk protection and dispute resolution services</li>
                <li>JC Pay settlement and cross‑border payment tools</li>
                <li>Conferences and industry news coverage</li>
              </ul>
              <div className="text-sm text-[#5A5A5A]">
                Learn more: jctrans.com
              </div>
            </div>
            <AdBanner slot="sidebar-middle" className="my-6" />
          </div>
        </div>
      </main>
    </>
  );
}
