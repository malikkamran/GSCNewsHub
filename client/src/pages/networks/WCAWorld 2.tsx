import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from "@/components/layout/AdBanner";
import ArticleCard from "@/components/common/ArticleCard";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function NetworkWCAWorld() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find(c => c.slug === "wca-world");

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: category ? [`/api/articles/category/${category.id}`, '8'] : [],
    enabled: !!category,
  });

  const latest = articles?.slice(0, 4) ?? [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Logistics Networks", href: "/category/logistics-networks" },
    { label: "WCA World", active: true }
  ];

  return (
    <>
      <Helmet>
        <title>WCA World — Network Page | GSC Supply Chain News</title>
        <meta name="description" content="Explore WCAworld: the world’s largest network of independent freight forwarders, member benefits, and updates." />
        <meta name="keywords" content="WCAworld, WCA, freight forwarders network, financial protection, PartnerPay, events, academy" />
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 py-6 mt-2">
        <section className="rounded-md overflow-hidden mb-8">
          <div className="bg-[#1f4e79] text-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block bg-white/10 px-3 py-1 rounded text-sm">Network Profile</span>
              <a href="https://www.wcaworld.com/Home" target="_blank" rel="noreferrer" className="text-white underline text-sm">Official Site</a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">WCAworld</h1>
            <p className="text-white/90 max-w-3xl">
              WCAworld describes itself as the world’s largest and most powerful network of independent freight forwarders, offering
              member benefits such as financial protection, PartnerPay, events, and training via WCAworld Academy
              (source: wcaworld.com).
            </p>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Programs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Financial Protection</h3>
              <p className="text-[#404040]">Coverage for member‑to‑member business to support secure cooperation.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">PartnerPay</h3>
              <p className="text-[#404040]">Secure settlements between members to streamline inter‑company payments.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Academy & Events</h3>
              <p className="text-[#404040]">Training via WCAworld Academy and annual/regional networking events.</p>
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
                <p>No recent updates for WCA World.</p>
              </div>
            )}

            <AdBanner slot="category-content" className="my-8" />
          </div>

          <div className="lg:w-4/12">
            <AdBanner slot="sidebar-top" className="mb-6" />
            <div className="bg-white border border-[#DDDDDD] p-4 space-y-3">
              <h3 className="text-xl font-semibold">About WCAworld</h3>
              <p className="text-[#404040]">
                WCAworld highlights global reach, networking and events, marketing promotion, customer service, and industry programs
                including World Insurance Service and All World Shipping
                (source: wcaworld.com).
              </p>
              <h4 className="font-semibold">Member Benefits</h4>
              <ul className="list-disc ml-5 text-[#404040]">
                <li>Financial protection program for member‑to‑member business</li>
                <li>PartnerPay for secure inter‑member settlements</li>
                <li>Training via WCAworld Academy</li>
                <li>Annual conferences and regional networking</li>
              </ul>
              <div className="text-sm text-[#5A5A5A]">
                Learn more: wcaworld.com
              </div>
            </div>
            <AdBanner slot="sidebar-middle" className="my-6" />
          </div>
        </div>
      </main>
    </>
  );
}
