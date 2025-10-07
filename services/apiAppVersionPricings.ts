const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AppVersionPriceItem {
  id: number;
  pricingId: number;
  textAr: string;
  textEn: string;
  displayOrder: number;
  createdAt: string;
}

export interface AppVersionPricing {
  id: number;
  pageNumber: number;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  price: number;
  currency: string;
  periodAr?: string;
  periodEn?: string;
  featuresAr?: string;
  featuresEn?: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: AppVersionPriceItem[];
}

export interface CreateAppVersionPricingDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  price: number;
  items?: Array<{
    text_ar: string;
    text_en: string;
    display_order?: number;
  }>;
}

export interface UpdateAppVersionPricingDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  price?: number;
  is_active?: boolean;
  items?: Array<{
    text_ar: string;
    text_en: string;
    display_order?: number;
  }>;
}

// Get all app version pricings or filter by page number
export const getAppVersionPricings = async (
  pageNumber?: number
): Promise<AppVersionPricing[]> => {
  const url = pageNumber
    ? `${API_URL}/api/app-version-pricings?page_number=${pageNumber}`
    : `${API_URL}/api/app-version-pricings`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch app version pricings");
  }

  const data = await response.json();
  return data.data || [];
};

// Get app version pricings by page number
export const getAppVersionPricingsByPage = async (
  pageNumber: number
): Promise<AppVersionPricing[]> => {
  const response = await fetch(
    `${API_URL}/api/app-version-pricings/page/${pageNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch app version pricings by page");
  }

  const data = await response.json();
  return data.data || [];
};

// Get app version pricing by ID
export const getAppVersionPricingById = async (
  id: number
): Promise<AppVersionPricing> => {
  const response = await fetch(`${API_URL}/api/app-version-pricings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch app version pricing");
  }

  const data = await response.json();
  return data.data;
};

// Create new app version pricing
export const createAppVersionPricing = async (
  pricingData: CreateAppVersionPricingDto
): Promise<AppVersionPricing> => {
  const response = await fetch(`${API_URL}/api/app-version-pricings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create app version pricing");
  }

  const data = await response.json();
  return data.data;
};

// Update app version pricing
export const updateAppVersionPricing = async (
  id: number,
  pricingData: UpdateAppVersionPricingDto
): Promise<AppVersionPricing> => {
  const response = await fetch(`${API_URL}/api/app-version-pricings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update app version pricing");
  }

  const data = await response.json();
  return data.data;
};

// Delete app version pricing
export const deleteAppVersionPricing = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/app-version-pricings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete app version pricing");
  }
};
