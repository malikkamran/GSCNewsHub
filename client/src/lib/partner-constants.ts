import { Article, ArticleStatus, DashboardSummary, Lead, LeadStatus, PlatformStat, DemographicStat } from './partner-types';

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
