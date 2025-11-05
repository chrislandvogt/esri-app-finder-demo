import type { ESRIApp, LivingAtlasDataset } from '../types';

export const mockApps: ESRIApp[] = [
  {
    id: 'instant-apps-map-viewer',
    name: 'Instant Apps - Map Viewer',
    description: 'Create interactive web maps with a simple, configurable interface. Perfect for sharing geographic data with stakeholders.',
    category: 'viewer',
    thumbnailUrl: 'https://placehold.co/256x256/0079c1/white?text=Map+Viewer',
    configUrl: 'https://www.arcgis.com/apps/instant/basic/index.html',
    features: ['Interactive map viewing', 'Pop-ups', 'Legend', 'Search', 'Print'],
    useCases: ['Data exploration', 'Public information sharing', 'Simple dashboards'],
    complexity: 'beginner',
  },
  {
    id: 'story-maps',
    name: 'ArcGIS StoryMaps',
    description: 'Combine authoritative maps with narrative text, images, and multimedia content to tell compelling stories.',
    category: 'storytelling',
    thumbnailUrl: 'https://placehold.co/256x256/6e1e78/white?text=StoryMaps',
    configUrl: 'https://storymaps.arcgis.com/stories/new',
    features: ['Rich multimedia', 'Immersive layouts', 'Map tours', 'Swipe comparison'],
    useCases: ['Educational content', 'Project presentations', 'Community engagement'],
    complexity: 'intermediate',
  },
];

export const mockDatasets: LivingAtlasDataset[] = [
  {
    id: 'world-imagery',
    title: 'World Imagery',
    description: 'High-resolution satellite and aerial imagery from around the world. Provides context for mapping applications.',
    owner: 'Esri',
    type: 'Image Service',
    tags: ['imagery', 'basemap', 'satellite', 'aerial'],
    thumbnailUrl: 'https://placehold.co/200x200/4c9141/white?text=World+Imagery',
    itemUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    created: new Date('2020-01-15'),
    modified: new Date('2024-11-01'),
    extent: {
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
    },
  },
  {
    id: 'usa-census-tract-boundaries',
    title: 'USA Census Tract Boundaries',
    description: 'Census tract boundaries for the United States. Includes demographic data and statistical information.',
    owner: 'Esri Demographics',
    type: 'Feature Service',
    tags: ['census', 'demographics', 'boundaries', 'usa'],
    thumbnailUrl: 'https://placehold.co/200x200/d95f02/white?text=Census+Tracts',
    itemUrl: 'https://www.arcgis.com/home/item.html?id=8d2647eb6e334ef4b4f74010dc2c18c0',
    created: new Date('2021-06-10'),
    modified: new Date('2024-10-15'),
    extent: {
      xmin: -179.14734,
      ymin: 18.91619,
      xmax: -66.96466,
      ymax: 71.35776,
    },
  },
  {
    id: 'world-countries',
    title: 'World Countries',
    description: 'Generalized boundaries of world countries with population and economic data.',
    owner: 'Esri',
    type: 'Feature Service',
    tags: ['countries', 'world', 'boundaries', 'reference'],
    thumbnailUrl: 'https://placehold.co/200x200/7570b3/white?text=World+Countries',
    itemUrl: 'https://www.arcgis.com/home/item.html?id=ac80670eb213440ea5899bbf92a04998',
    created: new Date('2019-03-20'),
    modified: new Date('2024-09-12'),
    extent: {
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
    },
  },
];

export const mockChatResponses = [
  {
    query: 'visualize population',
    response: "I'd recommend using **Instant Apps - Map Viewer** for visualizing population data. This app is perfect for creating interactive maps that display demographic information.\n\nI've also found some relevant datasets from Living Atlas:\n- USA Census Tract Boundaries (includes demographic data)\n- World Countries (includes population data)\n\nWould you like me to help you configure this app with one of these datasets?",
    recommendedApps: ['instant-apps-map-viewer'],
    suggestedDatasets: ['usa-census-tract-boundaries', 'world-countries'],
  },
  {
    query: 'tell a story',
    response: "For storytelling, I recommend **ArcGIS StoryMaps**! It allows you to combine maps with narrative text, images, and multimedia content.\n\nYou can use datasets like:\n- World Imagery (for beautiful basemaps)\n- World Countries (for geographic context)\n\nStoryMaps is great for educational content, project presentations, and community engagement.",
    recommendedApps: ['story-maps'],
    suggestedDatasets: ['world-imagery', 'world-countries'],
  },
];
