<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-6xl mx-auto w-full space-y-8">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5b976] pb-4 gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[#4a2f1d]">
            Laporan Produksi & Inventaris
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Pantau penggunaan bahan baku dan resep paling laris
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

          <select
            class="bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8b5a33] shadow-sm font-medium"
          >
            <option>Tahun Ini (2026)</option>
          </select>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Top 3 Menu Terlaris
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(menu, index) in topMenu"
            :key="index"
            class="flex items-center justify-between p-4 bg-white rounded-xl border border-[#e5b976] shadow-sm transition-transform hover:-translate-y-1"
          >
            <div class="flex items-center space-x-4">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner',
                  index === 0
                    ? 'bg-[#c28147] text-white'
                    : index === 1
                      ? 'bg-[#e5b976] text-white'
                      : 'bg-[#f0ce97] text-[#4a2f1d]',
                ]"
              >
                {{ index + 1 }}
              </div>
              <span class="font-bold text-[#4a2f1d] text-lg">{{
                menu.nama_produk
              }}</span>
            </div>
            <span class="font-extrabold text-[#8b5a33] text-xl">
              {{ menu.jumlah }} <span class="text-sm font-medium">Cup</span>
            </span>
          </div>

          <div
            v-if="topMenu.length === 0"
            class="col-span-3 text-center text-[#8b5a33] text-sm py-4 italic border border-dashed border-[#e5b976] rounded-xl bg-[#fdf5e6]"
          >
            Belum ada data produksi menu.
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-2">
          Grafik Detail Penggunaan Bahan Baku (2026)
        </h2>
        <div ref="grafikDOM" class="w-full h-80 mt-4"></div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 overflow-hidden"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Detail Ketersediaan & Expired Bahan Baku
        </h2>
        <div
          class="overflow-x-auto rounded-xl border border-[#e5b976] shadow-sm"
        >
          <table
            class="w-full text-left text-[#4a2f1d] border-collapse min-w-[600px]"
          >
            <thead>
              <tr class="bg-[#5c3a21] text-white tracking-wide">
                <th class="p-4 font-semibold text-sm">Nama Bahan Baku</th>
                <th class="p-4 font-semibold text-sm">Sisa Stok</th>
                <th class="p-4 font-semibold text-sm">Satuan</th>
                <th class="p-4 font-semibold text-sm">Tgl Expired</th>
                <th class="p-4 font-semibold text-sm">Info / Status</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="bahan in listBahanBaku"
                :key="bahan.id"
                class="border-b border-gray-100 hover:bg-[#fdf5e6] transition-colors last:border-0"
              >
                <td class="p-4 font-bold">{{ bahan.nama_bahan }}</td>
                <td
                  :class="[
                    'p-4 font-mono font-bold text-lg',
                    bahan.stok_saat_ini < 1000
                      ? 'text-red-600'
                      : 'text-[#8b5a33]',
                  ]"
                >
                  {{ bahan.stok_saat_ini.toLocaleString("id-ID") }}
                </td>
                <td class="p-4 text-sm font-medium text-gray-500">
                  {{ bahan.satuan }}
                </td>
                <td
                  :class="[
                    'p-4 text-sm font-medium',
                    bahan.status === 'Hampir Expired'
                      ? 'text-red-600 font-bold'
                      : 'text-gray-500',
                  ]"
                >
                  {{ bahan.tgl_format }}
                </td>
                <td class="p-4">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-md border',
                      bahan.status === 'Stok Aman'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : '',
                      bahan.status === 'Perlu Restok'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : '',
                      bahan.status === 'Hampir Expired'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : '',
                    ]"
                  >
                    {{ bahan.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="listBahanBaku.length === 0">
                <td
                  colspan="5"
                  class="p-8 text-center text-gray-400 text-sm italic"
                >
                  Belum ada data bahan baku untuk cabang ini.
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

// --- MANAJEMEN ROLE & CABANG ---
const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return { id_cabang: 1, role: "admin" }; // Fallback aman
};

const currentUser = getUserData();

// Pengecekan Super Admin yang kebal terhadap cache lama
const isSuperAdmin = ref(
  currentUser.id_cabang === null ||
    currentUser.id_cabang === undefined ||
    currentUser.id_cabang === "",
);

// Jika SuperAdmin, default filter null. Jika Admin Cabang, terkunci ke cabangnya.
const activeCabang = ref(currentUser.id_cabang || null);

// --- DATA REAKTIF ---
const listBahanBaku = ref([]);
const topMenu = ref([]);

// Referensi DOM untuk Chart ECharts
const grafikDOM = ref(null);
let myChart = null;

// Pantau perubahan pada dropdown cabang. Jika berubah, fetch ulang datanya!
watch(activeCabang, () => {
  refreshSemuaData();
});

// --- FUNGSI 1: MENGAMBIL DATA TABEL BAHAN BAKU ---
const ambilDataBahan = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/laporan/produksi?id_cabang=${activeCabang.value}`,
    );
    if (response.ok) listBahanBaku.value = await response.json();
  } catch (error) {
    console.error("Gagal mengambil laporan bahan baku:", error);
  }
};

// --- FUNGSI 2: MENGAMBIL DATA TOP 3 MENU ---
const ambilTopMenu = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/laporan/top-menu?id_cabang=${activeCabang.value}`,
    );
    if (response.ok) topMenu.value = await response.json();
  } catch (error) {
    console.error("Gagal mengambil data top menu:", error);
  }
};

// --- FUNGSI 3: MENGGAMBAR GRAFIK ECHARTS ---
const gambarGrafik = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/laporan/grafik?id_cabang=${activeCabang.value}`,
    );
    const dataDariBackend = await response.json();

    if (myChart) myChart.dispose();
    myChart = echarts.init(grafikDOM.value);

    if (!Array.isArray(dataDariBackend) || dataDariBackend.length === 0) {
      const pesanTengah = dataDariBackend.error
        ? `Error Backend: ${dataDariBackend.error}`
        : "Belum ada data pengeluaran bahan baku";

      myChart.setOption({
        title: {
          text: pesanTengah,
          textStyle: { color: "#c94a4a", fontSize: 14, fontStyle: "italic" },
          left: "center",
          top: "center",
        },
      });
      return;
    }

    const seriesECharts = dataDariBackend.map((item) => {
      return {
        name: item.name || item.label,
        type: item.type || "bar",
        stack: "Total",
        data: item.data || [],
      };
    });

    const legendData = seriesECharts.map((item) => item.name);

    const option = {
      color: ["#c28147", "#5c3a21", "#8b5a33", "#e5b976", "#a66a35", "#d4a373"],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5b976",
        textStyle: { color: "#4a2f1d" },
      },
      legend: {
        data: legendData,
        top: "0%",
        textStyle: { color: "#8b5a33", fontWeight: "bold" },
        icon: "roundRect",
      },
      grid: {
        left: "2%",
        right: "3%",
        bottom: "0%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Ags",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        axisLine: { lineStyle: { color: "#e5b976", width: 2 } },
        axisLabel: { color: "#8b5a33", fontWeight: "bold" },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: { color: "#f0ce97", type: "dashed", opacity: 0.5 },
        },
        axisLabel: { color: "#8b5a33" },
      },
      series: seriesECharts,
    };

    myChart.setOption(option);
  } catch (error) {
    console.error("Gagal memuat data grafik:", error);
  }
};

// --- FUNGSI REFRESH SEMUA ---
const refreshSemuaData = () => {
  ambilDataBahan();
  ambilTopMenu();
  gambarGrafik();
};

// --- LIFECYCLE VUE ---
onMounted(() => {
  refreshSemuaData();
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
