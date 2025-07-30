<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Detail Kedatangan</h1>

    <div v-if="error" class="text-red-600 mb-4">
      <pre>{{ error }}</pre>
    </div>

    <div v-if="arrival" class="space-y-2 border p-4 rounded">
      <div v-html="arrivalHtml"></div>

      <div class="mt-4 flex space-x-4">
        <button class="flex-1 bg-green-600 text-white py-2 rounded" @click="approveArrival">Approve</button>
        <button class="flex-1 bg-red-600 text-white py-2 rounded" @click="rejectArrival">Reject</button>
      </div>
    </div>

    <div v-else-if="loading">Memuat data...</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ArrivalDetail",
  data() {
    return {
      arrival: null,
      arrivalHtml: "",
      loading: false,
      error: null,
    };
  },
  mounted() {
    this.fetchArrival();
  },
  methods: {
    async fetchArrival() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const res = await axios.get(`http://localhost:3000/api/arrivals/${id}`);
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
        const res = await axios.post(
            `http://localhost:3000/api/arrivals/${this.arrival.id}/approve`,
            {},
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
        );
        console.log("Approve response:", res.data);
      } catch (err) {
        console.log(err);
        this.arrival = null; // Clear arrival data on error
        this.error = err.response?.data?.message || err.message;
      }
    },
    async rejectArrival() {
      try {
        const res = await axios.post(
            `http://localhost:3000/api/arrival/${this.arrival.id}/reject`,
            {},
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
        );
        console.log("Reject response:", res.data);
      } catch (err) {
        console.log(err);
        this.arrival = null; // Clear arrival data on error
        this.error = err.response?.data?.message || err.message;
      }
    },
  },
};
</script>
