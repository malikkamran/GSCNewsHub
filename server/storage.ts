import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  articles, type Article, type InsertArticle,
  analysts, type Analyst, type InsertAnalyst,
  analysis, type Analysis, type InsertAnalysis,
  videos, type Video, type InsertVideo
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Article operations
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getMostViewedArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
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
  
  private userId: number = 1;
  private categoryId: number = 1;
  private articleId: number = 1;
  private analystId: number = 1;
  private analysisId: number = 1;
  private videoId: number = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.analysts = new Map();
    this.analysis = new Map();
    this.videos = new Map();
    
    // Initialize with default categories
    this.initializeData();
  }

  private initializeData() {
    // Create default categories
    const categoryData: InsertCategory[] = [
      { name: "World", slug: "world" },
      { name: "Business", slug: "business" },
      { name: "Technology", slug: "technology" },
      { name: "Health", slug: "health" },
      { name: "Entertainment", slug: "entertainment" },
      { name: "Sports", slug: "sports" },
      { name: "Science", slug: "science" },
      { name: "Environment", slug: "environment" },
      { name: "Analysis", slug: "analysis" }
    ];
    
    categoryData.forEach(category => this.createCategory(category));
    
    // Create sample articles for each category (in a real app, this would come from a database)
    // For this demo, we're adding articles with realistic supply chain news titles and content
    const worldCategory = Array.from(this.categories.values()).find(c => c.slug === "world");
    const businessCategory = Array.from(this.categories.values()).find(c => c.slug === "business");
    const technologyCategory = Array.from(this.categories.values()).find(c => c.slug === "technology");
    const healthCategory = Array.from(this.categories.values()).find(c => c.slug === "health");
    const environmentCategory = Array.from(this.categories.values()).find(c => c.slug === "environment");
    const entertainmentCategory = Array.from(this.categories.values()).find(c => c.slug === "entertainment");
    const sportsCategory = Array.from(this.categories.values()).find(c => c.slug === "sports");
    const scienceCategory = Array.from(this.categories.values()).find(c => c.slug === "science");
    const analysisCategory = Array.from(this.categories.values()).find(c => c.slug === "analysis");
    
    if (worldCategory && businessCategory && technologyCategory && healthCategory && 
        environmentCategory && entertainmentCategory && sportsCategory && scienceCategory && analysisCategory) {
      
      // World category articles
      this.createArticle({
        title: "Red Sea Crisis Triggers Global Supply Chain Rerouting",
        slug: "red-sea-crisis-global-supply-chain-rerouting",
        summary: "Escalating tensions force shipping companies to adopt costly detours around Africa.",
        content: "Ongoing security concerns in the Red Sea have forced major shipping companies to reroute vessels around the Cape of Good Hope, adding up to 14 days to journey times and significantly increasing transportation costs.",
        imageUrl: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        categoryId: worldCategory.id,
        featured: true,
        publishedAt: new Date()
      });
      
      this.createArticle({
        title: "Panama Canal Drought Creates New Global Trade Bottleneck",
        slug: "panama-canal-drought-global-trade-bottleneck",
        summary: "Record low water levels slash Panama Canal capacity by 40%.",
        content: "The Panama Canal is operating at drastically reduced capacity due to historic drought conditions, creating backlogs and disrupting global shipping patterns.",
        imageUrl: "https://images.unsplash.com/photo-1565264685538-c83c255de90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: worldCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000)
      });
      
      // Business category articles
      this.createArticle({
        title: "Amazon Launches Massive Supply Chain Expansion Initiative",
        slug: "amazon-supply-chain-expansion-initiative",
        summary: "E-commerce giant to invest $15 billion in fulfillment centers and delivery network.",
        content: "Amazon has unveiled an ambitious $15 billion supply chain expansion plan designed to reduce delivery times and decrease dependency on third-party logistics providers.",
        imageUrl: "https://images.unsplash.com/photo-1540544093-9d5d2d9c8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Retail Giants Battle for Warehouse Space as E-commerce Booms",
        slug: "retail-giants-battle-warehouse-space-ecommerce",
        summary: "Industrial real estate prices soar to record highs in major markets.",
        content: "Competition for prime warehouse locations has intensified to unprecedented levels as retailers race to expand their e-commerce fulfillment capabilities.",
        imageUrl: "https://images.unsplash.com/photo-1566686209349-1e6657933a3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000)
      });
      
      // Technology category articles
      this.createArticle({
        title: "Digital Twins Revolutionize Supply Chain Planning",
        slug: "digital-twins-revolutionize-supply-chain-planning",
        summary: "Virtual replicas enable real-time simulation, reducing disruption impact by 60%.",
        content: "Leading manufacturers are increasingly adopting 'digital twin' technology to create virtual replicas of their entire supply chains, enabling unprecedented visibility and simulation capabilities.",
        imageUrl: "https://images.unsplash.com/photo-1581092921461-7289bd80a0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      });
      
      this.createArticle({
        title: "Quantum Computing Makes Breakthrough in Supply Chain Optimization",
        slug: "quantum-computing-breakthrough-supply-chain-optimization",
        summary: "New algorithm solves complex logistics problems 100x faster than conventional methods.",
        content: "Researchers have developed a quantum computing algorithm capable of solving complex supply chain optimization problems exponentially faster than classical computing approaches.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
      });
      
      // Health category articles
      this.createArticle({
        title: "Medical Supply Chain Modernization Accelerates Post-Pandemic",
        slug: "medical-supply-chain-modernization-post-pandemic",
        summary: "Healthcare facilities implement advanced inventory systems to prevent critical shortages.",
        content: "Healthcare institutions are rapidly modernizing their supply chain operations with digital tools and resilient sourcing strategies in response to lessons learned during the pandemic.",
        imageUrl: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: healthCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      });
      
      // Environment category articles
      this.createArticle({
        title: "Major Retailers Invest in Electric Delivery Fleets to Cut Emissions",
        slug: "retailers-electric-delivery-fleets",
        summary: "Retail companies transitioning to EVs for last-mile delivery as part of sustainability initiatives.",
        content: "Several of the world's largest retailers have announced significant investments in electric delivery vehicles as part of broader initiatives to reduce carbon emissions.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        categoryId: environmentCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
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

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Article operations
  async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(offset, offset + limit);
  }

  async getArticlesByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(offset, offset + limit);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }

  async getFeaturedArticles(limit: number = 1): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
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
      publishedAt: insertArticle.publishedAt || new Date()
    };
    this.articles.set(id, article);
    return article;
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
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
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
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
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
