import React, { useState } from 'react';
import { Search, Filter, Eye, MousePointer2, Calendar, Tag, ExternalLink, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { MOCK_ARTICLES } from '../../lib/partner-constants';
import { ArticleStatus, Article } from '../../lib/partner-types';
import { useAuth } from '../../hooks/use-auth';
import { useQuery } from '@tanstack/react-query';

interface NewsFeedProps {
  mode?: 'placements' | 'tagged';
}

const NewsFeed: React.FC<NewsFeedProps> = ({ mode = 'placements' }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch tagged articles if in tagged mode
  const { data: taggedArticles, isLoading } = useQuery<any[]>({
    queryKey: ['/api/articles/partner', user?.partnerCategoryId],
    queryFn: async () => {
      if (!user?.partnerCategoryId) return [];
      const res = await fetch(`/api/articles/partner/${user.partnerCategoryId}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
    enabled: mode === 'tagged' && !!user?.partnerCategoryId
  });

  // Map backend articles to frontend format
  const mappedTaggedArticles: Article[] = React.useMemo(() => {
    if (!taggedArticles) return [];
    return taggedArticles.map((a: any) => ({
      id: a.id.toString(),
      title: a.title,
      excerpt: a.summary,
      thumbnailUrl: a.imageUrl,
      publishDate: new Date(a.publishedAt).toISOString().split('T')[0],
      status: (a.status.charAt(0).toUpperCase() + a.status.slice(1)) as ArticleStatus,
      views: a.views || 0,
      clicks: 0, // Not available in DB yet
      tags: a.tags || [],
      category: 'News' // Default category name since we only have ID
    }));
  }, [taggedArticles]);

  // Filter base articles based on mode
  const baseArticles = mode === 'tagged' 
    ? mappedTaggedArticles
    : MOCK_ARTICLES.filter((a: Article) => a.tags.includes('Sponsored'));

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
      case ArticleStatus.PUBLISHED: return 'bg-green-100 text-green-700';
      case ArticleStatus.SCHEDULED: return 'bg-blue-100 text-blue-700';
      case ArticleStatus.DRAFT: return 'bg-gray-100 text-gray-700';
      case ArticleStatus.ARCHIVED: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in flex flex-col min-h-[calc(100vh-140px)] pb-12">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search news, tags, or categories..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BB1919] focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          
          {/* Year Filter */}
          <div className="relative group min-w-[120px]">
             <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-gray-600 bg-white hover:bg-gray-50 cursor-pointer justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <span className="text-sm font-medium">{yearFilter === 'All' ? 'Year' : yearFilter}</span>
                </div>
             </div>
             <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-20 p-1">
                {years.map(year => (
                  <button 
                    key={year} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${yearFilter === year ? 'bg-gray-100 text-[#BB1919]' : 'text-gray-600'}`}
                    onClick={() => { setYearFilter(year); setCurrentPage(1); }}
                  >
                    {year === 'All' ? 'All Years' : year}
                  </button>
                ))}
             </div>
          </div>

          {/* Status Filter */}
          <div className="relative group min-w-[140px]">
             <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-gray-600 bg-white hover:bg-gray-50 cursor-pointer justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  <span className="text-sm font-medium truncate">{statusFilter === 'All' ? 'Status' : statusFilter}</span>
                </div>
             </div>
             <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-20 p-1">
                {['All', ...Object.values(ArticleStatus)].map(status => (
                  <button 
                    key={status} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${statusFilter === status ? 'bg-gray-100 text-[#BB1919]' : 'text-gray-600'}`}
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
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
              <p className="text-gray-500">No {mode === 'placements' ? 'placements' : 'news'} found matching your criteria.</p>
            </div>
          ) : (
            paginatedArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">
                {/* Thumbnail - Shortened Height */}
                <div className="w-full md:w-40 h-32 md:h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 relative shadow-inner">
                   <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                   <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(article.status)}`}>
                     {article.status}
                   </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {article.publishDate}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[#BB1919] font-medium">{article.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#BB1919] cursor-pointer line-clamp-1">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  </div>
                  
                  <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-200">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Column */}
                <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-center gap-4 md:gap-2">
                   <div className="flex-1 md:flex-none">
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Eye size={12}/> Views</p>
                      <p className="text-lg font-bold text-gray-900">{article.views.toLocaleString()}</p>
                   </div>
                   <div className="flex-1 md:flex-none">
                      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><MousePointer2 size={12}/> Clicks</p>
                      <p className="text-lg font-bold text-gray-900">{article.clicks.toLocaleString()}</p>
                   </div>
                   <button className="w-auto md:w-full mt-auto py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#BB1919] text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2">
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
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
          <p className="text-sm text-gray-500 hidden sm:block">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredArticles.length)}</span> of <span className="font-medium">{filteredArticles.length}</span> results
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === page 
                      ? 'bg-[#BB1919] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
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
