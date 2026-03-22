import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PetForm from "@/components/pet-form";

export const metadata = { title: "New Pet – PetTrack Admin" };

export default async function NewPetPage() {
  const locations = await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/pets">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Pet</h1>
      </div>
      <PetForm locations={locations} tags={tags} />
    </div>
  );
}
