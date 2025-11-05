# Component Architecture & Implementation Guide

## Overview
This document outlines the React component structure, implementation patterns, and best practices for the ESRI App Finder & Builder Assistant frontend.

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   └── MainContent
│       ├── Sidebar (collapsible)
│       │   ├── ChatInterface
│       │   │   ├── ChatMessage (list)
│       │   │   ├── TypingIndicator
│       │   │   └── ChatInput
│       │   ├── AppRecommendationList
│       │   │   └── AppRecommendationCard (multiple)
│       │   └── LivingAtlasSearch
│       │       ├── SearchInput
│       │       ├── DatasetFilters
│       │       └── DatasetCard (list)
│       └── MapContainer
│           ├── MapViewer (ArcGIS)
│           ├── MapControls
│           ├── LayerList
│           └── AppPreview
```

## Core Components

### 1. Layout Components

#### `Layout.tsx`
```typescript
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapContainer } from '../map/MapContainer';
import { useAppStore } from '../../store/appStore';

export function Layout() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <MapContainer className={sidebarOpen ? 'ml-96' : 'ml-0'} />
      </div>
    </div>
  );
}
```

#### `Header.tsx`
```typescript
interface HeaderProps {}

export function Header() {
  const { sidebarOpen, setSidebarOpen } = useAppStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: state.setSidebarOpen
  }));

  return (
    <header className="bg-blue-600 text-white h-16 flex items-center px-4 shadow-md">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-blue-700 rounded"
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </button>
      <h1 className="ml-4 text-xl font-semibold">
        ESRI App Finder & Builder
      </h1>
    </header>
  );
}
```

#### `Sidebar.tsx`
```typescript
interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const activeTab = useAppStore((state) => state.activeTab);

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 w-96 bg-white shadow-lg
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <TabNavigation />
      <div className="h-full overflow-y-auto pb-4">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'atlas' && <LivingAtlasSearch />}
        {activeTab === 'preview' && <AppPreview />}
      </div>
    </aside>
  );
}
```

### 2. Chat Components

#### `ChatInterface.tsx`
```typescript
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

export function ChatInterface() {
  const sessionId = useSessionId();
  const { messages, sendMessage, isLoading } = useChat(sessionId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

#### `ChatMessage.tsx`
```typescript
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../../types/chat.types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] rounded-lg p-3
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
          }
        `}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
        
        {message.metadata?.recommendations && (
          <AppRecommendationList 
            recommendations={message.metadata.recommendations} 
          />
        )}
      </div>
    </div>
  );
}
```

#### `ChatInput.tsx`
```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what you want to build..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </form>
  );
}
```

### 3. Recommendation Components

#### `AppRecommendationList.tsx`
```typescript
import { AppRecommendation } from '../../types/esri.types';
import { AppRecommendationCard } from './AppRecommendationCard';

interface AppRecommendationListProps {
  recommendations: AppRecommendation[];
}

export function AppRecommendationList({ recommendations }: AppRecommendationListProps) {
  return (
    <div className="mt-4 space-y-3">
      <h3 className="font-semibold text-sm">Recommended Applications:</h3>
      {recommendations.map((app) => (
        <AppRecommendationCard key={app.id} app={app} />
      ))}
    </div>
  );
}
```

#### `AppRecommendationCard.tsx`
```typescript
interface AppRecommendationCardProps {
  app: AppRecommendation;
}

