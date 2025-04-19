export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  categoryId: number;
  featured: boolean;
  publishedAt: string | Date;
  views: number;
}

export interface Analyst {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
}

export interface Analysis {
  id: number;
  title: string;
  slug: string;
  content: string;
  analystId: number;
  publishedAt: string | Date;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured: boolean;
  publishedAt: string | Date;
}
