const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface DesignService {
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

export interface CreateDesignServiceDto {
  page_number: number;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image: File;
}

export interface UpdateDesignServiceDto {
  page_number?: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active?: boolean;
  image?: File;
}

export const getDesignServices = async (
  pageNumber?: number
): Promise<DesignService[]> => {
  const url = pageNumber
    ? `${API_URL}/api/design-services?page_number=${pageNumber}`
    : `${API_URL}/api/design-services`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch design services");
  const data = await res.json();
  return data.data || [];
};

export const getDesignServicesByPage = async (
  pageNumber: number
): Promise<DesignService[]> => {
  const res = await fetch(`${API_URL}/api/design-services/page/${pageNumber}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch design services by page");
  const data = await res.json();
  return data.data || [];
};

export const getDesignServiceById = async (
  id: number
): Promise<DesignService> => {
  const res = await fetch(`${API_URL}/api/design-services/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch design service");
  const data = await res.json();
  return data.data;
};

export const createDesignService = async (
  payload: CreateDesignServiceDto
): Promise<DesignService> => {
  const form = new FormData();
  form.append("page_number", payload.page_number.toString());
  form.append("title_ar", payload.title_ar);
  form.append("title_en", payload.title_en);
  if (payload.description_ar)
    form.append("description_ar", payload.description_ar);
  if (payload.description_en)
    form.append("description_en", payload.description_en);
  form.append("image", payload.image);

  const res = await fetch(`${API_URL}/api/design-services`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create design service");
  }
  const data = await res.json();
  return data.data;
};

export const updateDesignService = async (
  id: number,
  payload: UpdateDesignServiceDto
): Promise<DesignService> => {
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

  const res = await fetch(`${API_URL}/api/design-services/${id}`, {
    method: "PUT",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update design service");
  }
  const data = await res.json();
  return data.data;
};

export const deleteDesignService = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/design-services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete design service");
  }
};
