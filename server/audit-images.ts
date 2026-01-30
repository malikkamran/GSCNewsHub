import fetch from "node-fetch";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { type Article } from "@shared/schema";

type AuditStatus = "ok" | "missing" | "invalid" | "error";

interface AuditItem {
  id: number;
  slug: string;
  title: string;
  categoryId: number;
  imageUrl: string | null;
  status: AuditStatus;
  httpStatus?: number;
  contentType?: string | null;
  error?: string;
  repaired?: boolean;
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function isImageContentType(ct: string | null | undefined) {
  if (!ct) return false;
  const v = ct.toLowerCase();
  return v.startsWith("image/");
}

async function checkUrl(url: string) {
  try {
    const head = await fetch(url, { method: "HEAD" });
    const ct = head.headers.get("content-type");
    if (head.ok && isImageContentType(ct)) {
      return { ok: true as const, status: head.status, contentType: ct || null };
    }
    const getRes = await fetch(url, { method: "GET", redirect: "follow" });
    const gct = getRes.headers.get("content-type");
    return { ok: getRes.ok && isImageContentType(gct), status: getRes.status, contentType: gct || null };
  } catch (err: any) {
    return { ok: false, status: undefined, contentType: null, error: String(err?.message || err) };
  }
}

function toInsertArticle(a: Article, nextImageUrl: string): Article {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    content: a.content,
    imageUrl: nextImageUrl,
    categoryId: a.categoryId,
    featured: a.featured || false,
    status: a.status || "published",
    publishedBy: a.publishedBy || null,
    publishedAt: a.publishedAt
  } as Article;
}

async function auditImages(repair: boolean) {
  const pageSize = 50;
  let offset = 0;
  const results: AuditItem[] = [];
  let totalChecked = 0;
  let totalMissing = 0;
  let totalInvalid = 0;
  let totalErrors = 0;
  const fallbackPath = "/assets/article-placeholder.svg";

  for (;;) {
    const batch = await storage.getArticles(pageSize, offset);
    if (!batch || batch.length === 0) break;
    for (const a of batch) {
      totalChecked++;
      const currentUrl = a.imageUrl || null;
      if (!currentUrl || currentUrl.trim().length === 0) {
        totalMissing++;
        const item: AuditItem = {
          id: a.id,
          slug: a.slug,
          title: a.title,
          categoryId: a.categoryId,
          imageUrl: null,
          status: "missing"
        };
        if (repair) {
          const updated = await storage.updateArticle(a.id, toInsertArticle(a, fallbackPath));
          if (updated) item.repaired = true;
        }
        results.push(item);
        continue;
      }
      const check = await checkUrl(currentUrl);
      if (check.error) {
        totalErrors++;
        const item: AuditItem = {
          id: a.id,
          slug: a.slug,
          title: a.title,
          categoryId: a.categoryId,
          imageUrl: currentUrl,
          status: "error",
          httpStatus: check.status,
          contentType: check.contentType,
          error: check.error
        };
        if (repair) {
          const updated = await storage.updateArticle(a.id, toInsertArticle(a, fallbackPath));
          if (updated) item.repaired = true;
        }
        results.push(item);
        continue;
      }
      if (!check.ok) {
        totalInvalid++;
        const item: AuditItem = {
          id: a.id,
          slug: a.slug,
          title: a.title,
          categoryId: a.categoryId,
          imageUrl: currentUrl,
          status: "invalid",
          httpStatus: check.status,
          contentType: check.contentType || null
        };
        if (repair) {
          const updated = await storage.updateArticle(a.id, toInsertArticle(a, fallbackPath));
          if (updated) item.repaired = true;
        }
        results.push(item);
        continue;
      }
      results.push({
        id: a.id,
        slug: a.slug,
        title: a.title,
        categoryId: a.categoryId,
        imageUrl: currentUrl,
        status: "ok",
        httpStatus: check.status,
        contentType: check.contentType || null
      });
    }
    offset += pageSize;
  }

  const outDir = path.join(process.cwd(), "server", "logs");
  ensureDir(outDir);
  const outFile = path.join(outDir, `image-audit-${Date.now()}.json`);
  const summary = {
    timestamp: new Date().toISOString(),
    repair,
    totalChecked,
    totalMissing,
    totalInvalid,
    totalErrors
  };
  const payload = { summary, items: results };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(JSON.stringify(summary));
  console.log(outFile);
}

const repairFlag = process.argv.includes("--repair");
auditImages(repairFlag).catch(err => {
  console.error("Audit failed", err);
  process.exitCode = 1;
});
