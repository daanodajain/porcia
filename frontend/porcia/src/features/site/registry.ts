import { SiteShell } from "./layout-new";
import { WordPressHome } from "./wordpress-home";
import { WordPressJournalList } from "./wordpress-journal";
import { WordPressPageView } from "./wordpress-page";

export const siteShell = { SiteShell } as const;
export const siteWordPressViews = {
  WordPressHome,
  WordPressJournalList,
  WordPressPageView,
} as const;
