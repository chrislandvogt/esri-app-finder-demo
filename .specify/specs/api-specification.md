# API Specification
**Project:** ESRI App Finder & Builder Assistant  
**Version:** 1.0  
**Last Updated:** November 5, 2025

---

## Overview

This document defines the complete API contract for the ESRI App Finder backend. All endpoints follow RESTful principles and return JSON responses.

**Base URL (Development):** `http://localhost:7071/api`  
**Base URL (Production):** `https://<function-app>.azurewebsites.net/api`

---

## Authentication

**v1.0:** No authentication required (constitutional Article IV - ephemeral design)  
**v2.0:** Azure AD B2C integration planned

---

## Common Types

### Response Envelope

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string; // ISO 8601
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: object;
  };
  timestamp: string; // ISO 8601
}
```

### Error Codes

```typescript
enum ErrorCode {
  // Client Errors (4xx)
  INVALID_REQUEST = 'INVALID_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  OPENAI_ERROR = 'OPENAI_ERROR',
  ESRI_API_ERROR = 'ESRI_API_ERROR',
  TIMEOUT = 'TIMEOUT',
}
```

---

## Endpoints

### 1. POST /api/chat

**Purpose:** Send a chat message and receive AI-powered app recommendations

**Constitutional Alignment:**
- Article II: Conversational interface
- Article III: Streaming response <2s
- Article VI: Transparent reasoning

**Request:**

```typescript
interface ChatRequest {
  message: string;           // User's message (1-500 chars)
  sessionId?: string;        // Optional session UUID
  context?: {
    selectedDatasets?: string[];  // Dataset IDs already selected
    userIntent?: string;          // Explicit intent if known
  };
}
```

**Response (Streaming):**

```typescript
// Server-Sent Events (SSE) stream
interface ChatStreamEvent {
  type: 'chunk' | 'recommendation' | 'complete' | 'error';
  data: object;
}

// Text chunk
interface ChatChunk {
  type: 'chunk';
  data: {
    content: string;  // Incremental text
    delta: number;    // Character position
  };
}

// Recommendation event
interface RecommendationEvent {
  type: 'recommendation';
  data: {
    recommendations: AppRecommendation[];
  };
}

// Final event
interface CompleteEvent {
  type: 'complete';
  data: {
    messageId: string;
    totalTokens: number;
    latency: number;  // milliseconds
  };
}
```

**Response (Non-Streaming Fallback):**

```typescript
interface ChatResponse {
  messageId: string;
  role: 'assistant';
  content: string;
  timestamp: string;
  recommendations: AppRecommendation[];
  suggestedActions?: SuggestedAction[];
  metadata: {
    tokensUsed: number;
    latency: number;
    model: string;
  };
}

interface AppRecommendation {
  app: ESRIApp;
  score: number;        // 0-1 relevance score
  reasoning: string;    // 2-3 sentence explanation
  confidence: 'high' | 'medium' | 'low';
  matchedFeatures: string[];  // Which app features matched query
}

interface SuggestedAction {
  type: 'select-dataset' | 'create-map' | 'configure-app' | 'ask-question';
  label: string;
  description: string;
  data?: object;
}
```

**Example Request:**

```json
{
  "message": "I need to visualize population density across census tracts",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "context": {
    "selectedDatasets": []
  }
}
```

**Example Response:**

```json
{
  "messageId": "msg_1730847600000",
  "role": "assistant",
  "content": "For visualizing population density across census tracts, I recommend the **Instant Apps - Map Viewer**. This app excels at displaying demographic data with interactive filtering and works great with census boundary datasets.",
  "timestamp": "2025-11-05T18:30:00.000Z",
  "recommendations": [
    {
      "app": {
        "id": "instant-apps-map-viewer",
        "name": "Instant Apps - Map Viewer",
        "description": "Create interactive web maps with filtering",
        "category": "viewer",
        "thumbnailUrl": "https://placehold.co/256x256/0079c1/white?text=Map+Viewer",
        "configUrl": "https://www.arcgis.com/apps/instant/basic/index.html",
        "features": ["Interactive mapping", "Filtering", "Pop-ups", "Legend"],
        "useCases": ["Data exploration", "Demographics"],
        "complexity": "beginner"
      },
      "score": 0.95,
      "reasoning": "Map Viewer provides the best combination of simplicity and power for demographic visualization. It supports census tract boundaries natively and offers excellent filtering options for population data.",
      "confidence": "high",
      "matchedFeatures": ["Interactive mapping", "Filtering", "Pop-ups"]
    }
  ],
  "suggestedActions": [
    {
      "type": "select-dataset",
      "label": "Add Census Tract Boundaries",
      "description": "Include USA census tract boundaries dataset",
      "data": { "datasetId": "usa-census-tract-boundaries" }
    }
  ],
  "metadata": {
    "tokensUsed": 256,
    "latency": 1450,
    "model": "gpt-4"
  }
}
```

**Error Responses:**

```json
// Invalid message
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Message must be between 1 and 500 characters",
    "details": { "field": "message", "length": 0 }
  },
  "timestamp": "2025-11-05T18:30:00.000Z"
}

