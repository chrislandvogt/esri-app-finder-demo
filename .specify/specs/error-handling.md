# Error Handling & Graceful Degradation Specification
**Project:** ESRI App Finder & Builder Assistant  
**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Constitutional Compliance:** Article VII - Graceful Degradation

---

## Overview

This specification addresses **Article VII** of the constitutional framework, ensuring the application remains functional and helpful even when services fail. Every error provides actionable recovery paths, and the UI degrades gracefully while preserving user progress.

**Core Principle:** *Never leave users stuck with a cryptic error. Always provide a path forward.*

---

## Error Taxonomy

### Error Categories

```typescript
enum ErrorCategory {
  // User-Correctable (4xx equivalent)
  VALIDATION = 'VALIDATION',           // Invalid input
  NOT_FOUND = 'NOT_FOUND',            // Resource doesn't exist
  RATE_LIMIT = 'RATE_LIMIT',          // Too many requests
  
  // System-Level (5xx equivalent)
  NETWORK = 'NETWORK',                 // Connection failure
  TIMEOUT = 'TIMEOUT',                 // Operation took too long
  SERVICE_DOWN = 'SERVICE_DOWN',       // Dependency unavailable
  INTERNAL = 'INTERNAL',               // Unexpected error
  
  // Third-Party
  OPENAI_ERROR = 'OPENAI_ERROR',       // Azure OpenAI failure
  ESRI_API_ERROR = 'ESRI_API_ERROR',   // ESRI Living Atlas failure
}
```

### Error Severity

```typescript
enum ErrorSeverity {
  INFO = 'info',           // FYI, no action needed
  WARNING = 'warning',     // Degraded functionality
  ERROR = 'error',         // Feature unavailable
  CRITICAL = 'critical',   // App unusable
}
```

---

## Error Data Model

### Base Error Interface

```typescript
interface AppError {
  // Identity
  id: string;                    // Unique error ID for tracking
  category: ErrorCategory;
  severity: ErrorSeverity;
  
  // User-Facing
  title: string;                 // Short headline (5-10 words)
  message: string;               // Detailed explanation (1-2 sentences)
  suggestions: string[];         // Actionable recovery steps
  
  // Technical
  code: string;                  // Machine-readable code
  timestamp: string;             // ISO 8601
  context?: Record<string, any>; // Contextual data for debugging
  
  // UI Behavior
  dismissable: boolean;          // Can user dismiss?
  retryable: boolean;            // Show retry button?
  autoRetry?: number;            // Auto-retry after N seconds
}
```

### Error Factory

