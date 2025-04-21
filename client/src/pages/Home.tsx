import { Helmet } from "react-helmet";
import AdBanner from "@/components/layout/AdBanner";
import TopStories from "@/components/home/TopStories";
import LatestNews from "@/components/home/LatestNews";
import CategorySection from "@/components/home/CategorySection";
import MostRead from "@/components/sidebar/MostRead";
import FeaturedVideo from "@/components/sidebar/FeaturedVideo";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>GSC Supply Chain News - Latest Supply Chain Industry Updates</title>
        <meta name="description" content="Get the latest news and updates on global supply chain, logistics, transportation, and trade from GSC Supply Chain News." />
      </Helmet>
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-4">
        {/* Red TOP NEWS bar */}
        <div className="bg-[#BB1919] mb-4">
          <h2 className="text-white text-xl font-bold py-2 px-3 font-roboto">TOP NEWS</h2>
        </div>
        
        {/* TopStories with full width */}
        <TopStories />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <LatestNews />
            
            {/* In-content Ad */}
            <div className="my-8">
              <div className="text-xs text-gray-500 mb-1">ADVERTISEMENT</div>
              <AdBanner slot="in-article" format="horizontal" className="border border-gray-200" />
            </div>
            
            {/* Category Sections */}
            <CategorySection categorySlug="business" />
            <CategorySection categorySlug="technology" />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Sidebar Ad */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">ADVERTISEMENT</div>
              <AdBanner slot="sidebar-top" format="rectangle" className="border border-gray-200" />
            </div>
            
            <MostRead />
            <FeaturedVideo />
            
            {/* Second Sidebar Ad */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">ADVERTISEMENT</div>
              <AdBanner slot="sidebar-middle" format="rectangle" className="border border-gray-200" />
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Ad Banner */}
      <div className="container mx-auto">
        <AdBanner slot="bottom-leaderboard" format="horizontal" className="my-4" />
      </div>
    </>
  );
}
