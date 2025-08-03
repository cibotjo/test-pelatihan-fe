<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Detail Kedatangan</h1>
      <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center">
        <span class="material-icons mr-1">arrow_back</span> Kembali
      </button>
    </div>

    <div v-if="error" class="text-red-600 mb-4">
      <pre>{{ error }}</pre>
    </div>

    <div v-if="arrival" class="space-y-2 border p-4 rounded">
      <div v-html="arrivalHtml"></div>

      <div v-if="arrival.status !== 'approved' && arrival.status !== 'rejected'" class="mt-4">
        <div v-if="isAdmin" class="flex space-x-4">
          <button class="flex-1 bg-green-600 text-white py-2 rounded" @click="approveArrival">Approve</button>
          <button class="flex-1 bg-red-600 text-white py-2 rounded" @click="rejectArrival">Reject</button>
        </div>
        <div v-else class="bg-gray-100 p-4 rounded text-center text-gray-600">
          Anda login sebagai staff. Hanya admin yang dapat melakukan approval atau rejection.
        </div>
      </div>
      <div v-else class="mt-4 bg-gray-100 p-4 rounded text-center text-gray-600">
        Kedatangan ini sudah {{ arrival.status === 'approved' ? 'disetujui' : 'ditolak' }} dan tidak dapat diubah.
      </div>
    </div>

    <div v-else-if="loading">Memuat data...</div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "ArrivalDetail",
  data() {
    return {
      arrival: null,
      arrivalHtml: "",
      loading: false,
      error: null,
      isAdmin: false, //cek admin
      userRole: null, 
      userName: null,
    };
  },
  mounted() {
    this.fetchArrival();
    this.checkUserRole(); //cek role
  },
  methods: {
    async fetchArrival() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/arrivals/${id}`);
        console.log("Arrival Detail:", res.data);

        this.arrival = res.data.data;
        this.arrivalHtml = `
          <p><b>Nama:</b> ${this.arrival.full_name}</p>
          <p><b>Paspor:</b> ${this.arrival.passport_no}</p>
          <p><b>Kebangsaan:</b> ${this.arrival.nationality}</p>
          <p><b>Tanggal Kedatangan:</b> ${this.arrival.arrival_datetime}</p>
          <p><b>Alamat Tinggal:</b> ${this.arrival.address_in_indonesia}</p>
        `;
      } catch (err) {
        this.error = err.response ? err.response.data : err.message;
      } finally {
        this.loading = false;
      }
    },
    async approveArrival() {
      try {
        const res = await api.post(
            `/arrivals/${this.arrival.id}/approve`,
            {}
        );
        console.log("Approve response:", res.data);
        // Tampilkan pesan sukses
        this.error = null;
        alert("Kedatangan berhasil disetujui!");
        // Redirect ke halaman dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        console.log(err);
        this.arrival = null; // Clear arrival data on error
        
        // Tampilkan pesan yang lebih informatif untuk error 403
        if (err.response?.status === 403) {
          const data = err.response.data;
          this.error = data.message || 'Anda tidak memiliki hak akses untuk melakukan approval.';
          
          // Tambahkan informasi tambahan jika tersedia
          if (data.userName && data.userRole) {
            this.error += `\nAnda login sebagai ${data.userName} dengan peran ${data.userRole}.`;
          }
        } else {
          this.error = err.response?.data?.message || err.message;
        }
      }
    },
    async rejectArrival() { //cek role
      try {
        const res = await api.post(
            `/arrivals/${this.arrival.id}/reject`,
            {}
        );
        console.log("Reject response:", res.data);
        // Tampilkan pesan sukses
        this.error = null;
        alert("Kedatangan berhasil ditolak!");
        // Redirect ke halaman dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        console.log(err);
        this.arrival = null; // Clear arrival data on error
        
        // Tampilkan pesan yang lebih informatif untuk error 403
        if (err.response?.status === 403) {
          const data = err.response.data;
          this.error = data.message || 'Anda tidak memiliki hak akses untuk melakukan rejection.';
          
          // Tambahkan informasi tambahan jika tersedia
          if (data.userName && data.userRole) {
            this.error += `\nAnda login sebagai ${data.userName} dengan peran ${data.userRole}.`;
          }
        } else {
          this.error = err.response?.data?.message || err.message;
        }
      }
    },
    
    async checkUserRole() {
      try {
        // Coba melakukan operasi yang memerlukan hak admin
        // Kita akan menggunakan ID yang tidak ada untuk menghindari perubahan data
        await api.post('/arrivals/999999/approve', {});
        // Jika berhasil, berarti pengguna adalah admin
        this.isAdmin = true;
        this.userRole = 'admin';
      } catch (err) {
        if (err.response?.status === 403) {
          // Jika mendapat error 403, berarti pengguna bukan admin
          this.isAdmin = false;
          
          // Ambil informasi pengguna dari respons error
          const data = err.response.data;
          if (data.userRole) {
            this.userRole = data.userRole;
          }
          if (data.userName) {
            this.userName = data.userName;
          }
        } else if (err.response?.status === 404) {
          // Jika mendapat error 404, berarti endpoint valid tapi ID tidak ditemukan
          // Ini menunjukkan pengguna adalah admin
          this.isAdmin = true;
          this.userRole = 'admin';
        }
        // Jangan tampilkan error untuk operasi ini
        console.log('User role check completed');
      }
    },
    
    goBack() {
      this.$router.push('/dashboard');
    },
  },
};
</script>
