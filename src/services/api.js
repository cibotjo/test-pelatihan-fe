import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Menambahkan withCredentials untuk mengirim cookie dengan setiap request
});

// Tidak perlu menambahkan token ke header karena kita menggunakan httpOnly cookie
api.interceptors.request.use(config => {
  return config;
});

// Interceptor untuk menangani error response
api.interceptors.response.use(
  response => response,
  error => {
    // Tangani error berdasarkan status code
    if (error.response) {
      // Server merespons dengan status error
      console.error('Error response:', error.response.status, error.response.data);
      
      // Tambahkan penanganan khusus untuk error 500 pada endpoint arrivals
      if (error.response.status === 500 && error.config.url.includes('/arrivals')) {
        console.error('Kemungkinan masalah pada server: direktori uploads tidak ada atau tidak dapat diakses');
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error('No response received:', error.request);
    } else {
      // Error lainnya
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;