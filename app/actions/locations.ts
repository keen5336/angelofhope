"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { LocationType } from "@prisma/client";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function createLocationAction(formData: FormData) {
  await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Location name is required." };

  const type = formData.get("type") as LocationType;
  if (!type) return { error: "Location type is required." };

  await prisma.location.create({
    data: {
      name,
      type,
      address1: (formData.get("address1") as string)?.trim() || null,
      address2: (formData.get("address2") as string)?.trim() || null,
      city: (formData.get("city") as string)?.trim() || null,
      state: (formData.get("state") as string)?.trim() || null,
      postalCode: (formData.get("postalCode") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
      isActive: true,
    },
  });

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function updateLocationAction(
  locationId: string,
  formData: FormData
) {
  await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Location name is required." };

  const type = formData.get("type") as LocationType;
  if (!type) return { error: "Location type is required." };

  await prisma.location.update({
    where: { id: locationId },
    data: {
      name,
      type,
      address1: (formData.get("address1") as string)?.trim() || null,
      address2: (formData.get("address2") as string)?.trim() || null,
      city: (formData.get("city") as string)?.trim() || null,
      state: (formData.get("state") as string)?.trim() || null,
      postalCode: (formData.get("postalCode") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/admin/locations");
  return { success: true };
}
