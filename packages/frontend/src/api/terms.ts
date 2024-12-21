import { api } from './api';

export const termsApi = {
  acceptTerms: () => api.post('/terms/accept'),
  getTermsStatus: () => api.get('/terms/status'),
}; 