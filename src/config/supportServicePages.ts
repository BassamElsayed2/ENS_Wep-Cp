// Configuration for Support Service Pages
// Each page represents a different technical support service type

export interface SupportServicePage {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export const SUPPORT_SERVICE_PAGES: SupportServicePage[] = [
  {
    id: 1,
    nameAr: "الدعم الفني",
    nameEn: "Technical Support",
    slug: "technical-support",
  },
  {
    id: 2,
    nameAr: "شبكات VPN الآمنة",
    nameEn: "Secure VPN Networks",
    slug: "secure-vpn",
  },
  {
    id: 3,
    nameAr: "مراكز الاتصال",
    nameEn: "Call Centers",
    slug: "call-centers",
  },
  {
    id: 4,
    nameAr: "الأمن السيبراني",
    nameEn: "Cybersecurity",
    slug: "cybersecurity",
  },
];

export const getSupportServicePageById = (
  id: number
): SupportServicePage | undefined => {
  return SUPPORT_SERVICE_PAGES.find((page) => page.id === id);
};

export const getSupportServicePageBySlug = (
  slug: string
): SupportServicePage | undefined => {
  return SUPPORT_SERVICE_PAGES.find((page) => page.slug === slug);
};
