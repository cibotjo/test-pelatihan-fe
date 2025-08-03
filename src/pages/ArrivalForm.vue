<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="hero-gradient text-white py-16">
      <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between max-w-6xl">
        <div class="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h1 class="text-4xl font-bold mb-4">Pendaftaran Kedatangan Wisatawan Mancanegara</h1>
          <p class="text-lg opacity-90">Isi data sebelum tiba untuk mempercepat proses di bandara</p>
        </div>
        <div class="lg:w-1/2 flex justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/201/201623.png" alt="Turis" class="w-64 h-auto"/>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white rounded-2xl form-shadow p-8">
        <form @submit.prevent="submitForm" class="space-y-10">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span class="material-icons text-blue-600 mr-2">person</span>Informasi Pribadi
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input v-model="form.full_name" autocomplete="on" class="border p-3 rounded-lg w-full"
                     placeholder="Nama Lengkap"/>
              <input v-model="form.passport_no" autocomplete="on" class="border p-3 rounded-lg w-full"
                     placeholder="Nomor Paspor"/>
              <input v-model="form.nationality" class="border p-3 rounded-lg w-full" placeholder="Kebangsaan"/>
              <select v-model="form.gender" class="border p-3 rounded-lg w-full">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <input type="date" v-model="form.birth_date" class="border p-3 rounded-lg w-full"/>
              <input v-model="form.phone_number" class="border p-3 rounded-lg w-full" placeholder="Nomor Telepon"/>
              <input type="email" v-model="form.email" class="border p-3 rounded-lg w-full" placeholder="Email"/>
              <textarea v-model="form.address_in_indonesia" class="border p-3 rounded-lg md:col-span-2 w-full" rows="3"
                        placeholder="Alamat tinggal di Indonesia"></textarea>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span class="material-icons text-blue-600 mr-2">flight_takeoff</span>Informasi Perjalanan
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input v-model="form.flight_info" class="border p-3 rounded-lg w-full"
                     placeholder="Maskapai & Nomor Penerbangan"/>
              <input type="datetime-local" v-model="form.arrival_datetime" class="border p-3 rounded-lg w-full"/>
              <input v-model="form.departure_city" class="border p-3 rounded-lg w-full"
                     placeholder="Kota Asal Keberangkatan"/>
              <input v-model="form.destination_city" class="border p-3 rounded-lg w-full"
                     placeholder="Tujuan di Indonesia"/>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span class="material-icons text-blue-600 mr-2">health_and_safety</span>Kesehatan & Kontak Darurat
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea v-model="form.health_info" class="border p-3 rounded-lg md:col-span-2 w-full" rows="3"
                        placeholder="Riwayat Kesehatan"></textarea>
              <input v-model="form.emergency_contact_name" class="border p-3 rounded-lg w-full"
                     placeholder="Nama Kontak Darurat"/>
              <input v-model="form.emergency_contact_phone" class="border p-3 rounded-lg w-full"
                     placeholder="Nomor Kontak Darurat"/>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span class="material-icons text-blue-600 mr-2">upload_file</span>Upload Dokumen
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="file" @change="handleFileUpload('face_photo_url', $event)"
                     class="border p-3 rounded-lg w-full"/>
              <input type="file" @change="handleFileUpload('vaccine_card_url', $event)"
                     class="border p-3 rounded-lg w-full"/>
            </div>
          </div>

          <div>
            <button type="submit"
                    class="sticky-submit w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all">
              Kirim Pendaftaran
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "ArrivalForm",
  data() {
    return {
      isSubmitting: false,
      form: {
        full_name: "",
        passport_no: "",
        nationality: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        email: "",
        address_in_indonesia: "",
        flight_info: "",
        arrival_datetime: "",
        departure_city: "",
        destination_city: "",
        health_info: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        face_photo_url: "",
        vaccine_card_url: ""
      }
    };
  },
  methods: {
    handleFileUpload(field, event) {
      const file = event.target.files[0];
      if (file) {
        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          alert('Tipe file tidak diizinkan. Gunakan format JPG, PNG, atau PDF.');
          // Reset input file
          event.target.value = '';
          return;
        }
        
        // Validasi ukuran file (maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file terlalu besar. Maksimal 5MB.');
          // Reset input file
          event.target.value = '';
          return;
        }
        
        this.form[field] = file; // Simpan objek file, bukan URL
      }
    },
    async submitForm() {
      // Cegah multiple submission
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        // Validasi input sebelum mengirim
        const requiredFields = ['full_name', 'passport_no', 'nationality', 'gender', 'birth_date', 'phone_number', 'email'];
        const missingFields = requiredFields.filter(field => !this.form[field]);
        
        if (missingFields.length > 0) {
          alert('Mohon lengkapi data berikut: ' + missingFields.join(', '));
          this.isSubmitting = false;
          return;
        }
        
        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.form.email)) {
          alert('Format email tidak valid');
          this.isSubmitting = false;
          return;
        }
        
        // Validasi format nomor telepon (hanya angka dan +)
        const phoneRegex = /^[+]?[0-9]+$/;
        if (!phoneRegex.test(this.form.phone_number)) {
          alert('Format nomor telepon tidak valid');
          this.isSubmitting = false;
          return;
        }
        
        // Validasi nomor paspor (alfanumerik)
        const passportRegex = /^[A-Z0-9]+$/i;
        if (!passportRegex.test(this.form.passport_no)) {
          alert('Format nomor paspor tidak valid');
          this.isSubmitting = false;
          return;
        }
        
        // Persiapkan FormData untuk upload file
        const formData = new FormData();
        
        // Sanitasi dan tambahkan semua field teks ke FormData
        Object.keys(this.form).forEach(key => {
          if (key !== 'face_photo_url' && key !== 'vaccine_card_url') {
            // Sanitasi input untuk mencegah XSS
            let value = this.form[key];
            formData.append(key, value);
          }
        });
        
        // Tambahkan file jika ada
        if (this.form.face_photo_url instanceof File) {
          formData.append('face_photo', this.form.face_photo_url);
        }
        
        if (this.form.vaccine_card_url instanceof File) {
          formData.append('vaccine_card', this.form.vaccine_card_url);
        }
        
        // Tambahkan timestamp untuk mencegah replay attack
        formData.append('timestamp', Date.now());
        
        // Kirim data dengan CSRF token jika tersedia
        const res = await api.post(`/arrivals`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest' // Untuk identifikasi AJAX request
          },
          withCredentials: true // Untuk mengirim cookies (termasuk CSRF token)
        });
        
        console.log("Response:", res.data);
        alert("Data berhasil dikirim");
        
        // Reset form setelah berhasil
        this.resetForm();
      } catch (err) {
        console.error("Error submitting form:", err);
        
        // Tampilkan pesan error yang lebih spesifik berdasarkan jenis error
        let errorMessage = "Terjadi kesalahan saat mengirim data. Silakan coba lagi.";
        
        if (err.response) {
          // Error dari server
          if (err.response.status === 500) {
            errorMessage = "Terjadi kesalahan pada server. Kemungkinan masalah pada direktori uploads. Silakan hubungi administrator.";
          } else if (err.response.status === 413) {
            errorMessage = "Ukuran file terlalu besar. Silakan kompres file Anda atau gunakan file yang lebih kecil.";
          } else if (err.response.status === 400) {
            errorMessage = "Data yang dikirim tidak valid. Silakan periksa kembali formulir Anda.";
          } else if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = "Anda tidak memiliki izin untuk melakukan operasi ini. Silakan login kembali.";
          }
          
          // Jika server mengirimkan pesan error spesifik, gunakan itu
          if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          // Tidak ada respons dari server
          errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.";
        }
        
        alert(errorMessage);
      } finally {
        // Pastikan isSubmitting diatur kembali ke false
        this.isSubmitting = false;
      }
    },

    resetForm() {
      // Reset semua field form
      Object.keys(this.form).forEach(key => {
        this.form[key] = "";
      });
      
      // Reset file input fields
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        input.value = '';
      });
    }
  }
};
</script>

<style>
.hero-gradient {
  background: linear-gradient(135deg, #007bff 0%, #00a6ff 100%);
}

.form-shadow {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.sticky-submit {
  position: static;
}

@media (max-width: 768px) {
  .sticky-submit {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 50;
  }
}
</style>
