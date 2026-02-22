"use client";

import { useState, useRef } from "react";
import { ArtStatus } from "@/lib/constants";

interface AddArtFormProps {
  onSave: () => void;
}

export default function AddArtForm({ onSave }: AddArtFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

      const response = await fetch("/api/art", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsOpen(false);
        setPreview(null);
        formRef.current?.reset();
        onSave();
      } else if (response.status === 401) {
        setError("Please sign in to add art");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add art. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPreview(null);
    setError(null);
    formRef.current?.reset();
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
    <form ref={formRef} onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Add New Art</h3>

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
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Artist</label>
        <input
          type="text"
          name="artist"
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location (Gallery/Event)</label>
        <input
          type="text"
          name="location"
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" className="w-full p-2 border rounded" disabled={isSubmitting}>
          <option value={ArtStatus.OWNED}>I Own This</option>
          <option value={ArtStatus.INTERESTED}>Interested In</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
