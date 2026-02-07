"use client";

import { useState, useRef } from "react";
import { Art } from "@prisma/client";

interface EditArtFormProps {
  art: Art;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditArtForm({ art, onSave, onCancel }: EditArtFormProps) {
  const [preview, setPreview] = useState<string | null>(art.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch(`/api/art/${art.id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      onSave();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this art?")) {
      return;
    }

    const response = await fetch(`/api/art/${art.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Edit Art</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Photo</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full"
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
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          name="artist"
          defaultValue={art.artist || ""}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location (Gallery/Event)</label>
        <input
          type="text"
          name="location"
          defaultValue={art.location || ""}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={art.description || ""}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" defaultValue={art.status} className="w-full p-2 border rounded">
          <option value="OWNED">I Own This</option>
          <option value="INTERESTED">Interested In</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-auto"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
