<template>
  <aside
    class="w-64 bg-[#4a2f1d] text-white flex flex-col h-screen transition-all duration-300 shadow-2xl z-20 flex-shrink-0"
  >
    <div class="p-6 border-b border-[#5c3a21] flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-[#fdf5e6] flex items-center justify-center text-[#8b5a33] font-bold shadow-inner"
      >
        ☕
      </div>
      <div>
        <h1 class="text-xl font-extrabold tracking-wide text-white">
          Kupi <span class="text-[#c28147]">Kita</span>
        </h1>
      </div>
    </div>

    <div class="px-6 py-4 bg-[#3e2511] text-xs">
      <p class="text-gray-400 mb-0.5">Login sebagai:</p>
      <p class="font-bold text-[#e5b976] uppercase">
        {{ userName }}
        <span class="text-gray-400 text-[10px]">({{ userRole }})</span>
      </p>
    </div>

    <nav
      class="flex-1 overflow-y-auto py-4 space-y-1.5 px-3 scrollbar-thin scrollbar-thumb-[#5c3a21]"
    >
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-200 hover:text-white"
        active-class="bg-gradient-to-r from-[#c28147] to-[#8b5a33] text-white font-bold shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Dashboard
      </router-link>

      <router-link
        v-if="userRole === 'admin' || userRole === 'rider'"
        to="/rider"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-200 hover:text-white"
        active-class="bg-gradient-to-r from-[#c28147] to-[#8b5a33] text-white font-bold shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Rider POS
      </router-link>

      <router-link
        v-if="userRole === 'admin' || userRole === 'produksi'"
        to="/produksi"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-200 hover:text-white"
        active-class="bg-gradient-to-r from-[#c28147] to-[#8b5a33] text-white font-bold shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Produksi
      </router-link>

      <div
        class="px-4 py-2 mt-4 text-[10px] font-bold text-[#e5b976] opacity-70 uppercase tracking-widest"
      >
        Laporan
      </div>

      <router-link
        v-if="userRole === 'admin' || userRole === 'rider'"
        to="/laporan-penjualan"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-300 hover:text-white text-sm"
        active-class="bg-[#5c3a21] text-white font-bold border-l-4 border-[#c28147]"
      >
        Penjualan Rider
      </router-link>

      <router-link
        v-if="userRole === 'admin' || userRole === 'produksi'"
        to="/laporan-produksi"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-300 hover:text-white text-sm"
        active-class="bg-[#5c3a21] text-white font-bold border-l-4 border-[#c28147]"
      >
        Stok & Produksi
      </router-link>

      <router-link
        v-if="userRole === 'admin'"
        to="/laporan-keuangan"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-[#5c3a21] text-gray-300 hover:text-white text-sm"
        active-class="bg-[#5c3a21] text-white font-bold border-l-4 border-[#c28147]"
      >
        Keuangan (Pusat)
      </router-link>
    </nav>

    <div class="p-4 border-t border-[#5c3a21]">
      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-2 bg-red-900 bg-opacity-40 hover:bg-red-700 text-red-200 hover:text-white py-3 px-4 rounded-xl transition-colors text-sm font-bold border border-red-900/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Keluar Sistem
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Import SweetAlert2

const router = useRouter();

// Variabel untuk menyimpan info siapa yang sedang login
const userRole = ref("");
const userName = ref("");

// Saat Sidebar dimunculkan, ambil data dari tiket (localStorage)
onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    userRole.value = user.role; // contoh: 'admin', 'rider', 'produksi'
    userName.value = user.nama_lengkap; // contoh: 'Rico', 'Super Admin'
  }
});

// Fungsi Logout: Menggunakan SweetAlert2 untuk konfirmasi elegan
const logout = async () => {
  const result = await Swal.fire({
    title: "Keluar Sistem?",
    text: "Apakah Anda yakin ingin keluar dari aplikasi?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8b5a33", // Warna coklat Kupi Kita
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Keluar!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("user");
    router.push("/");
  }
};
</script>
