"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LOCATION_TYPE_LABELS } from "@/lib/constants";
import { LocationType } from "@prisma/client";
import {
  createLocationAction,
  updateLocationAction,
} from "@/app/actions/locations";
import type { Location } from "@prisma/client";

interface Props {
  location?: Location;
}

export default function LocationForm({ location }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const result = location
      ? await updateLocationAction(location.id, formData)
      : await createLocationAction(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result && "success" in result) {
      setSuccess("Location saved successfully.");
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-base">Location Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={location?.name || ""}
              required
              placeholder="e.g. Happy Paws Shelter"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              id="type"
              name="type"
              defaultValue={location?.type || ""}
              required
            >
              <option value="">Select type…</option>
              {(Object.keys(LOCATION_TYPE_LABELS) as LocationType[]).map(
                (t) => (
                  <option key={t} value={t}>
                    {LOCATION_TYPE_LABELS[t]}
                  </option>
                )
              )}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              name="address1"
              defaultValue={location?.address1 || ""}
              placeholder="123 Main St"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address2">Address Line 2</Label>
            <Input
              id="address2"
              name="address2"
              defaultValue={location?.address2 || ""}
              placeholder="Suite 200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={location?.city || ""}
              placeholder="Portland"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              defaultValue={location?.state || ""}
              placeholder="OR"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              defaultValue={location?.postalCode || ""}
              placeholder="97201"
            />
          </div>
          {location && (
            <div className="space-y-1.5">
              <Label htmlFor="isActive">Status</Label>
              <Select
                id="isActive"
                name="isActive"
                defaultValue={location.isActive ? "true" : "false"}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={location?.notes || ""}
            rows={3}
            placeholder="Any additional details about this location…"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : location ? "Save Changes" : "Create Location"}
        </Button>
        <Button asChild variant="outline">
          <a href="/admin/locations">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
