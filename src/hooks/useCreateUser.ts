import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createUser, CreateUserData } from "../../services/apiUsers";

/**
 * Hook لإنشاء مستخدم جديد
 */
export function useCreateUser() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: createNewUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (userData: CreateUserData) => createUser(userData),
    onSuccess: () => {
      // إعادة جلب قائمة المستخدمين بعد الإنشاء
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // إظهار رسالة نجاح
      toast.success("تم إنشاء المستخدم بنجاح");

      // الانتقال إلى صفحة Dashboard أو قائمة المستخدمين
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      // إظهار رسالة خطأ
      toast.error(error.message || "فشل في إنشاء المستخدم");
    },
  });

  return {
    createNewUser,
    isPending,
    isError,
    error,
  };
}
