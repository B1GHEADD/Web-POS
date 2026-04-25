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
            Dashboard Operasional
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Ringkasan performa dan pantauan sistem Kupi Kita hari ini
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
            @click="refreshSemua"
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-gradient-to-br from-[#8b5a33] via-[#6b4226] to-[#4a2f1d] rounded-2xl p-6 shadow-lg text-white flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 animate-fade-in-up"
        >
          <div class="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 scale-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-32 w-32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p class="text-sm font-bold text-[#f0ce97] z-10 uppercase tracking-widest drop-shadow-md">
            Total Omset (Hari Ini)
          </p>
          <h3 class="text-4xl font-black z-10 drop-shadow-lg tracking-tight">
            {{ formatRupiah(kpi.omset) }}
          </h3>
        </div>

        <div
          class="glass-card rounded-2xl p-6 flex flex-col justify-between h-36 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 animate-fade-in-up" style="animation-delay: 0.1s;"
        >
          <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Cup Terjual (Hari Ini)</p>
          <div class="flex items-end gap-2">
            <h3 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c28147] to-[#8b5a33]">
              {{ kpi.terjual }}
            </h3>
            <span class="text-sm text-[#8b5a33] font-bold mb-1.5">Cup</span>
          </div>
        </div>

        <div
          class="glass-card rounded-2xl p-6 flex flex-col justify-between h-36 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 animate-fade-in-up" style="animation-delay: 0.2s;"
        >
          <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Stok Kopi Siap Jual</p>
          <div class="flex items-end gap-2">
            <h3 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4a2f1d] to-[#8b5a33]">
              {{ kpi.stokKulkas }}
            </h3>
            <span class="text-sm text-[#8b5a33] font-bold mb-1.5"
              >Cup di Kulkas</span
            >
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2
          class="text-lg font-bold text-[#4a2f1d] mb-2 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-[#8b5a33]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
            />
          </svg>
          Tren Omset (7 Hari Terakhir)
        </h2>
        <div ref="chartDOM" class="w-full h-72 mt-4"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-200 flex flex-col"
        >
          <h2
            class="text-base font-bold text-red-800 mb-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Stok Bahan Kritis (< 2000)
          </h2>
          <ul v-if="stokKritis.length > 0" class="space-y-2 flex-1">
            <li
              v-for="(item, index) in stokKritis"
              :key="index"
              class="bg-white px-4 py-2.5 rounded-xl border border-red-100 flex justify-between items-center text-sm shadow-sm"
            >
              <span class="font-bold text-[#4a2f1d]">{{
                item.nama_bahan
              }}</span>
              <span
                class="bg-red-100 text-red-700 font-extrabold px-2.5 py-1 rounded-md"
                >{{ item.stok_saat_ini }} {{ item.satuan }}</span
              >
            </li>
          </ul>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-sm text-green-600 font-medium italic py-4"
          >
            ✅ Semua aman.
          </div>
        </div>

        <div
          class="bg-yellow-50 rounded-3xl p-6 shadow-sm border border-yellow-200 flex flex-col"
        >
          <h2
            class="text-base font-bold text-yellow-800 mb-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            Hampir Expired (< 30 Hari)
          </h2>
          <ul v-if="peringatanExpired.length > 0" class="space-y-2 flex-1">
            <li
              v-for="(item, index) in peringatanExpired"
              :key="index"
              class="bg-white px-4 py-2.5 rounded-xl border border-yellow-100 flex justify-between items-center text-sm shadow-sm"
            >
              <div class="flex flex-col">
                <span class="font-bold text-[#4a2f1d]">{{
                  item.nama_bahan
                }}</span>
                <span class="text-[10px] text-gray-500"
                  >Exp: {{ item.tgl_expired.split("T")[0] }}</span
                >
              </div>
              <span
                class="bg-yellow-100 text-yellow-700 font-extrabold px-2.5 py-1 rounded-md"
                >{{ item.sisa_hari }} Hari Lagi</span
              >
            </li>
          </ul>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-sm text-green-600 font-medium italic py-4"
          >
            ✅ Semua aman.
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2
          class="text-lg font-bold text-[#4a2f1d] mb-4 flex items-center gap-2"
        >
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
            ></span>
          </span>
          Live Tracking: Tas Rider
        </h2>
        <div
          class="overflow-x-auto rounded-xl border border-[#e5b976] shadow-sm"
        >
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-[#f4e8d8] text-[#8b5a33] text-sm">
                <th class="py-4 px-5 font-bold">Rider</th>
                <th class="py-4 px-5 font-bold">Produk</th>
                <th class="py-4 px-5 font-bold text-center">Stok Awal</th>
                <th class="py-4 px-5 font-bold text-center">Sudah Laku</th>
                <th class="py-4 px-5 font-bold text-center">Sisa</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(rider, index) in liveTracking"
                :key="index"
                class="border-b border-gray-100 hover:bg-[#fdf5e6] transition-colors"
              >
                <td class="py-4 px-5 text-sm font-extrabold text-[#4a2f1d]">
                  {{ rider.nama_rider }}
                </td>
                <td class="py-4 px-5 text-sm font-medium text-[#8b5a33]">
                  {{ rider.nama_produk }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-center text-gray-400 font-bold"
                >
                  {{ rider.stok_bawa }}
                </td>
                <td class="py-4 px-5 text-center">
                  <span
                    class="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-md"
                    >{{ rider.terjual }}</span
                  >
                </td>
                <td class="py-4 px-5 text-center">
                  <span
                    class="bg-[#c28147] text-white font-bold px-3 py-1 rounded-md text-xs shadow-sm"
                    >Sisa {{ rider.sisa }}</span
                  >
                </td>
              </tr>
              <tr v-if="liveTracking.length === 0">
                <td
                  colspan="5"
                  class="p-8 text-center text-gray-400 text-sm italic"
                >
                  Belum ada data hari ini.
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
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import apiClient from "../services/axios";

// --- MANAJEMEN ROLE & CABANG ---
const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return { id_cabang: 1, role: "admin" };
};

const currentUser = getUserData();
const isSuperAdmin = ref(currentUser.id_cabang === null);
const activeCabang = ref(currentUser.id_cabang);

// Jika dropdown cabang diubah, langsung refresh seluruh data dashboard
watch(activeCabang, () => {
  refreshSemua();
});

// --- DATA STATE ---
const kpi = ref({ omset: 0, terjual: 0, stokKulkas: 0 });
const stokKritis = ref([]);
const peringatanExpired = ref([]);
const liveTracking = ref([]);
const dataGrafik = ref([]);

const chartDOM = ref(null);
let myChart = null;

const formatRupiah = (angka) => {
  if (!angka) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

// --- RENDER GRAFIK ---
const renderChart = () => {
  if (myChart) myChart.dispose();
  myChart = echarts.init(chartDOM.value);
  if (dataGrafik.value.length === 0) return;

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (p) =>
        `${p[0].name}<br/>Omset: <b>${formatRupiah(p[0].value)}</b>`,
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dataGrafik.value.map((i) => i.tanggal_format),
    },
    yAxis: { type: "value", splitLine: { lineStyle: { type: "dashed" } } },
    series: [
      {
        data: dataGrafik.value.map((i) => i.omset),
        type: "line",
        smooth: true,
        lineStyle: { color: "#c28147", width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(194, 129, 71, 0.4)" },
            { offset: 1, color: "rgba(194, 129, 71, 0.05)" },
          ]),
        },
      },
    ],
  };
  myChart.setOption(option);
};

