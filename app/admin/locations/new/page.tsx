import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocationForm from "@/components/location-form";

export const metadata = { title: "New Location – PetTrack Admin" };

export default function NewLocationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/locations">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Location</h1>
      </div>
      <LocationForm />
    </div>
  );
}
