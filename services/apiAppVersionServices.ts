import { API_BASE_URL } from "./apiConfig";

const API_URL = API_BASE_URL;

export interface AppVersionService {
  id: number;
  pageNumber: number;
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  img: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppVersionServiceDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image: File;
  display_order?: number;
}

export interface UpdateAppVersionServiceDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active?: boolean;
  image?: File;
  display_order?: number;
}

// Get all app version services or filter by page number
export const getAppVersionServices = async (
  pageNumber?: number
): Promise<AppVersionService[]> => {
  const url = pageNumber
    ? `${API_URL}/api/app-version-services?page_number=${pageNumber}`
    : `${API_URL}/api/app-version-services`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch app version services");
  }

  const data = await response.json();
  return data.data || [];
};

// Get app version services by page number
export const getAppVersionServicesByPage = async (
  pageNumber: number
): Promise<AppVersionService[]> => {
  const response = await fetch(
    `${API_URL}/api/app-version-services/page/${pageNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch app version services by page");
  }

  const data = await response.json();
  return data.data || [];
};

// Get app version service by ID
export const getAppVersionServiceById = async (
  id: number
): Promise<AppVersionService> => {
  const response = await fetch(`${API_URL}/api/app-version-services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch app version service");
  }

  const data = await response.json();
  return data.data;
};

// Create new app version service
export const createAppVersionService = async (
  serviceData: CreateAppVersionServiceDto
): Promise<AppVersionService> => {
  const formData = new FormData();
  formData.append("page_number", serviceData.page_number.toString());
  formData.append("title_ar", serviceData.title_ar);
  formData.append("title_en", serviceData.title_en);

  if (serviceData.description_ar) {
    formData.append("description_ar", serviceData.description_ar);
  }
  if (serviceData.description_en) {
    formData.append("description_en", serviceData.description_en);
  }
  if (serviceData.display_order !== undefined) {
    formData.append("display_order", serviceData.display_order.toString());
  }
  formData.append("image", serviceData.image);

  const response = await fetch(`${API_URL}/api/app-version-services`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create app version service");
  }

  const data = await response.json();
  return data.data;
};

// Update app version service
export const updateAppVersionService = async (
  id: number,
  serviceData: UpdateAppVersionServiceDto
): Promise<AppVersionService> => {
  const formData = new FormData();

  if (serviceData.page_number !== undefined) {
    formData.append("page_number", serviceData.page_number.toString());
  }
  if (serviceData.title_ar !== undefined) {
    formData.append("title_ar", serviceData.title_ar);
  }
  if (serviceData.title_en !== undefined) {
    formData.append("title_en", serviceData.title_en);
  }
  if (serviceData.description_ar !== undefined) {
    formData.append("description_ar", serviceData.description_ar);
  }
  if (serviceData.description_en !== undefined) {
    formData.append("description_en", serviceData.description_en);
  }
  if (serviceData.is_active !== undefined) {
    formData.append("is_active", serviceData.is_active.toString());
  }
  if (serviceData.display_order !== undefined) {
    formData.append("display_order", serviceData.display_order.toString());
  }
  if (serviceData.image) {
    formData.append("image", serviceData.image);
  }

  const response = await fetch(`${API_URL}/api/app-version-services/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update app version service");
  }

  const data = await response.json();
  return data.data;
};

// Delete app version service
export const deleteAppVersionService = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/app-version-services/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete app version service");
  }
};