// --- FETCH DATA (DENGAN FILTER CABANG) ---
const fetchKPI = async () => {
  try {
    const res = await apiClient.get(`/dashboard/kpi?id_cabang=${activeCabang.value}`);
    kpi.value = res.data;
  } catch (error) { console.error("Error fetching KPI", error); }
};

const fetchGrafik = async () => {
  try {
    const res = await apiClient.get(`/dashboard/grafik-tren?id_cabang=${activeCabang.value}`);
    dataGrafik.value = res.data;
    renderChart();
  } catch (error) { console.error("Error fetching grafik", error); }
};

const fetchStokKritis = async () => {
  try {
    const res = await apiClient.get(`/dashboard/stok-kritis?id_cabang=${activeCabang.value}`);
    stokKritis.value = res.data;
  } catch (error) { console.error("Error fetching stok kritis", error); }
};

const fetchExpired = async () => {
  try {
    const res = await apiClient.get(`/dashboard/expired?id_cabang=${activeCabang.value}`);
    peringatanExpired.value = res.data;
  } catch (error) { console.error("Error fetching expired", error); }
};

const fetchLiveTracking = async () => {
  try {
    const res = await apiClient.get(`/dashboard/live-rider?id_cabang=${activeCabang.value}`);
    liveTracking.value = res.data;
  } catch (error) { console.error("Error fetching live tracking", error); }
};

const refreshSemua = () => {
  fetchKPI();
  fetchGrafik();
  fetchStokKritis();
  fetchExpired();
  fetchLiveTracking();
};

onMounted(() => {
  refreshSemua();
  window.addEventListener("resize", () => myChart && myChart.resize());
});

onUnmounted(() => {
  window.removeEventListener("resize", () => myChart && myChart.resize());
  if (myChart) myChart.dispose();
});
</script>
