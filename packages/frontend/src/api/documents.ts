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
    try {
      const { data } = await api.delete<void>(`/documents/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  update: async (data: { id: string } & Partial<Document>) => {
    const { data: response } = await api.put<Document>(`/documents/${data.id}`, data);
    return response;
  },

  download: async (id: string) => {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      
      // Get filename from Content-Disposition header or use a default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  },
}; 