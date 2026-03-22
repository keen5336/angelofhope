import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PublicNav from "@/components/public-nav";
import {
  SPECIES_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  ADOPTION_STATUS_LABELS,
  ADOPTION_STATUS_COLORS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pet = await prisma.pet.findUnique({
    where: { id, isActive: true },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      location: true,
      tags: { include: { tag: true } },
    },
  });

  if (!pet) notFound();

  const statusColor = ADOPTION_STATUS_COLORS[pet.adoptionStatus];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to all pets
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Photo Section */}
            <div className="md:w-1/2 lg:w-2/5">
              {pet.photos.length > 0 ? (
                <div className="space-y-2 p-4">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={pet.photos[0].url}
                      alt={pet.photos[0].altText || pet.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {pet.photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-1">
                      {pet.photos.slice(1).map((photo) => (
                        <div
                          key={photo.id}
                          className="relative aspect-square rounded overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={photo.url}
                            alt={photo.altText || pet.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-gray-100 text-8xl text-gray-300 m-4 rounded-md">
                  🐾
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 lg:w-3/5 p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColor}`}
                >
                  {ADOPTION_STATUS_LABELS[pet.adoptionStatus]}
                </span>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                {SPECIES_LABELS[pet.species]}
                {pet.breed ? ` · ${pet.breed}` : ""}
              </p>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {pet.ageText && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</p>
                    <p className="text-sm text-gray-900 mt-0.5">{pet.ageText}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sex</p>
                  <p className="text-sm text-gray-900 mt-0.5">{SEX_LABELS[pet.sex]}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</p>
                  <p className="text-sm text-gray-900 mt-0.5">{SIZE_LABELS[pet.size]}</p>
                </div>
                {pet.color && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</p>
                    <p className="text-sm text-gray-900 mt-0.5">{pet.color}</p>
                  </div>
                )}
                {pet.intakeDate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Intake Date</p>
                    <p className="text-sm text-gray-900 mt-0.5">{formatDate(pet.intakeDate)}</p>
                  </div>
                )}
                {pet.location && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-sm text-gray-900 mt-0.5">📍 {pet.location.name}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {pet.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {pet.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-sm text-blue-700"
                        style={tag.color ? { backgroundColor: `${tag.color}20`, color: tag.color, borderColor: `${tag.color}40` } : {}}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {pet.description && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">About {pet.name}</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {pet.description}
                  </p>
                </div>
              )}

              {pet.adoptionStatus === "AVAILABLE" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm font-medium text-green-800">
                    {pet.name} is available for adoption!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Contact us to learn more about adopting {pet.name}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
