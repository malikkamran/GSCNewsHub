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
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
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
  getArticles(limit?: number, offset?: number, status?: string): Promise<Article[]>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticle(id: number): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getMostViewedArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: InsertArticle): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementArticleViews(id: number): Promise<Article | undefined>;
  
  // Search operations
  searchArticles(query: string, limit?: number, offset?: number): Promise<{ articles: Article[], total: number }>;

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
      password: "admin123",
      email: "admin@gscsupplychainnews.com",
      role: "admin"
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      role: insertUser.role || 'user',
      createdAt: new Date(),
      lastLogin: null
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
  async getArticles(limit: number = 10, offset: number = 0, status?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    // Log the status parameter for debugging
    console.log(`Fetching articles with status filter: ${status || 'none'}`);
    console.log(`Before filtering: ${articles.length} articles`);
    
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
}

export const storage = new MemStorage();
