"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Art } from "@prisma/client";
import ArtCard from "@/components/ArtCard";

interface FriendInfo {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function FriendGalleryPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession();
  const [friend, setFriend] = useState<FriendInfo | null>(null);
  const [art, setArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFriendGallery();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, params.userId]);

  const fetchFriendGallery = async () => {
    try {
      const response = await fetch(`/api/friends/gallery/${params.userId}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          setError("You must be friends to view this gallery");
        } else {
          setError("Failed to load gallery");
        }
        return;
      }

      const data = await response.json();
      setFriend(data.friend);
      setArt(data.art);
    } catch (error) {
      console.error("Error fetching friend's gallery:", error);
      setError("Failed to load gallery");
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
        <h1 className="text-2xl font-bold mb-4">Friend's Gallery</h1>
        <p className="text-gray-600 mb-4">Please sign in to view galleries</p>
        <a href="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign In
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Unable to View Gallery</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <a href="/friends" className="text-blue-600 hover:underline">
          Back to Friends
        </a>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <a href="/friends" className="text-blue-600 hover:underline">
          Back to Friends
        </a>
      </div>
    );
  }

  const ownedArt = art.filter((a) => a.status === "OWNED");
  const interestedArt = art.filter((a) => a.status === "INTERESTED");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {friend.image && (
          <img src={friend.image} alt={friend.name || ""} className="w-16 h-16 rounded-full" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{friend.name || friend.email}'s Gallery</h1>
          <p className="text-gray-600">{friend.email}</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🖼️ Art They Own ({ownedArt.length})</h2>
        {ownedArt.length === 0 ? (
          <p className="text-gray-500">No art in this collection</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedArt.map((a) => (
              <ArtCard key={a.id} art={a} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">👀 They're Interested In ({interestedArt.length})</h2>
        {interestedArt.length === 0 ? (
          <p className="text-gray-500">No art in this collection</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestedArt.map((a) => (
              <ArtCard key={a.id} art={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}