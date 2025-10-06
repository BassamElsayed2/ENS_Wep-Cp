export interface DesignServicePage {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export const DESIGN_SERVICE_PAGES: DesignServicePage[] = [
  { id: 1, nameAr: "تصميم الويب", nameEn: "Web Design", slug: "wep-design" },
  {
    id: 2,
    nameAr: "تصميم الالعاب",
    nameEn: "Game Design",
    slug: "game-design",
  },
  {
    id: 3,
    nameAr: "تصميم التطبيقات",
    nameEn: "App Design",
    slug: "app-design",
  },
  {
    id: 4,
    nameAr: "تصميم الفيديو",
    nameEn: "Video Design",
    slug: "video-design",
  },
];

export const getDesignServicePageById = (id: number) =>
  DESIGN_SERVICE_PAGES.find((p) => p.id === id);

export const getDesignServicePageBySlug = (slug: string) =>
  DESIGN_SERVICE_PAGES.find((p) => p.slug === slug);
