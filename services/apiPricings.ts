const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Pricing {
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
}

export interface CreatePricingDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  price: number;
  currency?: string;
  period_ar?: string;
  period_en?: string;
  features_ar?: string;
  features_en?: string;
  is_featured?: boolean;
  display_order?: number;
}

export interface UpdatePricingDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  price?: number;
  currency?: string;
  period_ar?: string;
  period_en?: string;
  features_ar?: string;
  features_en?: string;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
}

// Get all pricings or filter by page number
export const getPricings = async (pageNumber?: number): Promise<Pricing[]> => {
  const url = pageNumber
    ? `${API_URL}/api/pricings?page_number=${pageNumber}`
    : `${API_URL}/api/pricings`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pricings");
  }

  const data = await response.json();
  return data.data || [];
};

// Get pricings by page number
export const getPricingsByPage = async (
  pageNumber: number
): Promise<Pricing[]> => {
  const response = await fetch(`${API_URL}/api/pricings/page/${pageNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pricings by page");
  }

  const data = await response.json();
  return data.data || [];
};

// Get pricing by ID
export const getPricingById = async (id: number): Promise<Pricing> => {
  const response = await fetch(`${API_URL}/api/pricings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pricing");
  }

  const data = await response.json();
  return data.data;
};

// Create new pricing
export const createPricing = async (
  pricingData: CreatePricingDto
): Promise<Pricing> => {
  const response = await fetch(`${API_URL}/api/pricings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create pricing");
  }

  const data = await response.json();
  return data.data;
};

// Update pricing
export const updatePricing = async (
  id: number,
  pricingData: UpdatePricingDto
): Promise<Pricing> => {
  const response = await fetch(`${API_URL}/api/pricings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update pricing");
  }

  const data = await response.json();
  return data.data;
};

// Delete pricing
export const deletePricing = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/pricings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete pricing");
  }
};
