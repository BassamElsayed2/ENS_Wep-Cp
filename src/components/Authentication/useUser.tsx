import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../../../services/apiauth";

export function useUser() {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { user, isPending, isAuthanticated: !!user };
}
