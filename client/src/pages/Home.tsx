import { Helmet } from "react-helmet";
import Breadcrumb from "@/components/common/Breadcrumb";
import AdBanner from "@/components/layout/AdBanner";
import FeaturedStory from "@/components/home/FeaturedStory";
import LatestNews from "@/components/home/LatestNews";
import CategorySection from "@/components/home/CategorySection";
import MostRead from "@/components/sidebar/MostRead";
import FeaturedVideo from "@/components/sidebar/FeaturedVideo";
import ExpertAnalysis from "@/components/sidebar/ExpertAnalysis";

export default function Home() {
  const breadcrumbItems = [
    { label: "Home", href: "/", active: true }
  ];

  return (
    <>
      <Helmet>
        <title>GSC Supply Chain News - Latest Supply Chain Industry Updates</title>
        <meta name="description" content="Get the latest news and updates on global supply chain, logistics, transportation, and trade from GSC Supply Chain News." />
      </Helmet>
      
      {/* Top Ad Banner */}
      <AdBanner slot="top-leaderboard" format="horizontal" />
      
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-8/12">
            <FeaturedStory />
            <LatestNews />
            
            {/* In-content Ad */}
            <AdBanner slot="in-article" format="horizontal" className="my-8" />
            
            {/* Category Sections */}
            <CategorySection categorySlug="business" />
            <CategorySection categorySlug="technology" />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-4/12">
            {/* Sidebar Ad */}
            <AdBanner slot="sidebar-top" format="rectangle" className="mb-6" />
            
            <MostRead />
            <FeaturedVideo />
            
            {/* Second Sidebar Ad */}
            <AdBanner slot="sidebar-middle" format="rectangle" className="mb-6" />
            
            <ExpertAnalysis />
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
