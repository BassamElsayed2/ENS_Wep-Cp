import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUserById } from "../../services/apiUsers";

/**
 * Hook لجلب جميع المستخدمين
 */
export function useUsers() {
  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5, // البيانات تبقى fresh لمدة 5 دقائق
  });

  return {
    users,
    isPending,
    isError,
    error,
  };
}

/**
 * Hook لجلب مستخدم واحد بالـ ID
 */
export function useUser(id: string | undefined) {
  const {
    data: user,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !!id, // لا يتم التشغيل إلا إذا كان ID موجود
  });

  return {
    user,
    isPending,
    isError,
    error,
  };
}
