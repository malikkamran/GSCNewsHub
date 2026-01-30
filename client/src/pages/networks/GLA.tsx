import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from "@/components/layout/AdBanner";
import ArticleCard from "@/components/common/ArticleCard";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function NetworkGLA() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find(c => c.slug === "gla");

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: category ? [`/api/articles/category/${category.id}`, '8'] : [],
    enabled: !!category,
  });

  const latest = articles?.slice(0, 4) ?? [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Logistics Networks", href: "/category/logistics-networks" },
    { label: "GLA (Global Logistics Alliance)", active: true }
  ];

  return (
    <>
      <Helmet>
        <title>GLA (Global Logistics Alliance) — Network Page | GSC Supply Chain News</title>
        <meta name="description" content="Explore Global Logistics Alliance (GLA): conferences, member tools, and worldwide partner coverage for forwarders." />
        <meta name="keywords" content="GLA, Global Logistics Alliance, logistics network, freight forwarders, conferences, member center, global coverage" />
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <main className="container mx-auto px-4 py-6 mt-2">
        {/* Hero */}
        <section className="rounded-md overflow-hidden mb-8">
          <div className="bg-[#0f3460] text-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block bg-white/10 px-3 py-1 rounded text-sm">Network Profile</span>
              <a href="https://www.glafamily.com" target="_blank" rel="noreferrer" className="text-white underline text-sm">Official Site</a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">GLA (Global Logistics Alliance)</h1>
            <p className="text-white/90 max-w-3xl">
              GLA connects thousands of qualified logistics companies across 170+ countries, combining global reach with local execution.
              Members benefit from conferences and forums, a unified member center (rates, inquiries, insurance, payments, tracking), and
              24/7 support that facilitates partner introductions and market insight.
            </p>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Programs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Conferences & Forums</h3>
              <p className="text-[#404040]">Global events and one‑on‑one meetings for partner discovery and growth.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">Member Center Tools</h3>
              <p className="text-[#404040]">Rates, inquiries, cargo insurance, payments, and tracking in a unified portal.</p>
            </div>
            <div className="bg-white border border-[#DDDDDD] p-4">
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-[#404040]">Partner introductions and local market insights to accelerate execution.</p>
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
                <p>No recent updates for GLA.</p>
              </div>
            )}

            <AdBanner slot="category-content" className="my-8" />
          </div>

          <div className="lg:w-4/12">
            <AdBanner slot="sidebar-top" className="mb-6" />
            <div className="bg-white border border-[#DDDDDD] p-4 space-y-3">
              <h3 className="text-xl font-semibold">About GLA</h3>
              <p className="text-[#404040]">
                According to GLA’s official site, the network focuses on innovation and affordability for member operations, hosting global
                conferences and providing a robust member center for rates, inquiries, insurance, payments, and tracking
                (source: glafamily.com).
              </p>
              <h4 className="font-semibold">Member Benefits</h4>
              <ul className="list-disc ml-5 text-[#404040]">
                <li>Face‑to‑face networking via global conferences and forums</li>
                <li>Unified tools for quoting, inquiries, and tracking</li>
                <li>Member promotions and partner introductions</li>
                <li>Support for complex multimodal and e‑commerce flows</li>
              </ul>
              <div className="text-sm text-[#5A5A5A]">
                Learn more: glafamily.com
              </div>
            </div>
            <AdBanner slot="sidebar-middle" className="my-6" />
          </div>
        </div>
      </main>
    </>
  );
}
