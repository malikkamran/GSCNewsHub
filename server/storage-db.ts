import { and, asc, desc, eq, ilike, isNull, lte, or, sql, gte } from "drizzle-orm";
import { getDb } from "./db";
import {
  users,
  categories,
  articles,
  analysts,
  analysis,
  videos,
  userPreferences,
  adPlacements,
  advertisements,
  networks,
  contents,
  siteStatistics,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type Analyst,
  type InsertAnalyst,
  type Analysis,
  type InsertAnalysis,
  type Video,
  type InsertVideo,
  type UserPreferences,
  type InsertUserPreferences,
  type AdPlacement,
  type InsertAdPlacement,
  type Advertisement,
  type InsertAdvertisement,
  type Network,
  type InsertNetwork,
  type Content,
  type InsertContent,
  type SiteStatistics,
  type InsertSiteStatistics,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private db = getDb();

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.select().from(users).orderBy(asc(users.id));
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return result.length > 0;
  }

  async getSiteStatistics(): Promise<SiteStatistics[]> {
    return this.db.select().from(siteStatistics).orderBy(asc(siteStatistics.id));
  }

  async getSiteStatisticByKey(key: string): Promise<SiteStatistics | undefined> {
    const result = await this.db.select().from(siteStatistics).where(eq(siteStatistics.key, key)).limit(1);
    return result[0];
  }

  async createSiteStatistic(stat: InsertSiteStatistics): Promise<SiteStatistics> {
    const result = await this.db.insert(siteStatistics).values(stat).returning();
    return result[0];
  }

  async updateSiteStatistic(key: string, stat: Partial<InsertSiteStatistics>): Promise<SiteStatistics | undefined> {
    const result = await this.db.update(siteStatistics)
      .set({ ...stat, updatedAt: new Date() })
      .where(eq(siteStatistics.key, key))
      .returning();
    return result[0];
  }
  
  async getNetworks(): Promise<Network[]> {
    return this.db.select().from(networks).orderBy(asc(networks.name));
  }
  
  async getNetwork(id: number): Promise<Network | undefined> {
    const result = await this.db.select().from(networks).where(eq(networks.id, id)).limit(1);
    return result[0];
  }
  
  async getNetworkBySlug(slug: string): Promise<Network | undefined> {
    const result = await this.db.select().from(networks).where(eq(networks.slug, slug)).limit(1);
    return result[0];
  }
  
  async createNetwork(networkData: InsertNetwork): Promise<Network> {
    const result = await this.db.insert(networks).values(networkData).returning();
    return result[0];
  }
  
  async updateNetwork(id: number, networkData: Partial<InsertNetwork>): Promise<Network | undefined> {
    const result = await this.db.update(networks).set(networkData).where(eq(networks.id, id)).returning();
    return result[0];
  }
  
  async deleteNetwork(id: number): Promise<boolean> {
    const result = await this.db.delete(networks).where(eq(networks.id, id)).returning({ id: networks.id });
    return result.length > 0;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences[]> {
    return this.db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
  }

  async getUserPreferencesByCategory(userId: number, categoryId: number): Promise<UserPreferences | undefined> {
    const result = await this.db
      .select()
      .from(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.categoryId, categoryId)))
      .limit(1);
    return result[0];
  }

  async createUserPreference(preference: InsertUserPreferences): Promise<UserPreferences> {
    const result = await this.db.insert(userPreferences).values(preference).returning();
    return result[0];
  }

  async updateUserPreference(id: number, preference: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const result = await this.db.update(userPreferences).set(preference).where(eq(userPreferences.id, id)).returning();
    return result[0];
  }

  async deleteUserPreference(id: number): Promise<boolean> {
    const result = await this.db.delete(userPreferences).where(eq(userPreferences.id, id)).returning({ id: userPreferences.id });
    return result.length > 0;
  }

  async getCategories(): Promise<Category[]> {
    return this.db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await this.db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: number, category: InsertCategory): Promise<Category | undefined> {
    const result = await this.db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return result.length > 0;
  }
  
  async getCategoriesByNetwork(networkId: number): Promise<Category[]> {
    return this.db.select().from(categories).where(eq(categories.networkId, networkId)).orderBy(asc(categories.order));
  }
  
  async getChildCategories(parentId: number): Promise<Category[]> {
    return this.db.select().from(categories).where(eq(categories.parentId, parentId)).orderBy(asc(categories.order));
  }

  async getArticles(limit: number = 10, offset: number = 0, status?: string): Promise<Article[]> {
    const conditions = status ? eq(articles.status, status) : undefined;
    let query = this.db.select().from(articles);
    if (conditions) {
      query = query.where(conditions);
    }
    return query.orderBy(desc(articles.publishedAt)).limit(limit).offset(offset);
  }

  async getArticlesByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return this.db
      .select()
      .from(articles)
      .where(eq(articles.categoryId, categoryId))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);
  }

  async getArticlesByPartnerCategory(partnerCategoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return this.db
      .select()
      .from(articles)
      .where(eq(articles.partnerCategoryId, partnerCategoryId))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getArticleCountByCategory(categoryId: number, status?: string): Promise<number> {
    const conditions = status ? and(eq(articles.categoryId, categoryId), eq(articles.status, status)) : eq(articles.categoryId, categoryId);
    const result = await this.db.select({ count: sql<number>`count(*)` }).from(articles).where(conditions);
    return result[0]?.count ?? 0;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await this.db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const result = await this.db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getFeaturedArticles(limit: number = 1): Promise<Article[]> {
    return this.db
      .select()
      .from(articles)
      .where(eq(articles.featured, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getMostViewedArticles(limit: number = 5): Promise<Article[]> {
    return this.db
      .select()
      .from(articles)
      .orderBy(desc(articles.views))
      .limit(limit);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await this.db.insert(articles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: number, article: InsertArticle): Promise<Article | undefined> {
    const existing = await this.getArticle(id);
    if (!existing) return undefined;

    const updateData: InsertArticle & { views?: number } = {
      ...article,
      views: existing.views ?? 0,
      status: article.status ?? existing.status,
      featured: article.featured ?? existing.featured,
      publishedBy: article.publishedBy ?? existing.publishedBy,
      publishedAt: article.publishedAt ?? existing.publishedAt,
    };

    const result = await this.db.update(articles).set(updateData).where(eq(articles.id, id)).returning();
    return result[0];
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await this.db.delete(articles).where(eq(articles.id, id)).returning({ id: articles.id });
    return result.length > 0;
  }

  async incrementArticleViews(id: number): Promise<Article | undefined> {
    const result = await this.db
      .update(articles)
      .set({ views: sql`${articles.views} + 1` })
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }
  
  async getContentsByNetwork(networkId: number, limit: number = 10, offset: number = 0): Promise<Content[]> {
    return this.db.select().from(contents)
      .where(eq(contents.networkId, networkId))
      .orderBy(desc(contents.updatedAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getContentsByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Content[]> {
    return this.db.select().from(contents)
      .where(eq(contents.categoryId, categoryId))
      .orderBy(desc(contents.updatedAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    const result = await this.db.select().from(contents).where(eq(contents.id, id)).limit(1);
    return result[0];
  }
  
  async createContent(contentData: InsertContent): Promise<Content> {
    const result = await this.db.insert(contents).values(contentData).returning();
    return result[0];
  }
  
  async updateContent(id: number, contentData: Partial<InsertContent>): Promise<Content | undefined> {
    const result = await this.db.update(contents).set(contentData).where(eq(contents.id, id)).returning();
    return result[0];
  }
  
  async deleteContent(id: number): Promise<boolean> {
    const result = await this.db.delete(contents).where(eq(contents.id, id)).returning({ id: contents.id });
    return result.length > 0;
  }

  async searchArticles(
    query: string,
    limit: number = 10,
    offset: number = 0,
    useAI: boolean = true,
  ): Promise<{ articles: Article[]; total: number; enhancedQuery?: string; queryContext?: string }> {
    if (!query) {
      return { articles: [], total: 0 };
    }

    let normalizedQuery = query.trim().toLowerCase();
    let relatedTerms: string[] = [];
    let queryContext: string | undefined;

    if (!normalizedQuery) {
      return { articles: [], total: 0 };
    }

    if (useAI) {
      try {
        const { enhanceSearchQuery } = await import("./perplexity");
        const enhancedSearchInfo = await enhanceSearchQuery(query);
        normalizedQuery = enhancedSearchInfo.enhancedQuery.toLowerCase().trim();
        relatedTerms = enhancedSearchInfo.relatedTerms;
        queryContext = enhancedSearchInfo.queryContext;
      } catch (error) {
        console.error("Error using AI-enhanced search:", error);
      }
    }

    const terms = normalizedQuery
      .split(/\s+/)
      .map(term => term.trim())
      .filter(term => term.length > 1);

    const tokens = Array.from(new Set([normalizedQuery, ...terms, ...relatedTerms])).filter(
      token => token.length > 0,
    );
    const conditions = tokens.map(token =>
      or(
        ilike(articles.title, `%${token}%`),
        ilike(articles.summary, `%${token}%`),
        ilike(articles.content, `%${token}%`),
        ilike(articles.slug, `%${token}%`),
        ilike(articles.publishedBy, `%${token}%`),
      ),
    );

    const whereClause = and(
      eq(articles.status, "published"),
      or(...conditions),
    );

    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(whereClause);

    const resultArticles = await this.db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    return {
      articles: resultArticles,
      total: Number(totalResult[0]?.count ?? 0),
      enhancedQuery: normalizedQuery !== query.toLowerCase().trim() ? normalizedQuery : undefined,
      queryContext,
    };
  }

  async getAnalysts(): Promise<Analyst[]> {
    return this.db.select().from(analysts).orderBy(asc(analysts.name));
  }

  async getAnalyst(id: number): Promise<Analyst | undefined> {
    const result = await this.db.select().from(analysts).where(eq(analysts.id, id)).limit(1);
    return result[0];
  }

  async createAnalyst(analyst: InsertAnalyst): Promise<Analyst> {
    const result = await this.db.insert(analysts).values(analyst).returning();
    return result[0];
  }

  async getAnalysisArticles(limit: number = 2): Promise<Analysis[]> {
    return this.db.select().from(analysis).orderBy(desc(analysis.publishedAt)).limit(limit);
  }

  async getAnalysisBySlug(slug: string): Promise<Analysis | undefined> {
    const result = await this.db.select().from(analysis).where(eq(analysis.slug, slug)).limit(1);
    return result[0];
  }

  async createAnalysis(analysisData: InsertAnalysis): Promise<Analysis> {
    const result = await this.db.insert(analysis).values(analysisData).returning();
    return result[0];
  }

  async getVideos(limit: number = 5): Promise<Video[]> {
    return this.db.select().from(videos).orderBy(desc(videos.publishedAt)).limit(limit);
  }

  async getFeaturedVideo(): Promise<Video | undefined> {
    const result = await this.db
      .select()
      .from(videos)
      .where(eq(videos.featured, true))
      .orderBy(desc(videos.publishedAt))
      .limit(1);
    return result[0];
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await this.db.insert(videos).values(video).returning();
    return result[0];
  }

  async getAdPlacements(): Promise<AdPlacement[]> {
    return this.db.select().from(adPlacements).orderBy(asc(adPlacements.id));
  }

  async getAdPlacementsByPage(page: string): Promise<AdPlacement[]> {
    return this.db.select().from(adPlacements).where(eq(adPlacements.page, page));
  }

  async getAdPlacementsBySection(section: string): Promise<AdPlacement[]> {
    return this.db.select().from(adPlacements).where(eq(adPlacements.section, section));
  }

  async getAdPlacementsByPageAndSection(page: string, section: string): Promise<AdPlacement[]> {
    return this.db
      .select()
      .from(adPlacements)
      .where(and(eq(adPlacements.page, page), eq(adPlacements.section, section)));
  }

  async getAdPlacement(id: number): Promise<AdPlacement | undefined> {
    const result = await this.db.select().from(adPlacements).where(eq(adPlacements.id, id)).limit(1);
    return result[0];
  }

  async getAdPlacementBySlot(slot: string): Promise<AdPlacement | undefined> {
    const result = await this.db.select().from(adPlacements).where(eq(adPlacements.slot, slot)).limit(1);
    return result[0];
  }

  async createAdPlacement(placement: InsertAdPlacement): Promise<AdPlacement> {
    const result = await this.db.insert(adPlacements).values(placement).returning();
    return result[0];
  }

  async updateAdPlacement(id: number, placement: Partial<InsertAdPlacement>): Promise<AdPlacement | undefined> {
    const result = await this.db.update(adPlacements).set(placement).where(eq(adPlacements.id, id)).returning();
    return result[0];
  }

  async deleteAdPlacement(id: number): Promise<boolean> {
    const result = await this.db.delete(adPlacements).where(eq(adPlacements.id, id)).returning({ id: adPlacements.id });
    return result.length > 0;
  }

  async getAdvertisements(): Promise<Advertisement[]> {
    return this.db.select().from(advertisements).orderBy(desc(advertisements.createdAt));
  }

  async getActiveAdvertisements(): Promise<Advertisement[]> {
    const now = new Date();
    return this.db
      .select()
      .from(advertisements)
      .where(
        and(
          eq(advertisements.active, true),
          lte(advertisements.startDate, now),
          or(isNull(advertisements.endDate), gte(advertisements.endDate, now)),
        ),
      );
  }

  async getAdvertisementsByPlacement(placementId: number): Promise<Advertisement[]> {
    return this.db.select().from(advertisements).where(eq(advertisements.placementId, placementId));
  }

  async getAdvertisement(id: number): Promise<Advertisement | undefined> {
    const result = await this.db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    return result[0];
  }

  async getActiveAdvertisementForPlacement(placementId: number): Promise<Advertisement | undefined> {
    const now = new Date();
    const result = await this.db
      .select()
      .from(advertisements)
      .where(
        and(
          eq(advertisements.placementId, placementId),
          eq(advertisements.active, true),
          lte(advertisements.startDate, now),
          or(isNull(advertisements.endDate), gte(advertisements.endDate, now)),
        ),
      )
      .orderBy(asc(advertisements.priority))
      .limit(1);
    return result[0];
  }

  async createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement> {
    const result = await this.db.insert(advertisements).values(ad).returning();
    return result[0];
  }

  async updateAdvertisement(id: number, ad: Partial<InsertAdvertisement>): Promise<Advertisement | undefined> {
    const result = await this.db.update(advertisements).set(ad).where(eq(advertisements.id, id)).returning();
    return result[0];
  }

  async deleteAdvertisement(id: number): Promise<boolean> {
    const result = await this.db.delete(advertisements).where(eq(advertisements.id, id)).returning({ id: advertisements.id });
    return result.length > 0;
  }

  async incrementAdClick(id: number): Promise<Advertisement | undefined> {
    const result = await this.db
      .update(advertisements)
      .set({ clicks: sql`${advertisements.clicks} + 1` })
      .where(eq(advertisements.id, id))
      .returning();
    return result[0];
  }

  async incrementAdView(id: number): Promise<Advertisement | undefined> {
    const result = await this.db
      .update(advertisements)
      .set({ views: sql`${advertisements.views} + 1` })
      .where(eq(advertisements.id, id))
      .returning();
    return result[0];
  }
}
