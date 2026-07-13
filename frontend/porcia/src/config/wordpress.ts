export const wordpress = {
  baseUrl:
    process.env.NEXT_PUBLIC_WORDPRESS_REST_BASE_URL ??
    "https://cms.theporcia.com/wp-json/wp/v2",
  revalidateSeconds: Number(process.env.NEXT_PUBLIC_WORDPRESS_REVALIDATE_SECONDS ?? 60),
  pages: {
    home: Number(process.env.NEXT_PUBLIC_WP_HOME_PAGE_ID ?? 0),
    house: Number(process.env.NEXT_PUBLIC_WP_HOUSE_PAGE_ID ?? 0),
    collections: Number(process.env.NEXT_PUBLIC_WP_COLLECTIONS_PAGE_ID ?? 0),
    lookbook: Number(process.env.NEXT_PUBLIC_WP_LOOKBOOK_PAGE_ID ?? 0),
    journal: Number(process.env.NEXT_PUBLIC_WP_JOURNAL_PAGE_ID ?? 0),
    contact: Number(process.env.NEXT_PUBLIC_WP_CONTACT_PAGE_ID ?? 0),
    appointment: Number(process.env.NEXT_PUBLIC_WP_APPOINTMENT_PAGE_ID ?? 0),
    craft: Number(process.env.NEXT_PUBLIC_WP_CRAFT_PAGE_ID ?? 0),
    sustainability: Number(process.env.NEXT_PUBLIC_WP_SUSTAINABILITY_PAGE_ID ?? 0),
    faq: Number(process.env.NEXT_PUBLIC_WP_FAQ_PAGE_ID ?? 0),
    shippingReturns: Number(process.env.NEXT_PUBLIC_WP_SHIPPING_RETURNS_PAGE_ID ?? 0),
    sizeGuide: Number(process.env.NEXT_PUBLIC_WP_SIZE_GUIDE_PAGE_ID ?? 0),
    care: Number(process.env.NEXT_PUBLIC_WP_CARE_PAGE_ID ?? 0),
    privacyPolicy: Number(process.env.NEXT_PUBLIC_WP_PRIVACY_POLICY_PAGE_ID ?? 0),
    terms: Number(process.env.NEXT_PUBLIC_WP_TERMS_PAGE_ID ?? 0),
  },
  pageSlugs: {
    home: "home",
    house: "house",
    collections: "collections",
    lookbook: "lookbook",
    journal: "journal",
    contact: "contact",
    appointment: "appointment",
    craft: "craft",
    sustainability: "sustainability",
    faq: "faq",
    shippingReturns: "shipping-returns",
    sizeGuide: "size-guide",
    care: "care",
    privacyPolicy: "privacy-policy",
    terms: "terms-conditions",
  },
} as const;

export type WordPressPageKey = keyof typeof wordpress.pages;
