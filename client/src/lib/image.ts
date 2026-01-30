export function optimizeImageUrl(url: string | null | undefined, width: number, quality: number): string {
  const fallback = "/assets/article-placeholder.svg";
  if (!url || url.trim().length === 0) return fallback;
  try {
    const u = new URL(url);
    if (u.hostname.includes("images.unsplash.com")) {
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", String(quality));
      return u.toString();
    }
    return url;
  } catch {
    return fallback;
  }
}
