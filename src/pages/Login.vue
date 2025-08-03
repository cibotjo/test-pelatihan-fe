<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920244.png"
              alt="Logo Imigrasi"
              class="w-16 h-16"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Login Petugas Imigrasi</h1>
        <p class="text-gray-500 mt-2">
          Masuk ke dashboard internal untuk verifikasi data kedatangan
        </p>
      </div>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
              id="email"
              type="text"
              v-model="username"
              class="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan email"
          />
          <div v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</div>
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
              id="password"
              type="password"
              v-model="password"
              class="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Masukkan password"
          />
          <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <div v-if="error" class="mt-4 text-red-500 text-sm">
        {{ error }}
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        © 2025 Sistem Imigrasi Kedatangan
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: null,
      errors: {
        username: "",
        password: ""
      },
      isSubmitting: false
    };
  },
  methods: {
    validateInput() {
      // Reset errors
      this.errors = {
        username: "",
        password: ""
      };
      
      let isValid = true;
      
      // Validasi username/email
      if (!this.username) {
        this.errors.username = "Email tidak boleh kosong";
        isValid = false;
      } else if (this.username.length > 100) {
        this.errors.username = "Email terlalu panjang";
        isValid = false;
      } else if (!/^[\w.@-]+$/.test(this.username)) {
        // Hanya izinkan karakter alfanumerik, titik, @, dan tanda hubung
        this.errors.username = "Email mengandung karakter yang tidak diizinkan";
        isValid = false;
      }
      
      // Validasi password
      if (!this.password) {
        this.errors.password = "Password tidak boleh kosong";
        isValid = false;
      } else if (this.password.length > 100) {
        this.errors.password = "Password terlalu panjang";
        isValid = false;
      }
      
      return isValid;
    },
    
    sanitizeInput(input) {
      // Sanitasi input untuk mencegah XSS dan SQL injection
      if (!input) return "";
      
      // Hapus karakter yang berpotensi berbahaya
      return input
        .replace(/[\\\"']/g, "") // Hapus backslash dan tanda kutip
        .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Hapus karakter kontrol
        .trim(); // Hapus spasi di awal dan akhir
    },
    
    async login() {
      // Validasi input
      if (!this.validateInput()) {
        return;
      }
      
      this.isSubmitting = true;
      this.error = null;
      
      try {
        // Sanitasi input sebelum dikirim ke server
        const sanitizedUsername = this.sanitizeInput(this.username);
        const sanitizedPassword = this.sanitizeInput(this.password);
        
        const res = await api.post("/login", {
          email: sanitizedUsername,
          password: sanitizedPassword,
        }, { withCredentials: true }); // Tambahan withCredentials: true

        if (res.data && res.data.success) {
          // Tidak perlu menyimpan token di localStorage
          // Token sudah disimpan sebagai httpOnly cookie oleh server
          
          // Tambahkan kode untuk menyimpan status login
          localStorage.setItem('isLoggedIn', 'true');
          
          this.$router.push("/dashboard");
        } else {
          this.error = "Format respons tidak valid";
        }
      } catch (err) {
        // Tampilkan pesan error yang aman
        this.error = "Login gagal. Silakan periksa kembali email dan password Anda.";
        console.error("Login error:", err);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style>
body {
  font-family: "Lato", sans-serif;
}

.bg-gradient {
  background: linear-gradient(135deg, #007bff 0%, #00a6ff 100%);
}
</style>
