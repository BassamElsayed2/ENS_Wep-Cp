// تكوين صفحات الخدمات والأسعار
// Service Pages Configuration

export interface ServicePage {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    id: 1,
    nameAr: "استضافة المواقع",
    nameEn: "Web Hosting",
    slug: "web-hosting",
  },
  {
    id: 2,
    nameAr: "استضافة الموزعين",
    nameEn: "Reseller Hosting",
    slug: "reseller-hosting",
  },
  {
    id: 3,
    nameAr: "السيرفرات الخاصة",
    nameEn: "Private Servers",
    slug: "private-servers",
  },
  {
    id: 4,
    nameAr: "البريد الإلكتروني",
    nameEn: "Email Services",
    slug: "email-services",
  },
];

// Helper function to get page by ID
export const getServicePageById = (id: number): ServicePage | undefined => {
  return SERVICE_PAGES.find((page) => page.id === id);
};

// Helper function to get page by slug
export const getServicePageBySlug = (slug: string): ServicePage | undefined => {
  return SERVICE_PAGES.find((page) => page.slug === slug);
};
