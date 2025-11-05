# Technical Specification

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   React SPA (TypeScript + Tailwind CSS)              │   │
│  │   - Chat Interface Component                          │   │
│  │   - Map Viewer Component (ArcGIS Maps SDK)           │   │
│  │   - Living Atlas Search Component                     │   │
│  │   - App Preview Component                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Express.js / Azure Functions                        │   │
│  │   - /api/chat (AI conversation)                       │   │
│  │   - /api/recommend (app recommendations)              │   │
│  │   - /api/maps (web map operations)                    │   │
│  │   - /api/living-atlas (dataset search)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ AI Service   │  │ ESRI Service │  │ Config Service  │   │
│  │ (OpenAI)     │  │ (ArcGIS API) │  │ (App Logic)     │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Azure OpenAI │  │ ArcGIS Online│  │ Living Atlas    │   │
│  │ (GPT-4)      │  │ REST API     │  │ API             │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Styling framework |
| ArcGIS Maps SDK for JavaScript | 4.x | Map rendering & interaction |
| Axios | 1.x | HTTP client |
| React Query | 5.x | Server state management |
| Zustand | 4.x | Client state management |
| React Markdown | 9.x | Chat message formatting |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Express.js | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| Azure Functions | 4.x | Serverless compute (alternative) |
| OpenAI SDK | 4.x | Azure OpenAI integration |
| ArcGIS REST JS | 4.x | ESRI API client |
| Winston | 3.x | Logging |
| Helmet | 7.x | Security headers |
| CORS | 2.x | Cross-origin requests |

### Infrastructure & DevOps

| Service | Purpose |
|---------|---------|
| Azure Static Web Apps | Frontend hosting |
| Azure App Service | Backend hosting (alternative to Functions) |
| Azure Functions | Serverless backend (alternative to App Service) |
| Azure OpenAI Service | AI/Chat capabilities |
| Azure CDN | Content delivery |
| Azure Monitor | Application insights & logging |
| Azure Key Vault | Secrets management |
| GitHub Actions | CI/CD pipeline |

## Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx          # Main chat container
│   │   ├── ChatMessage.tsx            # Individual message bubble
│   │   ├── ChatInput.tsx              # Message input field
│   │   └── TypingIndicator.tsx        # Loading state
│   ├── recommendations/
│   │   ├── AppRecommendationList.tsx  # List of recommended apps
│   │   ├── AppRecommendationCard.tsx  # Individual app card
│   │   └── AppDetailsModal.tsx        # Detailed app information
│   ├── map/
│   │   ├── MapViewer.tsx              # ArcGIS map container
│   │   ├── MapControls.tsx            # Zoom, basemap selector
│   │   ├── LayerList.tsx              # Data layers panel
│   │   └── PopupTemplate.tsx          # Feature popup configuration
│   ├── atlas/
│   │   ├── LivingAtlasSearch.tsx      # Search interface
│   │   ├── DatasetCard.tsx            # Dataset preview card
│   │   ├── DatasetFilters.tsx         # Category/geography filters
│   │   └── DatasetDetailsModal.tsx    # Full dataset information
│   ├── preview/
│   │   ├── AppPreview.tsx             # App preview container
│   │   └── LaunchButton.tsx           # Launch app CTA
│   └── layout/
│       ├── Header.tsx                 # App header
│       ├── Sidebar.tsx                # Collapsible side panel
│       └── Layout.tsx                 # Main layout wrapper
├── hooks/
│   ├── useChat.ts                     # Chat logic & API calls
│   ├── useRecommendations.ts          # Recommendation state
│   ├── useMap.ts                      # Map instance & operations
│   ├── useLivingAtlas.ts              # Dataset search & selection
│   └── useAppConfig.ts                # App configuration state
├── services/
│   ├── api.ts                         # API client setup
│   ├── chat.service.ts                # Chat API calls
│   ├── esri.service.ts                # ESRI API calls
│   └── atlas.service.ts               # Living Atlas API calls
├── store/
│   └── appStore.ts                    # Zustand global state
├── types/
│   ├── chat.types.ts                  # Chat message types
│   ├── esri.types.ts                  # ESRI-specific types
│   └── app.types.ts                   # Application types
└── utils/
    ├── esri-loader.ts                 # ArcGIS SDK initialization
    ├── markdown.ts                    # Markdown rendering helpers
    └── constants.ts                   # App constants
