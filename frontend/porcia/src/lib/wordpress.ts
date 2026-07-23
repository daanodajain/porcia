import { wordpress, type WordPressPageKey } from "@/config/wordpress";
import { inferMediaKind, resolveBestMediaUrl, type MediaKind } from "@/lib/media";

type WordPressRendered = { rendered: string };

export interface WordPressMedia {
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WordPressPage {
  id: number;
  slug: string;
  link?: string;
  date?: string;
  modified?: string;
  menu_order?: number;
  title: WordPressRendered;
  excerpt?: WordPressRendered;
  content: WordPressRendered;
  featured_media?: number;
  acf?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
  };
}

export interface WordPressPost {
  id: number;
  slug: string;
  link?: string;
  date: string;
  modified?: string;
  title: WordPressRendered;
  excerpt: WordPressRendered;
  content: WordPressRendered;
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
  };
}

export interface WordPressCard {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date?: string;
  image?: string | null;
  media?: string | null;
  mediaKind?: MediaKind;
  alt?: string;
}

export interface WordPressNavItem {
  id: number;
  href: string;
  label: string;
  slug: string;
  order: number;
}

// ─── ACF HOME PAGE TYPES ────────────────────────────────────────────────────

export interface AcfHousePage {
  page_title?: string;
  page_description?: string;
  page_slug?: string;
}

export interface HomeAcf {
  hero_title?: string;
  hero_descrption?: string;
  hero_media_link?: string;
  hero_button_text?: string;
  hero_button_link?: string;
  statement_label?: string;
  statement_heading?: string;
  statement_body?: string;
  collection_label?: string;
  collection_heading?: string;
  collection_link_text?: string;
  collection_link_url?: string;
  collection_image?: string;
  house_label?: string;
  house_heading?: string;
  house_pages?: AcfHousePage[];
  concierge_label?: string;
  concierge_heading?: string;
  concierge_body?: string;
  concierge_button_text?: string;
  concierge_button_link?: string;
  concierge_secondary_text?: string;
  concierge_secondary_link?: string;
  section_1_title?: string;
  section_1_image?: string;
  section_1_text?: string;
}

// ─── ACF SHOP PAGE TYPES ────────────────────────────────────────────────────

export interface ShopAcf {
  // Hero banner
  shop_hero_label?: string;
  shop_hero_title?: string;
  shop_hero_subtitle?: string;
  shop_hero_image?: string;
  shop_hero_video?: string;
  // Promo strip / marquee
  shop_promo_text?: string;
  // Season tag
  shop_season_tag?: string;
}

// ─── ACF FOOTER TYPES ───────────────────────────────────────────────────────

export interface FooterAcf {
  footer_brand_statement?: string;
  footer_newsletter_heading?: string;
  footer_newsletter_subtext?: string;
  // Social links
  footer_instagram?: string;
  footer_facebook?: string;
  footer_pinterest?: string;
  footer_tiktok?: string;
  footer_twitter?: string;
  footer_youtube?: string;
  // Bottom bar
  footer_copyright_name?: string;
  footer_bottom_text?: string;
}

// ─── ACF GLOBAL SETTINGS PAGE ───────────────────────────────────────────────
// This is a single WP page with slug "global-settings" that holds site-wide ACF