// OpenAI timeout
{
  "success": false,
  "error": {
    "code": "TIMEOUT",
    "message": "AI service took too long to respond. Please try again.",
    "details": { "timeout": 10000 }
  },
  "timestamp": "2025-11-05T18:30:00.000Z"
}
```

**Performance Budget:**
- First byte: <1s
- Streaming start: <2s (constitutional Article III)
- Complete response: <5s

**Rate Limits:**
- 10 requests per minute per session
- 100 requests per hour per IP

---

### 2. GET /api/living-atlas/search

**Purpose:** Search ESRI Living Atlas for datasets

**Constitutional Alignment:**
- Article V: ESRI ecosystem integration
- Article VII: Graceful degradation on failure

**Query Parameters:**

```typescript
interface SearchParams {
  q: string;              // Search query (min 3 chars)
  category?: string;      // Filter by category
  limit?: number;         // Results per page (1-100, default 20)
  offset?: number;        // Pagination offset (default 0)
  sortBy?: 'relevance' | 'modified' | 'title';  // Sort order
}
```

**Response:**

```typescript
interface SearchResponse {
  query: string;
  total: number;
  count: number;
  offset: number;
  results: LivingAtlasDataset[];
  categories: CategoryCount[];  // Available categories with counts
}

interface LivingAtlasDataset {
  id: string;
  title: string;
  description: string;
  owner: string;
  type: 'Feature Service' | 'Image Service' | 'Map Service' | 'Vector Tile Service';
  tags: string[];
  thumbnailUrl: string;
  itemUrl: string;
  created: string;      // ISO 8601
  modified: string;     // ISO 8601
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    spatialReference?: { wkid: number };
  };
  accessInformation?: string;
  licenseInfo?: string;
}

interface CategoryCount {
  category: string;
  count: number;
}
```

**Example Request:**

```
GET /api/living-atlas/search?q=population&category=Demographics&limit=10
```

**Example Response:**

```json
{
  "query": "population",
  "total": 47,
  "count": 10,
  "offset": 0,
  "results": [
    {
      "id": "usa-census-tract-boundaries",
      "title": "USA Census Tract Boundaries",
      "description": "Census tract boundaries with demographic data",
      "owner": "Esri Demographics",
      "type": "Feature Service",
      "tags": ["census", "demographics", "population", "usa"],
      "thumbnailUrl": "https://placehold.co/200x200/d95f02/white?text=Census",
      "itemUrl": "https://www.arcgis.com/home/item.html?id=8d2647eb",
      "created": "2021-06-10T00:00:00.000Z",
      "modified": "2024-10-15T00:00:00.000Z",
      "extent": {
        "xmin": -179.14734,
        "ymin": 18.91619,
        "xmax": -66.96466,
        "ymax": 71.35776,
        "spatialReference": { "wkid": 4326 }
      }
    }
  ],
  "categories": [
    { "category": "Demographics", "count": 23 },
    { "category": "Boundaries", "count": 15 },
    { "category": "Environment", "count": 9 }
  ]
}
```

**Error Responses:**

```json
// Query too short
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query must be at least 3 characters",
    "details": { "field": "q", "minLength": 3 }
  },
  "timestamp": "2025-11-05T18:30:00.000Z"
}

// ESRI API unavailable
{
  "success": false,
  "error": {
    "code": "ESRI_API_ERROR",
    "message": "Unable to search Living Atlas. Please try again or enter a dataset URL manually.",
    "details": { "upstream": "timeout" }
  },
  "timestamp": "2025-11-05T18:30:00.000Z"
}
```

**Performance Budget:**
- Response time: <1s (cached)
- Response time: <3s (uncached, ESRI API call)

**Caching:**
- Popular searches cached 1 hour
- Category counts cached 24 hours

**Rate Limits:**
- 30 requests per minute per session
- 500 requests per hour per IP

---

### 3. GET /api/apps

**Purpose:** Retrieve list of all 12 ESRI configurable applications

**Constitutional Alignment:**
- Article V: ESRI ecosystem (official apps only)

**Query Parameters:**

```typescript
interface AppsQueryParams {
  category?: string;        // Filter by category
  complexity?: 'beginner' | 'intermediate' | 'advanced';
}
```

**Response:**

```typescript
interface AppsResponse {
  total: number;
  apps: ESRIApp[];
}

