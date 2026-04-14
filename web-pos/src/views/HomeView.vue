<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-7xl mx-auto w-full space-y-6">
      <!-- HEADER -->
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
        <button
          @click="refreshSemua"
          class="bg-white border border-[#e5b976] hover:bg-[#fdf5e6] text-[#8b5a33] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
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

      <!-- 1. KPI (HIGHLIGHT HARI INI) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-gradient-to-br from-[#8b5a33] to-[#5c3a21] rounded-2xl p-5 shadow-md text-white flex flex-col justify-between h-32 relative overflow-hidden"
        >
          <div class="absolute -right-4 -bottom-4 opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p class="text-sm font-medium text-[#e5b976] z-10">
            Total Omset (Hari Ini)
          </p>
          <h3 class="text-2xl font-extrabold z-10">
            {{ formatRupiah(kpi.omset) }}
          </h3>
        </div>
        <div
          class="bg-white border border-[#e5b976] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32"
        >
          <p class="text-sm font-bold text-gray-500">Cup Terjual (Hari Ini)</p>
          <div class="flex items-end gap-2">
            <h3 class="text-4xl font-extrabold text-[#c28147]">
              {{ kpi.terjual }}
            </h3>
            <span class="text-sm text-gray-400 font-medium mb-1">Cup</span>
          </div>
        </div>
        <div
          class="bg-white border border-[#e5b976] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32"
        >
          <p class="text-sm font-bold text-gray-500">Stok Kopi Siap Jual</p>
          <div class="flex items-end gap-2">
            <h3 class="text-4xl font-extrabold text-[#4a2f1d]">
              {{ kpi.stokKulkas }}
            </h3>
            <span class="text-sm text-gray-400 font-medium mb-1"
              >Cup di Kulkas</span
            >
          </div>
        </div>
        <div
          class="bg-white border border-[#e5b976] rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32"
        >
          <p class="text-sm font-bold text-gray-500">Rider Aktif (Hari Ini)</p>
          <div class="flex items-end gap-2">
            <h3 class="text-4xl font-extrabold text-green-600">
              {{ kpi.riderAktif }}
            </h3>
            <span class="text-sm text-gray-400 font-medium mb-1">Orang</span>
          </div>
        </div>
      </div>

      <!-- 2. GRAFIK TREN PENJUALAN (MODERN MINIMALIS ECHARTS) -->
      <div
        class="bg-[#fffbf7] rounded-2xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
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
        <!-- Wadah untuk Chart -->
        <div ref="chartDOM" class="w-full h-72 mt-4"></div>
      </div>

      <!-- 3. PERINGATAN SISTEM (ALERTS) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-200 flex flex-col"
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
            Peringatan: Stok Bahan Kritis (< 2000)
          </h2>
          <ul v-if="stokKritis.length > 0" class="space-y-2 flex-1">
            <li
              v-for="(item, index) in stokKritis"
              :key="index"
              class="bg-white px-3 py-2 rounded-lg border border-red-100 flex justify-between items-center text-sm"
            >
              <span class="font-bold text-[#4a2f1d]">{{
                item.nama_bahan
              }}</span>
              <span
                class="bg-red-100 text-red-700 font-extrabold px-2 py-1 rounded"
                >{{ item.stok_saat_ini }} {{ item.satuan }}</span
              >
            </li>
          </ul>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-sm text-green-600 font-medium italic py-4"
          >
            ✅ Semua stok bahan baku dalam batas aman.
          </div>
        </div>

        <div
          class="bg-yellow-50 rounded-2xl p-5 shadow-sm border border-yellow-200 flex flex-col"
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
            Peringatan: Hampir Expired (< 30 Hari)
          </h2>
          <ul v-if="peringatanExpired.length > 0" class="space-y-2 flex-1">
            <li
              v-for="(item, index) in peringatanExpired"
              :key="index"
              class="bg-white px-3 py-2 rounded-lg border border-yellow-100 flex justify-between items-center text-sm"
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
                class="bg-yellow-100 text-yellow-700 font-extrabold px-2 py-1 rounded"
                >{{ item.sisa_hari }} Hari Lagi</span
              >
            </li>
          </ul>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-sm text-green-600 font-medium italic py-4"
          >
            ✅ Tidak ada bahan baku yang mendekati masa kedaluwarsa.
          </div>
        </div>
      </div>

      <!-- 4. LIVE TRACKING TAS RIDER -->
      <div
        class="bg-[#fffbf7] rounded-2xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
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
          Live Tracking: Tas Rider Hari Ini
        </h2>

        <div
          class="overflow-x-auto rounded-xl border border-[#e5b976] shadow-sm"
        >
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-[#f4e8d8] text-[#8b5a33] text-sm tracking-wide">
                <th class="py-3 px-4 font-bold border-b border-[#e5b976]">
                  Rider
                </th>
                <th class="py-3 px-4 font-bold border-b border-[#e5b976]">
                  Produk Dibawa
                </th>
                <th
                  class="py-3 px-4 font-bold text-center border-b border-[#e5b976]"
                >
                  Stok Awal
                </th>
                <th
                  class="py-3 px-4 font-bold text-center border-b border-[#e5b976]"
                >
                  Sudah Laku
                </th>
                <th
                  class="py-3 px-4 font-bold text-center border-b border-[#e5b976]"
                >
                  Sisa di Tas
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(rider, index) in liveTracking"
                :key="index"
                class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td class="py-3 px-4 text-sm font-extrabold text-[#4a2f1d]">
                  {{ rider.nama_rider }}
                </td>
                <td class="py-3 px-4 text-sm font-medium">
                  {{ rider.nama_produk }}
                </td>
                <td
                  class="py-3 px-4 text-sm text-center text-gray-400 font-bold"
                >
                  {{ rider.stok_bawa }}
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="text-green-600 font-bold">{{
                    rider.terjual
                  }}</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    class="bg-[#c28147] text-white font-bold px-2 py-1 rounded text-xs"
                    >Sisa {{ rider.sisa }}</span
                  >
                </td>
              </tr>
              <tr v-if="liveTracking.length === 0">
                <td
                  colspan="5"
                  class="p-6 text-center text-gray-400 text-sm italic"
                >
                  Belum ada Rider yang membawa kopi hari ini.
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
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts"; // Menggunakan Library ECharts

// --- STATE ---
const kpi = ref({ omset: 0, terjual: 0, stokKulkas: 0, riderAktif: 0 });
const stokKritis = ref([]);
const peringatanExpired = ref([]);
const liveTracking = ref([]);
const dataGrafik = ref([]);

// Referensi DOM untuk Chart
const chartDOM = ref(null);
let myChart = null;

// --- FORMAT RUPIAH ---
const formatRupiah = (angka) => {
  if (!angka) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

// --- INISIALISASI ECHARTS ---
const renderChart = () => {
  if (myChart) myChart.dispose(); // Bersihkan chart lama
  myChart = echarts.init(chartDOM.value);

  if (dataGrafik.value.length === 0) {
    myChart.setOption({
      title: {
        text: "Belum ada data penjualan",
        textStyle: { color: "#a1a1aa", fontSize: 14, fontStyle: "italic" },
        left: "center",
        top: "center",
      },
    });
    return;
  }

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#e5b976",
      textStyle: { color: "#4a2f1d" },
      formatter: (params) => {
        return `<div class="font-bold">${params[0].name}</div> Omset: <span class="font-extrabold text-[#8b5a33]">${formatRupiah(params[0].value)}</span>`;
      },
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
      data: dataGrafik.value.map((item) => item.tanggal_format),
      axisLine: { lineStyle: { color: "#e5b976" } },
      axisLabel: { color: "#8b5a33", fontWeight: "bold" },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: { color: "#f0ce97", type: "dashed", opacity: 0.5 },
      },
      axisLabel: {
        color: "#8b5a33",
        formatter: (value) => (value >= 1000 ? value / 1000 + "k" : value),
      },
    },
    series: [
      {
        data: dataGrafik.value.map((item) => item.omset),
        type: "line",
        smooth: true,
        symbolSize: 8,
        lineStyle: { color: "#c28147", width: 3 },
        itemStyle: { color: "#c28147", borderWidth: 2, borderColor: "#fff" },
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

// --- FETCH DATA ---
const fetchKPI = async () => {
  try {
    const res = await fetch("http://localhost:3000/dashboard/kpi");
    if (res.ok) kpi.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const fetchGrafik = async () => {
  try {
    const res = await fetch("http://localhost:3000/dashboard/grafik-tren");
    if (res.ok) {
      dataGrafik.value = await res.json();
      renderChart();
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchStokKritis = async () => {
  try {
    const res = await fetch("http://localhost:3000/dashboard/stok-kritis");
    if (res.ok) stokKritis.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const fetchExpired = async () => {
  try {
    const res = await fetch("http://localhost:3000/dashboard/expired");
    if (res.ok) peringatanExpired.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const fetchLiveTracking = async () => {
  try {
    const res = await fetch("http://localhost:3000/dashboard/live-rider");
    if (res.ok) liveTracking.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const refreshSemua = () => {
  fetchKPI();
  fetchGrafik();
  fetchStokKritis();
  fetchExpired();
  fetchLiveTracking();
};

// --- LIFECYCLE ---
onMounted(() => {
  refreshSemua();
  window.addEventListener("resize", () => {
    if (myChart) myChart.resize();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {
    if (myChart) myChart.resize();
  });
  if (myChart) myChart.dispose();
});
</script>
