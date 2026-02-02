# Developer Handoff Instructions

I want to add a "Partner Dashboard" to my existing website.

I have the **functionality and logic** ready in React code.
**Important:** My website already has its own article/tag system. Use the **logic** from the code below (pagination, filtering, layout, modals) but connect it to **my existing website's data**. The data in `constants.ts` is just mock data to show how the UI works.

### Requirements:
1. **Design:** Keep my current website's look and feel (header, footer, fonts, colors). Do NOT simply copy the Tailwind styles if they conflict.
2. **Logic:** Implement the features shown in the code:
   - **Sidebar Navigation:** Switch between Overview, My Placements, Tagged News, Leads.
   - **Overview Page:** Show stats and the "Audience Profile" modal.
   - **News Feed Logic:** Use the provided logic to filter lists (Search, Year Filter, Status Filter, Pagination). Distinguish between "My Placements" (Sponsored) and "Tagged News" (Mentions).
   - **Leads Table:** Search and table layout.

### Reference Code:

**types.ts** (Data Interfaces)
```typescript
export enum ArticleStatus {
  PUBLISHED = 'Published',
  SCHEDULED = 'Scheduled',
  DRAFT = 'Draft',
  ARCHIVED = 'Archived'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  CONVERTED = 'Converted'
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  publishDate: string;
  status: ArticleStatus;
  views: number;
  clicks: number;
  tags: string[];
  category: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  capturedAt: string;
  sourceArticleId: string;
  status: LeadStatus;
}

export interface DailyStat {
  date: string;
  views: number;
  clicks: number;
  leads: number;
}

export interface DashboardSummary {
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  activePlacements: number;
  ctr: number; // Click through rate percentage
}

export interface PlatformStat {
  monthlyUniqueVisitors: number;
  avgEngagementTime: string;
  newsletterSubscribers: number;
  decisionMakersPercent: number;
}

export interface DemographicStat {
  label: string;
  value: number;
  color: string;
}
```

