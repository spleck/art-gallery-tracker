"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ShareType } from "@/lib/constants";

export default function SharePage() {
  const [shareType, setShareType] = useState<ShareType>(ShareType.BOTH);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateShareLink = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const slug = uuidv4().slice(0, 8);

      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: shareType, slug }),
      });

      if (response.ok) {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/gallery/${slug}`;
        setShareUrl(url);

        // Generate QR code
        const qrResponse = await fetch(`/api/qr?text=${encodeURIComponent(url)}`);
        const qrData = await qrResponse.json();
        setQrCode(qrData.qrCode);
      } else if (response.status === 401) {
        setError("Please sign in to share your gallery");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create share link");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Error generating share link:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Share Your Gallery</h1>
      <p className="text-gray-600">
        Generate a shareable link and QR code for your art collection.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium mb-2">What to share:</label>
        <select
          value={shareType}
          onChange={(e) => setShareType(e.target.value as ShareType)}
          className="w-full p-2 border rounded mb-4"
          disabled={isGenerating}
        >
          <option value={ShareType.OWNED}>Art I Own Only</option>
          <option value={ShareType.INTERESTED}>Art I'm Interested In Only</option>
          <option value={ShareType.BOTH}>Both Collections</option>
        </select>

        <button
          onClick={generateShareLink}
          disabled={isGenerating}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Generating..." : "Generate Share Link"}
        </button>
      </div>

      {shareUrl && (
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <p className="font-semibold mb-2">Your share link:</p>
          <a href={shareUrl} className="text-blue-600 hover:underline break-all">
            {shareUrl}
          </a>
          
          {qrCode && (
            <div className="mt-4">
              <img src={qrCode} alt="Share QR Code" className="mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Scan to view gallery</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
