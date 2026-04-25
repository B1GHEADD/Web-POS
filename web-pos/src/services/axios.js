import axios from 'axios';
import router from '../router';

// Buat instance axios dengan base URL backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Sesuaikan jika port backend berbeda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk MENYISIPKAN Token JWT sebelum request dikirim
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk MENANGANI Error dari Backend (misal: Token Expired / 401)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token tidak valid / kadaluarsa, hapus data lokal dan tendang ke login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect ke halaman login jika belum di sana
      if (router.currentRoute.value.path !== '/') {
        router.push('/');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
