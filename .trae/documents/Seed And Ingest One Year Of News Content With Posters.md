## Goals
- Ingest and publish 12 months of supply chain news with poster images per article
- Reorganize the main navigation per your structure to prioritize top topics and group niche categories

## Licensing Strategy
- Use public/official RSS feeds (ports, shipping lines, gov/regulators, company press rooms) for excerpt + canonical link to stay compliant
- Optionally add licensed provider feeds for full text/images if you approve terms

## Content Ingestion (Articles + Posters)
1. Source Registry
- Create JSON/YAML of priority feeds mapped to your taxonomy (Logistics, Tech & Digital, E-commerce, Sustainability, Market Insights, etc.)
2. Fetch + Normalize
- Pull RSS/Atom, map title/summary/publishedAt/sourceUrl
- Generate slug, categorize via keyword rules + light NLP
3. Posters
- Extract og:image from canonical page → validate → download to your storage (R2/S3)
- Fallback poster generator (Satori/ResVG) for missing images with branded background, title, category
4. Deduplication
- Canonical URL hash + normalized title/content hash
5. Persistence
- Store as drafts first; auto-publish trusted sources
6. Backfill
- Iterate last 12 months per source with rate limits, retries; monitor ingestion quality

## Admin Workflow
- Draft queue with sourceUrl, suggested category, poster
- Approve/edit/publish; auto-publish whitelist toggle per source

## Navigation Reorganization (Client UI)
- Top-Level (visible): Home, Logistics, Tech & Digital, E-commerce, Sustainability, Market Insights
- New Dropdown: Industry Sectors → Warehousing, Manufacturing, Cold Chain, Infrastructure
- New Dropdown: Risk & Policy → Trade Policy, Risk & Security
- Innovation & Events under a More tab (with Innovation, Events & Conferences); if space permits, separate section
- Implementation outline:
  - Update header navigation component (e.g., [Header.tsx](file:///Users/lorinzhu/Library/Mobile%20Documents/com~apple~CloudDocs/Downloads/IMac%20Download%20Folder/Alll%20Projects/GSCNewsHub/client/src/components/layout/Header.tsx)) to use grouped NavigationMenu/DropdownMenu
  - Ensure category slugs already exist (confirmed in [storage.ts](file:///Users/lorinzhu/Library/Mobile%20Documents/com~apple%20CloudDocs/Downloads/IMac%20Download%20Folder/Alll%20Projects/GSCNewsHub/server/storage.ts)) and routes handle new structure

## SEO 
- Generate sitemaps; add canonical links to sources when using excerpt-only
- Ensure unique slugs; handle collisions

## Performance & Monitoring
- Cache lists (featured/most-viewed), paginate long lists
- Metrics for ingestion success, poster success rate, dedupe ratio; alert on feed failures

## What I Need From You
- Confirm excerpt-only with attribution vs pursuing licensed full-text feeds
- Provide image storage choice (R2/S3) and credentials
- Decide auto-publish policy for trusted sources
- Any specific priority publications to include first

## Implementation Steps (After Approval)
1. Enable Postgres (DATABASE_URL) and push schema; add source registry
2. Build ingestion worker, categorization, slugging, dedupe
3. Implement poster download + fallback generator to object storage
4. Add admin review UI for drafts; enable auto-publish per source
5. Run 12-month backfill; monitor and refine
6. Rework navigation menus per your structure and verify links
7. Generate sitemaps and verify public/admin views

I’ll proceed with this plan once you confirm licensing approach, storage, and the navigation grouping exactly as specified above.