import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";
import { log } from "console";

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/users/me");
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { login, user } = useAuthStore();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as User;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Actualizar el store de auth con los nuevos datos
      const token = useAuthStore.getState().token;
      if (token) login(token, updatedUser);
    },
  });
}