```typescript
// lib/utils/errorFactory.ts

export function createError(
  category: ErrorCategory,
  options: {
    title?: string;
    message?: string;
    suggestions?: string[];
    context?: Record<string, any>;
    dismissable?: boolean;
    retryable?: boolean;
  }
): AppError {
  const defaults = ERROR_DEFAULTS[category];
  
  return {
    id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    category,
    severity: defaults.severity,
    code: defaults.code,
    title: options.title || defaults.title,
    message: options.message || defaults.message,
    suggestions: options.suggestions || defaults.suggestions,
    timestamp: new Date().toISOString(),
    context: options.context,
    dismissable: options.dismissable ?? defaults.dismissable,
    retryable: options.retryable ?? defaults.retryable,
  };
}

const ERROR_DEFAULTS: Record<ErrorCategory, Partial<AppError>> = {
  [ErrorCategory.VALIDATION]: {
    severity: ErrorSeverity.WARNING,
    code: 'VALIDATION_ERROR',
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    suggestions: ['Review the highlighted fields'],
    dismissable: true,
    retryable: false,
  },
  
  [ErrorCategory.NETWORK]: {
    severity: ErrorSeverity.ERROR,
    code: 'NETWORK_ERROR',
    title: 'Connection Issue',
    message: 'Unable to connect to the server.',
    suggestions: [
      'Check your internet connection',
      'Try again in a moment',
      'Use offline features in Data tab',
    ],
    dismissable: true,
    retryable: true,
  },
  
  [ErrorCategory.OPENAI_ERROR]: {
    severity: ErrorSeverity.ERROR,
    code: 'OPENAI_ERROR',
    title: 'AI Assistant Unavailable',
    message: 'The chat assistant is temporarily unavailable.',
    suggestions: [
      'Browse apps manually in the Data tab',
      'Try your question again in a moment',
      'Use the search feature to find datasets',
    ],
    dismissable: true,
    retryable: true,
  },
  
  [ErrorCategory.ESRI_API_ERROR]: {
    severity: ErrorSeverity.WARNING,
    code: 'ESRI_API_ERROR',
    title: 'Living Atlas Search Unavailable',
    message: 'Cannot search Living Atlas right now.',
    suggestions: [
      'Enter a dataset URL directly',
      'Use previously selected datasets',
      'Try searching again in a moment',
    ],
    dismissable: true,
    retryable: true,
  },
  
  [ErrorCategory.TIMEOUT]: {
    severity: ErrorSeverity.WARNING,
    code: 'TIMEOUT',
    title: 'Request Timed Out',
    message: 'The operation took too long and was cancelled.',
    suggestions: [
      'Try again with a simpler query',
      'Check your connection speed',
    ],
    dismissable: true,
    retryable: true,
  },
  
  [ErrorCategory.RATE_LIMIT]: {
    severity: ErrorSeverity.INFO,
    code: 'RATE_LIMIT_EXCEEDED',
    title: 'Too Many Requests',
    message: 'You're sending requests too quickly.',
    suggestions: ['Wait a moment before trying again'],
    dismissable: true,
    retryable: false,
    autoRetry: 30, // Auto-retry after 30 seconds
  },
  
  [ErrorCategory.INTERNAL]: {
    severity: ErrorSeverity.CRITICAL,
    code: 'INTERNAL_ERROR',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    suggestions: [
      'Reload the page',
      'Clear your browser cache',
      'Contact support if problem persists',
    ],
    dismissable: false,
    retryable: true,
  },
};
```

---

## Error Handling Strategies

### 1. API Call Wrapper

Centralized error handling for all API calls:

