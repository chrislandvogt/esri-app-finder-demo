import { InteractiveMap } from './InteractiveMap';
import { useAppStore } from '../../lib/store/appStore';

export function MapContainer() {
  const selectedDatasets = useAppStore((state) => state.selectedDatasets);
  const datasetIds = selectedDatasets.map((ds) => ds.id);

  return (
    <div className="relative w-full h-full">
      <InteractiveMap datasetIds={datasetIds} />
    </div>
  );
}
