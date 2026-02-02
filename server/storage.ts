import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  articles, type Article, type InsertArticle,
  analysts, type Analyst, type InsertAnalyst,
  analysis, type Analysis, type InsertAnalysis,
  videos, type Video, type InsertVideo,
  userPreferences, type UserPreferences, type InsertUserPreferences,
  adPlacements, type AdPlacement, type InsertAdPlacement,
  advertisements, type Advertisement, type InsertAdvertisement,
  networks, type Network, type InsertNetwork,
  contents, type Content, type InsertContent,
  siteStatistics, type SiteStatistics, type InsertSiteStatistics
} from "@shared/schema";
import { DatabaseStorage } from "./storage-db";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Site Statistics operations
  getSiteStatistics(): Promise<SiteStatistics[]>;
  getSiteStatisticByKey(key: string): Promise<SiteStatistics | undefined>;
  createSiteStatistic(stat: InsertSiteStatistics): Promise<SiteStatistics>;
  updateSiteStatistic(key: string, stat: Partial<InsertSiteStatistics>): Promise<SiteStatistics | undefined>;
  
  // Network operations
  getNetworks(): Promise<Network[]>;
  getNetwork(id: number): Promise<Network | undefined>;
  getNetworkBySlug(slug: string): Promise<Network | undefined>;
  createNetwork(network: InsertNetwork): Promise<Network>;
  updateNetwork(id: number, network: Partial<InsertNetwork>): Promise<Network | undefined>;
  deleteNetwork(id: number): Promise<boolean>;
  
  // User Preferences operations
  getUserPreferences(userId: number): Promise<UserPreferences[]>;
  getUserPreferencesByCategory(userId: number, categoryId: number): Promise<UserPreferences | undefined>;
  createUserPreference(preference: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreference(id: number, preference: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;
  deleteUserPreference(id: number): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoriesByNetwork(networkId: number): Promise<Category[]>;
  getChildCategories(parentId: number): Promise<Category[]>;

  // Article operations
  getArticles(limit?: number, offset?: number, status?: string): Promise<Article[]>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByPartnerCategory(partnerCategoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticleCountByCategory(categoryId: number, status?: string): Promise<number>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticle(id: number): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getMostViewedArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: InsertArticle): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementArticleViews(id: number): Promise<Article | undefined>;
  
  // Content operations
  getContentsByNetwork(networkId: number, limit?: number, offset?: number): Promise<Content[]>;
  getContentsByCategory(categoryId: number, limit?: number, offset?: number): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Search operations
  searchArticles(
    query: string,
    limit?: number,
    offset?: number,
    useAI?: boolean,
  ): Promise<{ articles: Article[]; total: number; enhancedQuery?: string; queryContext?: string }>;

  // Analyst operations
  getAnalysts(): Promise<Analyst[]>;
  getAnalyst(id: number): Promise<Analyst | undefined>;
  createAnalyst(analyst: InsertAnalyst): Promise<Analyst>;

  // Analysis operations
  getAnalysisArticles(limit?: number): Promise<Analysis[]>;
  getAnalysisBySlug(slug: string): Promise<Analysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;

  // Video operations
  getVideos(limit?: number): Promise<Video[]>;
  getFeaturedVideo(): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;

  // Ad Placement operations
  getAdPlacements(): Promise<AdPlacement[]>;
  getAdPlacementsByPage(page: string): Promise<AdPlacement[]>;
  getAdPlacementsBySection(section: string): Promise<AdPlacement[]>;
  getAdPlacementsByPageAndSection(page: string, section: string): Promise<AdPlacement[]>;
  getAdPlacement(id: number): Promise<AdPlacement | undefined>;
  getAdPlacementBySlot(slot: string): Promise<AdPlacement | undefined>;
  createAdPlacement(placement: InsertAdPlacement): Promise<AdPlacement>;
  updateAdPlacement(id: number, placement: Partial<InsertAdPlacement>): Promise<AdPlacement | undefined>;
  deleteAdPlacement(id: number): Promise<boolean>;
  
  // Advertisement operations
  getAdvertisements(): Promise<Advertisement[]>;
  getActiveAdvertisements(): Promise<Advertisement[]>;
  getAdvertisementsByPlacement(placementId: number): Promise<Advertisement[]>;
  getAdvertisement(id: number): Promise<Advertisement | undefined>;
  getActiveAdvertisementForPlacement(placementId: number): Promise<Advertisement | undefined>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: number, ad: Partial<InsertAdvertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: number): Promise<boolean>;
  incrementAdClick(id: number): Promise<Advertisement | undefined>;
  incrementAdView(id: number): Promise<Advertisement | undefined>;
}

export interface SeedSnapshot {
  users: User[];
  categories: Category[];
  articles: Article[];
  analysts: Analyst[];
  analysis: Analysis[];
  videos: Video[];
  userPreferences: UserPreferences[];
  adPlacements: AdPlacement[];
  advertisements: Advertisement[];
  siteStatistics: SiteStatistics[];
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private networks: Map<number, Network>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private contents: Map<number, Content>;
  private analysts: Map<number, Analyst>;
  private analysis: Map<number, Analysis>;
  private videos: Map<number, Video>;
  private userPreferences: Map<number, UserPreferences>;
  private adPlacements: Map<number, AdPlacement>;
  private advertisements: Map<number, Advertisement>;
  private siteStatistics: Map<number, SiteStatistics>;
  
  private userId: number = 1;
  private networkId: number = 1;
  private categoryId: number = 1;
  private articleId: number = 1;
  private contentId: number = 1;
  private analystId: number = 1;
  private analysisId: number = 1;
  private videoId: number = 1;
  private userPreferenceId: number = 1;
  private adPlacementId: number = 1;
  private advertisementId: number = 1;
  private siteStatisticsId: number = 1;

  constructor() {
    this.users = new Map();
    this.networks = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.contents = new Map();
    this.analysts = new Map();
    this.analysis = new Map();
    this.videos = new Map();
    this.userPreferences = new Map();
    this.adPlacements = new Map();
    this.advertisements = new Map();
    this.siteStatistics = new Map();
    
    // Initialize with default categories
    this.initializeData();
  }

