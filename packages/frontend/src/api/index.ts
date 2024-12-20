import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Add any global axios interceptors or configurations here if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error cases here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export const cmeApi = {
  getCredits: () => api.get('/cme/credits'),
  addCredit: (data: CreateCreditDto) => api.post('/cme/credits', data),
  // ... other endpoints
};

export default api; 