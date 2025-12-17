import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw error;
  }
);

const apiService = {
  checkHealth: () => api.get('/health'),
  
  registerMember: (data: any) => api.post('/members/register', data),
  
  renewMembership: (data: any) => api.post('/members/renew', data),
  
  checkStatus: (params: any) => api.get('/members/status', { params }),
  
  checkPaymentStatus: (checkoutId: string) => 
    api.post('/check-mpesa', { checkout_request_id: checkoutId }),
  
  getActiveMembers: () => api.get('/members/active'),
  
  getSystemStats: () => api.get('/admin/stats'),
  
  testAxtrax: () => api.get('/test-axtrax'),
  
  debugRegistration: (data: any) => api.post('/debug-registration', data)
};

export default apiService;