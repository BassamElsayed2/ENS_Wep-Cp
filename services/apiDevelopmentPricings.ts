import { API_BASE_URL } from "./apiConfig";

const API_URL = API_BASE_URL;

export interface DevelopmentPriceItem {
  id?: number;
  developmentPricingId?: number;
  textAr: string;
  textEn: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DevelopmentPricing {
  id: number;
  pageNumber: number;
  titleAr: string;
  titleEn: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: DevelopmentPriceItem[];
}

export interface CreateDevelopmentPricingDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  price: number;
  items?: Array<{ text_ar: string; text_en: string; display_order?: number }>;
}

export interface UpdateDevelopmentPricingDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  price?: number;
  is_active?: boolean;
  items?: Array<{ text_ar: string; text_en: string; display_order?: number }>;
}

export const getDevelopmentPricings = async (
  pageNumber?: number
): Promise<DevelopmentPricing[]> => {
  const url = pageNumber
    ? `${API_URL}/api/development-pricings?page_number=${pageNumber}`
    : `${API_URL}/api/development-pricings`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch development pricings");
  const data = await res.json();
  return data.data || [];
};

export const getDevelopmentPricingsByPage = async (
  pageNumber: number
): Promise<DevelopmentPricing[]> => {
  const res = await fetch(
    `${API_URL}/api/development-pricings/page/${pageNumber}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch development pricings by page");
  const data = await res.json();
  return data.data || [];
};

export const getDevelopmentPricingById = async (
  id: number
): Promise<DevelopmentPricing> => {
  const res = await fetch(`${API_URL}/api/development-pricings/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch development pricing");
  const data = await res.json();
  return data.data;
};

export const createDevelopmentPricing = async (
  payload: CreateDevelopmentPricingDto
): Promise<DevelopmentPricing> => {
  const res = await fetch(`${API_URL}/api/development-pricings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create development pricing");
  }
  const data = await res.json();
  return data.data;
};

export const updateDevelopmentPricing = async (
  id: number,
  payload: UpdateDevelopmentPricingDto
): Promise<DevelopmentPricing> => {
  const res = await fetch(`${API_URL}/api/development-pricings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update development pricing");
  }
  const data = await res.json();
  return data.data;
};

export const deleteDevelopmentPricing = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/development-pricings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete development pricing");
  }
};
