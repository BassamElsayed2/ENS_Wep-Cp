// API base URL
const API_BASE_URL = "http://localhost:4010/api";
const USERS_URL = `${API_BASE_URL}/users`;
const AUTH_URL = `${API_BASE_URL}/auth`;

export interface User {
  id?: string;
  email: string;
  password?: string;
  phone: string;
  full_name: string;
  job_title?: string;
  address?: string;
  about?: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  phone: string;
  full_name: string;
  job_title?: string;
  address?: string;
  about?: string;
  profile_picture?: File;
}

/**
 * جلب جميع المستخدمين
 */
export async function getAllUsers(): Promise<User[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(USERS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("فشل في جلب المستخدمين");
  }

  return await response.json();
}

/**
 * جلب مستخدم واحد بالـ ID
 */
export async function getUserById(id: string): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("فشل في جلب بيانات المستخدم");
  }

  return await response.json();
}

/**
 * إنشاء مستخدم جديد (Sign Up)
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  // إرسال البيانات كـ JSON (ليس FormData)
  const response = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.full_name, // Backend expects 'username'
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      jobTitle: userData.job_title, // Backend expects 'jobTitle' (camelCase)
      address: userData.address,
      about: userData.about,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل في إنشاء المستخدم");
  }

  const data = await response.json();

  // حفظ الـ token إذا تم إرجاعه
  // Backend returns: { success: true, data: { user: {...}, token: "..." } }
  const token = data.data?.token || data.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return data;
}

/**
 * تحديث مستخدم موجود
 */
export async function updateUser(
  id: string,
  userData: Partial<CreateUserData>
): Promise<User> {
  const token = localStorage.getItem("token");

  // إرسال البيانات كـ JSON مع تحويل أسماء الحقول
  const updateData: Record<string, any> = {};

  if (userData.full_name !== undefined)
    updateData.username = userData.full_name;
  if (userData.email !== undefined) updateData.email = userData.email;
  if (userData.password !== undefined) updateData.password = userData.password;
  if (userData.phone !== undefined) updateData.phone = userData.phone;
  if (userData.job_title !== undefined)
    updateData.jobTitle = userData.job_title;
  if (userData.address !== undefined) updateData.address = userData.address;
  if (userData.about !== undefined) updateData.about = userData.about;

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل في تحديث المستخدم");
  }

  return await response.json();
}

/**
 * حذف مستخدم
 */
export async function deleteUser(id: string): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("فشل في حذف المستخدم");
  }
}

/**
 * رفع صورة المستخدم
 */
export async function uploadUserPicture(
  userId: string,
  file: File
): Promise<string> {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("picture", file);

  const response = await fetch(`${USERS_URL}/${userId}/upload-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل في رفع الصورة");
  }

  const data = await response.json();
  return data.data?.picture_url || "";
}