  private initializeData() {
    // Initialize site statistics
    const defaultStats: InsertSiteStatistics[] = [
      {
        key: 'monthly_visitors',
        value: '2.4M',
        label: 'Monthly Unique Visitors',
        changePercentage: 12,
        icon: 'users',
        updatedBy: 1
      },
      {
        key: 'global_partners',
        value: '150+',
        label: 'Global Partners',
        changePercentage: 8,
        icon: 'globe',
        updatedBy: 1
      },
      {
        key: 'news_articles',
        value: '12K+',
        label: 'News Articles',
        changePercentage: 24,
        icon: 'file-text',
        updatedBy: 1
      },
      {
        key: 'avg_engagement',
        value: '18min',
        label: 'Avg. Engagement Time',
        changePercentage: 5,
        icon: 'clock',
        updatedBy: 1
      }
    ];

    defaultStats.forEach(stat => this.createSiteStatistic(stat));

    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@gscnews.co",
      role: "admin"
    });

    // Create default partner user
    this.createUser({
      username: "gla",
      password: "Partner2024!",
      email: "gla@partner.com",
      role: "partner",
      firstName: "GLA",
      lastName: "Network"
    });
    
    // Create categories matching our navigation menu
    const categoryData: InsertCategory[] = [
      { name: "Logistics", slug: "logistics" },
      { name: "Warehousing", slug: "warehousing" },
      { name: "Procurement", slug: "procurement" },
      { name: "Manufacturing", slug: "manufacturing" },
      { name: "Tech & Digital", slug: "tech-digital" },
      { name: "Sustainability", slug: "sustainability" },
      { name: "Market Insights", slug: "market-insights" },
      { name: "Trade Policy", slug: "trade-policy" },
      { name: "Risk & Security", slug: "risk-security" },
      { name: "E-commerce", slug: "e-commerce" },
      { name: "Infrastructure", slug: "infrastructure" },
      { name: "Cold Chain", slug: "cold-chain" },
      { name: "Events & Conferences", slug: "events-conferences" },
      { name: "Company Profiles", slug: "company-profiles" },
      { name: "Innovation", slug: "innovation" },
      { name: "Logistics Networks", slug: "logistics-networks" },
      { name: "GLA (Global Logistics Alliance)", slug: "gla" },
      { name: "WCA World", slug: "wca-world" },
      { name: "JC Trans Networks", slug: "jc-trans-networks" }
    ];
    
    categoryData.forEach(category => this.createCategory(category));
    
    // Get references to the created categories
    const logisticsCategory = Array.from(this.categories.values()).find(c => c.slug === "logistics");
    const warehousingCategory = Array.from(this.categories.values()).find(c => c.slug === "warehousing");
    const procurementCategory = Array.from(this.categories.values()).find(c => c.slug === "procurement");
    const manufacturingCategory = Array.from(this.categories.values()).find(c => c.slug === "manufacturing");
    const techDigitalCategory = Array.from(this.categories.values()).find(c => c.slug === "tech-digital");
    const sustainabilityCategory = Array.from(this.categories.values()).find(c => c.slug === "sustainability");
    const marketInsightsCategory = Array.from(this.categories.values()).find(c => c.slug === "market-insights");
    const tradePolicyCategory = Array.from(this.categories.values()).find(c => c.slug === "trade-policy");
    const riskSecurityCategory = Array.from(this.categories.values()).find(c => c.slug === "risk-security");
    const ecommerceCategory = Array.from(this.categories.values()).find(c => c.slug === "e-commerce");
    const infrastructureCategory = Array.from(this.categories.values()).find(c => c.slug === "infrastructure");
    const eventsConferencesCategory = Array.from(this.categories.values()).find(c => c.slug === "events-conferences");
    const logisticsNetworksCategory = Array.from(this.categories.values()).find(c => c.slug === "logistics-networks");
    const glaCategory = Array.from(this.categories.values()).find(c => c.slug === "gla");
    const wcaCategory = Array.from(this.categories.values()).find(c => c.slug === "wca-world");
    const jcTransCategory = Array.from(this.categories.values()).find(c => c.slug === "jc-trans-networks");
    
    const glaNetId = this.networkId++;
    const wcaNetId = this.networkId++;
    const jcNetId = this.networkId++;
    this.networks.set(glaNetId, { id: glaNetId, name: "GLA (Global Logistics Alliance)", slug: "gla", description: null, logoUrl: null, createdAt: new Date() } as Network);
    this.networks.set(wcaNetId, { id: wcaNetId, name: "WCA World", slug: "wca-world", description: null, logoUrl: null, createdAt: new Date() } as Network);
    this.networks.set(jcNetId, { id: jcNetId, name: "JC Trans Networks", slug: "jc-trans-networks", description: null, logoUrl: null, createdAt: new Date() } as Network);
    if (glaCategory) {
      this.updateCategory(glaCategory.id, { name: glaCategory.name, slug: glaCategory.slug, parentId: null, networkId: glaNetId, level: 1, order: 0 });
      
      // Update GLA user with partner category ID
      const glaUser = Array.from(this.users.values()).find(u => u.username === "gla");
      if (glaUser) {
        this.updateUser(glaUser.id, { partnerCategoryId: glaCategory.id });
      }
    }
    if (wcaCategory) {
      this.updateCategory(wcaCategory.id, { name: wcaCategory.name, slug: wcaCategory.slug, parentId: null, networkId: wcaNetId, level: 1, order: 0 });
    }
    if (jcTransCategory) {
      this.updateCategory(jcTransCategory.id, { name: jcTransCategory.name, slug: jcTransCategory.slug, parentId: null, networkId: jcNetId, level: 1, order: 0 });
    }
    
    if (logisticsCategory && warehousingCategory && procurementCategory && manufacturingCategory && 
        techDigitalCategory && sustainabilityCategory && marketInsightsCategory && tradePolicyCategory && 
        riskSecurityCategory && ecommerceCategory) {
      
      // LOGISTICS CATEGORY
      this.createArticle({
        title: "Red Sea Crisis Triggers Global Supply Chain Rerouting",
        slug: "red-sea-crisis-global-supply-chain-rerouting",
        summary: "Escalating tensions force shipping companies to adopt costly detours around Africa.",
        content: "Ongoing security concerns in the Red Sea have forced major shipping companies to reroute vessels around the Cape of Good Hope, adding up to 14 days to journey times and significantly increasing transportation costs. The crisis continues to disrupt one of the world's most critical maritime trade routes affecting businesses worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        categoryId: logisticsCategory.id,
        featured: true,
        publishedAt: new Date()
      });
      
      this.createArticle({
        title: "Panama Canal Drought Creates New Global Trade Bottleneck",
        slug: "panama-canal-drought-global-trade-bottleneck",
        summary: "Record low water levels slash Panama Canal capacity by 40%, disrupting key shipping routes.",
        content: "The Panama Canal is operating at drastically reduced capacity due to historic drought conditions, creating backlogs and disrupting global shipping patterns. Canal authorities have been forced to limit daily transits and reduce maximum ship draft, impacting countless shipments.",
        imageUrl: "https://images.unsplash.com/photo-1565264685538-c83c255de90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: logisticsCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Air Freight Rates Surge Amid Capacity Constraints",
        slug: "air-freight-rates-surge-capacity-constraints",
        summary: "Global air cargo prices increase 25% as demand outpaces available capacity.",
        content: "Air freight rates have reached a two-year high as e-commerce growth and supply chain disruptions drive increased demand for expedited shipping. Industry analysts predict continued rate volatility through year-end as carriers struggle to add capacity.",
        imageUrl: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: logisticsCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      });
      
      // WAREHOUSING CATEGORY
      this.createArticle({
        title: "Retail Giants Battle for Warehouse Space as E-commerce Booms",
        slug: "retail-giants-battle-warehouse-space-ecommerce",
        summary: "Industrial real estate prices soar to record highs in major logistics hubs worldwide.",
        content: "Competition for prime warehouse locations has intensified to unprecedented levels as retailers race to expand their e-commerce fulfillment capabilities. Industrial real estate prices in top logistics hubs have surged more than 40% since 2021, with vacancy rates in key markets falling below 2%.",
        imageUrl: "https://images.unsplash.com/photo-1566686209349-1e6657933a3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: warehousingCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Micro-Fulfillment Centers Reshape Urban Distribution Strategy",
        slug: "micro-fulfillment-centers-urban-distribution",
        summary: "Retailers invest in compact, automated facilities to enable faster urban deliveries.",
        content: "Leading retailers are converting urban retail space into compact, highly automated micro-fulfillment centers to support same-day delivery promises. These facilities use dense storage systems and AI-powered picking robots to maximize efficiency in smaller footprints.",
        imageUrl: "https://images.unsplash.com/photo-1586528116023-32477fff2847?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: warehousingCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      });
      
      // PROCUREMENT CATEGORY
      this.createArticle({
        title: "Supply Diversification Becomes Top Procurement Priority",
        slug: "supply-diversification-procurement-priority",
        summary: "Companies implement multi-sourcing strategies to mitigate dependency risks.",
        content: "Chief Procurement Officers are rapidly reconfiguring supply networks to reduce geographic concentration risks, with 78% of Fortune 500 companies now requiring at least dual sourcing for critical components. The shift represents a fundamental change from pre-pandemic efficiency-focused procurement models.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: procurementCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "AI-Powered Procurement Platforms Transform Sourcing Efficiency",
        slug: "ai-procurement-platforms-transform-sourcing",
        summary: "Machine learning algorithms reduce sourcing cycles by 63% while improving supplier matches.",
        content: "Next-generation procurement platforms utilizing artificial intelligence are revolutionizing how companies identify and evaluate suppliers. These systems analyze vast amounts of supplier data to predict performance, compliance risks, and price trends before contracts are signed.",
        imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: procurementCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000)
      });
      
      // MANUFACTURING CATEGORY  
      this.createArticle({
        title: "Industrial IoT Adoption Accelerates in Manufacturing Sector",
        slug: "industrial-iot-adoption-manufacturing-sector",
        summary: "Connected factory implementations increase 47% as manufacturers pursue data-driven operations.",
        content: "Manufacturers are deploying Industrial Internet of Things (IIoT) sensors and platforms at unprecedented rates, creating connected production environments that generate real-time performance data. These investments are enabling predictive maintenance, quality control automation, and dynamic production scheduling.",
        imageUrl: "https://images.unsplash.com/photo-1565047571180-88762d8e4588?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: manufacturingCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Reshoring Trend Gains Momentum Across Manufacturing Sectors",
        slug: "reshoring-trend-gains-momentum-manufacturing",
        summary: "Labor cost advantages narrow as companies prioritize supply chain resilience and security.",
        content: "A significant shift toward domestic manufacturing continues to build momentum as total cost calculations increasingly favor production closer to end markets. Automation technologies are helping companies overcome historical labor cost disadvantages while reducing transportation risks and carbon footprints.",
        imageUrl: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: manufacturingCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000)
      });
      
      // TECH & DIGITAL CATEGORY
      this.createArticle({
        title: "Digital Twins Revolutionize Supply Chain Planning",
        slug: "digital-twins-revolutionize-supply-chain-planning",
        summary: "Virtual replicas enable real-time simulation, reducing disruption impact by 60%.",
        content: "Leading manufacturers are increasingly adopting 'digital twin' technology to create virtual replicas of their entire supply chains, enabling unprecedented visibility and simulation capabilities. These virtual models allow companies to test scenarios and predict outcomes before implementing changes in the physical world.",
        imageUrl: "https://images.unsplash.com/photo-1581092921461-7289bd80a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: techDigitalCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Quantum Computing Makes Breakthrough in Supply Chain Optimization",
        slug: "quantum-computing-breakthrough-supply-chain-optimization",
        summary: "New algorithm solves complex logistics problems 100x faster than conventional methods.",
        content: "Researchers have developed a quantum computing algorithm capable of solving complex supply chain optimization problems exponentially faster than classical computing approaches. The breakthrough could transform how companies manage large-scale logistics networks with hundreds of variables.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: techDigitalCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
      });
      
      // SUSTAINABILITY CATEGORY
      this.createArticle({
        title: "Major Retailers Invest in Electric Delivery Fleets to Cut Emissions",
        slug: "retailers-electric-delivery-fleets",
        summary: "Retail companies transitioning to EVs for last-mile delivery as part of sustainability initiatives.",
        content: "Several of the world's largest retailers have announced significant investments in electric delivery vehicles as part of broader initiatives to reduce carbon emissions. These transitions align with emerging regulations restricting diesel vehicles in urban centers while meeting customer demands for greener delivery options.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: sustainabilityCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Circular Supply Chain Models Gain Traction in Consumer Goods",
        slug: "circular-supply-chain-models-consumer-goods",
        summary: "Manufacturers redesign products and packaging for reuse, refurbishment, and recycling.",
        content: "Consumer goods companies are redesigning their supply chains to support circular economy principles, implementing take-back programs and developing products specifically engineered for multiple life cycles. These initiatives respond to regulatory pressures, resource constraints, and growing consumer eco-consciousness.",
        imageUrl: "https://images.unsplash.com/photo-1585202570039-408f40e67db6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: sustainabilityCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      });
      
      // MARKET INSIGHTS CATEGORY
      this.createArticle({
        title: "Amazon Launches Massive Supply Chain Expansion Initiative",
        slug: "amazon-supply-chain-expansion-initiative",
        summary: "E-commerce giant to invest $15 billion in new fulfillment centers and transportation networks.",
        content: "Amazon has unveiled an ambitious $15 billion supply chain expansion plan designed to reduce delivery times and decrease dependency on third-party logistics providers. The multi-year initiative includes constructing 23 new fulfillment centers and enhancing last-mile delivery capabilities globally.",
        imageUrl: "https://images.unsplash.com/photo-1540544093-9d5d2d9c8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: marketInsightsCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Supply Chain Startups Attract Record Venture Capital Investment",
        slug: "supply-chain-startups-venture-capital-investment",
        summary: "Logistics innovation companies secure $15.2 billion in funding as global disruptions continue.",
        content: "Venture capital investment in supply chain technology startups reached an all-time high of $15.2 billion in the first half of 2024, nearly double the amount raised during the same period last year. The surge reflects growing recognition of logistics modernization as a critical business priority.",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: marketInsightsCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      });
      
      // LOGISTICS NETWORKS CATEGORY OVERVIEW
      if (logisticsNetworksCategory) {
        this.createArticle({
          title: "Global Logistics Networks: How Alliances Drive Reach and Reliability",
          slug: "global-logistics-networks-overview",
          summary: "Why logistics alliances matter for coverage, compliance, and service quality.",
          content: "Logistics networks aggregate vetted forwarders and service providers under shared standards, enabling global reach with local expertise. Alliances support cross-border compliance, consistent service levels, and collaborative procurement while preserving independent ownership.",
          imageUrl: "https://images.unsplash.com/photo-1556909211-3693eeb31f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: logisticsNetworksCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        });
      }
      
      // FEATURED TOP NEWS (exactly 5 items)
      const topNewsItems: { title: string; slug: string; summary: string; content: string; imageUrl: string; categoryId: number; publishedBy: string; publishedAt: Date }[] = [
        {
          title: "Ocean Capacity Tightens as Asia–Europe Bookings Surge",
          slug: "ocean-capacity-tightens-asia-europe-bookings-surge",
          summary: "Shippers face reduced free time and rolling schedules amid renewed demand.",
          content: "Container shipping lanes linking Asia and North Europe saw a sharp rebound in bookings over the past two weeks, prompting carriers to trim free time allowances and adjust schedules. Forwarders report tighter space controls and a preference for longer-term allocations over ad-hoc spot bookings. While rates remain below last year’s peaks, volatility has returned to the major east–west corridors. Analysts attribute the surge to replenishment cycles, delayed orders clearing customs, and early seasonal demand signals. Importers are advised to confirm documentation readiness, ensure terminal cut-off compliance, and monitor transshipment exposures. Rail alternatives are being evaluated for time-sensitive goods, though capacity is limited and subject to weather constraints.",
          imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?fm=webp&w=1200&h=800&fit=crop&q=80",
          categoryId: logisticsCategory.id,
          publishedBy: "Byline: Alex Morgan",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          title: "Warehousing Robotics Adoption Accelerates in 2026",
          slug: "warehousing-robotics-adoption-accelerates-2026",
          summary: "Operators report double-digit productivity gains in pilot sites.",
          content: "Distribution centers across North America and Europe continue to expand pilot deployments of autonomous mobile robots and goods-to-person systems. Early adopters report double-digit improvements in pick productivity and cycle-time reductions, particularly in facilities handling e‑commerce SKUs with high variability. Integrators highlight the importance of layout optimization, safety zoning, and labor change management during rollout. While capital expenditure remains a hurdle for smaller operators, subscription models are gaining traction. Inventory accuracy improvements are a secondary benefit as systems enforce scan discipline and location integrity. Observers expect consolidation among robotics vendors and WMS providers to simplify integrations and lifecycle support.",
          imageUrl: "https://images.unsplash.com/photo-1586528116023-32477fff2847?fm=webp&w=1200&h=800&fit=crop&q=80",
          categoryId: warehousingCategory.id,
          publishedBy: "Byline: Priya Shah",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          title: "Manufacturers Pivot to Nearshore Assembly for Faster Replenishment",
          slug: "manufacturers-pivot-nearshore-assembly-faster-replenishment",
          summary: "Lead-time compression and risk diversification top the agenda.",
          content: "A growing number of manufacturers are transitioning parts of their assembly operations to nearshore locations to compress lead times and diversify risk. Executives cite shipping unpredictability, geopolitical exposure, and demand variability as catalysts for the shift. Component kitting remains centralized, but final assembly and configuration are moving closer to end markets, enabling faster replenishment and reduced working capital. Consultants recommend revisiting inventory segmentation, supplier onboarding processes, and quality escape containment plans prior to transition. Logistics players anticipate increased regional cross‑docking, multi‑modal flows, and more stringent milestone capture across inland nodes.",
          imageUrl: "https://images.unsplash.com/photo-1565047571180-88762d8e4588?fm=webp&w=1200&h=800&fit=crop&q=80",
          categoryId: manufacturingCategory.id,
          publishedBy: "Byline: Elena Rossi",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
        {
          title: "Digital Freight Platforms Add Predictive ETAs for Complex Lanes",
          slug: "digital-freight-platforms-add-predictive-etas-complex-lanes",
          summary: "New models improve reliability on transshipment‑heavy corridors.",
          content: "Freight technology providers have launched upgraded ETA engines targeting corridors with multiple transshipment points. The systems blend carrier schedules, AIS, weather feeds, and historical cycle‑time variance to produce more reliable estimates. Forwarders say predictive capabilities help align drayage and warehouse labor, reduce idle time, and improve invoice accuracy. Customers welcome improved transparency but stress the need for clear exception handling when ports experience congestion or weather events. Integration with TMS and ERP platforms is underway, with APIs designed to expose timestamps, confidence bands, and cause codes for delays.",
          imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?fm=webp&w=1200&h=800&fit=crop&q=80",
          categoryId: techDigitalCategory.id,
          publishedBy: "Byline: Daniel Park",
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        },
        {
          title: "Retailers Test Flexible Returns Networks Ahead of Holiday Peaks",
          slug: "retailers-test-flexible-returns-networks-holiday-peaks",
          summary: "Pop‑up hubs and dynamic carrier routing aim to stabilize customer experience.",
          content: "Major retailers are piloting flexible returns networks that activate pop‑up hubs and dynamic carrier routing during demand spikes. The strategy aims to stabilize customer experience while reducing congestion at fixed facilities. Early trials indicate faster refund cycles and improved inventory triage when hubs are located closer to metro areas. Carriers are coordinating capacity and time‑window commitments to handle weekend surges. Industry analysts expect broader adoption as merchants push for uniform service levels across channels. Environmental concerns remain as retailers weigh the footprint of temporary sites against reduced long-haul transport requirements.",
          imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?fm=webp&w=1200&h=800&fit=crop&q=80",
          categoryId: marketInsightsCategory.id,
          publishedBy: "Byline: Jenna Lee",
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        },
      ];
      
      for (const item of topNewsItems) {
        this.createArticle({
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          content: item.content,
          imageUrl: item.imageUrl,
          categoryId: item.categoryId,
          featured: true,
          publishedBy: item.publishedBy,
          publishedAt: item.publishedAt,
          status: "published",
        });
      }
      
      // GLA NETWORK NEWS
      if (glaCategory) {
        // Tagged News for GLA Partner Dashboard
        this.createArticle({
          title: "GLA Network Launches New Member Portal",
          slug: "gla-network-new-member-portal",
          summary: "Enhanced digital tools for global members to connect and collaborate.",
          content: "GLA has unveiled its new member portal featuring advanced search capabilities, real-time messaging, and integrated shipment tracking. This update aims to foster greater collaboration among its 5,000+ members worldwide.",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          partnerCategoryId: glaCategory.id,
          tags: ["GLA", "Digital", "Portal"],
          featured: false,
          status: "published",
          publishedAt: new Date()
        });

        this.createArticle({
          title: "GLA Annual Summit 2026: Key Takeaways",
          slug: "gla-annual-summit-2026-takeaways",
          summary: "Highlights from the global gathering of logistics leaders.",
          content: "The 2026 GLA Annual Summit concluded with a focus on sustainability and digital transformation. Key outcomes include a new carbon offset program and a strategic partnership with major tech providers.",
          imageUrl: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          partnerCategoryId: glaCategory.id,
          tags: ["GLA", "Events", "Summit"],
          featured: false,
          status: "published",
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });

        this.createArticle({
          title: "GLA Expands Asia–Europe Freight Corridors",
          slug: "gla-expands-asia-europe-corridors",
          summary: "New partnerships strengthen multimodal routes and customs brokerage coverage.",
          content: "GLA announced expanded corridor capacity connecting key gateways in China, Central Asia, and Eastern Europe, with integrated brokerage and visibility tools to reduce transit uncertainty.",
          imageUrl: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "GLA Members Roll Out Digital POD Across Network",
          slug: "gla-digital-pod-rollout",
          summary: "Standardized electronic proof-of-delivery improves billing cycle times.",
          content: "A coordinated rollout of digital POD and unified milestones aligns documentation and accelerates invoice cycles, with API access for enterprise systems.",
          imageUrl: "https://images.unsplash.com/photo-1581093373443-5c00f0c2156f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "GLA Annual Conference Announces Innovation Awards",
          slug: "gla-annual-conference-innovation-awards",
          summary: "Recognition for automation, sustainability, and customer service excellence.",
          content: "Finalists highlight robotics-enabled warehousing, green corridors, and self-service portals improving shipper experiences.",
          imageUrl: "https://images.unsplash.com/photo-1526498462968-8d52f3f0c1b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 40 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "GLA Adds Compliance Desk for Dangerous Goods",
          slug: "gla-dangerous-goods-compliance-desk",
          summary: "Central advisory team supports DG bookings across modes.",
          content: "Members gain access to pre-shipment checks, SDS verification, and documentation templates, reducing exception risks.",
          imageUrl: "https://images.unsplash.com/photo-1542326237-94b1c5a53a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: glaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 70 * 60 * 60 * 1000)
        });
      }
      
      // WCA WORLD NEWS
      if (wcaCategory) {
        this.createArticle({
          title: "WCA World Launches Ocean Carbon Reporting Toolkit",
          slug: "wca-world-ocean-carbon-toolkit",
          summary: "New toolkit standardizes CO2 calculations and helps shippers meet reporting mandates.",
          content: "The toolkit consolidates carrier data, voyage legs, and emissions factors to produce auditable statements for sustainability reporting.",
          imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: wcaCategory.id,
          partnerCategoryId: wcaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "WCA Members Integrate eBookings via Unified API",
          slug: "wca-members-integrate-ebookings-api",
          summary: "Unified booking API improves data quality and visibility.",
          content: "The common API reduces duplicate entry, aligns milestones, and enables predictive ETAs across origins and destinations.",
          imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: wcaCategory.id,
          partnerCategoryId: wcaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 32 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "WCA World Adds Pharma Logistics Certification Track",
          slug: "wca-world-pharma-logistics-certification",
          summary: "New training supports GDP compliance and cold chain best practices.",
          content: "The track covers lane risk assessment, thermal packaging selection, and excursion monitoring for temperature-sensitive cargo.",
          imageUrl: "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: wcaCategory.id,
          partnerCategoryId: wcaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 55 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "WCA World Strengthens Africa Regional Chapters",
          slug: "wca-world-strengthens-africa-chapters",
          summary: "Regional leadership appointments and hub development initiatives.",
          content: "Focus areas include customs modernization, multimodal development, and digitization for trade facilitation.",
          imageUrl: "https://images.unsplash.com/photo-1518459031867-a89b944bffe5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: wcaCategory.id,
          partnerCategoryId: wcaCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 80 * 60 * 60 * 1000)
        });
      }
      
      // JC TRANS NETWORKS NEWS
      if (jcTransCategory) {
        this.createArticle({
          title: "JC Trans Expands Cross-Border E‑commerce Fulfillment",
          slug: "jc-trans-expands-cross-border-fulfillment",
          summary: "New bonded facilities and last‑mile integrations for faster delivery.",
          content: "Investments target customs clearance speed, returns handling, and localized carrier integrations in major European markets.",
          imageUrl: "https://images.unsplash.com/photo-1556767576-5ec41e4b3b6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: jcTransCategory.id,
          partnerCategoryId: jcTransCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "JC Trans Introduces SME Trade Finance Program",
          slug: "jc-trans-introduces-sme-trade-finance",
          summary: "Program addresses cashflow gaps for small forwarders and shippers.",
          content: "The program offers invoice factoring and shipment-based credit lines to ease working capital constraints.",
          imageUrl: "https://images.unsplash.com/photo-1542909168-3f11754be9ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: jcTransCategory.id,
          partnerCategoryId: jcTransCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "JC Trans Adds Dangerous Goods Advisory Team",
          slug: "jc-trans-dangerous-goods-advisory",
          summary: "Centralized support improves DG bookings and compliance outcomes.",
          content: "Advisors provide pre‑shipment validation and documentation templates across air and ocean.",
          imageUrl: "https://images.unsplash.com/photo-1533158361295-93c01db7201d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: jcTransCategory.id,
          partnerCategoryId: jcTransCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 50 * 60 * 60 * 1000)
        });
        this.createArticle({
          title: "JC Trans Launches Customer Portal Enhancements",
          slug: "jc-trans-customer-portal-enhancements",
          summary: "Self‑serve quotes, milestone alerts, and document center updates.",
          content: "New features reduce support tickets and improve transparency across shipment lifecycle.",
          imageUrl: "https://images.unsplash.com/photo-1557800636-89407f13b1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: jcTransCategory.id,
          partnerCategoryId: jcTransCategory.id,
          featured: false,
          publishedAt: new Date(Date.now() - 76 * 60 * 60 * 1000)
        });
      }
      
      // TRADE POLICY CATEGORY
      this.createArticle({
        title: "New Trade Agreements Reshape Transpacific Supply Chains",
        slug: "trade-agreements-reshape-transpacific-supply-chains",
        summary: "Countries implement rules-of-origin changes requiring significant sourcing adjustments.",
        content: "Recently implemented trade agreements between Pacific Rim nations are forcing manufacturers to reconfigure supply networks to comply with stricter rules-of-origin requirements. Companies must now demonstrate more regional value creation to qualify for preferential tariff treatment.",
        imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: tradePolicyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
      });
      
      // RISK & SECURITY CATEGORY
      this.createArticle({
        title: "Cyber Attacks on Supply Chain Software Increase 300% in 2024",
        slug: "cyber-attacks-supply-chain-software-increase",
        summary: "Transportation and logistics companies face unprecedented digital security threats.",
        content: "Security researchers report a dramatic rise in targeted attacks against supply chain management systems, with ransomware gangs specifically focusing on logistics providers during peak shipping periods. Companies are implementing zero-trust architectures and enhanced authentication protocols in response.",
        imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: riskSecurityCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      });
      
      // E-COMMERCE CATEGORY
      this.createArticle({
        title: "Cross-Border E-commerce Complexity Drives Logistics Partnership Surge",
        slug: "cross-border-ecommerce-logistics-partnerships",
        summary: "Online retailers establish specialized partnerships to navigate international fulfillment challenges.",
        content: "E-commerce businesses targeting international markets are increasingly forming specialized partnerships with regional logistics specialists to navigate the complex web of customs regulations, tax compliance, and last-mile delivery variations. The trend represents a move away from one-size-fits-all global shipping solutions.",
        imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: ecommerceCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000)
      });
      
      if (eventsConferencesCategory) {
        this.createArticle({
          title: "Top Logistics & Supply Chain Events to Watch in 2026",
          slug: "top-logistics-supply-chain-events-2026",
          summary: "Curated logistics events in early 2026 with design-rich HTML overview.",
          content: `<!DOCTYPE html> 
 <html lang="en"> 
 <head> 
     <meta charset="UTF-8"> 
     <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
     <title>Top Logistics Events to Watch - 2026</title> 
     <style> 
         :root { --primary-color: #0f3460; --accent-color: #e94560; --bg-color: #f4f7f6; --card-bg: #ffffff; --text-dark: #333333; --text-light: #666666; --border-radius: 8px; } 
         body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: var(--text-dark); background-color: var(--bg-color); margin: 0; padding: 0; } 
         .container { max-width: 900px; margin: 40px auto; padding: 20px; } 
         header { text-align: center; margin-bottom: 50px; } 
         h1 { font-size: 2.5rem; color: var(--primary-color); margin-bottom: 10px; } 
         .subtitle { font-size: 1.2rem; color: var(--text-light); } 
         .month-header { display: flex; align-items: center; margin: 40px 0 20px 0; } 
         .month-header h2 { background-color: var(--primary-color); color: white; padding: 8px 20px; border-radius: 50px; font-size: 1.1rem; margin-right: 15px; text-transform: uppercase; letter-spacing: 1px; } 
         .month-line { flex-grow: 1; height: 2px; background-color: #ddd; } 
         .event-card { background: var(--card-bg); border-radius: var(--border-radius); box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 25px; margin-bottom: 25px; border-left: 5px solid var(--primary-color); transition: transform 0.2s ease; } 
         .event-card:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); } 
         .event-header { display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; } 
         .event-title { font-size: 1.5rem; font-weight: 700; color: var(--primary-color); margin: 0; } 
         .event-meta { font-size: 0.95rem; color: var(--text-light); margin-top: 5px; display: flex; gap: 15px; align-items: center; } 
         .icon { margin-right: 5px; } 
         .event-desc { margin-bottom: 15px; } 
         .why-attend { background-color: #eef2f5; padding: 15px; border-radius: 6px; font-size: 0.95rem; border-left: 3px solid var(--accent-color); } 
         .why-attend strong { color: var(--accent-color); text-transform: uppercase; font-size: 0.85rem; display: block; margin-bottom: 5px; } 
         .table-container { margin-top: 60px; overflow-x: auto; background: white; padding: 20px; border-radius: var(--border-radius); box-shadow: 0 4px 6px rgba(0,0,0,0.05); } 
         table { width: 100%; border-collapse: collapse; font-size: 0.9rem; } 
         th { background-color: var(--primary-color); color: white; padding: 12px; text-align: left; } 
         td { padding: 12px; border-bottom: 1px solid #eee; } 
         tr:nth-child(even) { background-color: #f9f9f9; } 
         @media (max-width: 600px) { .event-header { flex-direction: column; } .event-meta { flex-direction: column; align-items: flex-start; gap: 5px; } h1 { font-size: 1.8rem; } } 
     </style> 
 </head> 
 <body> 
 <div class="container"> 
     <header> 
         <h1>🌍 Top Logistics Events to Watch</h1> 
         <div class="subtitle">Your guide to the key supply chain conferences in early 2026.</div> 
     </header> 
     <div class="month-header"><h2>February 2026</h2><div class="month-line"></div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">LINK: The Retail Supply Chain Conference</h3><div class="event-meta"><span>📅 Feb 1 – 4</span><span>📍 Orlando, FL</span></div></div><div class="event-desc">Retail and consumer brand supply chain leaders gather to focus on distribution, fulfillment, logistics, analytics, and strategy.</div><div class="why-attend"><strong>Why Attend</strong>Use this event to benchmark retail network design and last-mile performance.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">Manifest Vegas</h3><div class="event-meta"><span>📅 Feb 9 – 11</span><span>📍 Las Vegas, NV</span></div></div><div class="event-desc">A major cross-industry event that brings together shippers, LSPs, and logistics tech providers with heavy coverage of automation and digitization.</div><div class="why-attend"><strong>Why Attend</strong>Essential for discovering cutting-edge logistics technology and end-to-end visibility solutions.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">transport logistic India</h3><div class="event-meta"><span>📅 Feb 25 – 27</span><span>📍 Mumbai, India</span></div></div><div class="event-desc">A large-scale trade fair spanning air, sea, rail, road, warehousing, and digital solutions.</div><div class="why-attend"><strong>Why Attend</strong>A strong pick if you track India's capacity buildout and multimodal infrastructure.</div></div> 
     <div class="month-header"><h2>March 2026</h2><div class="month-line"></div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">TPM26</h3><div class="event-meta"><span>📅 Mar 1 – 4</span><span>📍 Long Beach, CA</span></div></div><div class="event-desc">A flagship container shipping and supply chain conference with senior participation across carriers, shippers, and intermediaries.</div><div class="why-attend"><strong>Why Attend</strong>A key venue for contract cycle signals and ocean market sentiment.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">LogiMAT</h3><div class="event-meta"><span>📅 Mar 24 – 26</span><span>📍 Stuttgart, Germany</span></div></div><div class="event-desc">Europe’s major intralogistics show, with deep coverage of warehouse automation, robotics, and material flow systems.</div><div class="why-attend"><strong>Why Attend</strong>Ideal for scanning new hardware and software for DC productivity gains.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">LogiChem EU</h3><div class="event-meta"><span>📅 Mar 24 – 25</span><span>📍 Rotterdam, NL</span></div></div><div class="event-desc">A leading chemical supply chain event focused on compliance, resilience, sustainability, and risk across complex networks.</div><div class="why-attend"><strong>Why Attend</strong>A strong fit if you manage hazardous materials logistics or specialty chemicals planning.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">SCOPE Leadership Summit</h3><div class="event-meta"><span>📅 Mar 29 – 31</span><span>📍 Phoenix, AZ</span></div></div><div class="event-desc">A senior leader summit built around peer connections and vendor meetings.</div><div class="why-attend"><strong>Why Attend</strong>Use it to compare approaches to procurement, planning, and supply chain transformation.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">SITL</h3><div class="event-meta"><span>📅 Mar 31 – Apr 2</span><span>📍 Paris, France</span></div></div><div class="event-desc">A major European transport and logistics trade show with a broad mix of shippers, carriers, and solution providers.</div><div class="why-attend"><strong>Why Attend</strong>Good for scanning multimodal innovation and cold chain developments.</div></div> 
     <div class="month-header"><h2>April 2026</h2><div class="month-line"></div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">MODEX</h3><div class="event-meta"><span>📅 Apr 13 – 16</span><span>📍 Atlanta, GA</span></div></div><div class="event-desc">A top North American supply chain exhibition with hands-on demos, education sessions, and a wide exhibitor base.</div><div class="why-attend"><strong>Why Attend</strong>Prioritize this if you are actively buying automation, WMS, or fulfillment technology.</div></div> 
     <div class="event-card"><div class="event-header"><h3 class="event-title">AAFA Global Conference</h3><div class="event-meta"><span>📅 Apr 14 – 15</span><span>📍 Baltimore, MD</span></div></div><div class="event-desc">A focused conference on global supply chain and trade topics with an industry and policy lens.</div><div class="why-attend"><strong>Why Attend</strong>Strong value if tariffs, customs, and trade compliance are on your 2026 risk list.</div></div> 
     <div class="table-container"><h3 style="color: var(--primary-color); margin-top: 0;">📋 Quick Reference Calendar</h3><table><thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Focus</th></tr></thead><tbody><tr><td>LINK</td><td>Feb 1–4</td><td>Orlando, FL</td><td>Retail Supply Chain</td></tr><tr><td>Manifest</td><td>Feb 9–11</td><td>Las Vegas, NV</td><td>Logistics Tech</td></tr><tr><td>TL India</td><td>Feb 25–27</td><td>Mumbai</td><td>Multimodal / India</td></tr><tr><td>TPM26</td><td>Mar 1–4</td><td>Long Beach, CA</td><td>Ocean / Contracts</td></tr><tr><td>LogiMAT</td><td>Mar 24–26</td><td>Stuttgart</td><td>Intralogistics</td></tr><tr><td>MODEX</td><td>Apr 13–16</td><td>Atlanta, GA</td><td>Automation</td></tr></tbody></table></div> 
 </div> 
 </body> 
 </html>`,
          imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          categoryId: eventsConferencesCategory.id,
          featured: false,
          publishedAt: new Date()
        });
      }
      
      // Create analysts
      this.createAnalyst({
        name: "Sarah Johnson",
        title: "Supply Chain Economist",
        imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      });
      
      this.createAnalyst({
        name: "Michael Chen",
        title: "Logistics Director",
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      });
      
      // Add a test draft article
      this.createArticle({
        title: "TEST DRAFT: New Logistics Technology Preview",
        slug: "test-draft-logistics-technology-preview",
        summary: "This is a draft article for testing the draft filter functionality.",
        content: "This content will only be visible in the admin section since this is a draft article. It should not appear on the public site.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: logisticsCategory.id,
        featured: false,
        status: "draft",
        publishedAt: new Date()
      });
      
      // Create analysis articles
      const sarahAnalyst = Array.from(this.analysts.values()).find(a => a.name === "Sarah Johnson");
      const michaelAnalyst = Array.from(this.analysts.values()).find(a => a.name === "Michael Chen");
      
      if (sarahAnalyst && michaelAnalyst) {
        this.createAnalysis({
          title: "Why Resilience Will Define Supply Chains in the Next Decade",
          slug: "resilience-define-supply-chains",
          content: "The past three years have demonstrated the fragility of global supply chains in stark terms. From pandemic disruptions to geopolitical conflicts and extreme weather events, organizations have faced a relentless series of challenges to their operations.",
          analystId: sarahAnalyst.id,
          publishedAt: new Date()
        });
        
        this.createAnalysis({
          title: "The Case for Reshoring: When Local Production Makes Financial Sense",
          slug: "reshoring-local-production-financial-sense",
          content: "The pendulum of manufacturing location strategy appears to be swinging back toward domestic production after decades of offshoring. While labor cost differentials drove production to Asia and other low-cost regions throughout the 1990s and 2000s, a more complex calculation is now favoring reshoring for certain categories of products.",
          analystId: michaelAnalyst.id,
          publishedAt: new Date()
        });
      }
      
      // Create a featured video
      this.createVideo({
        title: "Inside the World's Busiest Shipping Port: A Special Report",
        description: "Our correspondent gets unprecedented access to operations at the Port of Shanghai.",
        thumbnailUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        videoUrl: "https://example.com/videos/port-of-shanghai",
        featured: true,
        publishedAt: new Date()
      });
      
      // Create ad placements for different pages and sections
      const adPlacementData: InsertAdPlacement[] = [
        // Home page ads
        {
          name: "Home Page Sidebar Top",
          slot: "home-sidebar-top",
          page: "home",
          section: "sidebar",
          description: "Ad slot at the top of the sidebar on the home page",
          width: 300,
          height: 250
        },
        {
          name: "Home Page Sidebar Bottom",
          slot: "home-sidebar-bottom",
          page: "home",
          section: "sidebar",
          description: "Ad slot at the bottom of the sidebar on the home page",
          width: 300,
          height: 250
        },
        {
          name: "Home Page Sidebar Middle",
          slot: "home-sidebar-middle",
          page: "home",
          section: "sidebar",
          description: "Middle ad slot in the home page sidebar",
          width: 300,
          height: 250
        },
        {
          name: "Home Page Bottom Leaderboard",
          slot: "home-bottom",
          page: "home",
          section: "bottom",
          description: "Bottom leaderboard on home page",
          width: 728,
          height: 90
        },
        
        // Category page ads
        {
          name: "Category Page Header",
          slot: "category-header",
          page: "category",
          section: "header",
          description: "Ad banner at the top of category pages",
          width: 728,
          height: 90
        },
        {
          name: "Category Page Sidebar",
          slot: "category-sidebar",
          page: "category",
          section: "sidebar",
          description: "Ad slot in the sidebar of category pages",
          width: 300,
          height: 250
        },
        {
          name: "Category Page Content",
          slot: "category-content",
          page: "category",
          section: "content",
          description: "Ad slot within category content listing",
          width: 300,
          height: 250
        },
        {
          name: "Bottom Leaderboard (Category)",
          slot: "bottom-leaderboard",
          page: "category",
          section: "bottom",
          description: "Bottom leaderboard on category pages",
          width: 728,
          height: 90
        },
        
        // Article page ads
        {
          name: "Article Page Header",
          slot: "article-header",
          page: "article",
          section: "header",
          description: "Ad banner at the top of article pages",
          width: 728,
          height: 90
        },
        {
          name: "Article Page Sidebar",
          slot: "article-sidebar",
          page: "article",
          section: "sidebar",
          description: "Ad slot in the sidebar of article pages",
          width: 300,
          height: 600
        },
        {
          name: "Article Page In-Content",
          slot: "article-content",
          page: "article",
          section: "content",
          description: "Ad slot within the article content",
          width: 300,
          height: 250
        },
        {
          name: "Article Page Bottom",
          slot: "article-bottom",
          page: "article",
          section: "bottom",
          description: "Ad banner at the bottom of article pages",
          width: 728,
          height: 90
        }
        ,
        {
          name: "Sidebar Top (Generic)",
          slot: "sidebar-top",
          page: "article",
          section: "sidebar",
          description: "Generic sidebar top slot used across pages",
          width: 300,
          height: 250
        },
        {
          name: "Sidebar Middle (Generic)",
          slot: "sidebar-middle",
          page: "article",
          section: "sidebar",
          description: "Generic sidebar middle slot used across pages",
          width: 300,
          height: 250
        }
      ];
      
      // Create ad placements
      for (const placement of adPlacementData) {
        this.createAdPlacement(placement);
      }
      
      // Create some sample advertisements
      const advertisementData: InsertAdvertisement[] = [
        {
          title: "Global Logistics Solutions",
          description: "Your partner for end-to-end global logistics services",
          imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
          linkUrl: "https://example.com/logistics-partner",
          placementId: 1, // Home sidebar top
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
          active: true,
          priority: 1,
          createdBy: 1 // Admin user
        },
        {
          title: "Supply Chain Consulting",
          description: "Expert consulting for supply chain optimization",
          imageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
          linkUrl: "https://example.com/sc-consulting",
          placementId: 3, // Category header
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
          active: true,
          priority: 1,
          createdBy: 1 // Admin user
        },
        {
          title: "Warehouse Management Software",
          description: "Revolutionize your warehouse operations with our WMS",
          imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
          linkUrl: "https://example.com/wms-software",
          placementId: 5, // Article header
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
          active: true,
          priority: 1,
          createdBy: 1 // Admin user
        },
        {
          title: "Freight Forwarding Services",
          description: "Fast and reliable global freight forwarding",
          imageUrl: "https://images.unsplash.com/photo-1494412574745-b4eb8d86c96d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
          linkUrl: "https://example.com/freight-services",
          placementId: 6, // Article sidebar
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
          active: true,
          priority: 1,
          createdBy: 1 // Admin user
        }
      ];
      
      // Create advertisements
      for (const ad of advertisementData) {
        this.createAdvertisement(ad);
      }
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const exists = this.users.has(id);
    if (exists) {
      this.users.delete(id);
      return true;
    }
    return false;
  }

  // Site Statistics operations
  async getSiteStatistics(): Promise<SiteStatistics[]> {
    return Array.from(this.siteStatistics.values());
  }

  async getSiteStatisticByKey(key: string): Promise<SiteStatistics | undefined> {
    return Array.from(this.siteStatistics.values()).find(stat => stat.key === key);
  }

  async createSiteStatistic(stat: InsertSiteStatistics): Promise<SiteStatistics> {
    const id = this.siteStatisticsId++;
    const newStat: SiteStatistics = {
      ...stat,
      id,
      updatedAt: new Date(),
      changePercentage: stat.changePercentage ?? null,
      updatedBy: stat.updatedBy ?? null
    };
    this.siteStatistics.set(id, newStat);
    return newStat;
  }

  async updateSiteStatistic(key: string, statUpdate: Partial<InsertSiteStatistics>): Promise<SiteStatistics | undefined> {
    const existingStat = await this.getSiteStatisticByKey(key);
    if (!existingStat) return undefined;

    const updatedStat: SiteStatistics = {
      ...existingStat,
      ...statUpdate,
      updatedAt: new Date()
    };
    this.siteStatistics.set(existingStat.id, updatedStat);
    return updatedStat;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      role: insertUser.role || 'user',
      networkId: insertUser.networkId ?? null,
      createdAt: new Date(),
      lastLogin: null,
      partnerCategoryId: insertUser.partnerCategoryId || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = { 
      ...existingUser, 
      ...userData 
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // User Preferences operations
  async getUserPreferences(userId: number): Promise<UserPreferences[]> {
    return Array.from(this.userPreferences.values()).filter(
      (pref) => pref.userId === userId
    );
  }
  
  async getUserPreferencesByCategory(userId: number, categoryId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId && pref.categoryId === categoryId
    );
  }
  
  async createUserPreference(preference: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.userPreferenceId++;
    const newPreference: UserPreferences = { 
      ...preference, 
      id,
      categoryId: preference.categoryId || null,
      notificationsEnabled: preference.notificationsEnabled || false,
      emailDigest: preference.emailDigest || false,
      digestFrequency: preference.digestFrequency || null,
      theme: preference.theme || null
    };
    this.userPreferences.set(id, newPreference);
    return newPreference;
  }
  
  async updateUserPreference(id: number, preference: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const existingPreference = this.userPreferences.get(id);
    if (!existingPreference) return undefined;
    
    const updatedPreference: UserPreferences = {
      ...existingPreference,
      ...preference
    };
    
    this.userPreferences.set(id, updatedPreference);
    return updatedPreference;
  }
  
  async deleteUserPreference(id: number): Promise<boolean> {
    return this.userPreferences.delete(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { 
      id,
      name: insertCategory.name,
      slug: insertCategory.slug,
      networkId: insertCategory.networkId ?? null,
      parentId: insertCategory.parentId ?? null,
      level: insertCategory.level ?? 1,
      order: insertCategory.order ?? 0
    } as Category;
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: Category = { 
      id,
      name: insertCategory.name ?? existingCategory.name,
      slug: insertCategory.slug ?? existingCategory.slug,
      networkId: insertCategory.networkId !== undefined ? insertCategory.networkId : existingCategory.networkId ?? null,
      parentId: insertCategory.parentId !== undefined ? insertCategory.parentId : existingCategory.parentId ?? null,
      level: insertCategory.level ?? existingCategory.level ?? 1,
      order: insertCategory.order ?? existingCategory.order ?? 0
    } as Category;
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const exists = this.categories.has(id);
    
    if (exists) {
      this.categories.delete(id);
      return true;
    }
    
    return false;
  }
  
  async getCategoriesByNetwork(networkId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.networkId === networkId);
  }
  
  async getChildCategories(parentId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.parentId === parentId);
  }

  // Article operations
  async getArticles(limit: number = 10, offset: number = 0, status?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    // Filter by status if provided
    if (status) {
      articles = articles.filter(article => article.status === status);
      console.log(`After filtering by status '${status}': ${articles.length} articles`);
      // Log the statuses of all articles for debugging
      console.log("Article statuses in database:", 
        Array.from(this.articles.values()).map(a => ({ id: a.id, status: a.status })));
    }
    
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getArticlesByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getArticlesByPartnerCategory(partnerCategoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.partnerCategoryId === partnerCategoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }
  
  async getArticleCountByCategory(categoryId: number, status?: string): Promise<number> {
    let list = Array.from(this.articles.values()).filter(a => a.categoryId === categoryId);
    if (status) {
      list = list.filter(a => a.status === status);
    }
    return list.length;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getFeaturedArticles(limit: number = 1): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getMostViewedArticles(limit: number = 5): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    
    // No longer need to unset other featured articles as we want to support multiple featured articles
    if (insertArticle.featured) {
      console.log("Creating a new featured article");
    }
    
    const article: Article = { 
      ...insertArticle, 
      id,
      views: 0,
      featured: insertArticle.featured || false,
      status: insertArticle.status || "published",
      publishedBy: insertArticle.publishedBy || null,
      publishedAt: insertArticle.publishedAt || new Date(),
      partnerCategoryId: insertArticle.partnerCategoryId ?? null,
      tags: insertArticle.tags ?? null
    };
    this.articles.set(id, article);
    return article;
  }
  
  async updateArticle(id: number, insertArticle: InsertArticle): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    
    if (!existingArticle) {
      return undefined;
    }
    
    // No longer need to unset other featured articles, as we want to allow up to 3 featured articles
    if (insertArticle.featured && !existingArticle.featured) {
      console.log(`Setting article ${id} as featured`);
    }
    
    const updatedArticle: Article = { 
      ...insertArticle, 
      id,
      views: existingArticle.views || 0,
      featured: insertArticle.featured ?? existingArticle.featured ?? false,
      // Ensure status is updated when it's explicitly provided in the update
      status: insertArticle.status !== undefined ? insertArticle.status : existingArticle.status || "published",
      publishedBy: insertArticle.publishedBy || existingArticle.publishedBy || null,
      publishedAt: insertArticle.publishedAt || existingArticle.publishedAt,
      partnerCategoryId: insertArticle.partnerCategoryId !== undefined ? insertArticle.partnerCategoryId : existingArticle.partnerCategoryId,
      tags: insertArticle.tags !== undefined ? insertArticle.tags : existingArticle.tags
    };
    
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    const exists = this.articles.has(id);
    
    if (exists) {
      this.articles.delete(id);
      return true;
    }
    
    return false;
  }

  async incrementArticleViews(id: number): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (article) {
      const updatedArticle = { ...article, views: (article.views || 0) + 1 };
      this.articles.set(id, updatedArticle);
      return updatedArticle;
    }
    return undefined;
  }

  // Analyst operations
  async getAnalysts(): Promise<Analyst[]> {
    return Array.from(this.analysts.values());
  }

  async getAnalyst(id: number): Promise<Analyst | undefined> {
    return this.analysts.get(id);
  }

  async createAnalyst(insertAnalyst: InsertAnalyst): Promise<Analyst> {
    const id = this.analystId++;
    const analyst: Analyst = { ...insertAnalyst, id };
    this.analysts.set(id, analyst);
    return analyst;
  }

  // Analysis operations
  async getAnalysisArticles(limit: number = 2): Promise<Analysis[]> {
    return Array.from(this.analysis.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getAnalysisBySlug(slug: string): Promise<Analysis | undefined> {
    return Array.from(this.analysis.values()).find(
      (analysis) => analysis.slug === slug,
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.analysisId++;
    const analysis: Analysis = { 
      ...insertAnalysis, 
      id,
      publishedAt: insertAnalysis.publishedAt || new Date()
    };
    this.analysis.set(id, analysis);
    return analysis;
  }

  // Video operations
  async getVideos(limit: number = 5): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getFeaturedVideo(): Promise<Video | undefined> {
    return Array.from(this.videos.values())
      .find(video => video.featured);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.videoId++;
    const video: Video = { 
      ...insertVideo, 
      id,
      featured: insertVideo.featured || false,
      publishedAt: insertVideo.publishedAt || new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  // Ad Placement Methods
  async getAdPlacements(): Promise<AdPlacement[]> {
    return Array.from(this.adPlacements.values());
  }
  
  async getAdPlacementsByPage(page: string): Promise<AdPlacement[]> {
    return Array.from(this.adPlacements.values())
      .filter(placement => placement.page === page);
  }
  
  async getAdPlacementsBySection(section: string): Promise<AdPlacement[]> {
    return Array.from(this.adPlacements.values())
      .filter(placement => placement.section === section);
  }
  
  async getAdPlacementsByPageAndSection(page: string, section: string): Promise<AdPlacement[]> {
    return Array.from(this.adPlacements.values())
      .filter(placement => placement.page === page && placement.section === section);
  }
  
  async getAdPlacement(id: number): Promise<AdPlacement | undefined> {
    return this.adPlacements.get(id);
  }
  
  async getAdPlacementBySlot(slot: string): Promise<AdPlacement | undefined> {
    return Array.from(this.adPlacements.values())
      .find(placement => placement.slot === slot);
  }
  
  async createAdPlacement(placement: InsertAdPlacement): Promise<AdPlacement> {
    const id = this.adPlacementId++;
    const newPlacement: AdPlacement = { 
      id,
      name: placement.name,
      slot: placement.slot,
      description: placement.description || null,
      width: placement.width,
      height: placement.height,
      page: placement.page,
      section: placement.section,
      active: placement.active ?? true
    };
    this.adPlacements.set(id, newPlacement);
    return newPlacement;
  }
  
  async updateAdPlacement(id: number, placement: Partial<InsertAdPlacement>): Promise<AdPlacement | undefined> {
    const existingPlacement = this.adPlacements.get(id);
    if (!existingPlacement) return undefined;
    
    const updatedPlacement: AdPlacement = {
      ...existingPlacement,
      ...placement
    };
    
    this.adPlacements.set(id, updatedPlacement);
    return updatedPlacement;
  }
  
  async deleteAdPlacement(id: number): Promise<boolean> {
    return this.adPlacements.delete(id);
  }
  
  // Advertisement Methods
  async getAdvertisements(): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values());
  }
  
  async getActiveAdvertisements(): Promise<Advertisement[]> {
    const now = new Date();
    
    return Array.from(this.advertisements.values())
      .filter(ad => {
        // Check if ad is active based on start/end dates
        const startDate = ad.startDate ? new Date(ad.startDate) : new Date(0); // If no start date, use epoch
        const endDate = ad.endDate ? new Date(ad.endDate) : new Date(8640000000000000); // If no end date, use max date
        
        return ad.active && now >= startDate && now <= endDate;
      });
  }
  
  async getAdvertisementsByPlacement(placementId: number): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values())
      .filter(ad => ad.placementId === placementId);
  }
  
  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    return this.advertisements.get(id);
  }
  
  async getActiveAdvertisementForPlacement(placementId: number, excludeId?: number): Promise<Advertisement | undefined> {
    const now = new Date();
    
    // Get all ads for this placement
    const ads = Array.from(this.advertisements.values())
      .filter(ad => {
        // Check if ad is for this placement and is active based on dates
        const startDate = ad.startDate ? new Date(ad.startDate) : new Date(0);
        const endDate = ad.endDate ? new Date(ad.endDate) : new Date(8640000000000000);
        
        return ad.placementId === placementId && 
               ad.active && 
               now >= startDate && 
               now <= endDate;
      });
    
    // If no ads found, return undefined
    if (ads.length === 0) return undefined;
    
    // Sort by priority (lowest number = highest priority)
    const sorted = ads.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    // If excludeId is provided, try to select the next available ad
    if (excludeId !== undefined) {
      const alternative = sorted.find(a => a.id !== excludeId);
      if (alternative) return alternative;
    }
    return sorted[0];
  }
  
  async createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement> {
    const id = this.advertisementId++;
    const now = new Date();
    
    const newAd: Advertisement = {
      id,
      title: ad.title,
      description: ad.description || null,
      placementId: ad.placementId,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      openInNewTab: ad.openInNewTab ?? true,
      altText: ad.altText || null,
      startDate: ad.startDate || now,
      endDate: ad.endDate || null,
      active: ad.active ?? true,
      priority: ad.priority || 1,
      position: ad.position ?? "middle",
      createdBy: ad.createdBy || null,
      createdAt: now,
      updatedAt: now,
      clicks: 0,
      views: 0,
      sponsorName: ad.sponsorName || null,
      sponsorLogo: ad.sponsorLogo || null
    };
    
    this.advertisements.set(id, newAd);
    return newAd;
  }
  
  async updateAdvertisement(id: number, adData: Partial<InsertAdvertisement>): Promise<Advertisement | undefined> {
    const existingAd = this.advertisements.get(id);
    if (!existingAd) return undefined;
    
    const updatedAd: Advertisement = {
      ...existingAd,
      title: adData.title ?? existingAd.title,
      description: adData.description !== undefined ? adData.description : existingAd.description,
      placementId: adData.placementId ?? existingAd.placementId,
      imageUrl: adData.imageUrl ?? existingAd.imageUrl,
      linkUrl: adData.linkUrl ?? existingAd.linkUrl,
      openInNewTab: adData.openInNewTab ?? existingAd.openInNewTab,
      altText: adData.altText !== undefined ? adData.altText : existingAd.altText,
      startDate: adData.startDate ?? existingAd.startDate,
      endDate: adData.endDate !== undefined ? adData.endDate : existingAd.endDate,
      active: adData.active ?? existingAd.active,
      priority: adData.priority ?? existingAd.priority,
      position: adData.position ?? existingAd.position,
      updatedAt: new Date(),
      sponsorName: adData.sponsorName !== undefined ? adData.sponsorName : existingAd.sponsorName,
      sponsorLogo: adData.sponsorLogo !== undefined ? adData.sponsorLogo : existingAd.sponsorLogo
    };
    
    this.advertisements.set(id, updatedAd);
    return updatedAd;
  }
  
  async deleteAdvertisement(id: number): Promise<boolean> {
    return this.advertisements.delete(id);
  }
  
  async incrementAdClick(id: number): Promise<Advertisement | undefined> {
    const ad = this.advertisements.get(id);
    if (!ad) return undefined;
    
    const updatedAd: Advertisement = {
      ...ad,
      clicks: (ad.clicks || 0) + 1,
      updatedAt: new Date()
    };
    
    this.advertisements.set(id, updatedAd);
    return updatedAd;
  }
  
  async incrementAdView(id: number): Promise<Advertisement | undefined> {
    const ad = this.advertisements.get(id);
    if (!ad) return undefined;
    
    const updatedAd: Advertisement = {
      ...ad,
      views: (ad.views || 0) + 1,
      updatedAt: new Date()
    };
    
    this.advertisements.set(id, updatedAd);
    return updatedAd;
  }
  
  async getNetworks(): Promise<Network[]> {
    return Array.from(this.networks.values());
  }
  
  async getNetwork(id: number): Promise<Network | undefined> {
    return this.networks.get(id);
  }
  
  async getNetworkBySlug(slug: string): Promise<Network | undefined> {
    return Array.from(this.networks.values()).find(n => n.slug === slug);
  }
  
  async createNetwork(insertNetwork: InsertNetwork): Promise<Network> {
    const id = this.networkId++;
    const network: Network = {
      id,
      name: insertNetwork.name,
      slug: insertNetwork.slug,
      description: insertNetwork.description || null,
      logoUrl: insertNetwork.logoUrl || null,
      createdAt: new Date(),
    } as Network;
    this.networks.set(id, network);
    return network;
  }
  
  async updateNetwork(id: number, networkData: Partial<InsertNetwork>): Promise<Network | undefined> {
    const existing = this.networks.get(id);
    if (!existing) return undefined;
    const updated: Network = {
      ...existing,
      name: networkData.name ?? existing.name,
      slug: networkData.slug ?? existing.slug,
      description: networkData.description !== undefined ? networkData.description : existing.description,
      logoUrl: networkData.logoUrl !== undefined ? networkData.logoUrl : existing.logoUrl,
    } as Network;
    this.networks.set(id, updated);
    return updated;
  }
  
  async deleteNetwork(id: number): Promise<boolean> {
    return this.networks.delete(id);
  }
  
  async getContentsByNetwork(networkId: number, limit: number = 10, offset: number = 0): Promise<Content[]> {
    const all = Array.from(this.contents.values()).filter(c => c.networkId === networkId);
    return all.slice(offset, offset + limit);
  }
  
  async getContentsByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Content[]> {
    const all = Array.from(this.contents.values()).filter(c => c.categoryId === categoryId);
    return all.slice(offset, offset + limit);
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async createContent(contentData: InsertContent): Promise<Content> {
    const id = this.contentId++;
    const now = new Date();
    const content: Content = {
      id,
      title: contentData.title,
      slug: contentData.slug,
      body: contentData.body || null,
      type: contentData.type,
      imageUrl: contentData.imageUrl || null,
      mediaUrl: contentData.mediaUrl || null,
      networkId: contentData.networkId || null,
      categoryId: contentData.categoryId || null,
      status: contentData.status || "published",
      createdAt: now,
      updatedAt: now,
    } as Content;
    this.contents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, contentData: Partial<InsertContent>): Promise<Content | undefined> {
    const existing = this.contents.get(id);
    if (!existing) return undefined;
    const updated: Content = {
      ...existing,
      title: contentData.title ?? existing.title,
      slug: contentData.slug ?? existing.slug,
      body: contentData.body !== undefined ? contentData.body : existing.body,
      type: contentData.type ?? existing.type,
      imageUrl: contentData.imageUrl !== undefined ? contentData.imageUrl : existing.imageUrl,
      mediaUrl: contentData.mediaUrl !== undefined ? contentData.mediaUrl : existing.mediaUrl,
      networkId: contentData.networkId !== undefined ? contentData.networkId : existing.networkId,
      categoryId: contentData.categoryId !== undefined ? contentData.categoryId : existing.categoryId,
      status: contentData.status ?? existing.status,
      updatedAt: new Date(),
    } as Content;
    this.contents.set(id, updated);
    return updated;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
  
  async searchArticles(query: string, limit: number = 10, offset: number = 0, useAI: boolean = true): Promise<{ articles: Article[], total: number, enhancedQuery?: string, queryContext?: string }> {
    if (!query) {
      return { articles: [], total: 0 };
    }
    
    let enhancedSearchInfo;
    let queryTerms: string[] = [];
    let normalizedQuery: string = query.toLowerCase().trim();
    let relatedTerms: string[] = [];
    let queryContext: string | undefined;
    
    // Enhanced search with AI if enabled
    if (useAI) {
      try {
        // Dynamically import to avoid circular dependencies
        const { enhanceSearchQuery } = await import('./perplexity');
        enhancedSearchInfo = await enhanceSearchQuery(query);
        
        normalizedQuery = enhancedSearchInfo.enhancedQuery.toLowerCase().trim();
        relatedTerms = enhancedSearchInfo.relatedTerms;
        queryContext = enhancedSearchInfo.queryContext;
        
        console.log(`AI enhanced search: "${query}" -> "${normalizedQuery}"`);
        if (relatedTerms.length > 0) {
          console.log(`Related terms: ${relatedTerms.join(', ')}`);
        }
      } catch (error) {
        console.error('Error using AI-enhanced search:', error);
        // Fall back to standard search
      }
    }
    
    // Split query into individual terms for better matching
    queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
    
    // Get all published articles
    const allArticles = Array.from(this.articles.values()).filter(article => article.status === 'published');
    
    // Get categories for semantic search
    const categories = Array.from(this.categories.values());
    
    // Score and filter articles based on relevance
    const scoredArticles = allArticles.map(article => {
      let score = 0;
      let matchDetails: string[] = [];
      
      // Check for matches in the title (highest weight)
      const titleLower = article.title.toLowerCase();
      if (titleLower.includes(normalizedQuery)) {
        score += 15;
        matchDetails.push("title:exact");
      }
      
      queryTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 8;
          matchDetails.push(`title:term:${term}`);
        }
      });
      
      // Add related terms with slightly lower weight
      relatedTerms.forEach(term => {
        const termLower = term.toLowerCase();
        if (titleLower.includes(termLower)) {
          score += 6; // Lower than direct match but still significant
          matchDetails.push(`title:related:${term}`);
        }
      });
      
      // Check for publisher match (good relevance signal)
      if (article.publishedBy) {
        const publisherLower = article.publishedBy.toLowerCase();
        if (publisherLower.includes(normalizedQuery)) {
          score += 7;
          matchDetails.push("publisher:exact");
        }
        
        queryTerms.forEach(term => {
          if (publisherLower.includes(term)) {
            score += 4;
            matchDetails.push(`publisher:term:${term}`);
          }
        });
        
        relatedTerms.forEach(term => {
          const termLower = term.toLowerCase();
          if (publisherLower.includes(termLower)) {
            score += 3;
            matchDetails.push(`publisher:related:${term}`);
          }
        });
      }
      
      // Check for matches in summary (medium weight)
      const summaryLower = article.summary.toLowerCase();
      if (summaryLower.includes(normalizedQuery)) {
        score += 10;
        matchDetails.push("summary:exact");
      }
      
      queryTerms.forEach(term => {
        if (summaryLower.includes(term)) {
          score += 5;
          matchDetails.push(`summary:term:${term}`);
        }
      });
      
      relatedTerms.forEach(term => {
        const termLower = term.toLowerCase();
        if (summaryLower.includes(termLower)) {
          score += 4;
          matchDetails.push(`summary:related:${term}`);
        }
      });
      
      // Check for matches in content (lower weight but still important)
      const contentLower = article.content.toLowerCase();
      if (contentLower.includes(normalizedQuery)) {
        score += 8;
        matchDetails.push("content:exact");
      }
      
      queryTerms.forEach(term => {
        if (contentLower.includes(term)) {
          // Count occurrences for content terms
          const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
          // Cap the bonus at 10 to prevent extremely long articles from dominating
          const bonus = Math.min(occurrences, 10);
          score += 2 + bonus;
          matchDetails.push(`content:term:${term}:${occurrences}`);
        }
      });
      
      relatedTerms.forEach(term => {
        const termLower = term.toLowerCase();
        if (contentLower.includes(termLower)) {
          const occurrences = (contentLower.match(new RegExp(termLower, 'g')) || []).length;
          const bonus = Math.min(occurrences, 5); // Lower cap for related terms
          score += 1 + bonus;
          matchDetails.push(`content:related:${term}:${occurrences}`);
        }
      });
      
      // Check for exact slug match
      const slugLower = article.slug.toLowerCase();
      if (slugLower.includes(normalizedQuery)) {
        score += 10;
        matchDetails.push("slug:exact");
      }
      
      queryTerms.forEach(term => {
        if (slugLower.includes(term)) {
          score += 6;
          matchDetails.push(`slug:term:${term}`);
        }
      });
      
      // Check for category name match (very relevant for topic searches)
      const category = categories.find(c => c.id === article.categoryId);
      if (category) {
        const categoryNameLower = category.name.toLowerCase();
        if (categoryNameLower.includes(normalizedQuery)) {
          score += 12;
          matchDetails.push("category:exact");
        }
        
        queryTerms.forEach(term => {
          if (categoryNameLower.includes(term)) {
            score += 7;
            matchDetails.push(`category:term:${term}`);
          }
        });
        
        relatedTerms.forEach(term => {
          const termLower = term.toLowerCase();
          if (categoryNameLower.includes(termLower)) {
            score += 5;
            matchDetails.push(`category:related:${term}`);
          }
        });
      }
      
      // Word position boost - terms appearing earlier in content are more relevant
      queryTerms.forEach(term => {
        const titlePos = titleLower.indexOf(term);
        if (titlePos >= 0 && titlePos < 20) {
          score += 3;
          matchDetails.push(`title:early:${term}`);
        }
        
        const summaryPos = summaryLower.indexOf(term);
        if (summaryPos >= 0 && summaryPos < 30) {
          score += 2;
          matchDetails.push(`summary:early:${term}`);
        }
        
        const contentPos = contentLower.indexOf(term);
        if (contentPos >= 0 && contentPos < 100) {
          score += 2;
          matchDetails.push(`content:early:${term}`);
        }
      });
      
      // Recency boost - newer articles get a significant boost
      const articleDate = new Date(article.publishedAt).getTime();
      const now = new Date().getTime();
      const daysDiff = Math.floor((now - articleDate) / (1000 * 60 * 60 * 24));
      
      // More substantial recency boost for the past 30 days
      if (daysDiff < 30) {
        // Articles from last 7 days get highest boost
        if (daysDiff < 7) {
          score += 10;
          matchDetails.push(`recency:very-recent`);
        } 
        // Articles from last 14 days get medium boost
        else if (daysDiff < 14) {
          score += 6;
          matchDetails.push(`recency:recent`);
        }
        // Articles from last 30 days get slight boost
        else {
          score += 3;
          matchDetails.push(`recency:somewhat-recent`);
        }
      }
      
      // Engagement metrics boost (views)
      if (article.views && article.views > 0) {
        // Cap the views boost to prevent very popular articles from dominating all results
        const viewsBoost = Math.min(5, Math.floor(article.views / 10));
        if (viewsBoost > 0) {
          score += viewsBoost;
          matchDetails.push(`engagement:views:${viewsBoost}`);
        }
      }
      
      return { article, score, matchDetails };
    });
    
    // Filter out non-matching articles and sort by score
    const relevantArticles = scoredArticles
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // Primary sort by score
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        
        // Secondary sort by recency (newer first)
        const aDate = new Date(a.article.publishedAt).getTime();
        const bDate = new Date(b.article.publishedAt).getTime();
        return bDate - aDate;
      });
    
    console.log(`Search for "${query}" found ${relevantArticles.length} articles`);
    if (relevantArticles.length > 0) {
      console.log("Top 3 results:", relevantArticles.slice(0, 3).map(r => ({
        title: r.article.title,
        score: r.score,
        matches: r.matchDetails
      })));
    }
    
    // Apply pagination
    const paginatedArticles = relevantArticles
      .slice(offset, offset + limit)
      .map(item => item.article);
    
    return {
      articles: paginatedArticles,
      total: relevantArticles.length,
      enhancedQuery: normalizedQuery !== query.toLowerCase().trim() ? normalizedQuery : undefined,
      queryContext
    };
  }

  getSeedSnapshot(): SeedSnapshot {
    return {
      users: Array.from(this.users.values()),
      categories: Array.from(this.categories.values()),
      articles: Array.from(this.articles.values()),
      analysts: Array.from(this.analysts.values()),
      analysis: Array.from(this.analysis.values()),
      videos: Array.from(this.videos.values()),
      userPreferences: Array.from(this.userPreferences.values()),
      adPlacements: Array.from(this.adPlacements.values()),
      advertisements: Array.from(this.advertisements.values()),
      siteStatistics: Array.from(this.siteStatistics.values()),
    };
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