interface ESRIApp {
  id: string;
  name: string;
  description: string;
  category: 'viewer' | 'storytelling' | 'dashboard' | 'collector' | 'editor';
  thumbnailUrl: string;
  configUrl: string;          // URL to launch app builder
  documentationUrl: string;    // ESRI official docs
  features: string[];
  useCases: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  requiredLicense?: string;    // e.g., "ArcGIS Online", "ArcGIS Enterprise"
  mobileSupport: boolean;
}
```

**Example Request:**

```
GET /api/apps?category=viewer&complexity=beginner
```

**Example Response:**

```json
{
  "total": 2,
  "apps": [
    {
      "id": "instant-apps-map-viewer",
      "name": "Instant Apps - Map Viewer",
      "description": "Create interactive web maps with filtering and search",
      "category": "viewer",
      "thumbnailUrl": "https://placehold.co/256x256/0079c1/white?text=Map+Viewer",
      "configUrl": "https://www.arcgis.com/apps/instant/basic/index.html",
      "documentationUrl": "https://doc.arcgis.com/en/instant-apps/",
      "features": ["Interactive mapping", "Filtering", "Search", "Pop-ups", "Legend", "Print"],
      "useCases": ["Data exploration", "Public information", "Simple dashboards"],
      "complexity": "beginner",
      "requiredLicense": "ArcGIS Online",
      "mobileSupport": true
    }
  ]
}
```

**Performance Budget:**
- Response time: <100ms (static data, cached)

**Caching:**
- Cached 24 hours (rarely changes)

---

### 4. GET /api/health

**Purpose:** Health check endpoint for monitoring

**Response:**

```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    openai: ServiceHealth;
    esri: ServiceHealth;
    cache?: ServiceHealth;
  };
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  latency?: number;  // milliseconds
  lastCheck: string;
}
```

**Example Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T18:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "openai": {
      "status": "up",
      "latency": 245,
      "lastCheck": "2025-11-05T18:29:50.000Z"
    },
    "esri": {
      "status": "up",
      "latency": 180,
      "lastCheck": "2025-11-05T18:29:55.000Z"
    }
  }
}
```

---

## Error Handling Standards

### HTTP Status Codes

```
200 OK                  - Successful request
201 Created            - Resource created
400 Bad Request        - Invalid input
404 Not Found          - Resource not found
429 Too Many Requests  - Rate limit exceeded
500 Internal Error     - Server error
503 Service Unavailable - Dependency failure
504 Gateway Timeout    - Upstream timeout
```

### Error Response Format

All errors follow this structure:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;        // User-friendly message
    details?: object;       // Additional context
    suggestions?: string[]; // Actionable next steps
  };
  timestamp: string;
  requestId: string;        // For support/debugging
}
```

### Fallback Guidance (Article VII)

Every error response must include `suggestions` array with fallback actions:

```json
{
  "error": {
    "code": "OPENAI_ERROR",
    "message": "AI service is temporarily unavailable",
    "suggestions": [
      "Browse apps manually using the Data tab",
      "Try again in a few moments",
      "Contact support if issue persists"
    ]
  }
}
```

---

## Request Validation

### Input Sanitization

All inputs sanitized for:
- XSS prevention (HTML entity encoding)
- SQL injection (parameterized queries, though no SQL in v1)
- Path traversal
- Excessive length

### Validation Library

```typescript
import { z } from 'zod';

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string().uuid().optional(),
  context: z.object({
    selectedDatasets: z.array(z.string()).optional(),
    userIntent: z.string().optional(),
  }).optional(),
});
```

---

## Performance Monitoring

### Application Insights Events

```typescript
// Track every API call
trackRequest({
  name: 'POST /api/chat',
  duration: 1450,
  responseCode: 200,
  success: true,
  properties: {
    sessionId: '550e8400...',
    tokensUsed: 256,
    recommendationCount: 1,
  },
});

// Track dependencies
trackDependency({
  name: 'Azure OpenAI',
  type: 'HTTP',
  data: 'POST https://api.openai.azure.com/...',
  duration: 1200,
  success: true,
});

// Track errors
trackException({
  exception: error,
  properties: {
    endpoint: '/api/chat',
    errorCode: 'OPENAI_ERROR',
    sessionId: '550e8400...',
  },
});
```

---

## Security Headers

All responses include:

```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Versioning Strategy

**v1.0:** Current specification (no versioning in URL)  
**v2.0+:** Version in URL path (`/api/v2/chat`)

Breaking changes require new major version.

---

## Testing Requirements

### Unit Tests
- All validation schemas
- Error response formatting
- Business logic in services

### Integration Tests
- Each endpoint with valid inputs
- Each endpoint with invalid inputs
- Dependency failure scenarios
- Rate limiting behavior

### Load Tests
- Simulate 100 concurrent users
- Verify rate limits
- Monitor cold start performance

---

**Document Status:** Complete  
**Next Review:** After implementation  
**Owner:** Backend Team
