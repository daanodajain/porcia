import { SiteShell } from "@/features/site/layout-new";
import { WordPressJournalList } from "@/features/site/wordpress-journal";
import { getWordPressPosts } from "@/lib/wordpress";

export default async function BlogPage() {
  const posts = await getWordPressPosts(9);

  return (
    <SiteShell>
      <WordPressJournalList posts={posts} />
    </SiteShell>
  );
}
