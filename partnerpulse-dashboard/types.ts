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