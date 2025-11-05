import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { mockDatasets } from '../../data/mockData';

export function LivingAtlasSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockDatasets);
  const addDataset = useAppStore((state) => state.addDataset);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setResults(mockDatasets);
      return;
    }
    const filtered = mockDatasets.filter(dataset =>
      dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setResults(filtered);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Living Atlas Datasets</h2>
        <form onSubmit={handleSearch}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search datasets..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-esri-blue-600 focus:border-transparent"
          />
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {results.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No datasets found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          results.map((dataset) => (
            <div
              key={dataset.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => addDataset(dataset)}
            >
              <div className="flex gap-3">
                <img
                  src={dataset.thumbnailUrl}
                  alt={dataset.title}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{dataset.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {dataset.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-esri-blue-100 text-esri-blue-700 px-2 py-1 rounded">
                      {dataset.type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {dataset.owner}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