**constants.ts** (Mock Data - Replace with real DB connections)
```typescript
import { Article, ArticleStatus, DailyStat, DashboardSummary, Lead, LeadStatus, PlatformStat, DemographicStat } from './types';

export const SUMMARY_STATS: DashboardSummary = {
  totalViews: 124500,
  totalClicks: 8230,
  totalLeads: 412,
  activePlacements: 12,
  ctr: 6.6
};

// New Platform Stats to show "Worth"
export const PLATFORM_STATS: PlatformStat = {
  monthlyUniqueVisitors: 2850000,
  avgEngagementTime: '4m 30s',
  newsletterSubscribers: 145000,
  decisionMakersPercent: 68
};

export const AUDIENCE_INDUSTRIES: DemographicStat[] = [
  { label: 'Technology & SaaS', value: 45, color: 'bg-blue-500' },
  { label: 'Finance & Banking', value: 25, color: 'bg-purple-500' },
  { label: 'Healthcare & Biotech', value: 15, color: 'bg-emerald-500' },
  { label: 'Manufacturing', value: 10, color: 'bg-orange-500' },
  { label: 'Other', value: 5, color: 'bg-slate-400' }
];

export const SENIORITY_LEVELS: DemographicStat[] = [
  { label: 'C-Level (CEO, CTO, etc.)', value: 35, color: 'bg-slate-800' },
  { label: 'VP / Director', value: 30, color: 'bg-slate-600' },
  { label: 'Manager', value: 20, color: 'bg-slate-400' },
  { label: 'Individual Contributor', value: 15, color: 'bg-slate-300' }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Fintech: How Blockchain is Changing Banking',
    excerpt: 'An in-depth look at how decentralized finance is reshaping the traditional banking sector globally.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    publishDate: '2023-10-24',
    status: ArticleStatus.PUBLISHED,
    views: 45200,
    clicks: 3100,
    tags: ['Fintech', 'Sponsored', 'Blockchain'],
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Sustainable Energy Solutions for Modern Manufacturing',
    excerpt: 'Top industrial players are moving towards green energy. Here is what you need to know about the transition.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2',
    publishDate: '2023-10-22',
    status: ArticleStatus.PUBLISHED,
    views: 12500,
    clicks: 850,
    tags: ['Green Energy', 'Partnership'],
    category: 'Industry'
  },
  {
    id: '3',
    title: 'AI in Healthcare: A New Era of Diagnosis',
    excerpt: 'Exploring the capabilities of generative AI in early disease detection and patient management.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=3',
    publishDate: '2023-10-28',
    status: ArticleStatus.SCHEDULED,
    views: 0,
    clicks: 0,
    tags: ['AI', 'Healthcare', 'Sponsored'],
    category: 'Healthcare'
  },
  {
    id: '4',
    title: 'Global Supply Chain Logistics: 2024 Outlook',
    excerpt: 'Experts predict a stabilization of shipping routes, but costs remain a concern for importers.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=4',
    publishDate: '2023-10-20',
    status: ArticleStatus.PUBLISHED,
    views: 28900,
    clicks: 1200,
    tags: ['Logistics', 'Economy'],
    category: 'Business'
  },
  {
    id: '5',
    title: 'Remote Work Tools That Actually Boost Productivity',
    excerpt: 'We tested the top 10 collaboration platforms so you do not have to. Here are the winners.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=5',
    publishDate: '2023-10-18',
    status: ArticleStatus.ARCHIVED,
    views: 8900,
    clicks: 450,
    tags: ['SaaS', 'Productivity'],
    category: 'Software'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '101',
    companyName: 'TechFlow Solutions',
    contactName: 'Sarah Jenkins',
    email: 'sarah.j@techflow.io',
    phone: '+1 (555) 012-3456',
    country: 'United States',
    capturedAt: '2023-10-25 14:30',
    sourceArticleId: '1',
    status: LeadStatus.NEW
  },
  {
    id: '102',
    companyName: 'GreenLeaf Industries',
    contactName: 'Marco Di Rossi',
    email: 'm.dirossi@greenleaf.it',
    phone: '+39 06 1234 5678',
    country: 'Italy',
    capturedAt: '2023-10-24 09:15',
    sourceArticleId: '2',
    status: LeadStatus.CONTACTED
  },
  {
    id: '103',
    companyName: 'Quantum Dynamics',
    contactName: 'Wei Chen',
    email: 'wei.chen@quantum.cn',
    phone: '+86 10 1234 5678',
    country: 'China',
    capturedAt: '2023-10-23 18:45',
    sourceArticleId: '1',
    status: LeadStatus.QUALIFIED
  },
  {
    id: '104',
    companyName: 'Apex Logistics',
    contactName: 'John Smith',
    email: 'jsmith@apexlog.com',
    phone: '+44 20 7946 0123',
    country: 'United Kingdom',
    capturedAt: '2023-10-22 11:20',
    sourceArticleId: '4',
    status: LeadStatus.NEW
  },
  {
    id: '105',
    companyName: 'Novus Pharma',
    contactName: 'Elena Rodriguez',
    email: 'e.rodriguez@novus.es',
    phone: '+34 91 123 4567',
    country: 'Spain',
    capturedAt: '2023-10-21 16:10',
    sourceArticleId: '1',
    status: LeadStatus.CONVERTED
  }
];
```

**App.tsx** (Routing Logic)
```tsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import NewsFeed from './components/NewsFeed';
import LeadsTable from './components/LeadsTable';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'news':
        return <NewsFeed mode="placements" />;
      case 'tagged':
        return <NewsFeed mode="tagged" />;
      case 'leads':
        return <LeadsTable />;
      default:
        return <Overview onNavigate={setCurrentView} />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'overview': return 'Dashboard Overview';
      case 'news': return 'My Sponsored Placements';
      case 'tagged': return 'Tagged News';
      case 'leads': return 'Lead Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false); // Close sidebar on mobile on selection
        }} 
        isOpen={isSidebarOpen}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
```

