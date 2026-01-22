import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { MemStorage } from "./storage";
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
} from "@shared/schema";

async function seed() {
  const db = getDb();
  const existingCategories = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories);

  if (Number(existingCategories[0]?.count ?? 0) > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  const snapshot = new MemStorage().getSeedSnapshot();

  await db.insert(users).values(snapshot.users);
  await db.insert(categories).values(snapshot.categories);
  await db.insert(analysts).values(snapshot.analysts);
  await db.insert(articles).values(snapshot.articles);
  await db.insert(analysis).values(snapshot.analysis);
  await db.insert(videos).values(snapshot.videos);
  await db.insert(userPreferences).values(snapshot.userPreferences);
  await db.insert(adPlacements).values(snapshot.adPlacements);

  const ads = snapshot.advertisements.map(ad => ({
    ...ad,
    openInNewTab: ad.openInNewTab ?? true,
    position: ad.position ?? "middle",
  }));

  await db.insert(advertisements).values(ads);

  const tablesToReset = [
    "users",
    "categories",
    "analysts",
    "articles",
    "analysis",
    "videos",
    "user_preferences",
    "ad_placements",
    "advertisements",
  ];

  for (const table of tablesToReset) {
    await db.execute(
      sql.raw(
        `select setval(pg_get_serial_sequence('${table}', 'id'), (select coalesce(max(id), 1) from ${table}), true);`,
      ),
    );
  }

  console.log("Database seed completed.");
}

seed()
  .catch(error => {
    console.error("Database seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
