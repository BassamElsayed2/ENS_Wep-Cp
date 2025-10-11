// API base URL للـ Authentication
const API_BASE_URL = "http://localhost:4010/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role?: string;
  };
  token: string;
}

/**
 * تسجيل الدخول
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "فشل تسجيل الدخول");
  }

  const data = await response.json();

  // حفظ الـ token في localStorage
  // Backend returns: { success: true, data: { user: {...}, token: "..." } }
  const token = data.data?.token || data.token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return data;
}

/**
 * تسجيل الخروج
 */
export async function logout(): Promise<void> {
  // حذف الـ token من localStorage
  localStorage.removeItem("token");
}

/**
 * الحصول على المستخدم الحالي
 */
export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    return null;
  }

  const data = await response.json();

  // Backend returns: { success: true, data: { user: {...} } }
  const user = data.data?.user || data.user || null;
  return user;
}

/**
 * الحصول على ملف Admin Profile بالـ ID
 */
export async function getAdminProfileById(id: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("فشل في جلب بيانات الملف الشخصي");
  }

  const userData = await response.json();

  // Transform backend data to match ProfileTypes interface
  return {
    user_id: userData.id,
    full_name: userData.username,
    email: userData.email,
    job_title: userData.jobTitle || "غير محدد",
    address: userData.address || "غير محدد",
    phone: userData.phone || "غير محدد",
    about: userData.about || "",
    image_url: userData.picture || "/images/admin.png",
    joined_at: userData.createdAt,
  };
}

/**
 * تغيير كلمة المرور
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("لم يتم العثور على token");
  }

  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "فشل في تغيير كلمة المرور");
  }

  const data = await response.json();
  return data;
}
