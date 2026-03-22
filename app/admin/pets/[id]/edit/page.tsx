import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PetForm from "@/components/pet-form";

export const dynamic = "force-dynamic";

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [pet, locations, tags] = await Promise.all([
    prisma.pet.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!pet) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/pets">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit: {pet.name}</h1>
      </div>
      <PetForm pet={pet} locations={locations} tags={tags} />
    </div>
  );
}
