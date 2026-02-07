"use client";

import { useState } from "react";
import { Art } from "@prisma/client";
import EditArtForm from "./EditArtForm";

interface ArtCardProps {
  art: Art;
}

export default function ArtCard({ art }: ArtCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    window.location.reload();
  };

  if (isEditing) {
    return (
      <EditArtForm
        art={art}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{art.title}</h3>
            {art.artist && <p className="text-gray-600">by {art.artist}</p>}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
        </div>
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
