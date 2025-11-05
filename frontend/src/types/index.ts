// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    recommendations?: AppRecommendation[];
    suggestedActions?: SuggestedAction[];
  };
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: ChatContext;
}

export interface ChatContext {
  previousRecommendations?: string[];
  currentMapId?: string;
  selectedDatasets?: string[];
}

export interface ChatResponse {
  messageId: string;
  role: 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: AppRecommendation[];
  suggestedActions?: SuggestedAction[];
}

// App Recommendation Types
export interface AppRecommendation {
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

export enum AppCategory {
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
  WORKFORCE = 'workforce',
}

export interface SuggestedAction {
  type: 'create-map' | 'search-datasets' | 'configure-app';
  label: string;
  description: string;
  query?: string;
  params?: Record<string, any>;
}

// Living Atlas Types
export interface Dataset {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'feature-layer' | 'image-layer' | 'tile-layer' | 'vector-tile-layer';
  thumbnailUrl: string;
  categories: string[];
  tags: string[];
  extent: DatasetExtent;
  owner: string;
  created: Date;
  modified: Date;
}

export interface DatasetExtent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference: { wkid: number };
}

export interface DatasetSearchParams {
  query: string;
  category?: string;
  geography?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface DatasetSearchResponse {
  query: string;
  total: number;
  results: Dataset[];
}

// Map Configuration Types
export interface MapConfiguration {
  webMapId?: string;
  basemap: string;
  center: [number, number];
  zoom: number;
  layers: LayerConfig[];
  popups?: PopupConfig[];
}

export interface LayerConfig {
  id: string;
  url: string;
  type: 'feature' | 'tile' | 'vector' | 'image';
  title: string;
  visible: boolean;
  opacity: number;
}

export interface PopupConfig {
  layerId: string;
  title: string;
  content: string;
}

// API Response Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  requestId?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
