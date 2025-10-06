import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteUser } from "../../services/apiUsers";

/**
 * Hook لحذف المستخدم
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  const {
    mutate: removeUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // إعادة جلب قائمة المستخدمين بعد الحذف
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("تم حذف المستخدم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "فشل في حذف المستخدم");
      console.error("Failed to delete user:", error);
    },
  });

  return {
    removeUser,
    isPending,
    isError,
    error,
  };
}
