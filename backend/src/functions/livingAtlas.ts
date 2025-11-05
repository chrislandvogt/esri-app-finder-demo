import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function livingAtlasSearchHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Living Atlas search request for url "${request.url}"`);

    try {
        const query = request.query.get('q') || '';
        const category = request.query.get('category');
        const limit = parseInt(request.query.get('limit') || '20');

        if (!query || query.length < 3) {
            return {
                status: 400,
                jsonBody: {
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Query must be at least 3 characters',
                        timestamp: new Date().toISOString()
                    }
                }
            };
        }

        // TODO: Integrate with ESRI Living Atlas API
        // For now, return mock response
        const mockResults = {
            query,
            total: 2,
            results: [
                {
                    id: 'dataset-1',
                    title: `${query} Dataset Example`,
                    description: 'This is a mock dataset result. ESRI Living Atlas integration will be implemented next.',
                    url: 'https://services.arcgis.com/example/FeatureServer/0',
                    type: 'feature-layer',
                    thumbnailUrl: 'https://www.esri.com/content/dam/esrisites/en-us/common/icons/product-logos/ArcGIS-Living-Atlas.png',
                    categories: ['Demographics'],
                    tags: [query, 'example'],
                    extent: {
                        xmin: -180,
                        ymin: -90,
                        xmax: 180,
                        ymax: 90,
                        spatialReference: { wkid: 4326 }
                    },
                    owner: 'esri_living_atlas',
                    created: new Date('2023-01-01').toISOString(),
                    modified: new Date('2025-01-01').toISOString()
                }
            ]
        };

        return {
            status: 200,
            jsonBody: mockResults,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        context.error('Error processing Living Atlas search:', error);
        return {
            status: 500,
            jsonBody: {
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An error occurred processing your search',
                    timestamp: new Date().toISOString()
                }
            }
        };
    }
}

app.http('livingAtlasSearch', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'living-atlas/search',
    handler: livingAtlasSearchHandler
});
