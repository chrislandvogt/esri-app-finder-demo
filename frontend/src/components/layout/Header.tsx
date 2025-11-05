import { useAppStore } from '../../lib/store/appStore';

export function Header() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <header className="bg-esri-blue-600 text-white h-16 flex items-center px-4 shadow-md z-10">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-esri-blue-700 rounded transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="ml-4 text-xl font-semibold">
        ESRI App Finder & Builder Assistant
      </h1>
      <div className="ml-auto text-sm text-esri-blue-100">
        v1.0.0
      </div>
    </header>
  );
}
