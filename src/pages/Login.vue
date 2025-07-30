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

      <!-- Form dengan bug: tidak ada validasi & error raw -->
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
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Masuk
        </button>
      </form>

      <!-- Bug: tampilkan error raw -->
      <div v-if="error" class="mt-4 text-red-500 text-sm">
        <pre>{{ error }}</pre>
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        © 2025 Sistem Imigrasi Kedatangan
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password,
        });

        // BUG: simpan token di localStorage (seharusnya HttpOnly cookie)
        localStorage.setItem("token", res.data.token);
        console.log("Token:", res.data.token); // BUG: sensitive log

        this.$router.push("/dashboard");
      } catch (err) {
        // BUG: tampilkan error raw
        this.error = err.response ? err.response.data : err.message;
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
