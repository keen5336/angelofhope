import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin Dashboard – PetTrack" };

export default async function AdminDashboard() {
  const [activePets, availablePets, locationCount, tagCount] =
    await Promise.all([
      prisma.pet.count({ where: { isActive: true } }),
      prisma.pet.count({
        where: { isActive: true, adoptionStatus: "AVAILABLE" },
      }),
      prisma.location.count({ where: { isActive: true } }),
      prisma.tag.count(),
    ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to PetTrack admin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{activePets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available for Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{availablePets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{locationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{tagCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Pets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">
              Add, edit, and update adoption status for pets.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/pets">View All</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/pets/new">Add Pet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">
              Manage shelters, pet stores, and foster homes.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/locations">View All</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/locations/new">Add Location</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">
              Organize pets with descriptive tags.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/tags">View All</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/tags/new">Add Tag</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
