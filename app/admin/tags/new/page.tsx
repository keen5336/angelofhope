import Link from "next/link";
import { Button } from "@/components/ui/button";
import TagForm from "@/components/tag-form";

export const metadata = { title: "New Tag – PetTrack Admin" };

export default function NewTagPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/tags">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Tag</h1>
      </div>
      <TagForm />
    </div>
  );
}
