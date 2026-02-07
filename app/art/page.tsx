import { prisma } from "@/lib/db";
import ArtCard from "@/components/ArtCard";
import AddArtForm from "@/components/AddArtForm";

export const dynamic = "force-dynamic";

export default async function ArtPage() {
  const ownedArt = await prisma.art.findMany({
    where: { status: "OWNED" },
    orderBy: { createdAt: "desc" },
  });

  const interestedArt = await prisma.art.findMany({
    where: { status: "INTERESTED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Art</h1>
      
      <AddArtForm />
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">🖼️ Art I Own ({ownedArt.length})</h2>
        {ownedArt.length === 0 ? (
          <p className="text-gray-500">No art yet. Add some above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedArt.map((art) => (
              <ArtCard key={art.id} art={art} />
            ))}
          </div>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">👀 Interested In ({interestedArt.length})</h2>
        {interestedArt.length === 0 ? (
          <p className="text-gray-500">No art yet. Scan QR codes at galleries to add!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestedArt.map((art) => (
              <ArtCard key={art.id} art={art} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