```

### Backend Services

```
backend/
├── src/
│   ├── routes/
│   │   ├── chat.routes.ts             # /api/chat endpoints
│   │   ├── recommend.routes.ts        # /api/recommend endpoints
│   │   ├── maps.routes.ts             # /api/maps endpoints
│   │   └── atlas.routes.ts            # /api/living-atlas endpoints
│   ├── services/
│   │   ├── ai.service.ts              # Azure OpenAI integration
│   │   ├── esri.service.ts            # ArcGIS API integration
│   │   ├── recommendation.service.ts   # App recommendation logic
│   │   └── atlas.service.ts           # Living Atlas search
│   ├── middleware/
│   │   ├── error.middleware.ts        # Error handling
│   │   ├── validation.middleware.ts   # Request validation
│   │   └── rateLimit.middleware.ts    # Rate limiting
│   ├── types/
│   │   ├── chat.types.ts              # Chat types
│   │   ├── esri.types.ts              # ESRI types
│   │   └── config.types.ts            # Configuration types
│   ├── utils/
│   │   ├── logger.ts                  # Winston logger
│   │   ├── cache.ts                   # In-memory caching
│   │   └── constants.ts               # Backend constants
│   ├── config/
│   │   ├── openai.config.ts           # OpenAI configuration
│   │   ├── esri.config.ts             # ESRI API configuration
│   │   └── env.config.ts              # Environment variables
│   └── index.ts                       # Application entry point
└── tests/
    ├── unit/                          # Unit tests
    └── integration/                   # Integration tests
```

## Data Models

### Chat Message Model

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    recommendations?: AppRecommendation[];
    mapConfig?: MapConfiguration;
    datasets?: Dataset[];
  };
}
```

### App Recommendation Model

```typescript
interface AppRecommendation {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  relevanceScore: number;
  reasoning: string;
  capabilities: string[];
  thumbnailUrl: string;
  documentationUrl: string;
  templateId?: string;
}

enum AppCategory {
  INSTANT_APPS = 'instant-apps',
  WEB_APPBUILDER = 'web-appbuilder',
  EXPERIENCE_BUILDER = 'experience-builder',
  DASHBOARDS = 'dashboards',
  STORYMAPS = 'storymaps',
  SURVEY123 = 'survey123',
  COLLECTOR = 'collector',
  EXPLORER = 'explorer',
  NAVIGATOR = 'navigator',
  QUICKCAPTURE = 'quickcapture',
  FIELD_MAPS = 'field-maps',
  WORKFORCE = 'workforce'
}
```

### Map Configuration Model

```typescript
interface MapConfiguration {
  webMapId?: string;
  basemap: string;
  center: [number, number];
  zoom: number;
  layers: LayerConfig[];
  popups: PopupConfig[];
}

interface LayerConfig {
  id: string;
  url: string;
  type: 'feature' | 'tile' | 'vector' | 'image';
  title: string;
  visible: boolean;
  opacity: number;
}
```

### Living Atlas Dataset Model

```typescript
interface Dataset {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'feature-layer' | 'image-layer' | 'tile-layer' | 'vector-tile-layer';
  thumbnailUrl: string;
  categories: string[];
  tags: string[];
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    spatialReference: { wkid: number };
  };
  owner: string;
  created: Date;
  modified: Date;
}
```

## API Contracts

See [API Contracts](./api-contracts.md) for detailed endpoint specifications.

## Authentication & Authorization

### Version 1.0 (Current)
- **No authentication required**
- Stateless sessions identified by client-generated session ID
- No user data persistence
- Rate limiting by IP address

