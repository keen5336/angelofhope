"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  SPECIES_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  ADOPTION_STATUS_LABELS,
} from "@/lib/constants";
import { Species, Sex, Size, AdoptionStatus } from "@prisma/client";
import { createPetAction, updatePetAction, updatePetTagsAction, updatePetPhotosAction } from "@/app/actions/pets";
import type { Pet, Location, Tag, PetTag, PetPhoto } from "@prisma/client";
import { isValidUrl } from "@/lib/utils";

interface PetWithRelations extends Pet {
  photos: PetPhoto[];
  tags: (PetTag & { tag: Tag })[];
}

interface Props {
  pet?: PetWithRelations;
  locations: Location[];
  tags: Tag[];
}

export default function PetForm({ pet, locations, tags }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tags state
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(pet?.tags.map((pt) => pt.tagId) || [])
  );

  // Photos state
  const [photos, setPhotos] = useState<
    { url: string; altText: string; sortOrder: number }[]
  >(
    pet?.photos.map((p) => ({
      url: p.url,
      altText: p.altText || "",
      sortOrder: p.sortOrder,
    })) || []
  );

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const addPhoto = () => {
    setPhotos((prev) => [
      ...prev,
      { url: "", altText: "", sortOrder: prev.length },
    ]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhoto = (
    index: number,
    field: "url" | "altText",
    value: string
  ) => {
    setPhotos((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const movePhoto = (index: number, direction: "up" | "down") => {
    setPhotos((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((p, i) => ({ ...p, sortOrder: i }));
    });
  };

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate photos
    const validPhotos = photos.filter((p) => p.url.trim());
    for (const p of validPhotos) {
      if (!isValidUrl(p.url)) {
        setError(`Invalid URL: ${p.url}`);
        setLoading(false);
        return;
      }
    }

    let result: { error?: string; success?: boolean; petId?: string } | undefined;

    if (pet) {
      result = await updatePetAction(pet.id, formData);
      if (!result?.error) {
        await updatePetTagsAction(pet.id, Array.from(selectedTagIds));
        await updatePetPhotosAction(
          pet.id,
          validPhotos.map((p, i) => ({ ...p, sortOrder: i }))
        );
        setSuccess("Pet updated successfully.");
      }
    } else {
      result = await createPetAction(formData);
      // If createPetAction redirects, this won't be reached
      // Tags and photos will be set after redirect if petId returned
    }

    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-base">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={pet?.name || ""}
              required
              placeholder="e.g. Buddy"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="species">
              Species <span className="text-red-500">*</span>
            </Label>
            <Select id="species" name="species" defaultValue={pet?.species || ""} required>
              <option value="">Select species…</option>
              {(Object.keys(SPECIES_LABELS) as Species[]).map((s) => (
                <option key={s} value={s}>
                  {SPECIES_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              name="breed"
              defaultValue={pet?.breed || ""}
              placeholder="e.g. Labrador Mix"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ageText">Age</Label>
            <Input
              id="ageText"
              name="ageText"
              defaultValue={pet?.ageText || ""}
              placeholder="e.g. 2 years, 6 months"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sex">Sex</Label>
            <Select id="sex" name="sex" defaultValue={pet?.sex || "UNKNOWN"}>
              {(Object.keys(SEX_LABELS) as Sex[]).map((s) => (
                <option key={s} value={s}>
                  {SEX_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="size">Size</Label>
            <Select id="size" name="size" defaultValue={pet?.size || "UNKNOWN"}>
              {(Object.keys(SIZE_LABELS) as Size[]).map((s) => (
                <option key={s} value={s}>
                  {SIZE_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              defaultValue={pet?.color || ""}
              placeholder="e.g. Brown and white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="adoptionStatus">Adoption Status</Label>
            <Select
              id="adoptionStatus"
              name="adoptionStatus"
              defaultValue={pet?.adoptionStatus || "AVAILABLE"}
            >
              {(Object.keys(ADOPTION_STATUS_LABELS) as AdoptionStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {ADOPTION_STATUS_LABELS[s]}
                  </option>
                )
              )}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="intakeDate">Intake Date</Label>
            <Input
              id="intakeDate"
              name="intakeDate"
              type="date"
              defaultValue={
                pet?.intakeDate
                  ? new Date(pet.intakeDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="locationId">Location</Label>
            <Select
              id="locationId"
              name="locationId"
              defaultValue={pet?.locationId || ""}
            >
              <option value="">No location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={pet?.description || ""}
            rows={4}
            placeholder="Tell potential adopters about this pet's personality, history, and needs…"
          />
        </div>

        {pet && (
          <div className="space-y-1.5">
            <Label htmlFor="isActive">Status</Label>
            <Select id="isActive" name="isActive" defaultValue={pet.isActive ? "true" : "false"}>
              <option value="true">Active (visible)</option>
              <option value="false">Archived (hidden)</option>
            </Select>
          </div>
        )}
        {!pet && <input type="hidden" name="isActive" value="true" />}
      </div>

      {/* Tags */}
      {pet && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-base">Tags</h2>
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500">
              No tags yet.{" "}
              <a href="/admin/tags/new" className="text-blue-600 hover:underline">
                Create tags
              </a>{" "}
              first.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTagIds.has(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm border transition-colors ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {pet && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-base">Photos</h2>
            <Button type="button" variant="outline" size="sm" onClick={addPhoto}>
              + Add Photo URL
            </Button>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-gray-500">No photos yet.</p>
          ) : (
            <div className="space-y-3">
              {photos.map((photo, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label className="text-xs">Photo URL</Label>
                      <Input
                        value={photo.url}
                        onChange={(e) => updatePhoto(i, "url", e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Alt text (optional)</Label>
                      <Input
                        value={photo.altText}
                        onChange={(e) => updatePhoto(i, "altText", e.target.value)}
                        placeholder="Description of the photo"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => movePhoto(i, "up")}
                      disabled={i === 0}
                      className="h-7 w-7"
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => movePhoto(i, "down")}
                      disabled={i === photos.length - 1}
                      className="h-7 w-7"
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhoto(i)}
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : pet ? "Save Changes" : "Create Pet"}
        </Button>
        <Button asChild variant="outline">
          <a href="/admin/pets">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
