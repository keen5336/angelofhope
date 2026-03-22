"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTagAction, updateTagAction } from "@/app/actions/tags";
import type { Tag } from "@prisma/client";

interface Props {
  tag?: Tag;
}

export default function TagForm({ tag }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const result = tag
      ? await updateTagAction(tag.id, formData)
      : await createTagAction(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result && "success" in result) {
      setSuccess("Tag saved successfully.");
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 text-sm mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold text-gray-900 text-base">Tag Details</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={tag?.name || ""}
            required
            placeholder="e.g. Good with kids"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={tag?.category || ""}
            placeholder="e.g. Temperament, Medical"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="color">Color (hex)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="color"
              name="color"
              defaultValue={tag?.color || ""}
              placeholder="#3b82f6"
              className="font-mono"
            />
            {tag?.color && (
              <div
                className="w-8 h-8 rounded border flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
            )}
          </div>
          <p className="text-xs text-gray-500">Optional. Used for tag badge color.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : tag ? "Save Changes" : "Create Tag"}
        </Button>
        <Button asChild variant="outline">
          <a href="/admin/tags">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
