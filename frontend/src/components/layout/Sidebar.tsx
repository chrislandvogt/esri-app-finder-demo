import { useAppStore, type ActiveTab } from '../../lib/store/appStore';
import { ChatInterface } from '../chat/ChatInterface';
import { LivingAtlasSearch } from '../atlas/LivingAtlasSearch';
import { AppPreview } from '../preview/AppPreview';

export function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'atlas', label: 'Data', icon: '🗺️' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 w-96 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out z-20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? 'bg-esri-blue-50 text-esri-blue-700 border-b-2 border-esri-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="h-[calc(100%-49px)] overflow-hidden">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'atlas' && <LivingAtlasSearch />}
        {activeTab === 'preview' && <AppPreview />}
      </div>
    </aside>
  );
}
