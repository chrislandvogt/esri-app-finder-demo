# API Contracts

## Overview
This document defines all API endpoints, request/response schemas, and integration patterns for the ESRI App Finder & Builder Assistant.

## Base URL
```
Production: https://api.esri-assistant.azure.com/api
Development: http://localhost:3000/api
```

## Authentication
Version 1.0: No authentication required. Sessions identified by `X-Session-ID` header.

## Common Headers

### Request Headers
```
Content-Type: application/json
X-Session-ID: <uuid> (client-generated, optional)
X-Client-Version: 1.0.0
```

### Response Headers
```
Content-Type: application/json
X-Request-ID: <uuid>
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1699200000
```

## Error Response Format

All errors follow this structure:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2025-11-05T12:00:00Z",
    "requestId": "uuid"
  }
}
```

### Common Error Codes
- `INVALID_REQUEST`: Malformed request body
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `AI_SERVICE_ERROR`: Azure OpenAI unavailable
- `ESRI_API_ERROR`: ESRI service error
- `INTERNAL_ERROR`: Unexpected server error

---

## Chat API

### POST /api/chat

Send a chat message and receive AI response with recommendations.

#### Request Body
```json
{
  "message": "I need to visualize crime data by neighborhood",
  "sessionId": "uuid",
  "context": {
    "previousRecommendations": ["instant-apps", "dashboards"],
    "currentMapId": "web-map-123",
    "selectedDatasets": ["crime-layer-id"]
  }
}
```

#### Request Schema
```typescript
interface ChatRequest {
  message: string;              // User's chat message (required)
  sessionId?: string;           // Session identifier (optional)
  context?: {                   // Conversation context (optional)
    previousRecommendations?: string[];
    currentMapId?: string;
    selectedDatasets?: string[];
  };
}
```

#### Response (200 OK)
```json
{
  "messageId": "msg-uuid",
  "role": "assistant",
  "content": "Based on your need to visualize crime data by neighborhood, I recommend the following applications...",
  "timestamp": "2025-11-05T12:00:00Z",
  "recommendations": [
    {
      "id": "instant-apps-map-viewer",
      "name": "Instant Apps - Map Viewer",
      "description": "Create an interactive map viewer with filtering and search capabilities",
      "category": "instant-apps",
      "relevanceScore": 0.95,
      "reasoning": "Perfect for displaying crime data with neighborhood boundaries. Supports filtering by crime type, date range, and spatial search.",
      "capabilities": [
        "Interactive mapping",
        "Filtering and search",
        "Pop-up configuration",
        "Mobile responsive"
      ],
      "thumbnailUrl": "https://cdn.esri.com/thumbnails/instant-apps-viewer.png",
      "documentationUrl": "https://doc.arcgis.com/en/instant-apps/",
      "templateId": "instant-apps-basic-viewer"
    }
  ],
  "suggestedActions": [
    {
      "type": "create-map",
      "label": "Create web map for crime data",
      "description": "Set up a web map with crime layers and neighborhood boundaries"
    },
    {
      "type": "search-datasets",
      "label": "Find crime datasets",
      "query": "crime statistics neighborhoods"
    }
  ]
}
```

#### Response Schema
```typescript
interface ChatResponse {
  messageId: string;
  role: 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: AppRecommendation[];
  suggestedActions?: SuggestedAction[];
}

interface AppRecommendation {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  relevanceScore: number;        // 0.0 to 1.0
  reasoning: string;
  capabilities: string[];
  thumbnailUrl: string;
  documentationUrl: string;
  templateId?: string;
}