export interface GlobalSettingsAcf extends FooterAcf {
  // Marquee ticker
  marquee_text?: string;
  marquee_enabled?: boolean;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveBaseUrl() {
  return trimSlash(wordpress.baseUrl);
}

async function fetchWordPress<T>(path: string): Promise<T> {
  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    next: { revalidate: wordpress.revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014");
}

function fromEmbeddedImage(item: WordPressPage | WordPressPost) {
  return item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export function toWordPressCard(item: WordPressPage | WordPressPost): WordPressCard {
  const media = resolveBestMediaUrl(fromEmbeddedImage(item));
  return {
    id: item.id,
    slug: item.slug,
    title: decodeHtmlEntities(item.title?.rendered ?? ""),
    excerpt: stripHtml(item.excerpt?.rendered ?? ""),
    content: item.content?.rendered ?? "",
    date: item.date,
    image: media,
    media,
    mediaKind: inferMediaKind(media),
    alt: decodeHtmlEntities(item.title?.rendered ?? ""),
  };
}

export function toWordPressNavItem(page: WordPressPage): WordPressNavItem {
  return {
    id: page.id,
    href: `/${page.slug}`,
    label: decodeHtmlEntities(stripHtml(page.title?.rendered ?? page.slug)),
    slug: page.slug,
    order: page.menu_order ?? 0,
  };
}

export async function getWordPressPages(limit = 100) {
  return fetchWordPress<WordPressPage[]>(
    `/pages?per_page=${limit}&orderby=menu_order&order=asc&_embed=1`,
  ).catch(() => []);
}

const FOOTER_ONLY_SLUGS = new Set([
  "home",
  "privacy-policy",
  "shipping-returns",
  "size-guide",
  "terms-conditions",
  "sample-page",
  "cart",
  "checkout",
  "my-account",
  "global-settings",
  "shop-settings",
]);

export async function getWordPressNavigation() {
  const pages = await getWordPressPages();
  return pages
    .filter((page) => !FOOTER_ONLY_SLUGS.has(page.slug))
    .sort((a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0) || a.title.rendered.localeCompare(b.title.rendered))
    .map(toWordPressNavItem);
}

export async function getWordPressFooterNav() {
  const FOOTER_SLUGS = new Set([
    "privacy-policy",
    "shipping-returns",
    "size-guide",
    "terms-conditions",
    "care",
    "faq",
  ]);
  const pages = await getWordPressPages();
  return pages
    .filter((page) => FOOTER_SLUGS.has(page.slug))
    .sort((a, b) => (a.menu_order ?? 0) - (b.menu_order ?? 0) || a.title.rendered.localeCompare(b.title.rendered))
    .map(toWordPressNavItem);
}

export async function getWordPressPageById(id: number) {
  if (!id) return null;
  return fetchWordPress<WordPressPage>(`/pages/${id}?_embed=1`).catch(() => null);
}

export async function getWordPressPageBySlug(slug: string) {
  const pages = await fetchWordPress<WordPressPage[]>(`/pages?slug=${encodeURIComponent(slug)}&_embed=1`).catch(() => []);
  return pages[0] ?? null;
}

export async function getWordPressPage(routeKey: WordPressPageKey, fallbackSlug?: string) {
  const pageId = wordpress.pages[routeKey];
  if (pageId) {
    const page = await getWordPressPageById(pageId);
    if (page) return page;
  }

  if (fallbackSlug) {
    return getWordPressPageBySlug(fallbackSlug);
  }

  return null;
}

// ─── ACF-SPECIFIC FETCHERS ───────────────────────────────────────────────────

// ─── CUSTOM PORCIA ACF ENDPOINT ─────────────────────────────────────────────
// Uses /wp-json/porcia/v1/page-acf/<slug> (mu-plugin: porcia-acf-api.php)

async function fetchPorciaAcf<T>(slug: string): Promise<T> {
  const base = trimSlash(wordpress.baseUrl).replace("/wp/v2", "");
  const response = await fetch(`${base}/porcia/v1/page-acf/${slug}`, {
    next: { revalidate: wordpress.revalidateSeconds },
  });
  if (!response.ok) throw new Error(`ACF fetch failed: ${response.status}`);
  const data = await response.json();
  return (data.acf ?? {}) as T;
}

export async function getHomePageAcf(): Promise<HomeAcf> {
  try {
    return await fetchPorciaAcf<HomeAcf>("home");
  } catch {
    return {};
  }
}

export async function getShopPageAcf(): Promise<ShopAcf> {
  try {
    return await fetchPorciaAcf<ShopAcf>("shop-settings");
  } catch {
    return {};
  }
}

export async function getGlobalSettingsAcf(): Promise<GlobalSettingsAcf> {
  try {
    return await fetchPorciaAcf<GlobalSettingsAcf>("global-settings");
  } catch {
    return {};
  }
}

// ─── POSTS ───────────────────────────────────────────────────────────────────

export async function getWordPressPosts(limit = 6) {
  const posts = await fetchWordPress<WordPressPost[]>(`/posts?per_page=${limit}&_embed=1`).catch(() => []);
  return posts.map(toWordPressCard);
}

export async function getWordPressPostBySlug(slug: string) {
  const posts = await fetchWordPress<WordPressPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed=1`).catch(() => []);
  const post = posts[0];
  return post ? toWordPressCard(post) : null;
}

export function getWordPressMedia(page: WordPressPage | WordPressPost | null) {
  if (!page) return null;
  return fromEmbeddedImage(page);
}

export function getWordPressExcerpt(page: WordPressPage | WordPressPost | null, fallback = "") {
  if (!page) return fallback;
  const excerpt = page.excerpt?.rendered ? stripHtml(page.excerpt.rendered) : "";
  return excerpt || fallback;
}

export function getWordPressTitle(page: WordPressPage | WordPressPost | null, fallback = "") {
  return page?.title?.rendered ?? fallback;
}
