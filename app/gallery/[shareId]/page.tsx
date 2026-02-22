import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ArtCard from "@/components/ArtCard";
import { ShareType } from "@/lib/constants";

interface PageProps {
  params: { shareId: string };
}

export const dynamic = "force-dynamic";

export default async function SharedGalleryPage({ params }: PageProps) {
  const { shareId } = params;

  const shareLink = await prisma.shareLink.findUnique({
    where: { slug: shareId },
    include: {
      artItems: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shareLink) {
    notFound();
  }

  // Check if the share link has expired
  if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
    notFound();
  }

  const typeLabel = {
    [ShareType.OWNED]: "Art Collection",
    [ShareType.INTERESTED]: "Art Wishlist",
    [ShareType.BOTH]: "Art Gallery",
  }[shareLink.type];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">🎨 {typeLabel}</h1>
        <p className="text-slate-300 mt-2">
          Shared gallery with {shareLink.artItems.length} piece
          {shareLink.artItems.length !== 1 ? "s" : ""}
        </p>
      </div>

      {shareLink.artItems.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          This gallery is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shareLink.artItems.map((art) => (
            <ArtCard key={art.id} art={art} />
          ))}
        </div>
      )}
    </div>
  );
}
