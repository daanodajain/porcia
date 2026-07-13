import { SiteShell } from "@/features/site/layout-new";
import { WordPressHome } from "@/features/site/wordpress-home";
import { getHomePageAcf, getWordPressPosts } from "@/lib/wordpress";

export default async function HomePage() {
  const [acf, latestPosts] = await Promise.all([
    getHomePageAcf(),
    getWordPressPosts(3),
  ]);

  return (
    <SiteShell>
      <WordPressHome acf={acf} latestPosts={latestPosts} />
    </SiteShell>
  );
}
