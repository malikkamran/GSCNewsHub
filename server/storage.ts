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
    const businessCategory = Array.from(this.categories.values()).find(c => c.slug === "business");
    const technologyCategory = Array.from(this.categories.values()).find(c => c.slug === "technology");
    const environmentCategory = Array.from(this.categories.values()).find(c => c.slug === "environment");
    
    if (businessCategory && technologyCategory && environmentCategory) {
      // Featured article
      this.createArticle({
        title: "Global Supply Chain Disruptions Continue as Port Congestion Worsens",
        slug: "global-supply-chain-disruptions-port-congestion",
        summary: "Major ports around the world are experiencing significant backlogs as the combination of labor shortages, equipment issues, and increased consumer demand creates a perfect storm.",
        content: "Major ports around the world are experiencing significant backlogs as the combination of labor shortages, equipment issues, and increased consumer demand creates a perfect storm for supply chain disruptions. The situation, which began during the pandemic, has shown little sign of improvement despite various interventions.\n\nIndustry experts warn that this congestion could impact holiday deliveries and result in higher prices for consumers. Several major retailers have already chartered their own vessels in an attempt to bypass traditional shipping routes.\n\n\"We're seeing unprecedented challenges across the board,\" said Amanda Chen, logistics director at Global Trade Solutions. \"Companies that can't secure container space are facing weeks or even months of delays.\"\n\nThe congestion has been particularly severe at ports in Los Angeles, Rotterdam, and Shanghai, where container ships may wait up to three weeks to unload cargo.",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        categoryId: businessCategory.id,
        featured: true,
        publishedAt: new Date()
      });
      
      // Latest news articles
      this.createArticle({
        title: "Trucking Companies Face Driver Shortage as Demand Soars",
        slug: "trucking-companies-driver-shortage",
        summary: "Industry leaders warn that the ongoing driver shortage could impact delivery times during the upcoming holiday season.",
        content: "The trucking industry is facing a critical shortage of drivers at a time when consumer demand is reaching record levels. Major logistics companies report difficulties in filling positions despite offering significant salary increases and sign-on bonuses.\n\n\"We're competing not just with other trucking companies, but with warehouse operations and last-mile delivery services that offer more regular hours,\" explained Robert Johnson, hiring manager at Interstate Logistics.\n\nThe American Trucking Association estimates the industry is currently short approximately 80,000 drivers, a figure that could double by 2030 if current trends continue.\n\nThe shortage is already impacting delivery schedules, with some retailers advising customers to expect longer wait times for product shipments.",
        imageUrl: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      });

      this.createArticle({
        title: "New AI Solutions Promise to Revolutionize Supply Chain Management",
        slug: "ai-solutions-supply-chain-management",
        summary: "Tech startups are launching innovative AI platforms to help logistics companies predict disruptions and optimize routes.",
        content: "A new wave of artificial intelligence solutions aimed at the logistics sector is transforming how companies manage their supply chains. These platforms use machine learning algorithms to predict potential disruptions before they occur, allowing companies to take preventative action.\n\n\"Our system can identify patterns that humans might miss,\" said Sophia Lee, founder of LogisticsMind, a startup that recently raised $45 million in Series B funding. \"For example, we can correlate weather patterns, labor statistics, and historical performance to predict port delays with 85% accuracy.\"\n\nMajor shipping companies including Maersk and CMA CGM have already implemented AI solutions to optimize routing and resource allocation. Early adopters report reduced transit times and significant cost savings.\n\nAnalysts predict the market for AI in supply chain management could reach $10 billion by 2025.",
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      });

      this.createArticle({
        title: "Shipping Rates Hit Record Highs as Demand Outpaces Capacity",
        slug: "shipping-rates-record-highs",
        summary: "Container shipping costs have tripled compared to pre-pandemic levels, putting pressure on retailers and manufacturers.",
        content: "The cost of shipping goods via container has reached unprecedented levels, with rates on some routes now more than three times higher than pre-pandemic figures. The Shanghai Containerized Freight Index, which tracks shipping costs, has increased by 350% since January 2020.\n\n\"We've never seen anything like this,\" commented James Wilson, a shipping analyst at Maritime Insights. \"A 40-foot container from Shanghai to Los Angeles that cost $2,000 before the pandemic now costs upwards of $20,000 in some cases.\"\n\nThese increased costs are already being passed on to consumers, with major retailers announcing price increases on imported goods. Smaller businesses with less negotiating power report even greater challenges.\n\n\"We're having to make difficult decisions about which products to continue importing,\" said Maria Gonzalez, owner of a medium-sized furniture importing business. \"Some items simply aren't profitable anymore given these shipping costs.\"",
        imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
      });

      this.createArticle({
        title: "Major Retailers Invest in Electric Delivery Fleets to Cut Emissions",
        slug: "retailers-electric-delivery-fleets",
        summary: "Leading retail companies are transitioning to electric vehicles for last-mile delivery as part of sustainability initiatives.",
        content: "Several of the world's largest retailers have announced significant investments in electric delivery vehicles as part of broader initiatives to reduce carbon emissions. Walmart, Amazon, and Target have collectively committed to deploying over 100,000 electric vehicles for last-mile delivery operations by 2025.\n\n\"We recognize our responsibility to minimize our environmental impact,\" said Rachel Green, sustainability director at a major retail chain. \"Electrifying our delivery fleet is a crucial component of our strategy to achieve carbon neutrality.\"\n\nThe transition is being facilitated by increased availability of purpose-built electric delivery vehicles from manufacturers including Rivian, BrightDrop, and Arrival. These vehicles offer operational cost savings in addition to environmental benefits.\n\nAnalysts note that the shift to electric vehicles also helps retailers appeal to environmentally conscious consumers and comply with increasingly stringent emissions regulations in urban areas.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        categoryId: environmentCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      });
      
      // Add more business articles
      this.createArticle({
        title: "Supply Chain Executives Report Confidence Despite Headwinds",
        slug: "supply-chain-executives-confidence",
        summary: "Despite ongoing challenges, a majority of supply chain leaders express optimism about their ability to meet consumer demand.",
        content: "A recent survey of over 300 supply chain executives reveals surprising optimism despite persistent challenges in the global logistics landscape. The annual Supply Chain Confidence Index shows that 65% of leaders believe their operations are better positioned to handle disruptions than they were a year ago.\n\n\"Companies have invested heavily in resilience,\" noted survey author Dr. Lisa Park. \"Many have diversified their supplier base, increased inventory buffers for critical components, and implemented advanced visibility solutions.\"\n\nThis confidence comes despite ongoing port congestion, labor shortages, and inflationary pressures that continue to impact global trade. The survey indicates that companies that invested in digital transformation early in the pandemic are reporting the highest levels of confidence.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      });

      this.createArticle({
        title: "Just-in-Time Model Under Review as Companies Build Inventory",
        slug: "just-in-time-model-review",
        summary: "Supply chain disruptions have caused many manufacturers to reconsider lean inventory practices in favor of resilience.",
        content: "The just-in-time inventory model, a cornerstone of manufacturing efficiency for decades, is facing unprecedented scrutiny as companies struggle with supply chain unreliability. Major manufacturers including Toyota, which pioneered the approach, are now maintaining larger component inventories to buffer against disruptions.\n\n\"We're seeing a fundamental shift in thinking,\" explained supply chain consultant David Miller. \"For 40 years, carrying inventory was seen as waste. Now it's increasingly viewed as a strategic asset.\"\n\nA recent analysis by McKinsey estimates that companies are increasing their inventory holdings by 15-25% for critical components. This shift represents a significant change in operational strategy with implications for working capital requirements and warehouse capacity.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      });

      this.createArticle({
        title: "Logistics Giants Announce Merger to Create Industry Powerhouse",
        slug: "logistics-giants-merger",
        summary: "The consolidation will create one of the world's largest integrated logistics providers with operations in over 100 countries.",
        content: "Two of the world's leading logistics companies have announced plans to merge in a deal valued at approximately $8.7 billion. The transaction, which is subject to regulatory approval, would create an entity with combined annual revenues exceeding $25 billion and operations spanning more than 100 countries.\n\n\"This merger represents a natural evolution in a rapidly changing industry,\" said Thomas Wright, CEO of the acquiring company. \"By combining our networks, we can offer customers truly end-to-end solutions on a global scale.\"\n\nAnalysts view the deal as part of a broader trend toward consolidation in the logistics sector as companies seek economies of scale to address rising costs and increasing service expectations. The combined entity would control approximately 15% of the global freight forwarding market.",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: businessCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      });
      
      // Add technology articles
      this.createArticle({
        title: "Blockchain Applications in Supply Chain Gain Traction",
        slug: "blockchain-supply-chain-applications",
        summary: "Major corporations are implementing blockchain solutions to enhance transparency and traceability across complex supply networks.",
        content: "Blockchain technology is moving beyond pilot projects and into mainstream implementation within supply chains as companies seek greater transparency and traceability. Walmart, Unilever, and Nestlé are among the major corporations now using blockchain to track products from source to consumer.\n\n\"What we're seeing is a transition from experimentation to operation,\" said blockchain specialist Elena Torres. \"Companies are realizing tangible benefits in terms of reducing paperwork, accelerating customs clearance, and verifying ethical sourcing claims.\"\n\nThe technology has proven particularly valuable for food safety, allowing retailers to trace contaminated products to their source within seconds rather than days. This capability not only protects consumers but significantly reduces the scope and cost of product recalls.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      });

      this.createArticle({
        title: "Warehouse Automation Market Expected to Grow 15% Annually",
        slug: "warehouse-automation-market-growth",
        summary: "Rising labor costs and e-commerce demand are driving unprecedented investment in robotic fulfillment solutions.",
        content: "The global market for warehouse automation technologies is projected to grow at a compound annual rate of 15% over the next five years, reaching $30 billion by 2026. This growth is being driven by labor shortages, rising wages, and the continued expansion of e-commerce.\n\n\"We're seeing adoption across companies of all sizes, not just the retail giants,\" reported Maria Gonzalez, an analyst specializing in logistics technology. \"The return on investment calculations are becoming increasingly favorable as technology costs decrease and labor costs rise.\"\n\nThe most significant growth is occurring in autonomous mobile robots (AMRs) that can navigate warehouses independently, artificial intelligence systems for order optimization, and automated storage and retrieval systems (AS/RS). These technologies not only reduce labor requirements but can increase storage density by up to 40% and improve order accuracy to near 100%.",
        imageUrl: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      });

      this.createArticle({
        title: "New IoT Sensors Allow Real-time Cargo Temperature Monitoring",
        slug: "iot-sensors-cargo-temperature-monitoring",
        summary: "Advanced sensor technology provides pharmaceutical and food companies with continuous visibility into shipping conditions.",
        content: "A new generation of Internet of Things (IoT) sensors is enabling unprecedented visibility into shipping conditions for temperature-sensitive products. These sensors, which are the size of a small coin, can continuously monitor and transmit data on temperature, humidity, light exposure, and shock events.\n\n\"This technology is transforming how we ship pharmaceuticals and temperature-sensitive food products,\" explained Dr. Samuel Chen, logistics director at a major pharmaceutical company. \"We now have minute-by-minute visibility into conditions throughout the journey, allowing for immediate intervention if parameters deviate from acceptable ranges.\"\n\nThe devices connect to cellular networks and provide real-time alerts when conditions approach critical thresholds. This capability is particularly valuable for COVID-19 vaccine distribution, which requires strict temperature control. Industry experts estimate that improved monitoring could reduce product losses in cold chains by up to 30%, representing billions in annual savings.",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        categoryId: technologyCategory.id,
        featured: false,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
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
          content: "The past three years have demonstrated the fragility of global supply chains in stark terms. From pandemic disruptions to geopolitical conflicts and extreme weather events, organizations have faced a relentless series of challenges to their operations.\n\nAs we look ahead to the next decade, it's clear that resilience – not just efficiency – will become the defining characteristic of successful supply chain strategy. This represents a fundamental shift in thinking.\n\nFor decades, supply chain optimization focused primarily on cost reduction, with strategies like just-in-time inventory, supplier consolidation, and offshoring driving decision-making. While these approaches delivered significant financial benefits during periods of stability, they also created vulnerabilities that became apparent during disruptions.\n\nMoving forward, organizations will need to balance efficiency with redundancy, concentration with diversification, and cost with resilience. This doesn't mean abandoning efficiency principles, but rather implementing them within a framework that acknowledges and mitigates systemic risks.\n\nKey components of a resilience-focused strategy include supplier diversification across geographic regions, strategic inventory buffering for critical components, investment in visibility technologies, and the development of contingency plans for various disruption scenarios.\n\nCompanies that master this balance will not only survive future disruptions but may find competitive advantage in their ability to maintain service levels when competitors cannot.",
          analystId: sarahAnalyst.id,
          publishedAt: new Date()
        });
        
        this.createAnalysis({
          title: "The Case for Reshoring: When Local Production Makes Financial Sense",
          slug: "reshoring-local-production-financial-sense",
          content: "The pendulum of manufacturing location strategy appears to be swinging back toward domestic production after decades of offshoring. While labor cost differentials drove production to Asia and other low-cost regions throughout the 1990s and 2000s, a more complex calculation is now favoring reshoring for certain categories of products.\n\nThis shift is driven by multiple factors beyond the supply chain disruptions of recent years. Rising wages in traditional manufacturing hubs like China have eroded the labor cost advantage. Simultaneously, automation technologies have reduced the labor component of total manufacturing costs, making proximity to markets relatively more important.\n\nAdditional considerations include increased transportation costs, intellectual property protection concerns, and growing consumer preference for locally-produced goods. Government incentives for domestic manufacturing, particularly in strategic sectors like semiconductors and medical supplies, are further accelerating this trend.\n\nHowever, reshoring isn't appropriate for all products. The decision requires careful analysis of total landed costs, including factors such as:\n\n- Labor intensity of production\n- Transportation costs relative to product value\n- Inventory carrying costs\n- Quality control considerations\n- Market response time requirements\n- Automation potential\n\nProducts with high automation potential, significant transportation costs, rapid innovation cycles, or custom configurations tend to be the best candidates for reshoring. Conversely, highly labor-intensive products with stable designs and low transportation costs relative to value may still benefit from global sourcing.\n\nUltimately, the optimal approach for most companies will be a regionalized strategy, with production capabilities distributed across multiple geographies to serve local markets while maintaining flexibility and redundancy.",
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
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const article: Article = { 
      ...insertArticle, 
      id,
      views: 0
    };
    this.articles.set(id, article);
    return article;
  }

  async incrementArticleViews(id: number): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (article) {
      const updatedArticle = { ...article, views: article.views + 1 };
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
    const analysis: Analysis = { ...insertAnalysis, id };
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
    const video: Video = { ...insertVideo, id };
    this.videos.set(id, video);
    return video;
  }
}

export const storage = new MemStorage();
