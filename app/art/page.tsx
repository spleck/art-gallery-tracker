"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Art } from "@prisma/client";
import ArtCard from "@/components/ArtCard";
import AddArtForm from "@/components/AddArtForm";

export default function ArtPage() {
  const { data: session, status } = useSession();
  const [ownedArt, setOwnedArt] = useState<Art[]>([]);
  const [interestedArt, setInterestedArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchArt();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchArt = async () => {
    try {
      const response = await fetch("/api/art");
      if (response.ok) {
        const art = await response.json();
        setOwnedArt(art.filter((a: Art) => a.status === "OWNED"));
        setInterestedArt(art.filter((a: Art) => a.status === "INTERESTED"));
      }
    } catch (error) {
      console.error("Error fetching art:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">My Art</h1>
        <p className="text-gray-600 mb-4">Please sign in to view your art collection</p>
        <a href="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign In
        </a>
      </div>
    );
  }

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
