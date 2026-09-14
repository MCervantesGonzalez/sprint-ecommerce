import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Address } from "@/types";
import { useAuthStore } from "@/store/authStore";

export function useAddresses() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get("/addresses");
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Address>) => {
      const res = await api.post("/addresses", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Address>;
    }) => {
      const res = await api.patch(`/addresses/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
