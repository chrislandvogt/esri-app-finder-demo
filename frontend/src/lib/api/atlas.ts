import { apiClient } from './client';
import { DatasetSearchParams, DatasetSearchResponse, Dataset } from '../../types';

export const atlasService = {
  async search(params: DatasetSearchParams): Promise<DatasetSearchResponse> {
    const response = await apiClient.get<DatasetSearchResponse>('/living-atlas/search', params);
    return response.data;
  },

  async getDataset(datasetId: string): Promise<Dataset> {
    const response = await apiClient.get<Dataset>(`/living-atlas/datasets/${datasetId}`);
    return response.data;
  },

  async getCategories(): Promise<{ categories: Array<{ id: string; name: string; count: number }> }> {
    const response = await apiClient.get('/living-atlas/categories');
    return response.data;
  },
};
