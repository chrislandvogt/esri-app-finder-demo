import { useState } from 'react';

export function LivingAtlasSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Living Atlas Datasets</h2>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search datasets..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esri-blue-600 focus:border-transparent"
        />
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchQuery ? (
          <div className="text-center text-gray-500 mt-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>Search for Living Atlas datasets</p>
            <p className="text-sm mt-1">Try: "demographics", "boundaries", or "environment"</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>Enter a search term to find datasets</p>
            <p className="text-sm mt-1 text-gray-400">Browse from thousands of curated layers</p>
          </div>
        )}
      </div>
    </div>
  );
}
