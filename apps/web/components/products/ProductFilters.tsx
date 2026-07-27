"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const CATEGORIES = [
  { value: "TAZA", label: "Tazas" },
  { value: "PLAYERA", label: "Playeras" },
  { value: "HOODIE", label: "Hoodies" },
  { value: "OTRO", label: "Otro" },
];

const MATERIALS = [
  { value: "ALGODON", label: "Algodón" },
  { value: "POLIESTER", label: "Poliéster" },
  { value: "CERAMICA", label: "Cerámica" },
  { value: "ALUMINIO", label: "Aluminio" },
  { value: "OTRO", label: "Otro" },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const material = searchParams.get("material") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = category || material;

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 sm:gap-4 pb-2">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-brand-medium">
          Categoría
        </label>
        <Select
          value={category || "all"}
          onValueChange={(v: string) => updateParam("category", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-brand-medium">
          Material
        </label>
        <Select
          value={material || "all"}
          onValueChange={(v: string) => updateParam("material", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {MATERIALS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-brand-medium hover:text-brand-primary"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
