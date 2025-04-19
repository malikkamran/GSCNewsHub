import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertArticleSchema, insertCategorySchema, insertUserSchema, insertAnalystSchema, insertAnalysisSchema, insertVideoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
