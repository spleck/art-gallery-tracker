"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SharePage() {
  const [shareType, setShareType] = useState<"OWNED" | "INTERESTED" | "BOTH">("BOTH");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateShareLink = async () => {
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
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Share Your Gallery</h1>
      <p className="text-gray-600">
        Generate a shareable link and QR code for your art collection.
      </p>

      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium mb-2">What to share:</label>
        <select
          value={shareType}
          onChange={(e) => setShareType(e.target.value as typeof shareType)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="OWNED">Art I Own Only</option>
          <option value="INTERESTED">Art I'm Interested In Only</option>
          <option value="BOTH">Both Collections</option>
        </select>

        <button
          onClick={generateShareLink}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Generate Share Link
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
