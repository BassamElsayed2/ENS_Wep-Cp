import { API_BASE_URL } from "./apiConfig";

const API_URL = API_BASE_URL;

export interface SupportPriceItem {
  id?: number;
  supportPricingId?: number;
  textAr: string;
  textEn: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportPricing {
  id: number;
  pageNumber: number;
  titleAr: string;
  titleEn: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: SupportPriceItem[];
}

export interface CreateSupportPricingDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  price: number;
  items?: Array<{ text_ar: string; text_en: string; display_order?: number }>;
}

export interface UpdateSupportPricingDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  price?: number;
  is_active?: boolean;
  items?: Array<{ text_ar: string; text_en: string; display_order?: number }>;
}

export const getSupportPricings = async (
  pageNumber?: number
): Promise<SupportPricing[]> => {
  const url = pageNumber
    ? `${API_URL}/api/support-pricings?page_number=${pageNumber}`
    : `${API_URL}/api/support-pricings`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch support pricings");
  const data = await res.json();
  return data.data || [];
};

export const getSupportPricingsByPage = async (
  pageNumber: number
): Promise<SupportPricing[]> => {
  const res = await fetch(
    `${API_URL}/api/support-pricings/page/${pageNumber}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch support pricings by page");
  const data = await res.json();
  return data.data || [];
};

export const getSupportPricingById = async (
  id: number
): Promise<SupportPricing> => {
  const res = await fetch(`${API_URL}/api/support-pricings/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch support pricing");
  const data = await res.json();
  return data.data;
};

export const createSupportPricing = async (
  payload: CreateSupportPricingDto
): Promise<SupportPricing> => {
  const res = await fetch(`${API_URL}/api/support-pricings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create support pricing");
  }
  const data = await res.json();
  return data.data;
};

export const updateSupportPricing = async (
  id: number,
  payload: UpdateSupportPricingDto
): Promise<SupportPricing> => {
  const res = await fetch(`${API_URL}/api/support-pricings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update support pricing");
  }
  const data = await res.json();
  return data.data;
};

export const deleteSupportPricing = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/support-pricings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete support pricing");
  }
};
