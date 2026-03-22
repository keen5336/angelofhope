"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Species, Sex, Size, AdoptionStatus } from "@prisma/client";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function createPetAction(formData: FormData) {
  const session = await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Pet name is required." };

  const species = formData.get("species") as Species;
  if (!species) return { error: "Species is required." };

  const locationId = formData.get("locationId") as string | null;

  const pet = await prisma.pet.create({
    data: {
      name,
      species,
      breed: (formData.get("breed") as string)?.trim() || null,
      sex: (formData.get("sex") as Sex) || "UNKNOWN",
      ageText: (formData.get("ageText") as string)?.trim() || null,
      size: (formData.get("size") as Size) || "UNKNOWN",
      color: (formData.get("color") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      adoptionStatus:
        (formData.get("adoptionStatus") as AdoptionStatus) || "AVAILABLE",
      intakeDate: parseDate(formData.get("intakeDate") as string),
      isActive: formData.get("isActive") !== "false",
      locationId: locationId || null,
      createdById: session.userId,
      updatedById: session.userId,
    },
  });

  // Create initial location history if location set
  if (locationId) {
    await prisma.petLocationHistory.create({
      data: { petId: pet.id, locationId, startDate: new Date() },
    });
  }

  revalidatePath("/admin/pets");
  redirect(`/admin/pets/${pet.id}/edit`);
}

export async function updatePetAction(petId: string, formData: FormData) {
  const session = await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Pet name is required." };

  const species = formData.get("species") as Species;
  if (!species) return { error: "Species is required." };

  const newLocationId = (formData.get("locationId") as string) || null;

  // Get current pet to check location change
  const currentPet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { locationId: true },
  });

  const updatedPet = await prisma.pet.update({
    where: { id: petId },
    data: {
      name,
      species,
      breed: (formData.get("breed") as string)?.trim() || null,
      sex: (formData.get("sex") as Sex) || "UNKNOWN",
      ageText: (formData.get("ageText") as string)?.trim() || null,
      size: (formData.get("size") as Size) || "UNKNOWN",
      color: (formData.get("color") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      adoptionStatus:
        (formData.get("adoptionStatus") as AdoptionStatus) || "AVAILABLE",
      intakeDate: parseDate(formData.get("intakeDate") as string),
      isActive: formData.get("isActive") === "true",
      locationId: newLocationId,
      updatedById: session.userId,
    },
  });

  // Handle location change history
  if (
    currentPet &&
    newLocationId !== currentPet.locationId &&
    newLocationId
  ) {
    // Close previous open history entry
    await prisma.petLocationHistory.updateMany({
      where: { petId, endDate: null },
      data: { endDate: new Date() },
    });
    // Create new history entry
    await prisma.petLocationHistory.create({
      data: { petId, locationId: newLocationId, startDate: new Date() },
    });
  }

  revalidatePath("/admin/pets");
  revalidatePath(`/admin/pets/${petId}/edit`);
  revalidatePath(`/pets/${petId}`);

  return { success: true, petId: updatedPet.id };
}

export async function updatePetTagsAction(
  petId: string,
  tagIds: string[]
) {
  await requireSession();

  await prisma.petTag.deleteMany({ where: { petId } });

  if (tagIds.length > 0) {
    await prisma.petTag.createMany({
      data: tagIds.map((tagId) => ({ petId, tagId })),
    });
  }

  revalidatePath(`/admin/pets/${petId}/edit`);
  revalidatePath(`/pets/${petId}`);
  return { success: true };
}

export async function updatePetPhotosAction(
  petId: string,
  photos: { url: string; altText: string; sortOrder: number }[]
) {
  await requireSession();

  await prisma.petPhoto.deleteMany({ where: { petId } });

  if (photos.length > 0) {
    await prisma.petPhoto.createMany({
      data: photos.map((p) => ({ petId, ...p })),
    });
  }

  revalidatePath(`/admin/pets/${petId}/edit`);
  revalidatePath(`/pets/${petId}`);
  return { success: true };
}
