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