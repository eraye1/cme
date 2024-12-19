import { api } from './index';
import type { Document } from '../types/documents';

export const documentsApi = {
  upload: async (userId: string, formData: FormData) => {
    const { data } = await api.post<Document>(`/documents/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getByUser: async (userId: string) => {
    const { data } = await api.get<Document[]>(`/documents/${userId}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<void>(`/documents/${id}`);
    return data;
  },

  update: async (data: { id: string } & Partial<Document>) => {
    const { data: response } = await api.put<Document>(`/documents/${data.id}`, data);
    return response;
  },
}; 