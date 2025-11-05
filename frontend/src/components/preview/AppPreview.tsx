import { useAppStore } from '../../store/appStore';
import { mockApps } from '../../data/mockData';

export function AppPreview() {
  const selectedApp = useAppStore((state) => state.selectedApp) || mockApps[0];
  const selectedDatasets = useAppStore((state) => state.selectedDatasets);

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex gap-4 mb-4">
          <img
            src={selectedApp.thumbnailUrl}
            alt={selectedApp.name}
            className="w-24 h-24 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/96?text=App';
            }}
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{selectedApp.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedApp.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-esri-blue-100 text-esri-blue-700 px-2 py-1 rounded">
                {selectedApp.complexity}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {selectedApp.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 text-sm mb-2">Key Features</h4>
          <ul className="space-y-1">
            {selectedApp.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="text-esri-blue-600 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 text-sm mb-2">Use Cases</h4>
          <ul className="space-y-1">
            {selectedApp.useCases.map((useCase, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>
        
        <button
          className="w-full px-4 py-2 bg-esri-blue-600 text-white rounded-lg hover:bg-esri-blue-700 transition-colors font-medium"
          onClick={() => window.open(selectedApp.configUrl, '_blank')}
        >
          Open App Builder
        </button>
      </div>

      {selectedDatasets.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Selected Datasets ({selectedDatasets.length})
          </h3>
          <div className="space-y-3">
            {selectedDatasets.map((dataset) => (
              <div key={dataset.id} className="border-l-4 border-esri-blue-400 pl-3 py-2">
                <h4 className="font-medium text-gray-900 text-sm">{dataset.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{dataset.type} • {dataset.owner}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
