import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertArticleSchema, insertCategorySchema, insertUserSchema, insertAnalystSchema, insertAnalysisSchema, insertVideoSchema } from "@shared/schema";

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
        // Set user in session (except password)
        const { password: _, ...userWithoutPassword } = user;
        req.session.user = userWithoutPassword;
        
        return res.json({ success: true });
      }
      
      // Invalid credentials
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Failed to logout" });
      }
      
      res.clearCookie('connect.sid');
      return res.json({ success: true });
    });
  });
  
  app.get("/api/auth/check", (req: Request, res: Response) => {
    // Check if user is authenticated
    if (req.session && req.session.user) {
      return res.json({ authenticated: true, user: req.session.user });
    }
    
    return res.json({ authenticated: false });
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
      res.json(featuredArticles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured articles' });
    }
  });

  app.get('/api/articles/most-viewed', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const mostViewedArticles = await storage.getMostViewedArticles(limit);
      res.json(mostViewedArticles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch most viewed articles' });
    }
  });

  app.get('/api/articles/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const articles = await storage.getArticlesByCategory(categoryId, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles by category' });
    }
  });

  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
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

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
