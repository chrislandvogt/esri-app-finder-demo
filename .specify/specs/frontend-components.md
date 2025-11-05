# Frontend Component Specification
**Project:** ESRI App Finder & Builder Assistant  
**Version:** 1.0  
**Last Updated:** November 5, 2025

---

## Overview

This document defines all frontend React components, their props interfaces, state management patterns, and interaction contracts. All components use TypeScript strict mode and follow functional component patterns with hooks.

**Framework:** React 19.1.1  
**State Management:** Zustand 5.0.8  
**Styling:** Tailwind CSS 3.4.18  
**Build Tool:** Vite 7.1.7

---

## Architecture Principles

### Constitutional Alignment

- **Article I (Simplicity):** 3-click maximum to configure any app
- **Article II (Conversational):** Chat-first interface, natural language
- **Article III (Performance):** <2s initial load, <200ms interactions
- **Article VII (Graceful Degradation):** Error boundaries on all major components
- **Article VIII (Accessibility):** WCAG 2.1 AA compliance

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   │   ├── DataTab
│   │   └── ChatTab
│   └── MainContent
│       ├── InteractiveMap
│       ├── AppPreview (conditional)
│       └── EmptyState (conditional)
└── ErrorBoundary
```

---

## Global State (Zustand)

### Store Definition

```typescript
// lib/store/appStore.ts

interface AppStore {
  // Chat State
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;

  // Dataset State
  selectedDatasets: LivingAtlasDataset[];
  addDataset: (dataset: LivingAtlasDataset) => void;
  removeDataset: (id: string) => void;
  clearDatasets: () => void;

  // App State
  selectedApp: ESRIApp | null;
  setSelectedApp: (app: ESRIApp | null) => void;

  // UI State
  sidebarTab: 'data' | 'chat';
  setSidebarTab: (tab: 'data' | 'chat') => void;
  isPreviewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;

  // Error State
  error: AppError | null;
  setError: (error: AppError | null) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendations?: AppRecommendation[];
  suggestedActions?: SuggestedAction[];
}

interface AppError {
  code: string;
  message: string;
  suggestions?: string[];
  dismissable: boolean;
}

const useAppStore = create<AppStore>((set) => ({
  messages: [],
  isLoading: false,
  selectedDatasets: [],
  selectedApp: null,
  sidebarTab: 'chat',
  isPreviewOpen: false,
  error: null,

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),

  addDataset: (dataset) => set((state) => ({
    selectedDatasets: [...state.selectedDatasets, dataset]
  })),
  removeDataset: (id) => set((state) => ({
    selectedDatasets: state.selectedDatasets.filter((d) => d.id !== id)
  })),
  clearDatasets: () => set({ selectedDatasets: [] }),

  setSelectedApp: (app) => set({ selectedApp: app }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setPreviewOpen: (open) => set({ isPreviewOpen: open }),
  setError: (error) => set({ error }),
}));
```

---

## Component Specifications

### 1. App.tsx

**Purpose:** Root component with error boundary and global providers

**Props:** None (root component)

**State:** None (delegates to Layout)

**Implementation:**

```typescript
// src/App.tsx

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { ToastContainer } from './components/common/ToastContainer';

