import { CollectionPage, Category, Brand, Filter, Sort, InfiniteScroll, Search, LuxuryProductGrid } from "./index";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const shopPhases = [CollectionPage, Category, Brand, Filter, Sort, InfiniteScroll, Search, LuxuryProductGrid, LoadingSkeleton] as const;
