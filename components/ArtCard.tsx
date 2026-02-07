import { Art } from "@prisma/client";
import Image from "next/image";

interface ArtCardProps {
  art: Art;
}

export default function ArtCard({ art }: ArtCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-200 relative">
        {art.imageUrl ? (
          <img
            src={art.imageUrl}
            alt={art.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{art.title}</h3>
        {art.artist && <p className="text-gray-600">by {art.artist}</p>}
        {art.location && (
          <p className="text-sm text-gray-500 mt-1">📍 {art.location}</p>
        )}
        {art.description && (
          <p className="text-sm text-gray-600 mt-2">{art.description}</p>
        )}
      </div>
    </div>
  );
}
