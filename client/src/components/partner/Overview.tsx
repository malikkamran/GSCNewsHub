import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Users, Globe2, Clock, Briefcase, ArrowRight, Eye, MousePointer2, ExternalLink, Calendar, Tag, X, FileText } from 'lucide-react';
import StatCard from './StatCard';
import { AUDIENCE_INDUSTRIES, SENIORITY_LEVELS } from '../../lib/partner-constants';
import { ArticleStatus } from '../../lib/partner-types';
import { SiteStatistics, Article } from '@shared/schema';
import { format } from 'date-fns';

interface OverviewProps {
  onNavigate: (view: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: siteStats } = useQuery({
    queryKey: ['/api/site-statistics'],
  });

  const { data: partnerArticles = [] } = useQuery({
    queryKey: ['/api/articles/partner', user?.partnerCategoryId],
    enabled: !!user?.partnerCategoryId,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return Users;
      case 'globe': return Globe2;
      case 'file-text': return FileText;
      case 'clock': return Clock;
      case 'briefcase': return Briefcase;
      default: return Globe2;
    }
  };

  const getColor = (index: number) => {
    const colors = ['blue', 'purple', 'green', 'orange'];
    return colors[index % colors.length] as 'blue' | 'purple' | 'green' | 'orange';
  };

  // Filter for My Placements (using all partner articles for now as they are "placements")
  const myPlacements = partnerArticles;
  
  // Tagged News - for now using same list but maybe we can differentiate later
  const taggedNews = partnerArticles;

  return (
    <div className="space-y-10 animate-fade-in relative pb-24">
      
      {/* Section 1: Website Value Stats */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Website Reach & Performance</h2>
          <p className="text-sm text-gray-500 mt-1">Why top brands choose to partner with us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteStats ? (
            siteStats.map((stat: SiteStatistics, index: number) => (
              <StatCard 
                key={stat.id}
                title={stat.label}
                value={stat.value}
                icon={getIcon(stat.icon)}
                color={getColor(index)}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-4">Loading stats...</div>
          )}
        </div>
      </div>

      {/* Section 2: Placements & Mentions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: My Recent Placements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-gray-900">My Recent Placements</h3>
               <p className="text-sm text-gray-500">Sponsored articles performance</p>
             </div>
             <button 
               onClick={() => onNavigate('news')}
               className="text-sm font-medium text-[#BB1919] hover:text-red-700 flex items-center gap-1 hover:underline"
             >
               View All <ArrowRight size={14} />
             </button>
          </div>
          
          <div className="p-6 pt-2 flex-1">
            <div className="space-y-4">
              {myPlacements.length > 0 ? (
                myPlacements.slice(0, 3).map((article: Article) => (
                  <div 
                    key={article.id} 
                    className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                    onClick={() => setLocation(`/article/${article.slug}`)}
                  >
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-16 h-16 rounded-md object-cover bg-gray-200" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/100?text=News";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                         <h4 className="text-sm font-bold text-gray-900 truncate pr-2 group-hover:text-[#BB1919]">{article.title}</h4>
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${getStatusColor(article.status)}`}>
                           {article.status}
                         </span>
                       </div>
                       <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(article.views || 0)} views</span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No active placements found.</div>
              )}
            </div>
            
            {myPlacements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 gap-4">
                 <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Views</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(myPlacements.reduce((acc: number, curr: Article) => acc + (curr.views || 0), 0))}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Tagged News / Mentions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-gray-900">Tagged News</h3>
               <p className="text-sm text-gray-500">Articles mentioning your brand or tags</p>
             </div>
             <button 
               onClick={() => onNavigate('tagged')}
               className="text-sm font-medium text-[#BB1919] hover:text-red-700 flex items-center gap-1 hover:underline"
             >
               View All <ArrowRight size={14} />
             </button>
          </div>
          
          <div className="p-6 pt-2 flex-1">
            <div className="space-y-1">
              {taggedNews.length > 0 ? (
                taggedNews.slice(0, 4).map((article: Article) => (
                  <div 
                    key={article.id} 
                    className="py-3 px-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                    onClick={() => setLocation(`/article/${article.slug}`)}
                  >
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                         {/* We need to fetch category name, but for now just show ID or skip */}
                         Category {article.categoryId}
                       </span>
                       <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                       </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 leading-snug group-hover:text-[#BB1919] cursor-pointer truncate">
                      {article.title}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      {article.tags && article.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] text-gray-500 flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No tagged news found.</div>
              )}
            </div>
            <div className="mt-4 pt-2">
               <button 
                  onClick={() => onNavigate('tagged')}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
        className="fixed bottom-8 right-8 z-30 bg-[#BB1919] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-3 font-semibold group"
      >
        <Users className="group-hover:animate-pulse" />
        <span>View Audience Profile</span>
      </button>

      {/* Audience Profile Modal */}
      {showAudienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAudienceModal(false)}></div>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden transform transition-all scale-100">
             
             {/* Modal Header */}
             <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Audience Profile</h2>
                 <p className="text-sm text-gray-500">Who is reading your sponsored content?</p>
               </div>
               <button 
                 onClick={() => setShowAudienceModal(false)}
                 className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>

             {/* Modal Body */}
             <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Industries */}
                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Industries</h4>
                    <div className="space-y-4">
                      {AUDIENCE_INDUSTRIES.map((ind, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-700 font-medium">{ind.label}</span>
                            <span className="text-gray-900 font-bold">{ind.value}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`${ind.color} h-2 rounded-full`} style={{ width: `${ind.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Seniority */}
                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Job Seniority</h4>
                    <div className="flex gap-3 h-48 items-end">
                       {SENIORITY_LEVELS.map((level, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className={`w-full ${level.color} rounded-t-md transition-all hover:opacity-90 relative`} style={{ height: `${level.value * 2}%` }}>
                               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {level.value}%
                               </span>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-2 text-center font-medium leading-tight h-8 flex items-center justify-center">
                              {level.label.split(' ')[0]}
                            </span>
                         </div>
                       ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <strong>68%</strong> of our audience are decision makers (Manager+ level).
                    </div>
                 </div>
               </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
               <button 
                 onClick={() => setShowAudienceModal(false)}
                 className="text-sm font-medium text-[#BB1919] hover:text-red-800"
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
