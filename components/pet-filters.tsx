"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPECIES_LABELS, ADOPTION_STATUS_LABELS } from "@/lib/constants";
import { Species, AdoptionStatus } from "@prisma/client";

interface Props {
  locations: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  initialParams: {
    q?: string;
    species?: string;
    status?: string;
    locationId?: string;
    tagId?: string;
  };
}

export default function PetFilters({ locations, tags, initialParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      const current = {
        q: initialParams.q || "",
        species: initialParams.species || "",
        status: initialParams.status || "",
        locationId: initialParams.locationId || "",
        tagId: initialParams.tagId || "",
        [key]: value,
      };
      Object.entries(current).forEach(([k, v]) => {
        if (v && v !== "all") params.set(k, v);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, initialParams]
  );

  const hasFilters =
    initialParams.q ||
    (initialParams.species && initialParams.species !== "all") ||
    (initialParams.status && initialParams.status !== "all") ||
    (initialParams.locationId && initialParams.locationId !== "all") ||
    (initialParams.tagId && initialParams.tagId !== "all");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input
          placeholder="Search by name or breed…"
          defaultValue={initialParams.q || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => updateParam("q", val), 400);
          }}
          className="lg:col-span-1"
        />
        <Select
          value={initialParams.species || "all"}
          onChange={(e) => updateParam("species", e.target.value)}
        >
          <option value="all">All Species</option>
          {(Object.keys(SPECIES_LABELS) as Species[]).map((s) => (
            <option key={s} value={s}>
              {SPECIES_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={initialParams.status || "all"}
          onChange={(e) => updateParam("status", e.target.value)}
        >
          <option value="all">All Statuses</option>
          {(Object.keys(ADOPTION_STATUS_LABELS) as AdoptionStatus[]).map((s) => (
            <option key={s} value={s}>
              {ADOPTION_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          value={initialParams.locationId || "all"}
          onChange={(e) => updateParam("locationId", e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <Select
          value={initialParams.tagId || "all"}
          onChange={(e) => updateParam("tagId", e.target.value)}
        >
          <option value="all">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
