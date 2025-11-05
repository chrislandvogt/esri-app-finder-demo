import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    require: any;
  }
}

interface InteractiveMapProps {
  datasetIds?: string[];
}

export function InteractiveMap({ datasetIds = [] }: InteractiveMapProps) {
  const mapDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    // Load ArcGIS modules
    window.require([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/layers/TileLayer',
    ], (
      Map: any,
      MapView: any,
      FeatureLayer: any,
      TileLayer: any
    ) => {
      // Create the map
      const map = new Map({
        basemap: 'streets-navigation-vector',
      });

      // Create the map view
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 4,
      });

      // Add sample layers based on selected datasets
      if (datasetIds.includes('world-imagery')) {
        const imageryLayer = new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
          title: 'World Imagery',
        });
        map.add(imageryLayer);
      }

      if (datasetIds.includes('usa-census-tract-boundaries')) {
        const censusTractLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_Tract_Areas_analysis_trim/FeatureServer/0',
          title: 'USA Census Tracts',
          opacity: 0.7,
        });
        map.add(censusTractLayer);
      }

      if (datasetIds.includes('world-countries')) {
        const countriesLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0',
          title: 'World Countries',
          opacity: 0.6,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [51, 51, 204, 0.3],
              outline: {
                color: [0, 0, 0, 0.5],
                width: 1,
              },
            },
          },
        });
        map.add(countriesLayer);
      }

      // Add a default demographics layer if no datasets are selected
      if (datasetIds.length === 0) {
        const demoLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer/0',
          title: 'USA States',
          opacity: 0.5,
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 121, 193, 0.2],
              outline: {
                color: [0, 121, 193, 1],
                width: 2,
              },
            },
          },
        });
        map.add(demoLayer);
      }

      // Add popup on click
      view.on('click', (event: any) => {
        view.hitTest(event).then((response: any) => {
          if (response.results.length) {
            const graphic = response.results[0].graphic;
            view.popup.open({
              title: graphic.attributes.NAME || 'Feature',
              content: `Click on features to see their attributes.<br>Selected datasets: ${datasetIds.length}`,
              location: event.mapPoint,
            });
          }
        });
      });

      // Cleanup
      return () => {
        if (view) {
          view.destroy();
        }
      };
    });
  }, [datasetIds]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapDiv}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
        <div className="font-semibold text-gray-900">Interactive Map</div>
        <div className="text-xs text-gray-600 mt-1">
          {datasetIds.length > 0
            ? `${datasetIds.length} dataset(s) loaded`
            : 'Default view - Select datasets from the Data tab'}
        </div>
      </div>
    </div>
  );
}
