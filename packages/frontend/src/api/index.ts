import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const cmeApi = {
  getCredits: () => api.get('/cme/credits'),
  addCredit: (data: CreateCreditDto) => api.post('/cme/credits', data),
  // ... other endpoints
}; 