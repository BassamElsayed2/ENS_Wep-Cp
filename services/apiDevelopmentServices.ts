const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface DevelopmentService {
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

export interface CreateDevelopmentServiceDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image: File;
}

export interface UpdateDevelopmentServiceDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active?: boolean;
  image?: File;
}

export const getDevelopmentServices = async (
  pageNumber?: number
): Promise<DevelopmentService[]> => {
  const url = pageNumber
    ? `${API_URL}/api/development-services?page_number=${pageNumber}`
    : `${API_URL}/api/development-services`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch development services");
  const data = await res.json();
  return data.data || [];
};

export const getDevelopmentServicesByPage = async (
  pageNumber: number
): Promise<DevelopmentService[]> => {
  const res = await fetch(
    `${API_URL}/api/development-services/page/${pageNumber}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch development services by page");
  const data = await res.json();
  return data.data || [];
};

export const getDevelopmentServiceById = async (
  id: number
): Promise<DevelopmentService> => {
  const res = await fetch(`${API_URL}/api/development-services/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch development service");
  const data = await res.json();
  return data.data;
};

export const createDevelopmentService = async (
  payload: CreateDevelopmentServiceDto
): Promise<DevelopmentService> => {
  const form = new FormData();
  form.append("page_number", payload.page_number.toString());
  form.append("title_ar", payload.title_ar);
  form.append("title_en", payload.title_en);
  if (payload.description_ar)
    form.append("description_ar", payload.description_ar);
  if (payload.description_en)
    form.append("description_en", payload.description_en);
  form.append("image", payload.image);

  const res = await fetch(`${API_URL}/api/development-services`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create development service");
  }
  const data = await res.json();
  return data.data;
};

export const updateDevelopmentService = async (
  id: number,
  payload: UpdateDevelopmentServiceDto
): Promise<DevelopmentService> => {
  const form = new FormData();
  if (payload.page_number !== undefined)
    form.append("page_number", payload.page_number.toString());
  if (payload.title_ar !== undefined) form.append("title_ar", payload.title_ar);
  if (payload.title_en !== undefined) form.append("title_en", payload.title_en);
  if (payload.description_ar !== undefined)
    form.append("description_ar", payload.description_ar);
  if (payload.description_en !== undefined)
    form.append("description_en", payload.description_en);
  if (payload.is_active !== undefined)
    form.append("is_active", payload.is_active.toString());
  if (payload.image) form.append("image", payload.image);

  const res = await fetch(`${API_URL}/api/development-services/${id}`, {
    method: "PUT",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update development service");
  }
  const data = await res.json();
  return data.data;
};

export const deleteDevelopmentService = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/development-services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete development service");
  }
};