### Future Versions
- ArcGIS Online SSO integration
- OAuth 2.0 flow
- User profile management
- Saved configurations

## Security Considerations

### API Security
1. **HTTPS Only**: All communication over TLS 1.2+
2. **CORS Configuration**: Whitelist specific origins
3. **Rate Limiting**: 
   - Chat: 30 requests/minute per IP
   - Living Atlas: 60 requests/minute per IP
4. **Input Validation**: Sanitize all user inputs
5. **API Key Protection**: Store in Azure Key Vault
6. **Content Security Policy**: Strict CSP headers

### Data Privacy
1. **No PII Collection**: Don't store user information
2. **Session Isolation**: Each session is independent
3. **Ephemeral Data**: Chat history not persisted
4. **Logging**: Don't log sensitive chat content

## Performance Requirements

### Response Times (95th Percentile)
- Chat message response: <3 seconds
- Living Atlas search: <1 second
- Map rendering: <2 seconds
- App preview: <2 seconds

### Optimization Strategies
1. **Frontend**:
   - Code splitting & lazy loading
   - Image optimization & lazy loading
   - CDN for static assets
   - Service worker for offline UI (future)

2. **Backend**:
   - Response caching (Redis for future)
   - Connection pooling
   - Compression (gzip/brotli)
   - Request debouncing

3. **ArcGIS SDK**:
   - Progressive data loading
   - Layer simplification for preview
   - Tile caching

## Error Handling

### Error Categories
1. **Network Errors**: Retry with exponential backoff
2. **API Errors**: Display user-friendly messages
3. **Validation Errors**: Inline form validation
4. **AI Errors**: Fallback to template responses

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
  };
}
```

## Monitoring & Logging

### Application Insights
- Request/response times
- Error rates & exceptions
- Dependency failures
- Custom events (app recommendations, launches)

### Logging Levels
- **ERROR**: Exceptions, API failures
- **WARN**: Retries, degraded performance
- **INFO**: App launches, recommendations
- **DEBUG**: Detailed request/response data

## Deployment Architecture

### Azure Static Web Apps (Recommended)
```
GitHub Repo → GitHub Actions → Azure Static Web Apps
                                 ├── Frontend (Static)
                                 └── API Functions (Node.js)
```

### Alternative: App Service + Functions
```
Frontend: Azure Static Web Apps or App Service
Backend: Azure Functions (serverless)
```

## Environment Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=https://api.esri-assistant.azure.com
VITE_ARCGIS_API_KEY=<esri-api-key>
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com
AZURE_OPENAI_API_KEY=<key>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# ESRI
ESRI_API_KEY=<key>
ESRI_CLIENT_ID=<optional>
ESRI_CLIENT_SECRET=<optional>

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security
ALLOWED_ORIGINS=https://esri-assistant.azure.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

## Scalability Considerations

### Horizontal Scaling
- Stateless backend enables auto-scaling
- Azure Static Web Apps automatically scales
- Azure Functions scale based on demand

### Caching Strategy
- Browser caching for static assets (1 year)
- CDN caching for images/scripts
- API response caching for Living Atlas (5 minutes)
- App recommendation caching per query

### Future Optimization
- Redis cache for frequent queries
- Database read replicas (when persistence added)
- Message queue for async operations

## Testing Strategy

### Unit Tests
- Jest for React components
- Jest for backend services
- Target: >80% code coverage

### Integration Tests
- API endpoint testing
- ESRI API integration tests
- OpenAI service tests

### E2E Tests
- Playwright for user flows
- Critical path testing:
  1. Chat → Recommendation → Map → Launch

### Performance Tests
- Load testing with Artillery
- Stress testing API endpoints

## Accessibility Compliance

### WCAG 2.1 AA Requirements
- Keyboard navigation for all interactions
- Screen reader support (ARIA labels)
- Color contrast ratio >4.5:1
- Focus indicators
- Alt text for images
- Semantic HTML

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

## Dependencies & Versions

See `package.json` for exact versions and dependency tree.

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025  
**Next Review**: December 2025
