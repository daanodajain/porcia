import { notFound } from "next/navigation";
import { SiteShell } from "@/features/site/layout-new";
import { WordPressJournalDetail } from "@/features/site/wordpress-journal";
import { getWordPressPostBySlug } from "@/lib/wordpress";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWordPressPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <SiteShell>
      <WordPressJournalDetail post={post} />
    </SiteShell>
  );
}
