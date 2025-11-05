export function MapContainer() {
  return (
    <div className="relative w-full h-full bg-gray-200">
      {/* Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
          <p className="text-gray-600 max-w-md">
            Your web map will appear here. Start by chatting with the assistant to get app
            recommendations and select datasets from Living Atlas.
          </p>
        </div>
      </div>

      {/* Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col">
          <button
            className="p-3 hover:bg-gray-100 border-b transition-colors"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            className="p-3 hover:bg-gray-100 border-b transition-colors"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            className="p-3 hover:bg-gray-100 transition-colors"
            aria-label="Reset extent"
            title="Reset extent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Basemap Selector (Top Left) */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
        <select className="px-3 py-2 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-esri-blue-600 rounded">
          <option>Streets</option>
          <option>Topographic</option>
          <option>Satellite</option>
          <option>Dark Gray</option>
          <option>Light Gray</option>
        </select>
      </div>

      {/* Layer List (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Layers</h4>
        <p className="text-xs text-gray-500">No layers added yet</p>
      </div>
    </div>
  );
}
