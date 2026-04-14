<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-6xl mx-auto w-full space-y-8">
      <!-- HEADER -->
      <div
        class="flex justify-between items-end border-b border-[#e5b976] pb-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[#4a2f1d]">
            Laporan Produksi & Inventaris
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Pantau penggunaan bahan baku dan resep paling laris
          </p>
        </div>
        <select
          class="bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] shadow-sm font-medium"
        >
          <option>Tahun Ini (2026)</option>
        </select>
      </div>

      <!-- WIDGET: TOP 3 MENU TERLARIS -->
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

      <!-- WIDGET: GRAFIK PENGGUNAAN BAHAN BAKU (MODERN ECHARTS) -->
      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-2">
          Grafik Detail Penggunaan Bahan Baku (2026)
        </h2>
        <!-- Wadah untuk ECharts, menggunakan div biasa bukan canvas -->
        <div ref="grafikDOM" class="w-full h-80 mt-4"></div>
      </div>

      <!-- WIDGET: DETAIL KETERSEDIAAN BAHAN -->
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts"; // Murni menggunakan ECharts

// --- DATA REAKTIF ---
const listBahanBaku = ref([]);
const topMenu = ref([]);

// Referensi DOM untuk Chart ECharts
const grafikDOM = ref(null);
let myChart = null;

// --- FUNGSI 1: MENGAMBIL DATA TABEL BAHAN BAKU ---
const ambilDataBahan = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/produksi");
    if (response.ok) listBahanBaku.value = await response.json();
  } catch (error) {
    console.error("Gagal mengambil laporan bahan baku:", error);
  }
};

// --- FUNGSI 2: MENGAMBIL DATA TOP 3 MENU ---
const ambilTopMenu = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/top-menu");
    if (response.ok) topMenu.value = await response.json();
  } catch (error) {
    console.error("Gagal mengambil data top menu:", error);
  }
};

// --- FUNGSI 3: MENGGAMBAR GRAFIK ECHARTS (MODERN STACKED BAR) ---
const gambarGrafik = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/grafik");
    const dataDariBackend = await response.json();

    if (myChart) myChart.dispose(); // Bersihkan chart lama jika ada
    myChart = echarts.init(grafikDOM.value);

    // PENGECEKAN ERROR LEBIH SOLID:
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

    // --- SOLUSI: TRANSLASI DATA ---
    // Menerjemahkan data 'Chart.js' dari backend menjadi format 'ECharts'
    const seriesECharts = dataDariBackend.map((item) => {
      return {
        name: item.name || item.label, // Jika backend pakai 'label', kita jadikan 'name'
        type: item.type || "bar", // Wajib ada 'type' di ECharts
        stack: "Total", // Agar grafiknya bertumpuk (Stacked)
        data: item.data || [],
      };
    });

    // Ekstrak nama bahan untuk Legend (sekarang aman karena item.name pasti ada)
    const legendData = seriesECharts.map((item) => item.name);

    const option = {
      // Warna palet premium tema Kopi
      color: ["#c28147", "#5c3a21", "#8b5a33", "#e5b976", "#a66a35", "#d4a373"],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" }, // Efek bayangan kotak saat di-hover (Modern)
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5b976",
        textStyle: { color: "#4a2f1d" },
      },
      legend: {
        data: legendData,
        top: "0%",
        textStyle: { color: "#8b5a33", fontWeight: "bold" },
        icon: "roundRect", // Ikon kotak membulat
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
      // Masukkan data yang sudah diterjemahkan
      series: seriesECharts,
    };

    myChart.setOption(option);
  } catch (error) {
    console.error("Gagal memuat data grafik:", error);
  }
};

// --- LIFECYCLE VUE ---
onMounted(() => {
  ambilDataBahan();
  ambilTopMenu();
  gambarGrafik();

  // Agar grafik responsive otomatis ketika ukuran layar / browser diubah
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
