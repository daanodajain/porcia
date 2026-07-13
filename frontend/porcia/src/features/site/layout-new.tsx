import { type ReactNode } from "react";
import { getWordPressNavigation, getWordPressFooterNav } from "@/lib/wordpress";
import { SiteChrome } from "./layout-client";

export async function SiteShell({ children }: { children: ReactNode }) {
  const [navItems, footerItems] = await Promise.all([
    getWordPressNavigation(),
    getWordPressFooterNav(),
  ]);

  return <SiteChrome navItems={navItems} footerItems={footerItems}>{children}</SiteChrome>;
}
