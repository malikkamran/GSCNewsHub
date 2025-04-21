import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertArticleSchema, 
  insertCategorySchema, 
  insertUserSchema, 
  insertAnalystSchema, 
  insertAnalysisSchema, 
  insertVideoSchema, 
  insertUserPreferencesSchema,
  insertAdPlacementSchema,
  insertAdvertisementSchema
} from "@shared/schema";

// Authentication state
let isLoggedIn = false;
let currentUser: any = null;

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (isLoggedIn) {
    return next();
  }
  return res.status(401).json({ authenticated: false, message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      // Check if user exists and password matches
      if (user && user.password === password) { // In a real app, use bcrypt for password hashing
        // Set global auth state
        isLoggedIn = true;
        currentUser = { ...user, password: undefined };
        
        return res.json({ success: true });
      }
      
      // Invalid credentials
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    // Clear auth state
    isLoggedIn = false;
    currentUser = null;
    return res.json({ success: true });
  });
  
  app.get("/api/auth/check", (req: Request, res: Response) => {
    // Check if user is authenticated
    if (isLoggedIn && currentUser) {
      return res.json({ authenticated: true, user: currentUser });
    }
    
    return res.json({ authenticated: false });
  });
  
  // User Registration
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      // Validate request data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Set the user as logged in
      isLoggedIn = true;
      currentUser = userWithoutPassword;
      
      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to register user" });
    }
  });
  
  // User Profile
  app.get("/api/users/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const user = await storage.getUser(currentUser.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
  });
  
  // Update User Profile
  app.put("/api/users/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      // Validate request data
      const updateData = req.body;
      
      // Don't allow updating username through this endpoint
      delete updateData.username;
      
      // Don't allow changing role through this endpoint
      delete updateData.role;
      
      // Update user
      const updatedUser = await storage.updateUser(currentUser.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      // Update current user
      currentUser = userWithoutPassword;
      
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to update user profile" });
    }
  });
  
  // User Preferences
  app.get("/api/user-preferences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const preferences = await storage.getUserPreferences(currentUser.id);
      res.json({ success: true, preferences });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user preferences" });
    }
  });
  
  app.post("/api/user-preferences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      // Validate request data
      const preferenceData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId: currentUser.id
      });
      
      // Check if preference already exists for this category
      if (preferenceData.categoryId) {
        const existingPreference = await storage.getUserPreferencesByCategory(
          currentUser.id, 
          preferenceData.categoryId
        );
        
        if (existingPreference) {
          return res.status(400).json({ 
            success: false, 
            message: "Preference for this category already exists" 
          });
        }
      }
      
      // Create preference
      const preference = await storage.createUserPreference(preferenceData);
      res.status(201).json({ success: true, preference });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid preference data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ success: false, message: "Failed to create user preference" });
    }
  });
  
  app.put("/api/user-preferences/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const preferenceId = parseInt(req.params.id);
      if (isNaN(preferenceId)) {
        return res.status(400).json({ success: false, message: "Invalid preference ID" });
      }
      
      // Update preference
      const updatedPreference = await storage.updateUserPreference(preferenceId, req.body);
      if (!updatedPreference) {
        return res.status(404).json({ success: false, message: "Preference not found" });
      }
      
      // Check if this preference belongs to the current user
      if (updatedPreference.userId !== currentUser.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      
      res.json({ success: true, preference: updatedPreference });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid preference data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ success: false, message: "Failed to update user preference" });
    }
  });
  
  app.delete("/api/user-preferences/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const preferenceId = parseInt(req.params.id);
      if (isNaN(preferenceId)) {
        return res.status(400).json({ success: false, message: "Invalid preference ID" });
      }
      
      // Get the preference to check ownership
      const preference = await storage.updateUserPreference(preferenceId, {});
      if (!preference) {
        return res.status(404).json({ success: false, message: "Preference not found" });
      }
      
      // Check if this preference belongs to the current user
      if (preference.userId !== currentUser.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      
      // Delete preference
      const result = await storage.deleteUserPreference(preferenceId);
      if (!result) {
        return res.status(404).json({ success: false, message: "Preference not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete user preference" });
    }
  });
  
  // prefix all routes with /api
  const apiRouter = app.route('/api');
  
  // Categories endpoints
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });

  // Articles endpoints
  app.get('/api/articles', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const status = req.query.status as string | undefined;
      const includeAll = req.query.includeAll === 'true';
      
      // If specific status is requested, use it directly
      if (status) {
        const articles = await storage.getArticles(limit, offset, status);
        return res.json(articles);
      } 
      
      // If no specific status and not including all, return only published
      if (!includeAll) {
        const articles = await storage.getArticles(limit, offset, 'published');
        return res.json(articles);
      } 
      
      // Otherwise return all articles (for admin views)
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles' });
    }
  });

  app.get('/api/articles/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;
      const featuredArticles = await storage.getFeaturedArticles(limit);
      
      // Filter out draft articles
      const publishedFeaturedArticles = featuredArticles.filter(article => article.status === 'published');
      
      res.json(publishedFeaturedArticles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured articles' });
    }
  });

  app.get('/api/articles/most-viewed', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const mostViewedArticles = await storage.getMostViewedArticles(limit);
      
      // Filter out draft articles
      const publishedMostViewedArticles = mostViewedArticles.filter(article => article.status === 'published');
      
      res.json(publishedMostViewedArticles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch most viewed articles' });
    }
  });

  app.get('/api/articles/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      let articles = await storage.getArticlesByCategory(categoryId, limit, offset);
      
      // Filter out draft articles
      articles = articles.filter(article => article.status === 'published');
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles by category' });
    }
  });

  // Get article by slug (for public view)
  app.get('/api/articles/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Check if article is published
      if (article.status !== 'published') {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });
  
  // Get article by ID (for admin editing)
  app.get('/api/articles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid article ID' });
      }
      
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });

  // Analysts endpoints
  app.get('/api/analysts', async (req, res) => {
    try {
      const analysts = await storage.getAnalysts();
      res.json(analysts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analysts' });
    }
  });

  // Analysis endpoints
  app.get('/api/analysis', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 2;
      const analysisArticles = await storage.getAnalysisArticles(limit);
      
      // Enhance analysis with analyst details
      const enhancedAnalysis = await Promise.all(
        analysisArticles.map(async (analysis) => {
          const analyst = await storage.getAnalyst(analysis.analystId);
          return {
            ...analysis,
            analyst
          };
        })
      );
      
      res.json(enhancedAnalysis);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analysis articles' });
    }
  });

  app.get('/api/analysis/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const analysis = await storage.getAnalysisBySlug(slug);
      
      if (!analysis) {
        return res.status(404).json({ message: 'Analysis article not found' });
      }
      
      const analyst = await storage.getAnalyst(analysis.analystId);
      
      res.json({
        ...analysis,
        analyst
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analysis article' });
    }
  });
  
  // CMS API Routes - protected by authentication
  
  // Articles CRUD operations
  app.post('/api/articles', isAuthenticated, async (req, res) => {
    try {
      // Validate request data
      const articleData = insertArticleSchema.parse(req.body);
      
      // Create article
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create article' });
    }
  });
  
  app.put('/api/articles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get existing article
      const existingArticle = await storage.getArticle(id);
      if (!existingArticle) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Validate request data
      const articleData = insertArticleSchema.parse(req.body);
      
      // Update article
      const updatedArticle = await storage.updateArticle(id, articleData);
      res.json(updatedArticle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update article' });
    }
  });
  
  app.delete('/api/articles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Delete article
      const result = await storage.deleteArticle(id);
      if (!result) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete article' });
    }
  });
  
  // Categories CRUD operations
  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      // Validate request data
      const categoryData = insertCategorySchema.parse(req.body);
      
      // Create category
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create category' });
    }
  });
  
  app.put('/api/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get existing category
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      // Validate request data
      const categoryData = insertCategorySchema.parse(req.body);
      
      // Update category
      const updatedCategory = await storage.updateCategory(id, categoryData);
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update category' });
    }
  });
  
  app.delete('/api/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if category has articles
      const articles = await storage.getArticlesByCategory(id);
      if (articles.length > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete category with associated articles. Reassign articles first.' 
        });
      }
      
      // Delete category
      const result = await storage.deleteCategory(id);
      if (!result) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Videos endpoints
  app.get('/api/videos', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const videos = await storage.getVideos(limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch videos' });
    }
  });

  app.get('/api/videos/featured', async (req, res) => {
    try {
      const featuredVideo = await storage.getFeaturedVideo();
      
      if (!featuredVideo) {
        return res.status(404).json({ message: 'No featured video found' });
      }
      
      res.json(featuredVideo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured video' });
    }
  });
  
  // Search endpoint with AI enhancement
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const useAI = req.query.ai !== 'false'; // Default to true
      
      if (!query) {
        return res.json({ articles: [], total: 0 });
      }
      
      console.log(`Search request received: "${query}" (useAI: ${useAI})`);
      const startTime = Date.now();
      
      const results = await storage.searchArticles(query, limit, offset, useAI);
      
      // Enhance article results with category information
      const enhancedResults = {
        ...results,
        articles: await Promise.all(
          results.articles.map(async (article) => {
            const category = await storage.getCategory(article.categoryId);
            return {
              ...article,
              category
            };
          })
        ),
        processingTime: Date.now() - startTime
      };
      
      res.json(enhancedResults);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Error performing search" });
    }
  });

  // Admin user management routes
  app.get("/api/users", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return res.json(usersWithoutPasswords);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  app.post("/api/users", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
      }
      
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
      
      // Check if email already exists
      if (userData.email) {
        const existingEmail = await storage.getUserByEmail(userData.email);
        if (existingEmail) {
          return res.status(400).json({ success: false, message: "Email already registered" });
        }
      }
      
      // Create new user with role
      const newUser = await storage.createUser(userData);
      
      // Return the new user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ success: false, message: "Failed to create user" });
    }
  });
  
  app.put("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
      }
      
      const userId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Don't send the password
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ success: false, message: "Failed to update user" });
    }
  });
  
  app.delete("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
      }
      
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting the current user
      if (userId === currentUser.id) {
        return res.status(400).json({ success: false, message: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete user" });
    }
  });

  // Ad Placement endpoints
  app.get('/api/ad-placements', async (req, res) => {
    try {
      const placements = await storage.getAdPlacements();
      res.json({ success: true, placements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad placements' });
    }
  });

  app.get('/api/ad-placements/page/:page', async (req, res) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const { page } = req.params;
      const placements = await storage.getAdPlacementsByPage(page);
      res.json({ success: true, placements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad placements by page' });
    }
  });

  app.get('/api/ad-placements/section/:section', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const { section } = req.params;
      const placements = await storage.getAdPlacementsBySection(section);
      res.json({ success: true, placements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad placements by section' });
    }
  });

  app.get('/api/ad-placements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid placement ID' });
      }

      const placement = await storage.getAdPlacement(id);
      if (!placement) {
        return res.status(404).json({ success: false, message: 'Ad placement not found' });
      }

      res.json({ success: true, placement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad placement' });
    }
  });

  app.post('/api/ad-placements', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      // Validate request data
      const placementData = insertAdPlacementSchema.parse(req.body);

      // Check if slot already exists
      const existingPlacement = await storage.getAdPlacementBySlot(placementData.slot);
      if (existingPlacement) {
        return res.status(400).json({ success: false, message: 'Ad slot already exists' });
      }

      // Create placement
      const placement = await storage.createAdPlacement(placementData);
      res.status(201).json({ success: true, placement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Invalid placement data', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to create ad placement' });
    }
  });

  app.put('/api/ad-placements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid placement ID' });
      }

      // Update placement
      const updatedPlacement = await storage.updateAdPlacement(id, req.body);
      if (!updatedPlacement) {
        return res.status(404).json({ success: false, message: 'Ad placement not found' });
      }

      res.json({ success: true, placement: updatedPlacement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Invalid placement data', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to update ad placement' });
    }
  });

  app.delete('/api/ad-placements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid placement ID' });
      }

      // Delete placement
      const result = await storage.deleteAdPlacement(id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Ad placement not found' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete ad placement' });
    }
  });

  // Advertisement endpoints
  app.get('/api/advertisements', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }
      
      const advertisements = await storage.getAdvertisements();
      res.json({ success: true, advertisements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch advertisements' });
    }
  });

  app.get('/api/advertisements/active', async (req, res) => {
    try {
      const advertisements = await storage.getActiveAdvertisements();
      res.json({ success: true, advertisements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch active advertisements' });
    }
  });

  app.get('/api/advertisements/placement/:placementId', async (req, res) => {
    try {
      const placementId = parseInt(req.params.placementId);
      if (isNaN(placementId)) {
        return res.status(400).json({ success: false, message: 'Invalid placement ID' });
      }

      const advertisements = await storage.getAdvertisementsByPlacement(placementId);
      res.json({ success: true, advertisements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch advertisements by placement' });
    }
  });

  app.get('/api/advertisements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement ID' });
      }

      const advertisement = await storage.getAdvertisement(id);
      if (!advertisement) {
        return res.status(404).json({ success: false, message: 'Advertisement not found' });
      }

      res.json({ success: true, advertisement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch advertisement' });
    }
  });

  app.get('/api/advertisements/active/placement/:placementId', async (req, res) => {
    try {
      const placementId = parseInt(req.params.placementId);
      if (isNaN(placementId)) {
        return res.status(400).json({ success: false, message: 'Invalid placement ID' });
      }

      const advertisement = await storage.getActiveAdvertisementForPlacement(placementId);
      if (!advertisement) {
        return res.status(404).json({ success: false, message: 'No active advertisement found for this placement' });
      }

      // Track view
      await storage.incrementAdView(advertisement.id);

      res.json({ success: true, advertisement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch active advertisement for placement' });
    }
  });

  app.post('/api/advertisements', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      // Validate request data
      const advertisementData = insertAdvertisementSchema.parse({
        ...req.body,
        createdBy: currentUser.id
      });

      // Create advertisement
      const advertisement = await storage.createAdvertisement(advertisementData);
      res.status(201).json({ success: true, advertisement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement data', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to create advertisement' });
    }
  });

  app.put('/api/advertisements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement ID' });
      }

      // Update advertisement
      const updatedAdvertisement = await storage.updateAdvertisement(id, req.body);
      if (!updatedAdvertisement) {
        return res.status(404).json({ success: false, message: 'Advertisement not found' });
      }

      res.json({ success: true, advertisement: updatedAdvertisement });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement data', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to update advertisement' });
    }
  });

  app.delete('/api/advertisements/:id', isAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement ID' });
      }

      // Delete advertisement
      const result = await storage.deleteAdvertisement(id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Advertisement not found' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete advertisement' });
    }
  });

  app.post('/api/advertisements/:id/click', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid advertisement ID' });
      }

      // Increment click count
      const advertisement = await storage.incrementAdClick(id);
      if (!advertisement) {
        return res.status(404).json({ success: false, message: 'Advertisement not found' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to track advertisement click' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
