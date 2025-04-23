import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("user").notNull(), // 'user', 'admin', 'editor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false),
  status: text("status").notNull().default("published"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  publishedBy: text("published_by"),
  views: integer("views").default(0),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  views: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Analysts table
export const analysts = pgTable("analysts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertAnalystSchema = createInsertSchema(analysts).omit({
  id: true,
});

export type InsertAnalyst = z.infer<typeof insertAnalystSchema>;
export type Analyst = typeof analysts.$inferSelect;

// Analysis articles table
export const analysis = pgTable("analysis", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  analystId: integer("analyst_id").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysis).omit({
  id: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysis.$inferSelect;

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  notificationsEnabled: boolean("notifications_enabled").default(false).notNull(),
  emailDigest: boolean("email_digest").default(false).notNull(),
  digestFrequency: text("digest_frequency").default("weekly"), // 'daily', 'weekly', 'monthly'
  theme: text("theme").default("light"), // 'light', 'dark'
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  categoryId: true,
  notificationsEnabled: true,
  emailDigest: true,
  digestFrequency: true,
  theme: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Advertisement Slots/Placements table
export const adPlacements = pgTable("ad_placements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slot: text("slot").notNull().unique(),
  description: text("description"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  page: text("page").notNull(), // 'home', 'article', 'category', etc.
  section: text("section").notNull(), // 'top', 'sidebar', 'in-content', 'bottom', etc.
  active: boolean("active").default(true).notNull(),
});

export const insertAdPlacementSchema = createInsertSchema(adPlacements).omit({
  id: true,
});

export type InsertAdPlacement = z.infer<typeof insertAdPlacementSchema>;
export type AdPlacement = typeof adPlacements.$inferSelect;

// Advertisements table
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  placementId: integer("placement_id").notNull().references(() => adPlacements.id),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url").notNull(),
  openInNewTab: boolean("open_in_new_tab").default(true), // Added new field
  altText: text("alt_text"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  active: boolean("active").default(true).notNull(),
  priority: integer("priority").default(1),
  position: text("position").default("middle"), // Added new field for position (top, middle, bottom)
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  clicks: integer("clicks").default(0),
  views: integer("views").default(0),
  sponsorName: text("sponsor_name"),
  sponsorLogo: text("sponsor_logo"),
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  clicks: true,
  views: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;
