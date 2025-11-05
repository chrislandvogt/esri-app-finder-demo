import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ActiveTab = 'chat' | 'atlas' | 'preview';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  activeTab: ActiveTab;
  
  // Session
  sessionId: string;
  
  // App Selection
  selectedApp: string | null;
  selectedDatasets: string[];
  
  // Map Configuration
  currentWebMapId: string | null;
  mapExtent: any | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedApp: (appId: string | null) => void;
  addDataset: (datasetId: string) => void;
  removeDataset: (datasetId: string) => void;
  clearDatasets: () => void;
  setCurrentWebMapId: (mapId: string | null) => void;
  setMapExtent: (extent: any) => void;
  reset: () => void;
}

// Generate a simple session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const initialState = {
  sidebarOpen: true,
  activeTab: 'chat' as ActiveTab,
  sessionId: generateSessionId(),
  selectedApp: null,
  selectedDatasets: [],
  currentWebMapId: null,
  mapExtent: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setSelectedApp: (appId) => set({ selectedApp: appId }),
      
      addDataset: (datasetId) =>
        set((state) => ({
          selectedDatasets: [...state.selectedDatasets, datasetId],
        })),
      
      removeDataset: (datasetId) =>
        set((state) => ({
          selectedDatasets: state.selectedDatasets.filter((id) => id !== datasetId),
        })),
      
      clearDatasets: () => set({ selectedDatasets: [] }),
      
      setCurrentWebMapId: (mapId) => set({ currentWebMapId: mapId }),
      
      setMapExtent: (extent) => set({ mapExtent: extent }),
      
      reset: () => set({ ...initialState, sessionId: generateSessionId() }),
    }),
    { name: 'AppStore' }
  )
);
