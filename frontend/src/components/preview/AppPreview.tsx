import { useAppStore } from '../../store/appStore';

export function AppPreview() {
  const selectedApp = useAppStore((state) => state.selectedApp);

  if (!selectedApp) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No App Selected</h3>
          <p className="text-sm text-gray-600 mb-4">
            Chat with the assistant to get app recommendations, then preview them here.
          </p>
          <button
            onClick={() => useAppStore.getState().setActiveTab('chat')}
            className="px-4 py-2 bg-esri-blue-600 text-white rounded-lg hover:bg-esri-blue-700 transition-colors"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">App Preview</h2>
        <p className="text-sm text-gray-600">
          Selected App: <span className="font-medium">{selectedApp}</span>
        </p>
        <div className="mt-4 p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">Preview will appear here</p>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-esri-blue-600 text-white rounded-lg hover:bg-esri-blue-700 transition-colors font-medium">
          Launch Application
        </button>
      </div>
    </div>
  );
}