function App() {
  return (
    <ErrorBoundary>
      <Layout />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
```

**Requirements:**
- Wrap entire app in ErrorBoundary (Article VII)
- Single Layout component renders all UI
- ToastContainer for transient notifications

---

### 2. Layout.tsx

**Purpose:** Main layout with header, sidebar, and content area

**Props:** None

**State:** Uses `useAppStore` for sidebar tab, preview state

**Template:**

```typescript
// src/components/layout/Layout.tsx

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { InteractiveMap } from '../map/InteractiveMap';
import { AppPreview } from '../preview/AppPreview';
import { EmptyState } from '../common/EmptyState';
import { useAppStore } from '../../lib/store/appStore';

export function Layout() {
  const { isPreviewOpen, selectedApp, error } = useAppStore();

  return (
    <div className="flex h-screen flex-col">
      <Header />
      
      {error && <ErrorBanner error={error} />}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 relative">
          {isPreviewOpen && selectedApp ? (
            <AppPreview app={selectedApp} />
          ) : (
            <>
              <InteractiveMap />
              {!hasAnyContent && <EmptyState />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
```

**Requirements:**
- Header always visible (64px fixed height)
- Sidebar 384px wide, collapsible on mobile
- Main content fills remaining space
- ErrorBanner appears below header when error present
- Conditional rendering: Preview XOR (Map + EmptyState)

**Responsive Behavior:**
- Desktop (>768px): Sidebar visible
- Mobile (<768px): Sidebar slides over content, dismiss on selection

---

### 3. Header.tsx

**Purpose:** App branding and global actions

**Props:**

```typescript
interface HeaderProps {
  className?: string;
}
```

**State:** None (stateless presentation)

**Template:**

```typescript
// src/components/layout/Header.tsx

export function Header({ className }: HeaderProps) {
  const { clearMessages, clearDatasets, setError } = useAppStore();

  const handleReset = () => {
    if (confirm('Clear all data and start over?')) {
      clearMessages();
      clearDatasets();
      setError(null);
    }
  };

  return (
    <header className={cn('bg-esri-blue-600 text-white h-16 flex items-center px-6', className)}>
      <div className="flex items-center gap-3">
        <img src="/esri-logo.svg" alt="ESRI" className="h-8" />
        <h1 className="text-xl font-semibold">App Finder</h1>
      </div>

      <div className="ml-auto flex gap-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded hover:bg-esri-blue-700 transition"
          aria-label="Reset application"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
```

**Requirements:**
- Fixed 64px height
- ESRI branding (logo + title)
- Reset button with confirmation (Article I - simplicity)
- ARIA labels for accessibility (Article VIII)

---

### 4. Sidebar.tsx

**Purpose:** Tab container for Chat and Data tabs

**Props:** None

**State:** Uses `useAppStore` for `sidebarTab`

**Template:**

```typescript
// src/components/layout/Sidebar.tsx

import { ChatTab } from './ChatTab';
import { DataTab } from './DataTab';
import { useAppStore } from '../../lib/store/appStore';

export function Sidebar() {
  const { sidebarTab, setSidebarTab } = useAppStore();

  return (
    <aside className="w-96 border-r border-gray-200 flex flex-col bg-white">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setSidebarTab('chat')}
          className={cn(
            'flex-1 py-3 px-4 font-medium transition',
            sidebarTab === 'chat'
              ? 'bg-white border-b-2 border-esri-blue-600 text-esri-blue-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          )}
          aria-selected={sidebarTab === 'chat'}
          role="tab"
        >
          Chat
        </button>
        <button
          onClick={() => setSidebarTab('data')}
          className={cn(
            'flex-1 py-3 px-4 font-medium transition',
            sidebarTab === 'data'
              ? 'bg-white border-b-2 border-esri-blue-600 text-esri-blue-600'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          )}
          aria-selected={sidebarTab === 'data'}
          role="tab"
        >
          Data ({selectedDatasets.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {sidebarTab === 'chat' ? <ChatTab /> : <DataTab />}
      </div>
    </aside>
  );
}
```

**Requirements:**
- 384px wide (96 * 4px)
- Tab headers with active state
- Data tab shows count badge
- Accessible tab pattern (role="tab", aria-selected)
- Content area scrollable independently

---

### 5. ChatTab.tsx

**Purpose:** Chat interface with message history and input

**Props:** None

**State:** Uses `useAppStore` for messages, isLoading

**Template:**

```typescript
// src/components/layout/ChatTab.tsx

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../chat/ChatMessage';
import { ChatInput } from '../chat/ChatInput';
import { sendChatMessage } from '../../lib/api/chat';
import { useAppStore } from '../../lib/store/appStore';

export function ChatTab() {
  const { messages, isLoading, addMessage, setLoading, setError, selectedDatasets } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({
        message: text,
        context: {
          selectedDatasets: selectedDatasets.map((d) => d.id),
        },
      });

      const assistantMessage: ChatMessage = {
        id: response.messageId,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        recommendations: response.recommendations,
        suggestedActions: response.suggestedActions,
      };

      addMessage(assistantMessage);
    } catch (error) {
      setError({
        code: 'CHAT_ERROR',
        message: 'Unable to send message. Please try again.',
        suggestions: ['Check your connection', 'Browse apps manually in Data tab'],
        dismissable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">👋 Hi! I'm your ESRI assistant.</p>
            <p className="text-sm">Ask me about apps or datasets.</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Spinner className="w-4 h-4" />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask about ESRI apps or datasets..."
        />
      </div>
    </div>
  );
}
```

**Requirements:**
- Auto-scroll to newest message
- Empty state with friendly greeting
- Loading indicator (spinner + text)
- Context passed to API (selected datasets)
- Error handling with user-friendly messages
- Input disabled during loading
- Message history preserved until reset

**Performance:**
- Virtual scrolling if >100 messages (future optimization)
- Debounced typing indicators

---

### 6. ChatMessage.tsx

**Purpose:** Render individual chat message with recommendations

**Props:**

```typescript
interface ChatMessageProps {
  message: ChatMessage;
}
```

**Template:**

```typescript
// src/components/chat/ChatMessage.tsx

export function ChatMessage({ message }: ChatMessageProps) {
  const { setSelectedApp, setPreviewOpen } = useAppStore();

  const handleAppClick = (app: ESRIApp) => {
    setSelectedApp(app);
    setPreviewOpen(true);
  };

  return (
    <div className={cn(
      'flex gap-3',
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-esri-blue-100 flex items-center justify-center">
          🤖
        </div>
      )}

      <div className={cn(
        'max-w-[80%] rounded-lg p-3',
        message.role === 'user'
          ? 'bg-esri-blue-600 text-white'
          : 'bg-gray-100 text-gray-900'
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Recommendations */}
        {message.recommendations && message.recommendations.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.recommendations.map((rec) => (
              <AppRecommendationCard
                key={rec.app.id}
                recommendation={rec}
                onClick={() => handleAppClick(rec.app)}
              />
            ))}
          </div>
        )}

        {/* Suggested Actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestedActions.map((action, i) => (
              <SuggestedActionButton key={i} action={action} />
            ))}
          </div>
        )}

        <time className="text-xs opacity-70 mt-2 block">
          {formatTime(message.timestamp)}
        </time>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          👤
        </div>
      )}
    </div>
  );
}
```

**Requirements:**
- User messages right-aligned, blue background
- Assistant messages left-aligned, gray background
- Avatar icons (emoji for simplicity)
- Timestamp in human-readable format
- Recommendations rendered as interactive cards
- Suggested actions as pill buttons
- Click recommendation → open preview

---

### 7. ChatInput.tsx

**Purpose:** Text input with send button

**Props:**

```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**Template:**

```typescript
// src/components/chat/ChatInput.tsx

import { useState, KeyboardEvent } from 'react';

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-esri-blue-600 disabled:opacity-50"
        aria-label="Chat message input"
        maxLength={500}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 bg-esri-blue-600 text-white rounded-lg hover:bg-esri-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
```

**Requirements:**
- Enter to send, Shift+Enter for newline
- Max 500 characters (API limit)
- Auto-resize up to 3 rows
- Disabled state during loading
- ARIA labels for accessibility

---

### 8. DataTab.tsx

**Purpose:** Search and manage Living Atlas datasets

**Props:** None

**State:** Local search query, results; global selectedDatasets

**Template:**

```typescript
// src/components/layout/DataTab.tsx

import { useState } from 'react';
import { SearchBar } from '../common/SearchBar';
import { DatasetCard } from '../atlas/DatasetCard';
import { searchLivingAtlas } from '../../lib/api/atlas';
import { useAppStore } from '../../lib/store/appStore';
import { debounce } from '../../lib/utils/helpers';

export function DataTab() {
  const { selectedDatasets, addDataset, removeDataset } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LivingAtlasDataset[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = debounce(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchLivingAtlas({ q: query, limit: 20 });
      setResults(response.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const isSelected = (id: string) => selectedDatasets.some((d) => d.id === id);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            handleSearch(q);
          }}
          placeholder="Search Living Atlas..."
          loading={isSearching}
        />
      </div>

      {/* Selected Datasets */}
      {selectedDatasets.length > 0 && (
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Selected ({selectedDatasets.length})
          </h3>
          <div className="space-y-2">
            {selectedDatasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                selected
                onToggle={() => removeDataset(dataset.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchQuery.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Search for datasets"
            description="Find Living Atlas datasets to add to your map"
          />
        )}

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <p className="text-sm text-gray-500">Type at least 3 characters...</p>
        )}

        {results.length === 0 && searchQuery.length >= 3 && !isSearching && (
          <EmptyState
            icon="🤷"
            title="No results"
            description={`No datasets found for "${searchQuery}"`}
          />
        )}

        <div className="space-y-2">
          {results.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              selected={isSelected(dataset.id)}
              onToggle={() =>
                isSelected(dataset.id)
                  ? removeDataset(dataset.id)
                  : addDataset(dataset)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Requirements:**
- Search debounced 300ms
- Min 3 characters to search
- Selected datasets section always visible at top
- Empty states for guidance
- Loading spinner during search
- Select/deselect toggles dataset in store

---

### 9. InteractiveMap.tsx

**Purpose:** ESRI ArcGIS map with dynamic layers

**Props:** None

**State:** Uses `useAppStore` for `selectedDatasets`

**Implementation:** (Already created, see existing file)

**Requirements:**
- Load ArcGIS SDK from CDN
- Initialize MapView on mount
- Add/remove layers reactively based on selectedDatasets
- Default basemap: "topo-vector"
- Default center: [-98, 39] (USA)
- Default zoom: 4

---

### 10. AppPreview.tsx

**Purpose:** Full-screen preview of configured ESRI app

**Props:**

```typescript
interface AppPreviewProps {
  app: ESRIApp;
}
```

**Template:**

```typescript
// src/components/preview/AppPreview.tsx

export function AppPreview({ app }: AppPreviewProps) {
  const { setPreviewOpen, selectedDatasets } = useAppStore();

  // Build config URL with selected datasets as query params
  const configUrl = useMemo(() => {
    const url = new URL(app.configUrl);
    selectedDatasets.forEach((dataset) => {
      url.searchParams.append('layer', dataset.itemUrl);
    });
    return url.toString();
  }, [app.configUrl, selectedDatasets]);

  return (
    <div className="absolute inset-0 bg-white z-10">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-6 justify-between">
        <div>
          <h2 className="text-lg font-semibold">{app.name}</h2>
          <p className="text-sm text-gray-600">{selectedDatasets.length} layers selected</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.open(configUrl, '_blank')}
            className="px-4 py-2 bg-esri-blue-600 text-white rounded hover:bg-esri-blue-700 transition"
          >
            Open in ESRI
          </button>
          <button
            onClick={() => setPreviewOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="h-[calc(100%-4rem)] p-6">
        <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={configUrl}
            className="w-full h-full"
            title={`Preview: ${app.name}`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
```

**Requirements:**
- Full viewport overlay (z-index 10)
- Close button returns to map
- "Open in ESRI" button opens in new tab
- Iframe sandboxed for security
- Selected datasets passed as query params

---

### 11. ErrorBoundary.tsx

**Purpose:** Catch React errors and show fallback UI

**Props:**

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
```

**Implementation:**

```typescript
// src/components/common/ErrorBoundary.tsx

import { Component, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to Application Insights
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center max-w-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2 bg-esri-blue-600 text-white rounded hover:bg-esri-blue-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Requirements:**
- Catch all React errors (Article VII)
- User-friendly error message
- Reload button to recover
- Log errors to console (and telemetry)

---

## Accessibility Requirements (Article VIII)

### WCAG 2.1 AA Compliance

All components must:
- Support keyboard navigation (Tab, Enter, Esc, Arrow keys)
- Include ARIA labels and roles
- Maintain 4.5:1 color contrast ratio
- Provide focus indicators
- Support screen readers

### Keyboard Shortcuts

```
Tab          - Navigate focusable elements
Enter/Space  - Activate buttons
Escape       - Close modals/preview
Ctrl+/       - Focus chat input
```

### Focus Management

```typescript
// Auto-focus chat input on mount
useEffect(() => {
  if (sidebarTab === 'chat' && !isLoading) {
    chatInputRef.current?.focus();
  }
}, [sidebarTab, isLoading]);

// Trap focus in modal
useFocusTrap(previewRef, isPreviewOpen);
```

---

## Performance Budget (Article III)

### Initial Load
- **Target:** <2s to interactive
- **Metrics:** Time to First Byte <500ms, First Contentful Paint <1s

### Interactions
- **Target:** <200ms for all UI updates
- **Strategies:** Debounced search, optimistic UI updates, lazy loading

### Bundle Size
- **Target:** <300KB initial bundle (gzipped)
- **Code splitting:** Map component lazy-loaded

---

## Error Handling Patterns

### API Errors

```typescript
try {
  const response = await apiCall();
  // Success handling
} catch (error) {
  setError({
    code: 'API_ERROR',
    message: 'Unable to complete request',
    suggestions: ['Try again', 'Check connection'],
    dismissable: true,
  });
}
```

### Form Validation

```typescript
const errors: Record<string, string> = {};

if (message.length === 0) {
  errors.message = 'Message cannot be empty';
}

if (message.length > 500) {
  errors.message = 'Message too long (max 500 characters)';
}

setFormErrors(errors);
```

---

## Testing Requirements

### Unit Tests (Vitest + React Testing Library)

Each component must have:
- Render test
- Props validation
- User interaction tests
- Edge case handling

Example:

```typescript
describe('ChatInput', () => {
  it('renders with placeholder', () => {
    render(<ChatInput onSend={vi.fn()} placeholder="Type..." />);
    expect(screen.getByPlaceholderText('Type...')).toBeInTheDocument();
  });

  it('calls onSend when Enter pressed', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('disables input when disabled prop true', () => {
    render(<ChatInput onSend={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

### Integration Tests

- Chat flow: send message → receive response → show recommendations
- Dataset flow: search → select → add to map
- Preview flow: select app → open preview → pass datasets

### Accessibility Tests

```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<ChatTab />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Styling Guidelines

### Tailwind Theme Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'esri-blue': {
          50: '#e6f2ff',
          100: '#cce5ff',
          600: '#0079c1',
          700: '#005a8f',
        },
      },
    },
  },
};
```

### Component Classes

- Buttons: `px-4 py-2 rounded hover:opacity-90 transition`
- Cards: `border border-gray-200 rounded-lg p-4 hover:shadow-md transition`
- Inputs: `border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-esri-blue-600`

---

## State Management Patterns

### Local vs Global State

**Use Local State (useState) for:**
- Form inputs
- UI toggles (dropdown open/closed)
- Transient states

**Use Global State (Zustand) for:**
- Chat messages
- Selected datasets
- Selected app
- Active tab
- Errors

### Derived State

Prefer computing derived state:

```typescript
// ✅ Good
const hasMessages = messages.length > 0;
const isEmpty = !hasMessages && !selectedDatasets.length;

// ❌ Bad (duplicate state)
const [isEmpty, setIsEmpty] = useState(true);
```

---

## Code Organization

```
components/
├── layout/
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ChatTab.tsx
│   └── DataTab.tsx
├── chat/
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   └── AppRecommendationCard.tsx
├── atlas/
│   └── DatasetCard.tsx
├── map/
│   └── InteractiveMap.tsx
├── preview/
│   └── AppPreview.tsx
└── common/
    ├── ErrorBoundary.tsx
    ├── EmptyState.tsx
    ├── SearchBar.tsx
    ├── Spinner.tsx
    └── ToastContainer.tsx
```

---

**Document Status:** Complete  
**Next Steps:** Implement components with tests  
**Owner:** Frontend Team
