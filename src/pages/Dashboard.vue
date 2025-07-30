<template>
  <div class="bg-gray-100 min-h-screen flex">
    <aside class="w-64 bg-blue-700 text-white hidden md:block">
      <div class="p-6 font-bold text-xl border-b border-blue-600">Imigrasi</div>
      <nav class="p-4 space-y-2 bg-blue-700">
        <router-link to="/dashboard" class="flex items-center p-2 rounded hover:bg-blue-600">
          <span class="material-icons mr-2">dashboard</span> Dashboard
        </router-link>
        <router-link to="/form" class="flex items-center p-2 rounded hover:bg-blue-600">
          <span class="material-icons mr-2">list_alt</span> Kedatangan
        </router-link>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col">
      <header class="bg-blue-700 text-white shadow p-4 flex justify-between items-center relative">
        <h1 class="text-xl font-bold">Dashboard Petugas Imigrasi</h1>
        <div class="relative">
          <button @click="toggleMenu" class="flex items-center focus:outline-none">
            <img src="https://i.pravatar.cc/40" alt="Avatar"
                 class="w-10 h-10 rounded-full border-2 border-white"/>
            <span class="material-icons ml-2">expand_more</span>
          </button>
          <div v-show="menuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-20">
            <router-link to="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</router-link>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div class="bg-white rounded shadow p-4 flex items-center">
          <span class="material-icons text-blue-600 text-4xl mr-4">flight_land</span>
          <div>
            <p class="text-gray-500">Total Kedatangan Hari Ini</p>
            <p class="text-2xl font-bold">{{ arrivals.length }}</p>
          </div>
        </div>
        <div class="bg-white rounded shadow p-4 flex items-center">
          <span class="material-icons text-green-600 text-4xl mr-4">check_circle</span>
          <div>
            <p class="text-gray-500">Disetujui</p>
            <p class="text-2xl font-bold">{{ approvedCount }}</p>
          </div>
        </div>
        <div class="bg-white rounded shadow p-4 flex items-center">
          <span class="material-icons text-red-600 text-4xl mr-4">cancel</span>
          <div>
            <p class="text-gray-500">Ditolak</p>
            <p class="text-2xl font-bold">{{ rejectedCount }}</p>
          </div>
        </div>
      </div>

      <main class="p-6">
        <div class="bg-white rounded shadow p-4">
          <h2 class="text-lg font-semibold mb-4">Daftar Kedatangan Hari Ini</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
              <tr class="bg-gray-50">
                <th class="p-3 border-b">Nama</th>
                <th class="p-3 border-b">Paspor</th>
                <th class="p-3 border-b">Kebangsaan</th>
                <th class="p-3 border-b">Tanggal Kedatangan</th>
                <th class="p-3 border-b">Status</th>
                <th class="p-3 border-b">Aksi</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="arrival in arrivals" :key="arrival.id" class="hover:bg-gray-50">
                <td class="p-3 border-b" v-html="arrival.full_name"></td>
                <td class="p-3 border-b">{{ arrival.passport_no }}</td>
                <td class="p-3 border-b">{{ arrival.nationality }}</td>
                <td class="p-3 border-b">{{ arrival.arrival_datetime }}</td>
                <td class="p-3 border-b font-semibold"
                    :class="statusColor(arrival.status)">{{ arrival.status }}
                </td>
                <td class="p-3 border-b">
                  <router-link :to="`/arrivals/${arrival.id}`" class="text-blue-600 hover:underline">Detail</router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <h3 class="text-xl font-semibold mb-4">Detail Kedatangan</h3>

        <div class="space-y-2" v-html="selectedArrivalHtml"></div>
        <div class="mt-6 flex space-x-4">
          <button class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded hidden md:block"
                  @click="approveArrival">Approve
          </button>
          <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded hidden md:block"
                  @click="rejectArrival">Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      arrivals: [],
      modalOpen: false,
      selectedArrival: null,
      selectedArrivalHtml: "",
      menuOpen: false
    };
  },
  computed: {
    approvedCount() {
      return this.arrivals.filter(a => a.status === "approved").length;
    },
    rejectedCount() {
      return this.arrivals.filter(a => a.status === "rejected").length;
    }
  },
  mounted() {
    this.fetchArrivals();
  },
  methods: {
    async fetchArrivals() {
      try {
        const res = await axios.get("http://localhost:3000/api/arrivals");
        console.log("Arrivals:", res.data);
        this.arrivals = res.data.data;
      } catch (err) {
        alert("Error: " + (err.response?.data || err.message));
      }
    },
    openModal(arrival) {
      this.selectedArrival = arrival;
      this.selectedArrivalHtml = `
        <p><b>Nama:</b> ${arrival.full_name}</p>
        <p><b>Paspor:</b> ${arrival.passport_no}</p>
        <p><b>Kebangsaan:</b> ${arrival.nationality}</p>
        <p><b>Tanggal Kedatangan:</b> ${arrival.arrival_datetime}</p>
        <p><b>Alamat Tinggal:</b> ${arrival.address_in_indonesia}</p>
      `;
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
    },
    async approveArrival() {
      try {
        const res = await axios.post(
            `http://localhost:3000/api/arrivals/${this.selectedArrival.id}/approve`,
            {},
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
        );
        console.log("Approve response:", res.data);
        await this.fetchArrivals();
      } catch (err) {
        console.log(err);
        alert("Error approving arrival: " + (err.response?.data?.message || err.message));
      }

      this.closeModal();
    },
    async rejectArrival() {
      try {
        const res = await axios.post(
            `http://localhost:3000/api/arrivals/${this.selectedArrival.id}/reject`,
            {},
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
        );
        console.log("Reject response:", res.data);
        await this.fetchArrivals();
      } catch (err) {
        console.log(err);
        alert("Error reject arrival: " + (err.response?.data?.message || err.message));
      }

      this.closeModal();
    },
    statusColor(status) {
      if (status === "approved") return "text-green-600";
      if (status === "rejected") return "text-red-600";
      return "text-yellow-600";
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
};
</script>
