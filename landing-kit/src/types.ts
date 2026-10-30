export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  children?: ProductCategory[];
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: ProductCategory[];
  images: ImageAsset[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: ImageAsset;
  publishedAt: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
