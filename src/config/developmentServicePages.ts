// Configuration for Development Service Pages
// Each page represents a different development service type

export interface DevelopmentServicePage {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export const DEVELOPMENT_SERVICE_PAGES: DevelopmentServicePage[] = [
  {
    id: 1,
    nameAr: "برمجة الألعاب",
    nameEn: "Game Development",
    slug: "game-development",
  },
  {
    id: 2,
    nameAr: "تطبيقات الويب",
    nameEn: "Web Applications",
    slug: "web-applications",
  },
  {
    id: 3,
    nameAr: "تطبيقات الموبايل",
    nameEn: "Mobile Applications",
    slug: "mobile-applications",
  },
];

export const getDevelopmentServicePageById = (
  id: number
): DevelopmentServicePage | undefined => {
  return DEVELOPMENT_SERVICE_PAGES.find((page) => page.id === id);
};

export const getDevelopmentServicePageBySlug = (
  slug: string
): DevelopmentServicePage | undefined => {
  return DEVELOPMENT_SERVICE_PAGES.find((page) => page.slug === slug);
};
