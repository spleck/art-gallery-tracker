"use client";

import { useState, useRef } from "react";
import { Art } from "@prisma/client";
import { ArtStatus } from "@/lib/constants";

interface EditArtFormProps {
  art: Art;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditArtForm({ art, onSave, onCancel }: EditArtFormProps) {
  const [preview, setPreview] = useState<string | null>(art.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch(`/api/art/${art.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        onSave();
      } else if (response.status === 401) {
        setError("Please sign in to edit art");
      } else if (response.status === 404) {
        setError("Art not found");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update art. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error updating art:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this art?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/art/${art.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onSave();
      } else if (response.status === 401) {
        setError("Please sign in to delete art");
      } else if (response.status === 404) {
        setError("Art not found");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete art. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error deleting art:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Edit Art</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Photo</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full"
          disabled={isSubmitting || isDeleting}
        />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 max-h-48 rounded" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          name="title"
          defaultValue={art.title}
          className="w-full p-2 border rounded"
          required
          disabled={isSubmitting || isDeleting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          name="artist"
          defaultValue={art.artist || ""}
          className="w-full p-2 border rounded"
          disabled={isSubmitting || isDeleting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location (Gallery/Event)</label>
        <input
          type="text"
          name="location"
          defaultValue={art.location || ""}
          className="w-full p-2 border rounded"
          disabled={isSubmitting || isDeleting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={art.description || ""}
          className="w-full p-2 border rounded"
          disabled={isSubmitting || isDeleting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          defaultValue={art.status}
          className="w-full p-2 border rounded"
          disabled={isSubmitting || isDeleting}
        >
          <option value={ArtStatus.OWNED}>I Own This</option>
          <option value={ArtStatus.INTERESTED}>Interested In</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isDeleting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isDeleting}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting || isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </form>
  );
}
