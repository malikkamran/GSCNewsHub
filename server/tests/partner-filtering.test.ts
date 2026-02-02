
import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../storage';
import { User, Category } from '@shared/schema';

describe('Partner Category Filtering & Article Visibility', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('should filter out partner categories without active users', async () => {
    // 1. Get all users
    const users = await storage.getAllUsers();
    
    // 2. Get all categories
    const categories = await storage.getCategories();
    
    // 3. Identify active partner category IDs
    const activePartnerCategoryIds = new Set(
      users
        .filter(u => u.role === 'partner' && u.partnerCategoryId)
        .map(u => u.partnerCategoryId)
    );
    
    // 4. Filter categories (mimicking frontend logic)
    const filteredCategories = categories.filter(c => {
      const isPartnerType = c.type === 'partner' || (c.slug && ['gla', 'wca-world', 'jc-trans-networks'].includes(c.slug));
      if (!isPartnerType) return false;
      
      return activePartnerCategoryIds.has(c.id);
    });

    // GLA user exists in seed, so GLA category should be present
    const glaCategory = categories.find(c => c.slug === 'gla');
    expect(activePartnerCategoryIds.has(glaCategory!.id)).toBe(true);
    expect(filteredCategories.some(c => c.slug === 'gla')).toBe(true);

    // JC Trans user does NOT exist in seed, so JC Trans category should be ABSENT
    const jcTransCategory = categories.find(c => c.slug === 'jc-trans-networks');
    expect(activePartnerCategoryIds.has(jcTransCategory!.id)).toBe(false);
    expect(filteredCategories.some(c => c.slug === 'jc-trans-networks')).toBe(false);
  });

  it('should include partner category when user is created', async () => {
    const categories = await storage.getCategories();
    const jcTransCategory = categories.find(c => c.slug === 'jc-trans-networks');
    
    // Create JC Trans user
    await storage.createUser({
      username: 'jctrans',
      password: 'password',
      email: 'jc@trans.com',
      role: 'partner',
      partnerCategoryId: jcTransCategory!.id
    });

    // Re-run filtering logic
    const users = await storage.getAllUsers();
    const activePartnerCategoryIds = new Set(
      users
        .filter(u => u.role === 'partner' && u.partnerCategoryId)
        .map(u => u.partnerCategoryId)
    );
    
    const filteredCategories = categories.filter(c => {
      const isPartnerType = c.type === 'partner' || (c.slug && ['gla', 'wca-world', 'jc-trans-networks'].includes(c.slug));
      if (!isPartnerType) return false;
      return activePartnerCategoryIds.has(c.id);
    });

    // Now JC Trans should be present
    expect(filteredCategories.some(c => c.slug === 'jc-trans-networks')).toBe(true);
  });

  it('should have partnerCategoryId set for WCA articles', async () => {
    const categories = await storage.getCategories();
    const wcaCategory = categories.find(c => c.slug === 'wca-world');
    
    // Get all articles (increase limit)
    const articles = await storage.getArticles(1000);
    
    // Find WCA articles
    const wcaArticles = articles.filter(a => a.categoryId === wcaCategory!.id);
    
    expect(wcaArticles.length).toBeGreaterThan(0);
    
    // Verify they have partnerCategoryId set
    wcaArticles.forEach(article => {
      expect(article.partnerCategoryId).toBe(wcaCategory!.id);
    });
  });
});
