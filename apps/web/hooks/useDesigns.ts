import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Design } from "@/types";

export function useDesigns() {
  return useQuery<Design[]>({
    queryKey: ["designs"],
    queryFn: async () => {
      const { data } = await api.get("/designs");
      return data;
    },
  });
}
