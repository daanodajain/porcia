export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const;
export const container = { sm: "40rem", md: "48rem", lg: "72rem", xl: "80rem", "2xl": "88rem" } as const;
export const radius = { sm: "0.375rem", md: "0.75rem", lg: "1.25rem", xl: "1.75rem", pill: "9999px" } as const;
export const shadow = { soft: "0 10px 30px rgba(15,12,11,.08)", lift: "0 18px 60px rgba(15,12,11,.10)", gold: "0 0 0 1px rgba(176,141,87,.18),0 18px 60px rgba(15,12,11,.10)" } as const;
export const motion = { fast: 150, normal: 220, slow: 320, reveal: 480, dramatic: 650 } as const;
export const ratio = { square: "1/1", portrait: "4/5", card: "3/4", wide: "16/9", cinema: "21/9" } as const;
export const imageSizes = { hero: "(min-width: 1280px) 1200px, 100vw", card: "(min-width: 768px) 50vw, 100vw" } as const;