export function AppRecommendationCard({ app }: AppRecommendationCardProps) {
  const { setSelectedApp, setActiveTab } = useAppStore((state) => ({
    setSelectedApp: state.setSelectedApp,
    setActiveTab: state.setActiveTab
  }));

  const handleSelect = () => {
    setSelectedApp(app.id);
    setActiveTab('map');
  };

  return (
    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <img
          src={app.thumbnailUrl}
          alt={app.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{app.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{app.reasoning}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {app.capabilities.slice(0, 3).map((capability) => (
              <span
                key={capability}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={handleSelect}
        className="mt-3 w-full py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Use This App
      </button>
    </div>
  );
}
```

### 4. Map Components

#### `MapViewer.tsx`
```typescript
import { useEffect, useRef } from 'react';
import { useMap } from '../../hooks/useMap';

export function MapViewer() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const { initializeMap, addLayer } = useMap();
  const selectedDatasets = useAppStore((state) => state.selectedDatasets);

  useEffect(() => {
    if (mapDiv.current) {
      initializeMap(mapDiv.current);
    }
  }, []);

  useEffect(() => {
    selectedDatasets.forEach((datasetId) => {
      addLayer(datasetId);
    });
  }, [selectedDatasets]);

  return (
    <div ref={mapDiv} className="w-full h-full" />
  );
}
```

#### `MapControls.tsx`
```typescript
export function MapControls() {
  const { zoomIn, zoomOut, resetExtent } = useMap();

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
      <button
        onClick={zoomIn}
        className="p-2 hover:bg-gray-100 rounded"
        aria-label="Zoom in"
      >
        <PlusIcon />
      </button>
      <button
        onClick={zoomOut}
        className="p-2 hover:bg-gray-100 rounded"
        aria-label="Zoom out"
      >
        <MinusIcon />
      </button>
      <button
        onClick={resetExtent}
        className="p-2 hover:bg-gray-100 rounded"
        aria-label="Reset extent"
      >
        <HomeIcon />
      </button>
    </div>
  );
}
```

### 5. Living Atlas Components

#### `LivingAtlasSearch.tsx`
```typescript
import { useState } from 'react';
import { useLivingAtlasSearch } from '../../hooks/useLivingAtlas';
import { DatasetCard } from './DatasetCard';
import { DatasetFilters } from './DatasetFilters';

export function LivingAtlasSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useLivingAtlasSearch(query, filters);

  return (
    <div className="p-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Living Atlas datasets..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      <DatasetFilters filters={filters} onChange={setFilters} />
      
      <div className="mt-4 space-y-3">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading datasets</div>}
        {data?.results.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>
    </div>
  );
}
```

#### `DatasetCard.tsx`
```typescript
interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const { selectedDatasets, addDataset, removeDataset } = useAppStore();
  const isSelected = selectedDatasets.includes(dataset.id);

  const handleToggle = () => {
    if (isSelected) {
      removeDataset(dataset.id);
    } else {
      addDataset(dataset.id);
    }
  };

  return (
    <div className="border rounded-lg p-3 hover:shadow-md">
      <div className="flex gap-3">
        <img
          src={dataset.thumbnailUrl}
          alt={dataset.title}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{dataset.title}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {dataset.description}
          </p>
          <button
            onClick={handleToggle}
            className={`mt-2 px-3 py-1 text-xs rounded ${
              isSelected
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isSelected ? 'Added' : 'Add to Map'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Component Best Practices

### 1. Props Interface Pattern
```typescript
// Always define props interface
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  children?: React.ReactNode;
}

export function Component({ requiredProp, optionalProp = 0 }: ComponentProps) {
  // ...
}
```

### 2. State Management Pattern
```typescript
// Server state: Use React Query hooks
const { data, isLoading, error } = useQuery(...);

// Client state: Use Zustand
const clientState = useAppStore((state) => state.clientState);

// Local UI state: Use useState
const [isOpen, setIsOpen] = useState(false);
```

### 3. Event Handler Pattern
```typescript
// Prefix with 'handle'
const handleClick = () => { /* ... */ };
const handleSubmit = (e: React.FormEvent) => { /* ... */ };

// For props, prefix with 'on'
interface Props {
  onClick: () => void;
  onSubmit: (data: any) => void;
}
```

### 4. Conditional Rendering
```typescript
// Use && for simple conditions
{isLoading && <Spinner />}

// Use ternary for if/else
{isLoading ? <Spinner /> : <Content />}

// Use early return for complex conditions
if (error) return <Error message={error.message} />;
if (isLoading) return <Spinner />;
return <Content />;
```

### 5. Accessibility
```typescript
// Always include aria labels
<button aria-label="Close dialog" onClick={onClose}>
  <XIcon />
</button>

// Use semantic HTML
<nav>...</nav>
<main>...</main>
<aside>...</aside>

// Keyboard navigation
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
}}
```

## Styling Guidelines

### Tailwind CSS Classes
```typescript
// Use semantic class grouping
<div className={`
  // Layout
  flex items-center justify-between
  // Spacing
  p-4 gap-3
  // Colors
  bg-white text-gray-900
  // Effects
  hover:bg-gray-50 transition-colors
  // Responsive
  md:flex-row md:p-6
`}>
```

### Dynamic Classes
```typescript
import { clsx } from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-600 text-white',
  !isActive && 'bg-gray-200 text-gray-700',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025
