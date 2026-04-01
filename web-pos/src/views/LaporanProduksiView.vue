<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full"
  >
    <div class="max-w-6xl mx-auto w-full space-y-8">
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
            class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1"
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
            class="col-span-3 text-center text-sm text-[#8b5a33] py-4"
          >
            Belum ada data produksi menu.
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Grafik Detail Penggunaan Bahan Baku (2026)
        </h2>
        <div
          class="w-full h-80 bg-white rounded-xl border border-[#e5b976] p-4 flex items-center justify-center"
        >
          <canvas ref="grafikCanvas"></canvas>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 overflow-hidden"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Detail Ketersediaan & Expired Bahan Baku
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-[#4a2f1d]">
            <thead>
              <tr class="bg-[#5c3a21] text-white">
                <th class="p-4 font-semibold text-sm rounded-tl-lg">
                  Nama Bahan Baku
                </th>
                <th class="p-4 font-semibold text-sm">Sisa Stok</th>
                <th class="p-4 font-semibold text-sm">Satuan</th>
                <th class="p-4 font-semibold text-sm">Tgl Expired</th>
                <th class="p-4 font-semibold text-sm rounded-tr-lg">
                  Info / Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="bahan in listBahanBaku"
                :key="bahan.id"
                class="border-b border-[#e5b976] border-opacity-30 hover:bg-white transition-colors"
              >
                <td class="p-4 font-medium">{{ bahan.nama_bahan }}</td>
                <td
                  :class="[
                    'p-4 font-mono font-bold',
                    bahan.stok_saat_ini < 1000 ? 'text-[#c94a4a]' : '',
                  ]"
                >
                  {{ bahan.stok_saat_ini.toLocaleString("id-ID") }}
                </td>
                <td class="p-4 text-sm">{{ bahan.satuan }}</td>
                <td
                  :class="[
                    'p-4 text-sm',
                    bahan.status === 'Hampir Expired'
                      ? 'text-[#c94a4a] font-bold'
                      : '',
                  ]"
                >
                  {{ bahan.tgl_format }}
                </td>
                <td class="p-4">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full border',
                      bahan.status === 'Stok Aman'
                        ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]'
                        : '',
                      bahan.status === 'Perlu Restok'
                        ? 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]'
                        : '',
                      bahan.status === 'Hampir Expired'
                        ? 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'
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
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

// --- DATA REAKTIF ---
const listBahanBaku = ref([]);
const topMenu = ref([]);
const grafikCanvas = ref(null);

// --- FUNGSI 1: MENGAMBIL DATA TABEL BAHAN BAKU ---
const ambilDataBahan = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/produksi");
    const data = await response.json();
    listBahanBaku.value = data;
  } catch (error) {
    console.error("Gagal mengambil laporan bahan baku:", error);
  }
};

// --- FUNGSI 2: MENGAMBIL DATA TOP 3 MENU ---
const ambilTopMenu = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/top-menu");
    const data = await response.json();
    topMenu.value = data;
  } catch (error) {
    console.error("Gagal mengambil data top menu:", error);
  }
};

// --- FUNGSI 3: MENGGAMBAR GRAFIK DETAIL (STACKED) ---
const gambarGrafik = async () => {
  try {
    const response = await fetch("http://localhost:3000/laporan/grafik");
    const datasetsDariBackend = await response.json();

    const warnaPalet = [
      "#c28147",
      "#93c47d",
      "#f1c232",
      "#e06666",
      "#8e7cc3",
      "#6fa8dc",
      "#e5b976",
      "#c27ba0",
    ];

    const datasetsDenganWarna = datasetsDariBackend.map((dataset, index) => {
      return {
        ...dataset,
        backgroundColor: warnaPalet[index % warnaPalet.length],
        borderRadius: 4,
      };
    });

    new Chart(grafikCanvas.value, {
      type: "bar",
      data: {
        labels: [
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
        datasets: datasetsDenganWarna,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { boxWidth: 12 },
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      },
    });
  } catch (error) {
    console.error("Gagal memuat data grafik:", error);
  }
};

// --- JALANKAN SAAT HALAMAN DIBUKA ---
onMounted(() => {
  ambilDataBahan();
  ambilTopMenu();
  gambarGrafik();
});
</script>
