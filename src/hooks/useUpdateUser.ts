import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUser, CreateUserData } from "../../services/apiUsers";

/**
 * Hook لتحديث بيانات المستخدم
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  const {
    mutate: updateUserData,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: Partial<CreateUserData>;
    }) => updateUser(id, userData),
    onSuccess: (_, variables) => {
      // تحديث الـ cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });

      toast.success("تم تحديث البيانات بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "فشل في تحديث البيانات");
    },
  });

  return {
    updateUserData,
    isPending,
    isError,
    error,
  };
}