**components/Overview.tsx** (Dashboard & Modal Logic)
```tsx
import React, { useState } from 'react';
import { Users, Globe2, Clock, Briefcase, ArrowRight, Eye, MousePointer2, ExternalLink, Calendar, Tag, X } from 'lucide-react';
import StatCard from './StatCard';
import { PLATFORM_STATS, AUDIENCE_INDUSTRIES, SENIORITY_LEVELS, MOCK_ARTICLES } from '../constants';
import { ArticleStatus } from '../types';

interface OverviewProps {
  onNavigate: (view: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [showAudienceModal, setShowAudienceModal] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Mock filtering: 'Sponsored' tag implies it's a placement the partner paid for.
  const myPlacements = MOCK_ARTICLES.filter(a => a.tags.includes('Sponsored'));
  // Everything else is news they might be tagged in.
  const taggedNews = MOCK_ARTICLES.filter(a => !a.tags.includes('Sponsored'));

  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.PUBLISHED: return 'bg-emerald-100 text-emerald-700';
      case ArticleStatus.SCHEDULED: return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      
      {/* Section 1: Website Value Stats (The "Pitch") */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">Website Reach & Performance</h2>
          <p className="text-sm text-slate-500">Why top brands choose to partner with us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Monthly Unique Visitors" 
            value={formatNumber(PLATFORM_STATS.monthlyUniqueVisitors)} 
            icon={Globe2} 
            color="blue"
          />
          <StatCard 
            title="Decision Makers" 
            value={`${PLATFORM_STATS.decisionMakersPercent}%`} 
            icon={Briefcase} 
            color="purple"
          />
          <StatCard 
            title="Avg. Read Time" 
            value={PLATFORM_STATS.avgEngagementTime} 
            icon={Clock} 
            color="green"
          />
          <StatCard 
            title="Newsletter Subscribers" 
            value={formatNumber(PLATFORM_STATS.newsletterSubscribers)} 
            icon={Users} 
            color="orange"
          />
        </div>
      </div>

      {/* Section 2: Placements & Mentions Split (Moved up) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: My Recent Placements */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-slate-800">My Recent Placements</h3>
               <p className="text-sm text-slate-500">Sponsored articles performance</p>
             </div>
             <button 
               onClick={() => onNavigate('news')}
               className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
             >
               View All <ArrowRight size={14} />
             </button>
          </div>
          
          <div className="p-6 pt-2 flex-1">
            <div className="space-y-4">
              {myPlacements.length > 0 ? (
                myPlacements.map((article) => (
                  <div key={article.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                    <img src={article.thumbnailUrl} alt={article.title} className="w-16 h-16 rounded-md object-cover bg-slate-200" />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                         <h4 className="text-sm font-bold text-slate-800 truncate pr-2 group-hover:text-blue-600">{article.title}</h4>
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${getStatusColor(article.status)}`}>
                           {article.status}
                         </span>
                       </div>
                       <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(article.views)} views</span>
                          <span className="flex items-center gap-1"><MousePointer2 size={12} /> {formatNumber(article.clicks)} clicks</span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">No active placements found.</div>
              )}
            </div>
            
            {myPlacements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Total Views</p>
                    <p className="text-lg font-bold text-slate-800">
                      {formatNumber(myPlacements.reduce((acc, curr) => acc + curr.views, 0))}
                    </p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Total Clicks</p>
                    <p className="text-lg font-bold text-slate-800">
                      {formatNumber(myPlacements.reduce((acc, curr) => acc + curr.clicks, 0))}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Tagged News / Mentions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-slate-800">Tagged News</h3>
               <p className="text-sm text-slate-500">Articles mentioning your brand or tags</p>
             </div>
             <button 
               onClick={() => onNavigate('tagged')}
               className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
             >
               View All <ArrowRight size={14} />
             </button>
          </div>
          
          <div className="p-6 pt-2 flex-1">
            <div className="space-y-1">
              {taggedNews.slice(0, 4).map((article) => (
                <div key={article.id} className="py-3 px-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-lg transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                     <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{article.category}</span>
                     <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={10} /> {article.publishDate}
                     </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-800 leading-snug group-hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h4>
                  <div className="flex gap-2 mt-2">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] text-slate-500 flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2">
               <button 
                  onClick={() => onNavigate('tagged')}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 Explore All News <ExternalLink size={14} />
               </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button for Audience Profile */}
      <button 
        onClick={() => setShowAudienceModal(true)}
        className="fixed bottom-8 right-8 z-30 bg-slate-900 text-white px-5 py-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-3 font-semibold group"
      >
        <Users className="group-hover:animate-pulse" />
        <span>View Audience Profile</span>
      </button>

      {/* Audience Profile Modal */}
      {showAudienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAudienceModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden transform transition-all scale-100">
             
             {/* Modal Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h2 className="text-xl font-bold text-slate-800">Audience Profile</h2>
                 <p className="text-sm text-slate-500">Who is reading your sponsored content?</p>
               </div>
               <button 
                 onClick={() => setShowAudienceModal(false)}
                 className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Modal Body */}
             <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Industries */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Top Industries</h4>
                    <div className="space-y-4">
                      {AUDIENCE_INDUSTRIES.map((ind, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-700 font-medium">{ind.label}</span>
                            <span className="text-slate-900 font-bold">{ind.value}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className={`${ind.color} h-2 rounded-full`} style={{ width: `${ind.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Seniority */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Job Seniority</h4>
                    <div className="flex gap-3 h-48 items-end">
                       {SENIORITY_LEVELS.map((level, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className={`w-full ${level.color} rounded-t-md transition-all hover:opacity-90 relative`} style={{ height: `${level.value * 2}%` }}>
                               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {level.value}%
                               </span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-2 text-center font-medium leading-tight h-8 flex items-center justify-center">
                              {level.label.split(' ')[0]}
                            </span>
                         </div>
                       ))}
                    </div>
                    <div className="mt-4 text-xs text-slate-500 text-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>68%</strong> of our audience are decision makers (Manager+ level).
                    </div>
                 </div>
               </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button 
                 onClick={() => setShowAudienceModal(false)}
                 className="text-sm font-medium text-blue-600 hover:text-blue-800"
               >
                 Close Overview
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;
```

**components/NewsFeed.tsx** (Filtered List & Pagination Logic)
```tsx
import React, { useState } from 'react';
import { Search, Filter, Eye, MousePointer2, Calendar, Tag, ExternalLink, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';
import { ArticleStatus } from '../types';

interface NewsFeedProps {
  mode?: 'placements' | 'tagged';
}

const NewsFeed: React.FC<NewsFeedProps> = ({ mode = 'placements' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter base articles based on mode
  const baseArticles = MOCK_ARTICLES.filter(a => 
    mode === 'placements' ? a.tags.includes('Sponsored') : !a.tags.includes('Sponsored')
  );

  // Extract unique years from filtered base articles
  const years = ['All', ...Array.from(new Set(baseArticles.map(a => new Date(a.publishDate).getFullYear().toString()))).sort().reverse()];

  // Filter Logic
  const filteredArticles = baseArticles.filter(article => {
    const articleYear = new Date(article.publishDate).getFullYear().toString();
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
    const matchesYear = yearFilter === 'All' || articleYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.PUBLISHED: return 'bg-emerald-100 text-emerald-700';
      case ArticleStatus.SCHEDULED: return 'bg-blue-100 text-blue-700';
      case ArticleStatus.DRAFT: return 'bg-slate-100 text-slate-700';
      case ArticleStatus.ARCHIVED: return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search news, tags, or categories..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          
          {/* Year Filter */}
          <div className="relative group min-w-[120px]">
             <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 cursor-pointer justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <span className="text-sm font-medium">{yearFilter === 'All' ? 'Year' : yearFilter}</span>
                </div>
             </div>
             <div className="absolute right-0 mt-1 w-full bg-white border border-slate-100 shadow-lg rounded-lg hidden group-hover:block z-20 p-1">
                {years.map(year => (
                  <button 
                    key={year} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-50 ${yearFilter === year ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                    onClick={() => { setYearFilter(year); setCurrentPage(1); }}
                  >
                    {year === 'All' ? 'All Years' : year}
                  </button>
                ))}
             </div>
          </div>

          {/* Status Filter */}
          <div className="relative group min-w-[140px]">
             <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 cursor-pointer justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  <span className="text-sm font-medium truncate">{statusFilter === 'All' ? 'Status' : statusFilter}</span>
                </div>
             </div>
             <div className="absolute right-0 mt-1 w-full bg-white border border-slate-100 shadow-lg rounded-lg hidden group-hover:block z-20 p-1">
                {['All', ...Object.values(ArticleStatus)].map(status => (
                  <button 
                    key={status} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-slate-50 ${statusFilter === status ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                    onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                  >
                    {status === 'All' ? 'All Statuses' : status}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
              <p className="text-slate-500">No {mode === 'placements' ? 'placements' : 'news'} found matching your criteria.</p>
            </div>
          ) : (
            paginatedArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">
                {/* Thumbnail - Shortened Height */}
                <div className="w-full md:w-40 h-32 md:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 relative shadow-inner">
                   <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                   <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(article.status)}`}>
                     {article.status}
                   </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {article.publishDate}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">{article.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 hover:text-blue-600 cursor-pointer line-clamp-1">{article.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>
                  </div>
                  
                  <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] rounded border border-slate-100">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Column */}
                <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-center gap-4 md:gap-2">
                   <div className="flex-1 md:flex-none">
                      <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Eye size={12}/> Views</p>
                      <p className="text-lg font-bold text-slate-800">{article.views.toLocaleString()}</p>
                   </div>
                   <div className="flex-1 md:flex-none">
                      <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><MousePointer2 size={12}/> Clicks</p>
                      <p className="text-lg font-bold text-slate-800">{article.clicks.toLocaleString()}</p>
                   </div>
                   <button className="w-auto md:w-full mt-auto py-2 px-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                     View Live <ExternalLink size={12} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-auto">
          <p className="text-sm text-slate-500 hidden sm:block">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredArticles.length)}</span> of <span className="font-medium">{filteredArticles.length}</span> results
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
             <button 
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
             >
               <ChevronLeft size={18} />
             </button>
             
             <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                 <button
                   key={page}
                   onClick={() => handlePageChange(page)}
                   className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                     currentPage === page 
                       ? 'bg-blue-600 text-white shadow-sm' 
                       : 'text-slate-600 hover:bg-slate-100'
                   }`}
                 >
                   {page}
                 </button>
               ))}
             </div>

             <button 
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
               className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
             >
               <ChevronRight size={18} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
```

**components/LeadsTable.tsx** (Table Logic)
```tsx
import React, { useState } from 'react';
import { Download, Search, Mail, Phone, MapPin, Building2, MoreHorizontal } from 'lucide-react';
import { MOCK_LEADS } from '../constants';
import { LeadStatus } from '../types';

const LeadsTable: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(filter.toLowerCase()) ||
    lead.email.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700';
      case LeadStatus.CONTACTED: return 'bg-yellow-100 text-yellow-700';
      case LeadStatus.QUALIFIED: return 'bg-purple-100 text-purple-700';
      case LeadStatus.CONVERTED: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Generated Leads</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Info</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Captured</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {lead.contactName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{lead.contactName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {lead.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-slate-900 flex items-center gap-2">
                     <Building2 size={14} className="text-slate-400" /> {lead.companyName}
                   </div>
                   <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5">
                     <span className="flex items-center gap-1"><MapPin size={10} /> {lead.country}</span>
                     <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {lead.capturedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-slate-400 hover:text-blue-600">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
         <span>Showing {filteredLeads.length} entries</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white">Next</button>
         </div>
      </div>
    </div>
  );
};

export default LeadsTable;
```

**components/StatCard.tsx** (UI Component)
```tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel = 'vs last month',
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trendLabel && <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>}
      </div>
    </div>
  );
};

export default StatCard;
```

**components/Sidebar.tsx** (Layout & Nav)
```tsx
import React from 'react';
import { LayoutDashboard, Newspaper, Users, LogOut, Globe, Tag } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'news', label: 'My Placements', icon: Newspaper },
    { id: 'tagged', label: 'Tagged News', icon: Tag },
    { id: 'leads', label: 'Leads', icon: Users },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
    >
      <div className="h-full flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Globe size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">PartnerPulse</h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/100/100?random=user" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
               <p className="text-sm font-semibold text-white">Acme Corp</p>
               <p className="text-xs text-slate-500">Gold Partner</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
```

**components/Header.tsx** (Layout)
```tsx
import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 capitalize">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
```