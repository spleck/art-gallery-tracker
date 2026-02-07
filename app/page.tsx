import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Art Gallery Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/art" className="p-6 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
          <h2 className="text-xl font-semibold mb-2">📸 My Art</h2>
          <p className="text-gray-600">View and manage your art collection and interests</p>
        </Link>
        
        <Link href="/scan" className="p-6 bg-green-100 rounded-lg hover:bg-green-200 transition">
          <h2 className="text-xl font-semibold mb-2">📱 Scan QR</h2>
          <p className="text-gray-600">Scan QR codes at galleries to add art to your list</p>
        </Link>
        
        <Link href="/share" className="p-6 bg-purple-100 rounded-lg hover:bg-purple-200 transition">
          <h2 className="text-xl font-semibold mb-2">🔗 Share</h2>
          <p className="text-gray-600">Generate QR codes to share your galleries</p>
        </Link>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-gray-600">Art Owned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-gray-600">Interested</p>
          </div>
        </div>
      </div>
    </div>
  );
}
