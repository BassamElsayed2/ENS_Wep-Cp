import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginApi, getCurrentUser } from "../../../services/apiauth";
import toast from "react-hot-toast";

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await loginApi({ email, password });
    },
    onSuccess: async () => {
      // جلب بيانات المستخدم الجديدة
      const user = await getCurrentUser();

      if (user) {
        // تحديث الـ cache مباشرة ببيانات المستخدم
        queryClient.setQueryData(["user"], user);

        toast.success("تم تسجيل الدخول بنجاح");

        // الانتظار قليلاً للتأكد من تحديث الـ state
        await new Promise((resolve) => setTimeout(resolve, 100));

        router.push("/dashboard");
      } else {
        throw new Error("فشل في الحصول على بيانات المستخدم");
      }
    },
    onError: () => {
      toast.error("فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور");
    },
  });

  return { login, isPending, isError };
}