interface SuggestedAction {
  type: 'create-map' | 'search-datasets' | 'configure-app';
  label: string;
  description: string;
  query?: string;
  params?: Record<string, any>;
}
```

#### Error Responses
- **400 Bad Request**: Invalid message format
- **429 Too Many Requests**: Rate limit exceeded
- **503 Service Unavailable**: AI service unavailable

---

## Recommendations API

### GET /api/recommend

Get app recommendations based on a query (alternative to chat interface).

#### Query Parameters
```
q: string (required) - User's problem description
limit: number (optional, default: 3) - Max recommendations to return
category: string (optional) - Filter by app category
```

#### Example Request
```
GET /api/recommend?q=track%20field%20assets%20real-time&limit=3
```

#### Response (200 OK)
```json
{
  "query": "track field assets real-time",
  "recommendations": [
    {
      "id": "field-maps",
      "name": "ArcGIS Field Maps",
      "description": "Mobile app for field workforce to view maps, collect data, and track assets in real-time",
      "category": "field-maps",
      "relevanceScore": 0.98,
      "reasoning": "Ideal for real-time asset tracking with mobile workforce. Supports offline data collection and GPS tracking.",
      "capabilities": [
        "Real-time location tracking",
        "Offline data collection",
        "Asset inspection forms",
        "Route optimization"
      ],
      "thumbnailUrl": "https://cdn.esri.com/thumbnails/field-maps.png",
      "documentationUrl": "https://doc.arcgis.com/en/field-maps/",
      "templateId": "field-maps-basic"
    }
  ],
  "totalResults": 3
}
```

---

## Web Maps API

### POST /api/maps

Create a new web map.

#### Request Body
```json
{
  "title": "Crime Analysis Map",
  "description": "Visualization of crime data by neighborhood",
  "basemap": "streets-vector",
  "initialExtent": {
    "xmin": -118.5,
    "ymin": 33.9,
    "xmax": -118.1,
    "ymax": 34.1,
    "spatialReference": { "wkid": 4326 }
  },
  "layers": [
    {
      "url": "https://services.arcgis.com/.../FeatureServer/0",
      "title": "Crime Incidents",
      "type": "feature"
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "webMapId": "abc123def456",
  "title": "Crime Analysis Map",
  "url": "https://arcgis.com/home/webmap/viewer.html?webmap=abc123def456",
  "thumbnailUrl": "https://cdn.esri.com/thumbnails/abc123def456.png",
  "created": "2025-11-05T12:00:00Z"
}
```

### GET /api/maps/:webMapId

Retrieve web map configuration.

#### Response (200 OK)
```json
{
  "webMapId": "abc123def456",
  "title": "Crime Analysis Map",
  "basemap": "streets-vector",
  "layers": [...],
  "extent": {...},
  "created": "2025-11-05T12:00:00Z",
  "modified": "2025-11-05T12:30:00Z"
}
```

### PATCH /api/maps/:webMapId

Update web map configuration.

#### Request Body
```json
{
  "layers": [
    {
      "url": "https://services.arcgis.com/.../FeatureServer/1",
      "title": "Neighborhood Boundaries",
      "type": "feature"
    }
  ]
}
```

---

## Living Atlas API

### GET /api/living-atlas/search

Search ESRI Living Atlas datasets.

#### Query Parameters
```
q: string (required) - Search query
category: string (optional) - Filter by category
geography: string (optional) - Geographic filter (e.g., "USA", "world")
type: string (optional) - Dataset type (feature-layer, tile-layer, etc.)
limit: number (optional, default: 20)
offset: number (optional, default: 0)
```

#### Example Request
```
GET /api/living-atlas/search?q=crime&category=boundaries&limit=10
```

#### Response (200 OK)
```json
{
  "query": "crime",
  "total": 47,
  "results": [
    {
      "id": "dataset-uuid-1",
      "title": "USA Crime Statistics",
      "description": "Historical crime statistics by county from FBI UCR",
      "url": "https://services.arcgis.com/.../FeatureServer/0",
      "type": "feature-layer",
      "thumbnailUrl": "https://cdn.esri.com/thumbnails/crime-stats.png",
      "categories": ["Demographics", "Public Safety"],
      "tags": ["crime", "statistics", "FBI", "UCR"],
      "extent": {
        "xmin": -180,
        "ymin": -90,
        "xmax": 180,
        "ymax": 90,
        "spatialReference": { "wkid": 4326 }
      },
      "owner": "esri_living_atlas",
      "created": "2023-01-15T00:00:00Z",
      "modified": "2025-10-01T00:00:00Z"
    }
  ]
}
```

### GET /api/living-atlas/categories

Get available Living Atlas categories.

#### Response (200 OK)
```json
{
  "categories": [
    { "id": "boundaries", "name": "Boundaries and Places", "count": 124 },
    { "id": "demographics", "name": "Demographics", "count": 89 },
    { "id": "environment", "name": "Environment", "count": 156 },
    { "id": "infrastructure", "name": "Infrastructure", "count": 78 },
    { "id": "transportation", "name": "Transportation", "count": 45 }
  ]
}
```

### GET /api/living-atlas/datasets/:datasetId

Get detailed information about a specific dataset.

#### Response (200 OK)
```json
{
  "id": "dataset-uuid-1",
  "title": "USA Crime Statistics",
  "description": "Detailed description...",
  "url": "https://services.arcgis.com/.../FeatureServer/0",
  "type": "feature-layer",
  "geometryType": "esriGeometryPolygon",
  "fields": [
    { "name": "OBJECTID", "type": "esriFieldTypeOID" },
    { "name": "County", "type": "esriFieldTypeString" },
    { "name": "CrimeRate", "type": "esriFieldTypeDouble" }
  ],
  "extent": {...},
  "spatialReference": { "wkid": 4326 },
  "capabilities": "Query,Data",
  "maxRecordCount": 2000
}
```

---

## App Configuration API

### POST /api/apps/configure

Configure and generate app URL.

#### Request Body
```json
{
  "appType": "instant-apps",
  "templateId": "instant-apps-basic-viewer",
  "config": {
    "title": "Crime Viewer",
    "webMapId": "abc123def456",
    "theme": "light",
    "tools": ["search", "filter", "legend"],
    "sharing": true
  }
}
```

#### Response (200 OK)
```json
{
  "appId": "app-uuid",
  "appUrl": "https://arcgis.com/apps/instant/basic/index.html?appid=app-uuid",
  "previewUrl": "https://arcgis.com/apps/instant/basic/index.html?appid=app-uuid&preview=true",
  "embedUrl": "https://arcgis.com/apps/instant/basic/index.html?appid=app-uuid&embed=true",
  "created": "2025-11-05T12:00:00Z"
}
```

### GET /api/apps/templates

Get available app templates.

#### Query Parameters
```
category: string (optional) - Filter by app category
```

#### Response (200 OK)
```json
{
  "templates": [
    {
      "id": "instant-apps-basic-viewer",
      "name": "Basic Map Viewer",
      "category": "instant-apps",
      "description": "Simple map viewer with essential tools",
      "thumbnailUrl": "https://cdn.esri.com/templates/basic-viewer.png",
      "configOptions": [
        { "name": "tools", "type": "array", "default": ["search", "legend"] },
        { "name": "theme", "type": "string", "default": "light" }
      ]
    }
  ]
}
```

---

## Health Check API

### GET /api/health

Check API health status.

#### Response (200 OK)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-05T12:00:00Z",
  "services": {
    "openai": "healthy",
    "esri": "healthy",
    "database": "not-applicable"
  }
}
```

---

## Rate Limiting

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/chat | 30 requests | per minute per IP |
| /api/recommend | 60 requests | per minute per IP |
| /api/maps/* | 60 requests | per minute per IP |
| /api/living-atlas/* | 60 requests | per minute per IP |
| /api/apps/* | 30 requests | per minute per IP |

### Rate Limit Headers
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1699200060
```

### Rate Limit Exceeded Response (429)
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "retryAfter": 30,
    "timestamp": "2025-11-05T12:00:00Z"
  }
}
```

---

## Webhooks (Future)

### POST /api/webhooks/subscribe

Subscribe to events (future feature).

#### Request Body
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["app.created", "map.updated"],
  "secret": "webhook-secret"
}
```

---

## TypeScript SDK (Future)

Example usage of future TypeScript SDK:

```typescript
import { ESRIAssistantClient } from '@esri-assistant/sdk';

const client = new ESRIAssistantClient({
  apiKey: 'your-api-key', // Future feature
  baseUrl: 'https://api.esri-assistant.azure.com'
});

// Chat
const response = await client.chat.send({
  message: 'I need to track assets',
  sessionId: 'session-123'
});

// Search Living Atlas
const datasets = await client.livingAtlas.search({
  query: 'crime',
  limit: 10
});

// Create web map
const map = await client.maps.create({
  title: 'My Map',
  basemap: 'streets-vector'
});
```

---

## Versioning

API versioning strategy:
- Version in URL path: `/api/v1/`, `/api/v2/`
- Current version (1.0) has no version prefix (default)
- Breaking changes will introduce new version
- Old versions supported for 12 months after deprecation notice

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025  
**Next Review**: December 2025