```typescript
// lib/api/client.ts

import { createError } from '../utils/errorFactory';

export async function apiCall<T>(
  fn: () => Promise<T>,
  options: {
    timeout?: number;
    retries?: number;
    fallback?: T;
  } = {}
): Promise<{ data?: T; error?: AppError }> {
  const { timeout = 10000, retries = 2, fallback } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);

      return { data: result };
    } catch (error) {
      // Last attempt failed
      if (attempt === retries) {
        const appError = mapErrorToAppError(error);
        
        // Return fallback if available
        if (fallback !== undefined) {
          console.warn('API call failed, using fallback:', appError);
          return { data: fallback };
        }
        
        return { error: appError };
      }
      
      // Exponential backoff
      await delay(Math.pow(2, attempt) * 1000);
    }
  }

  // Should never reach here
  return { error: createError(ErrorCategory.INTERNAL, {}) };
}

function mapErrorToAppError(error: unknown): AppError {
  if (error instanceof Error && error.message === 'Timeout') {
    return createError(ErrorCategory.TIMEOUT, {});
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return createError(ErrorCategory.NETWORK, {});
    }

    const status = error.response.status;
    
    if (status === 429) {
      return createError(ErrorCategory.RATE_LIMIT, {});
    }
    
    if (status >= 500) {
      return createError(ErrorCategory.SERVICE_DOWN, {
        context: { status, url: error.config?.url },
      });
    }
    
    if (status === 404) {
      return createError(ErrorCategory.NOT_FOUND, {});
    }
  }

  return createError(ErrorCategory.INTERNAL, {
    context: { originalError: String(error) },
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### 2. React Error Boundary

Component-level error catching:

```typescript
// components/common/ErrorBoundary.tsx

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    const appError = createError(ErrorCategory.INTERNAL, {
      title: 'Component Error',
      message: 'A part of the application failed to load.',
      context: { componentError: error.message },
    });
    
    return { hasError: true, error: appError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Application Insights
    trackException({
      exception: error,
      properties: {
        componentStack: errorInfo.componentStack,
        errorId: this.state.error?.id,
      },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
```

### 3. Hook for Error State

Reusable error management:

```typescript
// hooks/useErrorHandler.ts

export function useErrorHandler() {
  const setGlobalError = useAppStore((state) => state.setError);
  const [localError, setLocalError] = useState<AppError | null>(null);

  const handleError = useCallback((error: unknown, local = false) => {
    const appError = error instanceof Error
      ? mapErrorToAppError(error)
      : createError(ErrorCategory.INTERNAL, {
          context: { unknownError: String(error) },
        });

    if (local) {
      setLocalError(appError);
    } else {
      setGlobalError(appError);
    }

    // Track in telemetry
    trackException({
      exception: error instanceof Error ? error : new Error(String(error)),
      properties: {
        errorId: appError.id,
        category: appError.category,
        severity: appError.severity,
      },
    });
  }, [setGlobalError]);

  const clearError = useCallback(() => {
    setLocalError(null);
    setGlobalError(null);
  }, [setGlobalError]);

  return { error: localError, handleError, clearError };
}
```

---

## UI Error Components

### 1. ErrorBanner (Global)

Top-of-page banner for critical errors:

```typescript
// components/common/ErrorBanner.tsx

interface ErrorBannerProps {
  error: AppError;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  const severityStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    critical: 'bg-red-100 border-red-300 text-red-950',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    critical: '🚨',
  };

  return (
    <div
      className={cn(
        'border-b-2 px-6 py-4',
        severityStyles[error.severity]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {icons[error.severity]}
        </span>

        <div className="flex-1">
          <h3 className="font-semibold mb-1">{error.title}</h3>
          <p className="text-sm mb-2">{error.message}</p>

          {error.suggestions.length > 0 && (
            <div className="text-sm">
              <strong>What you can do:</strong>
              <ul className="list-disc list-inside mt-1">
                {error.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {error.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-white border border-current rounded hover:bg-opacity-90 transition"
            >
              Retry
            </button>
          )}

          {error.dismissable && onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded transition"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 2. ErrorFallback (Component-Level)

Replaces broken component:

```typescript
// components/common/ErrorFallback.tsx

export function ErrorFallback({ error, onRetry }: Props) {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center max-w-md px-6">
        <div className="text-4xl mb-3">😕</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {error.title}
        </h3>
        <p className="text-gray-600 mb-4">{error.message}</p>

        {error.suggestions.length > 0 && (
          <div className="text-sm text-left bg-white border border-gray-200 rounded p-3 mb-4">
            <strong className="block mb-1">Try this:</strong>
            <ul className="list-disc list-inside space-y-1">
              {error.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-esri-blue-600 text-white rounded hover:bg-esri-blue-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
```

### 3. InlineError (Form-Level)

Below input fields:

```typescript
// components/common/InlineError.tsx

export function InlineError({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
      <span aria-hidden="true">⚠️</span>
      <span>{message}</span>
    </p>
  );
}
```

---

## Graceful Degradation Patterns

### Pattern 1: Feature Toggle

Disable broken feature, show alternative:

```typescript
// ChatTab.tsx

export function ChatTab() {
  const [chatAvailable, setChatAvailable] = useState(true);

  const handleChatError = (error: AppError) => {
    if (error.category === ErrorCategory.OPENAI_ERROR) {
      setChatAvailable(false);
      // Show error banner with manual app browsing suggestion
      setError(error);
    }
  };

  if (!chatAvailable) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">
          Chat is temporarily unavailable.
        </p>
        <button
          onClick={() => setSidebarTab('data')}
          className="px-4 py-2 bg-esri-blue-600 text-white rounded"
        >
          Browse Apps Manually
        </button>
      </div>
    );
  }

  // Normal chat UI
}
```

### Pattern 2: Cached Fallback

Use stale data when fresh data unavailable:

```typescript
// api/atlas.ts

const CACHE_KEY = 'livingAtlas_searchResults';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function searchLivingAtlas(
  params: SearchParams
): Promise<SearchResponse> {
  const cacheKey = `${CACHE_KEY}_${JSON.stringify(params)}`;
  const cached = getFromCache<SearchResponse>(cacheKey);

  const { data, error } = await apiCall(
    () => esriApiClient.search(params),
    { 
      timeout: 5000,
      retries: 1,
      fallback: cached?.data, // Use cached data on failure
    }
  );

  if (error && !data) {
    throw error;
  }

  if (data) {
    // Cache successful response
    setCache(cacheKey, data, CACHE_DURATION);

    // If using cached fallback, notify user
    if (error) {
      useAppStore.getState().setError(
        createError(ErrorCategory.ESRI_API_ERROR, {
          severity: ErrorSeverity.INFO,
          message: 'Showing cached results (may be outdated).',
          suggestions: ['Results may not include latest datasets'],
        })
      );
    }

    return data;
  }

  throw error;
}
```

### Pattern 3: Optimistic UI

Update UI immediately, rollback on error:

```typescript
// ChatTab.tsx

const handleSendMessage = async (text: string) => {
  const userMessage = createUserMessage(text);
  const optimisticResponse = createOptimisticResponse();

  // Immediately show messages
  addMessage(userMessage);
  addMessage(optimisticResponse);

  try {
    const response = await sendChatMessage({ message: text });
    
    // Replace optimistic with real response
    updateMessage(optimisticResponse.id, response);
  } catch (error) {
    // Remove optimistic response
    removeMessage(optimisticResponse.id);
    
    // Show error
    handleError(error);
  }
};
```

### Pattern 4: Progressive Enhancement

Core functionality works without advanced features:

```typescript
// InteractiveMap.tsx

export function InteractiveMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Try to load ESRI SDK
    if (!window.require) {
      setMapError(true);
      return;
    }

    loadEsriModules()
      .then(() => setMapLoaded(true))
      .catch(() => setMapError(true));
  }, []);

  if (mapError) {
    // Fallback: Show dataset list without map
    return (
      <div className="p-6">
        <ErrorBanner
          error={createError(ErrorCategory.SERVICE_DOWN, {
            title: 'Map Unavailable',
            message: 'Unable to load map component.',
            suggestions: ['View datasets in list format below'],
          })}
        />
        <DatasetList datasets={selectedDatasets} />
      </div>
    );
  }

  if (!mapLoaded) {
    return <LoadingSpinner />;
  }

  // Full map experience
  return <div ref={mapRef} className="w-full h-full" />;
}
```

---

## Retry Strategies

### Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### User-Triggered Retry

```typescript
// Store retry callback
interface ErrorState {
  error: AppError | null;
  retryFn: (() => void) | null;
}

// Set error with retry
setError({
  error: appError,
  retryFn: () => fetchDataAgain(),
});

// ErrorBanner triggers retry
<ErrorBanner
  error={error}
  onRetry={() => {
    retryFn?.();
    clearError();
  }}
/>
```

---

## Validation & User Input Errors

### Form Validation

```typescript
// lib/validation/schemas.ts

import { z } from 'zod';

export const ChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message too long (max 500 characters)'),
});

export const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(3, 'Search query must be at least 3 characters')
    .max(100, 'Search query too long'),
});

// Validate and get user-friendly errors
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { data?: T; errors?: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return { errors };
}
```

### Real-Time Validation

```typescript
// ChatInput.tsx

export function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (text: string) => {
    setValue(text);

    // Clear error as user types
    if (error) setError(null);

    // Validate length
    if (text.length > 500) {
      setError('Message too long (max 500 characters)');
    }
  };

  const handleSubmit = () => {
    const { data, errors } = validateInput(ChatMessageSchema, { message: value });

    if (errors) {
      setError(errors.message);
      return;
    }

    onSend(data.message);
    setValue('');
  };

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(error && 'border-red-500')}
      />
      {error && <InlineError message={error} />}
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
```

---

## Network State Handling

### Offline Detection

```typescript
// hooks/useOnlineStatus.ts

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Usage in component
export function ChatTab() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div className="p-6 text-center">
        <ErrorBanner
          error={createError(ErrorCategory.NETWORK, {
            title: 'You're Offline',
            message: 'Chat requires an internet connection.',
            suggestions: [
              'Check your network connection',
              'Browse previously loaded data',
            ],
          })}
        />
      </div>
    );
  }

  // Normal UI
}
```

---

## Telemetry & Monitoring

### Track All Errors

```typescript
// lib/telemetry/tracking.ts

export function trackError(error: AppError, context?: object) {
  // Application Insights
  appInsights.trackException({
    exception: new Error(error.message),
    properties: {
      errorId: error.id,
      category: error.category,
      severity: error.severity,
      code: error.code,
      ...error.context,
      ...context,
    },
    severityLevel: mapSeverityLevel(error.severity),
  });

  // Also track as custom event for dashboards
  appInsights.trackEvent({
    name: 'Error',
    properties: {
      errorId: error.id,
      category: error.category,
      code: error.code,
    },
  });
}

function mapSeverityLevel(severity: ErrorSeverity): SeverityLevel {
  switch (severity) {
    case ErrorSeverity.INFO:
      return SeverityLevel.Verbose;
    case ErrorSeverity.WARNING:
      return SeverityLevel.Warning;
    case ErrorSeverity.ERROR:
      return SeverityLevel.Error;
    case ErrorSeverity.CRITICAL:
      return SeverityLevel.Critical;
  }
}
```

### Error Rate Alerts

Configure alerts in Azure Application Insights:
- **Warning:** >5 errors/minute
- **Critical:** >20 errors/minute or any CRITICAL severity error

---

## Testing Error Scenarios

### Unit Tests

```typescript
describe('apiCall wrapper', () => {
  it('retries on network failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network'))
      .mockResolvedValueOnce({ data: 'success' });

    const { data } = await apiCall(fn, { retries: 2 });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ data: 'success' });
  });

  it('returns error after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network'));

    const { error } = await apiCall(fn, { retries: 1 });

    expect(error).toBeDefined();
    expect(error?.category).toBe(ErrorCategory.NETWORK);
  });

  it('uses fallback on failure', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Fail'));
    const fallback = { cached: true };

    const { data } = await apiCall(fn, { fallback });

    expect(data).toEqual(fallback);
  });
});
```

### Integration Tests

```typescript
describe('Chat error handling', () => {
  it('shows error banner when API fails', async () => {
    server.use(
      http.post('/api/chat', () => HttpResponse.error())
    );

    render(<ChatTab />);

    await userEvent.type(screen.getByRole('textbox'), 'Hello');
    await userEvent.click(screen.getByText('Send'));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'AI Assistant Unavailable'
    );
  });

  it('allows retry after error', async () => {
    let callCount = 0;
    server.use(
      http.post('/api/chat', () => {
        callCount++;
        return callCount === 1
          ? HttpResponse.error()
          : HttpResponse.json({ content: 'Success' });
      })
    );

    render(<ChatTab />);

    // First attempt fails
    await userEvent.type(screen.getByRole('textbox'), 'Hello');
    await userEvent.click(screen.getByText('Send'));

    // Click retry
    await userEvent.click(await screen.findByText('Retry'));

    // Second attempt succeeds
    expect(await screen.findByText('Success')).toBeInTheDocument();
  });
});
```

---

## Documentation & User Communication

### Error Messages Checklist

Every error message must:
- ✅ Explain what went wrong (user-friendly language)
- ✅ Why it might have happened
- ✅ What the user can do about it
- ✅ Avoid technical jargon
- ✅ Provide 1-3 actionable suggestions

**Example:**

❌ **Bad:** "HTTP 503 from OpenAI endpoint"  
✅ **Good:** "The chat assistant is temporarily unavailable. Try browsing apps manually in the Data tab, or try your question again in a moment."

### User Education

Include error recovery in help docs:
- "What to do if chat doesn't work"
- "Offline mode: What still works?"
- "Understanding error messages"

---

## Checklist: Constitutional Compliance (Article VII)

- ✅ Every API call wrapped in retry logic
- ✅ Cached fallbacks for external data
- ✅ Error boundaries on all major components
- ✅ User-friendly error messages with suggestions
- ✅ Offline detection and graceful handling
- ✅ No blocking errors (always provide workaround)
- ✅ Telemetry for all errors
- ✅ Manual retry buttons on retryable errors
- ✅ Progressive enhancement (core features work without JS APIs)
- ✅ Validation errors show inline with corrections

---

**Document Status:** Complete  
**Next Steps:** Implement error factory and UI components  
**Owner:** Full Stack Team  
**Priority:** CRITICAL (constitutional violation)
