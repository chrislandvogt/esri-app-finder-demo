import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapContainer } from '../map/MapContainer';
import { useAppStore } from '../../lib/store/appStore';

export function Layout() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-96' : 'ml-0'}`}>
          <MapContainer />
        </main>
      </div>
    </div>
  );
}
