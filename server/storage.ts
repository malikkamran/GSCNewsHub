import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  articles, type Article, type InsertArticle,
  analysts, type Analyst, type InsertAnalyst,
  analysis, type Analysis, type InsertAnalysis,
  videos, type Video, type InsertVideo,
  userPreferences, type UserPreferences, type InsertUserPreferences
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; 
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
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

  // Article operations
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticle(id: number): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getMostViewedArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: InsertArticle): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementArticleViews(id: number): Promise<Article | undefined>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private analysts: Map<number, Analyst>;
  private analysis: Map<number, Analysis>;
  private videos: Map<number, Video>;
  private userPreferences: Map<number, UserPreferences>;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private articleId: number = 1;
  private analystId: number = 1;
  private analysisId: number = 1;
  private videoId: number = 1;
  private userPreferenceId: number = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.analysts = new Map();
    this.analysis = new Map();
    this.videos = new Map();
    this.userPreferences = new Map();
    
    // Initialize with default categories
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123"
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
      { name: "Innovation", slug: "innovation" }
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: Category = { ...insertCategory, id };
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

  // Article operations
  async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
  }

  async getArticlesByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(offset, offset + limit);
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
    const article: Article = { 
      ...insertArticle, 
      id,
      views: 0,
      featured: insertArticle.featured || false,
      status: insertArticle.status || "published",
      publishedAt: insertArticle.publishedAt || new Date()
    };
    this.articles.set(id, article);
    return article;
  }
  
  async updateArticle(id: number, insertArticle: InsertArticle): Promise<Article | undefined> {
    const existingArticle = this.articles.get(id);
    
    if (!existingArticle) {
      return undefined;
    }
    
    const updatedArticle: Article = { 
      ...insertArticle, 
      id,
      views: existingArticle.views || 0,
      featured: insertArticle.featured || false,
      status: insertArticle.status || existingArticle.status || "published",
      publishedAt: insertArticle.publishedAt || existingArticle.publishedAt
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
}

export const storage = new MemStorage();
