import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  SPECIES_LABELS,
  ADOPTION_STATUS_LABELS,
  ADOPTION_STATUS_COLORS,
} from "@/lib/constants";
import { AdoptionStatus, Species, Prisma } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Pets – PetTrack Admin" };
export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  status?: string;
  species?: string;
}

export default async function AdminPetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.PetWhereInput = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { breed: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.status && params.status !== "all") {
    where.adoptionStatus = params.status as AdoptionStatus;
  }
  if (params.species && params.species !== "all") {
    where.species = params.species as Species;
  }

  const pets = await prisma.pet.findMany({
    where,
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    include: {
      location: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pets</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{pets.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/pets/new">+ Add Pet</Link>
        </Button>
      </div>

      {/* Filters */}
      <form className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
        <Input
          name="q"
          placeholder="Search by name or breed…"
          defaultValue={params.q || ""}
          className="w-48"
        />
        <Select name="status" defaultValue={params.status || "all"}>
          <option value="all">All Statuses</option>
          {(Object.keys(ADOPTION_STATUS_LABELS) as AdoptionStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {ADOPTION_STATUS_LABELS[s]}
              </option>
            )
          )}
        </Select>
        <Select name="species" defaultValue={params.species || "all"}>
          <option value="all">All Species</option>
          {(Object.keys(SPECIES_LABELS) as Species[]).map((s) => (
            <option key={s} value={s}>
              {SPECIES_LABELS[s]}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
        {(params.q || params.status || params.species) && (
          <Button asChild variant="ghost">
            <Link href="/admin/pets">Clear</Link>
          </Button>
        )}
      </form>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No pets found.
                </TableCell>
              </TableRow>
            ) : (
              pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.name}</TableCell>
                  <TableCell>{SPECIES_LABELS[pet.species]}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ADOPTION_STATUS_COLORS[pet.adoptionStatus]}`}
                    >
                      {ADOPTION_STATUS_LABELS[pet.adoptionStatus]}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {pet.location?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${pet.isActive ? "text-green-600" : "text-gray-400"}`}
                    >
                      {pet.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(pet.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/pets/${pet.id}/edit`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
