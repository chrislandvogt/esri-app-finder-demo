# Frontend Source Code Organization

This document describes the organization of the frontend source code.

## Directory Structure

```
src/
├── components/          # React components organized by feature
│   ├── atlas/          # Living Atlas dataset search
│   ├── chat/           # AI chat interface
│   ├── common/         # Shared/reusable components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── map/            # Map-related components
│   ├── preview/        # App preview components
│   └── index.ts        # Barrel exports for all components
│
├── config/             # Application configuration
│   ├── constants.ts    # App constants and environment config
│   └── index.ts        # Config barrel exports
│
├── hooks/              # Custom React hooks
│   └── (empty - ready for custom hooks)
│
├── lib/                # Core library code
│   ├── api/           # API client and service layer
│   │   ├── client.ts  # Base API client with axios
│   │   ├── chat.ts    # Chat API service
│   │   ├── atlas.ts   # Living Atlas API service
│   │   └── index.ts   # API barrel exports
│   │
│   ├── data/          # Mock data and fixtures
│   │   └── mockData.ts # Mock apps, datasets, and responses
│   │
│   ├── store/         # State management
│   │   └── appStore.ts # Zustand global store
│   │
│   ├── utils/         # Utility functions
│   │   ├── helpers.ts  # Common helper functions
│   │   └── index.ts    # Utils barrel exports
│   │
│   └── index.ts       # Lib barrel exports
│
├── types/              # TypeScript type definitions
│   └── index.ts        # All app types and interfaces
│
├── assets/             # Static assets (images, fonts, etc.)
│
├── App.tsx             # Root application component
├── App.css             # Root application styles
├── main.tsx            # Application entry point
└── index.css           # Global styles

```

## Import Conventions

### Use Barrel Exports
Instead of importing from deep paths, use barrel exports:

```typescript
// ✅ Good - using barrel exports
import { Layout, Header, Sidebar } from '@/components';
import { useAppStore } from '@/lib/store/appStore';
import { apiClient, chatService } from '@/lib/api';

// ❌ Avoid - deep imports
import { Layout } from './components/layout/Layout';
import { useAppStore } from './lib/store/appStore';
```

### Component Imports
All components can be imported from the components index:

```typescript
import { 
  Layout, 
  Header, 
  Sidebar,
  ChatInterface,
  LivingAtlasSearch,
  MapContainer
} from '@/components';
```

### Library Imports
```typescript
// API services
import { apiClient, chatService, atlasService } from '@/lib/api';

// State management
import { useAppStore } from '@/lib/store/appStore';

// Mock data
import { mockApps, mockDatasets, mockChatResponses } from '@/lib/data/mockData';

// Utilities
import { formatDate, truncateText, debounce } from '@/lib/utils';
```

### Configuration
```typescript
import { CONFIG, ROUTES, STORAGE_KEYS } from '@/config';
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `ChatInterface.tsx`)
- **Utilities**: camelCase (e.g., `helpers.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `ESRIApp`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## Code Organization Best Practices

1. **Single Responsibility**: Each file/component should have one clear purpose
2. **Colocation**: Keep related files together (e.g., component + styles + tests)
3. **Barrel Exports**: Use index.ts files to simplify imports
4. **Type Safety**: Define types in the types folder
5. **Configuration**: Centralize config in the config folder

## Adding New Features

When adding a new feature:

1. Create a new folder in `components/` if it's a major feature
2. Add any API services to `lib/api/`
3. Add types to `types/index.ts`
4. Update barrel exports in `components/index.ts`
5. Add any utilities to `lib/utils/`

## State Management

The app uses Zustand for state management. The main store is in `lib/store/appStore.ts`.

```typescript
import { useAppStore } from '@/lib/store/appStore';

function MyComponent() {
  const selectedApp = useAppStore((state) => state.selectedApp);
  const setSelectedApp = useAppStore((state) => state.setSelectedApp);
  // ...
}
```

## API Layer

All API calls go through the services in `lib/api/`:

```typescript
import { chatService, atlasService } from '@/lib/api';

// Send a chat message
const response = await chatService.sendMessage({ message: 'Hello' });

// Search datasets
const results = await atlasService.search({ q: 'population' });
```
