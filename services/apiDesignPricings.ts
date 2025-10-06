const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface DesignPricing {
  id: number;
  pageNumber: number;
  titleAr: string;
  titleEn: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: DesignPriceItem[];
}

export interface DesignPriceItem {
  id: number;
  designPricingId: number;
  textAr: string;
  textEn: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateDesignPricingDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  price: number;
  items?: Array<{ text_ar: string; text_en: string; display_order?: number }>;
}

export interface UpdateDesignPricingDto {
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

// Get all design pricings or filter by page number
export const getDesignPricings = async (
  pageNumber?: number
): Promise<DesignPricing[]> => {
  const url = pageNumber
    ? `${API_URL}/api/design-pricings?page_number=${pageNumber}`
    : `${API_URL}/api/design-pricings`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch design pricings");
  }

  const data = await response.json();
  return data.data || [];
};

// Get design pricings by page number
export const getDesignPricingsByPage = async (
  pageNumber: number
): Promise<DesignPricing[]> => {
  const response = await fetch(
    `${API_URL}/api/design-pricings/page/${pageNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch design pricings by page");
  }

  const data = await response.json();
  return data.data || [];
};

// Get design pricing by ID
export const getDesignPricingById = async (
  id: number
): Promise<DesignPricing> => {
  const response = await fetch(`${API_URL}/api/design-pricings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch design pricing");
  }

  const data = await response.json();
  return data.data;
};

// Create new design pricing
export const createDesignPricing = async (
  pricingData: CreateDesignPricingDto
): Promise<DesignPricing> => {
  const response = await fetch(`${API_URL}/api/design-pricings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create design pricing");
  }

  const data = await response.json();
  return data.data;
};

// Update design pricing
export const updateDesignPricing = async (
  id: number,
  pricingData: UpdateDesignPricingDto
): Promise<DesignPricing> => {
  const response = await fetch(`${API_URL}/api/design-pricings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update design pricing");
  }

  const data = await response.json();
  return data.data;
};

// Delete design pricing
export const deleteDesignPricing = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/design-pricings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete design pricing");
  }
};
