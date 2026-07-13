import Link from "next/link";
import { SiteShell } from "@/features/site/layout-new";
import { WordPressPageView } from "@/features/site/wordpress-page";
import { wordpress, type WordPressPageKey } from "@/config/wordpress";
import { getWordPressPage, getWordPressPageBySlug, toWordPressCard } from "@/lib/wordpress";
import { Container } from "@/components/ui";

function routeKeyFromSlug(slug: string): WordPressPageKey | null {
  const entry = Object.entries(wordpress.pageSlugs).find(([, routeSlug]) => routeSlug === slug);
  return entry ? (entry[0] as WordPressPageKey) : null;
}

function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default async function CmsPageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const routeKey = routeKeyFromSlug(slug);
  const page = routeKey
    ? await getWordPressPage(routeKey, slug)
    : await getWordPressPageBySlug(slug);

  if (page) {
    const pageCard = toWordPressCard(page);
    return (
      <SiteShell>
        <WordPressPageView page={pageCard} pageLabel={pageCard.title} />
      </SiteShell>
    );
  }

  // Page not yet in WordPress — show coming soon instead of 404
  const title = slugToTitle(slug);
  return (
    <SiteShell>
      <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)]">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
            Coming Soon
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6rem)] font-light leading-[0.94] tracking-[-0.05em]">
            {title}
          </h1>
          <p className="mt-8 max-w-md text-base leading-8 text-[var(--porcia-text-secondary)]">
            This page is being crafted with care. Please check back soon.
          </p>
          <Link
            href="/"
            className="mt-12 inline-flex h-12 items-center rounded-full border border-[var(--porcia-border)] px-8 text-xs uppercase tracking-[0.3em] transition hover:border-[var(--porcia-fg)]"
          >
            Back to Home
          </Link>
        </Container>
      </div>
    </SiteShell>
  );
}
