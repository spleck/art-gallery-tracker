"use client";

import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    
    // Delay to let DOM render
    setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          stopScanning();
          // TODO: Parse QR code and add to interested list
          window.location.href = `/art/add?qr=${encodeURIComponent(decodedText)}`;
        },
        (error) => {
          // console.log(error);
        }
      );
    }, 100);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Scan QR Code</h1>
      <p className="text-gray-600">
        Scan a QR code at a gallery to add art to your interested list.
      </p>

      {!isScanning ? (
        <button
          onClick={startScanning}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          📷 Start Scanning
        </button>
      ) : (
        <button
          onClick={stopScanning}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          ✋ Stop Scanning
        </button>
      )}

      <div id="qr-reader" className="w-full max-w-md"></div>

      {scanResult && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold">Scanned:</p>
          <code className="text-sm">{scanResult}</code>
        </div>
      )}
    </div>
  );
}
