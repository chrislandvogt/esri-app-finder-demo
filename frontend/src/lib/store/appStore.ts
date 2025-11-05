import { create } from 'zustand';
import type { ESRIApp, LivingAtlasDataset } from '../types';

export type ActiveTab = 'chat' | 'atlas' | 'preview';

export interface AppState {
  // UI State
  sidebarOpen: boolean;
  activeTab: ActiveTab;
  
  // Session
  sessionId: string;
  
  // App Selection
  selectedApp: ESRIApp | null;
  selectedDatasets: LivingAtlasDataset[];
  
  // Map Configuration
  currentWebMapId: string | null;
  mapExtent: any | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedApp: (app: ESRIApp | null) => void;
  addDataset: (dataset: LivingAtlasDataset) => void;
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

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSelectedApp: (app) => set({ selectedApp: app }),
  
  addDataset: (dataset) =>
    set((state) => ({
      selectedDatasets: state.selectedDatasets.find(d => d.id === dataset.id) 
        ? state.selectedDatasets 
        : [...state.selectedDatasets, dataset]
    })),
  
  removeDataset: (datasetId) =>
    set((state) => ({
      selectedDatasets: state.selectedDatasets.filter((d) => d.id !== datasetId),
    })),
  
  clearDatasets: () => set({ selectedDatasets: [] }),
  
  setCurrentWebMapId: (mapId) => set({ currentWebMapId: mapId }),
  
  setMapExtent: (extent) => set({ mapExtent: extent }),
  
  reset: () => set({ ...initialState, sessionId: generateSessionId() }),
}));
