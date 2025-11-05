import { apiClient } from './api';
import { ChatRequest, ChatResponse } from '../types';

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/chat', request);
    return response.data;
  },
};
