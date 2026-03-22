import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TagForm from "@/components/tag-form";

export const dynamic = "force-dynamic";

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/tags">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit: {tag.name}</h1>
      </div>
      <TagForm tag={tag} />
    </div>
  );
}
