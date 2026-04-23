<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-7xl mx-auto w-full space-y-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5b976] pb-4 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[#4a2f1d]">
            Laporan Penjualan Rider
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Pantau performa penjualan dan rekap transaksi rider
          </p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div v-if="isSuperAdmin" class="relative flex-1 md:flex-none">
            <select
              v-model="activeCabang"
              class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] shadow-sm font-bold appearance-none cursor-pointer"
            >
              <option :value="null">🌍 Seluruh Cabang</option>
              <option :value="1">🏢 Cabang Sudirman</option>
              <option :value="2">🏢 Cabang Kemang</option>
              <option :value="3">🏢 Cabang Tebet</option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#8b5a33]"
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            @click="refreshData"
            class="bg-white border border-[#e5b976] hover:bg-[#fdf5e6] text-[#8b5a33] px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-[#fffbf7] rounded-2xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 flex flex-col"
        >
          <h2
            class="text-lg font-bold text-[#4a2f1d] mb-4 flex items-center gap-2"
          >
            <span>🏆</span> Top 3 Menu (Bulan Ini)
          </h2>
          <div class="flex flex-col gap-3 flex-1">
            <div
              v-for="(item, index) in topMenu"
              :key="index"
              class="bg-white border border-[#e5b976] rounded-xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#c28147] text-white font-bold flex items-center justify-center text-lg shadow-inner"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <h3
                  class="font-bold text-[#4a2f1d] truncate"
                  :title="item.nama_produk"
                >
                  {{ item.nama_produk }}
                </h3>
                <p class="text-sm text-green-600 font-bold">
                  {{ item.jumlah }}
                  <span class="text-xs text-gray-500 font-normal"
                    >Cup Terjual</span
                  >
                </p>
              </div>
            </div>
            <div
              v-if="topMenu.length === 0"
              class="text-center text-gray-400 text-sm py-4 italic border border-dashed border-[#e5b976] rounded-xl bg-[#fdf5e6] flex-1 flex items-center justify-center"
            >
              Belum ada data penjualan menu.
            </div>
          </div>
        </div>

        <div
          class="bg-[#fffbf7] rounded-2xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 flex flex-col"
        >
          <h2
            class="text-lg font-bold text-[#4a2f1d] mb-4 flex items-center gap-2"
          >
            <span>🛵</span> Klasemen Rider (Bulan Ini)
          </h2>
          <div class="flex flex-col gap-3 flex-1">
            <div
              v-for="(rider, index) in klasemenRider"
              :key="index"
              class="bg-white border border-[#e5b976] rounded-xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                class="w-10 h-10 rounded-full bg-[#5c3a21] text-white font-bold flex items-center justify-center text-lg shadow-inner"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-[#4a2f1d]">{{ rider.nama_rider }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  <span class="font-bold text-green-600">{{
                    rider.total_cup || rider.terjual
                  }}</span>
                  Cup Terjual
                </p>
              </div>
              <div class="text-right">
                <span class="block text-sm font-extrabold text-[#8b5a33]">{{
                  formatRupiah(rider.total_omset || rider.pendapatan)
                }}</span>
              </div>
            </div>
            <div
              v-if="klasemenRider.length === 0"
              class="text-center text-gray-400 text-sm py-4 italic border border-dashed border-[#e5b976] rounded-xl bg-[#fdf5e6] flex-1 flex items-center justify-center"
            >
              Belum ada data penjualan rider.
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-2xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Rekap Penjualan Rider (Harian)
        </h2>

        <div
          class="overflow-x-auto rounded-xl border border-[#e5b976] shadow-sm"
        >
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-[#5c3a21] text-white text-sm tracking-wide">
                <th class="py-3 px-4 font-semibold whitespace-nowrap">
                  Tanggal
                </th>
                <th class="py-3 px-4 font-semibold">Rider</th>
                <th class="py-3 px-4 font-semibold">Produk</th>
                <th class="py-3 px-4 font-semibold text-center">Total Laku</th>
                <th class="py-3 px-4 font-semibold text-right rounded-tr-xl">
                  Total Omset
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(log, index) in riwayatTransaksi"
                :key="index"
                class="hover:bg-[#fdf5e6] transition-colors border-b border-gray-100 last:border-0"
              >
                <td class="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {{ log.waktu_format }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="bg-[#f4e8d8] text-[#8b5a33] text-xs font-bold px-2.5 py-1 rounded-md border border-[#e5b976] border-opacity-50"
                  >
                    {{ log.nama_rider }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm font-bold text-[#4a2f1d]">
                  {{ log.nama_produk }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="bg-green-50 text-green-600 font-extrabold px-4 py-1.5 rounded-md border border-green-200 inline-block min-w-[50px]"
                  >
                    {{ log.terjual }}
                  </span>
                </td>
                <td
                  class="py-3 px-4 text-sm text-right font-bold text-[#4a2f1d]"
                >
                  {{ formatRupiah(log.total_pendapatan) }}
                </td>
              </tr>

              <tr v-if="riwayatTransaksi.length === 0">
                <td
                  colspan="5"
                  class="p-8 text-center text-gray-400 text-sm italic"
                >
                  Data rekap penjualan masih kosong. Lakukan penjualan di menu
                  Rider POS.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// --- MANAJEMEN ROLE & CABANG ---
const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return { id_cabang: 1, role: "admin" }; // Fallback aman
};

const currentUser = getUserData();

// Cek apakah Super Admin secara kebal error
const isSuperAdmin = ref(
  currentUser.id_cabang === null ||
    currentUser.id_cabang === undefined ||
    currentUser.id_cabang === "",
);

// Jika SuperAdmin, default filter null. Jika Admin Cabang, terkunci ke cabangnya.
const activeCabang = ref(currentUser.id_cabang || null);

// --- DATA REAKTIF ---
const topMenu = ref([]);
const klasemenRider = ref([]);
const riwayatTransaksi = ref([]);

// Pantau perubahan pada dropdown cabang. Jika berubah, fetch ulang datanya!
watch(activeCabang, () => {
  refreshData();
});

// --- FUNGSI FORMAT MATA UANG ---
const formatRupiah = (angka) => {
  if (!angka) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

// --- FUNGSI FETCH API (DENGAN FILTER CABANG) ---
const fetchTopMenu = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/laporan/top-menu?id_cabang=${activeCabang.value}`,
    );
    if (res.ok) topMenu.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const fetchKlasemenRider = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/laporan-penjualan/leaderboard?id_cabang=${activeCabang.value}`,
    );
    if (res.ok) klasemenRider.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const fetchRiwayat = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/laporan-penjualan/riwayat?id_cabang=${activeCabang.value}`,
    );
    if (res.ok) riwayatTransaksi.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

// --- REFRESH SEMUA DATA ---
const refreshData = () => {
  fetchTopMenu();
  fetchKlasemenRider();
  fetchRiwayat();
};

// --- INIT SAAT HALAMAN DIBUKA ---
onMounted(() => {
  refreshData();
});
</script>
