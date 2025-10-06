const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Service {
  id: number;
  pageNumber: number;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  img: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image: File;
}

export interface UpdateServiceDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active?: boolean;
  image?: File;
}

// Get all services or filter by page number
export const getServices = async (pageNumber?: number): Promise<Service[]> => {
  const url = pageNumber
    ? `${API_URL}/api/services?page_number=${pageNumber}`
    : `${API_URL}/api/services`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await response.json();
  return data.data || [];
};

// Get services by page number
export const getServicesByPage = async (
  pageNumber: number
): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/api/services/page/${pageNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services by page");
  }

  const data = await response.json();
  return data.data || [];
};

// Get service by ID
export const getServiceById = async (id: number): Promise<Service> => {
  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch service");
  }

  const data = await response.json();
  return data.data;
};

// Create new service
export const createService = async (
  serviceData: CreateServiceDto
): Promise<Service> => {
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
  formData.append("image", serviceData.image);

  const response = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create service");
  }

  const data = await response.json();
  return data.data;
};

// Update service
export const updateService = async (
  id: number,
  serviceData: UpdateServiceDto
): Promise<Service> => {
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
  if (serviceData.image) {
    formData.append("image", serviceData.image);
  }

  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update service");
  }

  const data = await response.json();
  return data.data;
};

// Delete service
export const deleteService = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete service");
  }
};
