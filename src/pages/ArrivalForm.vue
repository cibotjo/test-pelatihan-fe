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
import axios from "axios";

export default {
  name: "ArrivalForm",
  data() {
    return {
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
      this.form[field] = URL.createObjectURL(event.target.files[0]);
    },
    async submitForm() {
      try {
        const res = await axios.post("http://localhost:3000/api/arrival", this.form);
        console.log("Response:", res.data);
        alert("Data berhasil dikirim");
      } catch (err) {
        alert("Error: " + (err.response?.data || err.message));
      }
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
