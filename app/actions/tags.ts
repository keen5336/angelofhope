"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function createTagAction(formData: FormData) {
  await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Tag name is required." };

  const existing = await prisma.tag.findUnique({ where: { name } });
  if (existing) return { error: "A tag with that name already exists." };

  await prisma.tag.create({
    data: {
      name,
      category: (formData.get("category") as string)?.trim() || null,
      color: (formData.get("color") as string)?.trim() || null,
    },
  });

  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function updateTagAction(tagId: string, formData: FormData) {
  await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Tag name is required." };

  const existing = await prisma.tag.findFirst({
    where: { name, NOT: { id: tagId } },
  });
  if (existing) return { error: "A tag with that name already exists." };

  await prisma.tag.update({
    where: { id: tagId },
    data: {
      name,
      category: (formData.get("category") as string)?.trim() || null,
      color: (formData.get("color") as string)?.trim() || null,
    },
  });

  revalidatePath("/admin/tags");
  return { success: true };
}
