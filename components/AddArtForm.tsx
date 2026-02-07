"use client";

import { useState, useRef } from "react";

export default function AddArtForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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
    
    const response = await fetch("/api/art", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsOpen(false);
      setPreview(null);
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Art
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Add New Art</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Photo</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full"
          required
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
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          name="artist"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location (Gallery/Event)</label>
        <input
          type="text"
          name="location"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" className="w-full p-2 border rounded">
          <option value="OWNED">I Own This</option>
          <option value="INTERESTED">Interested In</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
