import { prisma } from "@/lib/prisma";
import { AdoptionStatus, Species, Prisma } from "@prisma/client";
import { SPECIES_LABELS, ADOPTION_STATUS_LABELS, ADOPTION_STATUS_COLORS } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/public-nav";
import PetFilters from "@/components/pet-filters";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  species?: string;
  status?: string;
  locationId?: string;
  tagId?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [locations, tags] = await Promise.all([
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const where: Prisma.PetWhereInput = {
    isActive: true,
  };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { breed: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.species && params.species !== "all") {
    where.species = params.species as Species;
  }
  if (params.status && params.status !== "all") {
    where.adoptionStatus = params.status as AdoptionStatus;
  }
  if (params.locationId && params.locationId !== "all") {
    where.locationId = params.locationId;
  }
  if (params.tagId && params.tagId !== "all") {
    where.tags = { some: { tagId: params.tagId } };
  }

  const pets = await prisma.pet.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
      location: { select: { name: true } },
      tags: { include: { tag: true }, take: 4 },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Adoptable Pets</h1>
          <p className="mt-2 text-gray-600">
            Find your perfect companion. All pets are looking for loving forever homes.
          </p>
        </div>

        <PetFilters
          locations={locations}
          tags={tags}
          initialParams={params}
        />

        {pets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🐾</p>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No pets found</h2>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {pets.length} pet{pets.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => {
                const photo = pet.photos[0];
                const statusColor = ADOPTION_STATUS_COLORS[pet.adoptionStatus];
                return (
                  <Link
                    key={pet.id}
                    href={`/pets/${pet.id}`}
                    className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {photo ? (
                        <Image
                          src={photo.url}
                          alt={photo.altText || pet.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-5xl text-gray-300">
                          🐾
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                          {ADOPTION_STATUS_LABELS[pet.adoptionStatus]}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600">
                        {pet.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {SPECIES_LABELS[pet.species]}
                        {pet.breed ? ` · ${pet.breed}` : ""}
                      </p>
                      {pet.ageText && (
                        <p className="text-sm text-gray-500">{pet.ageText}</p>
                      )}
                      {pet.location && (
                        <p className="text-xs text-gray-400 mt-1">
                          📍 {pet.location.name}
                        </p>
                      )}
                      {pet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pet.tags.slice(0, 3).map(({ tag }) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {pet.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                              +{pet.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
