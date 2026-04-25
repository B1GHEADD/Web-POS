import { defineStore } from 'pinia';
import apiClient from '../services/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state) => state.user?.role || null,
    isSuperAdmin: (state) => 
      state.user?.role === 'admin' && 
      (state.user?.id_cabang === null || state.user?.id_cabang === undefined || state.user?.id_cabang === ''),
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.post('/login', { username, password });
        
        if (response.data.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          
          // Simpan ke local storage agar persisten
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);
          
          return true;
        }
        return false;
      } catch (err) {
        this.error = err.response?.data?.error || 'Gagal terhubung ke server.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
