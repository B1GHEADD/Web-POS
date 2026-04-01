<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full"
  >
    <div class="max-w-6xl mx-auto w-full space-y-6">
      <div
        class="flex justify-between items-end border-b border-[#e5b976] pb-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[#4a2f1d]">
            Laporan Penjualan & Performa
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Pantau arus kas, tren harian, dan kinerja Rider lapangan
          </p>
        </div>
        <select
          class="bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] shadow-sm font-medium"
        >
          <option>Bulan Ini (2026)</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-gradient-to-br from-[#8b5a33] to-[#5c3a21] rounded-3xl p-6 shadow-md text-white flex flex-col justify-center transition-transform hover:-translate-y-1"
        >
          <span class="text-sm font-medium opacity-80 mb-1"
            >Total Pendapatan (Bulan Ini)</span
          >
          <span class="text-3xl font-extrabold"
            >Rp {{ summary.totalPendapatan.toLocaleString("id-ID") }}</span
          >
        </div>

        <div
          class="bg-[#fffbf7] border border-[#f0ce97] border-opacity-60 rounded-3xl p-6 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1"
        >
          <span class="text-sm font-medium text-[#8b5a33] mb-1"
            >Total Cup Terjual</span
          >
          <span class="text-3xl font-extrabold text-[#4a2f1d]"
            >{{ summary.totalCup }}
            <span class="text-base font-semibold">Cup</span></span
          >
        </div>

        <div
          class="bg-[#fffbf7] border border-[#f0ce97] border-opacity-60 rounded-3xl p-6 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1"
        >
          <span class="text-sm font-medium text-[#8b5a33] mb-1"
            >Menu Paling Laku Aktual</span
          >
          <span class="text-xl font-extrabold text-[#4a2f1d] leading-tight">{{
            summary.menuJuara
          }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="lg:col-span-2 bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40"
        >
          <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
            Tren Pendapatan Harian
          </h2>
          <div
            class="w-full h-72 bg-white rounded-xl border border-[#e5b976] p-4 flex items-center justify-center"
          >
            <canvas ref="grafikCanvas"></canvas>
          </div>
        </div>

        <div
          class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 flex flex-col"
        >
          <h2
            class="text-lg font-bold text-[#4a2f1d] mb-4 border-b border-[#e5b976] pb-2"
          >
            Top Rider (Penjualan)
          </h2>
          <div class="space-y-3 flex-1 overflow-y-auto">
            <div
              v-for="(rider, index) in leaderboard"
              :key="index"
              class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner',
                    index === 0
                      ? 'bg-[#c28147] text-white'
                      : index === 1
                        ? 'bg-[#e5b976] text-white'
                        : 'bg-[#f0ce97] text-[#4a2f1d]',
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <span class="font-bold text-[#4a2f1d] block text-sm">{{
                    rider.nama_rider
                  }}</span>
                  <span class="text-xs text-green-600 font-semibold"
                    >Rp {{ rider.pendapatan.toLocaleString("id-ID") }}</span
                  >
                </div>
              </div>
              <span class="font-extrabold text-[#8b5a33]"
                >{{ rider.terjual }}
                <span class="text-xs font-normal">Cup</span></span
              >
            </div>

            <div
              v-if="leaderboard.length === 0"
              class="text-center text-sm text-gray-400 italic pt-4"
            >
              Belum ada data penjualan.
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-[#fffbf7] rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-40 overflow-hidden"
      >
        <h2 class="text-lg font-bold text-[#4a2f1d] mb-4">
          Riwayat Transaksi (Audit Log)
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-[#4a2f1d]">
            <thead>
              <tr class="bg-[#5c3a21] text-white">
                <th class="p-4 font-semibold text-sm rounded-tl-lg">Waktu</th>
                <th class="p-4 font-semibold text-sm">Rider</th>
                <th class="p-4 font-semibold text-sm">Produk</th>
                <th class="p-4 font-semibold text-sm text-center">Bawa</th>
                <th class="p-4 font-semibold text-sm text-center">Laku</th>
                <th class="p-4 font-semibold text-sm text-center">Sisa</th>
                <th class="p-4 font-semibold text-sm text-right rounded-tr-lg">
                  Pendapatan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in riwayatPenjualan"
                :key="log.id"
                class="border-b border-[#e5b976] border-opacity-30 hover:bg-white transition-colors text-sm"
              >
                <td class="p-4">{{ log.waktu_format }}</td>
                <td class="p-4 font-bold text-[#8b5a33]">
                  {{ log.nama_rider }}
                </td>
                <td class="p-4 font-medium">{{ log.nama_produk }}</td>
                <td class="p-4 text-center">{{ log.jumlah_dibawa }}</td>
                <td class="p-4 text-center font-bold text-green-600">
                  {{ log.terjual }}
                </td>
                <td class="p-4 text-center text-red-500">{{ log.sisa }}</td>
                <td class="p-4 text-right font-mono font-bold">
                  Rp {{ log.total_pendapatan.toLocaleString("id-ID") }}
                </td>
              </tr>
              <tr v-if="riwayatPenjualan.length === 0">
                <td colspan="7" class="p-6 text-center text-gray-400 italic">
                  Data transaksi masih kosong.
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
const summary = ref({ totalPendapatan: 0, totalCup: 0, menuJuara: "-" });
const leaderboard = ref([]);
const riwayatPenjualan = ref([]);
const grafikCanvas = ref(null);
let chartInstance = null;

// --- 1. AMBIL DATA SUMMARY ---
const ambilSummary = async () => {
  try {
    const res = await fetch("http://localhost:3000/laporan-penjualan/summary");
    if (res.ok) summary.value = await res.json();
  } catch (error) {
    console.error("Error summary:", error);
  }
};

// --- 2. AMBIL DATA LEADERBOARD ---
const ambilLeaderboard = async () => {
  try {
    const res = await fetch(
      "http://localhost:3000/laporan-penjualan/leaderboard",
    );
    if (res.ok) leaderboard.value = await res.json();
  } catch (error) {
    console.error("Error leaderboard:", error);
  }
};

// --- 3. AMBIL DATA RIWAYAT TABEL ---
const ambilRiwayat = async () => {
  try {
    const res = await fetch("http://localhost:3000/laporan-penjualan/riwayat");
    if (res.ok) riwayatPenjualan.value = await res.json();
  } catch (error) {
    console.error("Error riwayat:", error);
  }
};

// --- 4. GAMBAR GRAFIK TREN HARIAN ---
const gambarGrafik = async () => {
  try {
    const res = await fetch("http://localhost:3000/laporan-penjualan/grafik");
    if (!res.ok) return;

    const dataHarian = await res.json();

    // Hancurkan chart lama jika ada (mencegah error saat pindah halaman)
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(grafikCanvas.value, {
      type: "line", // Menggunakan Line Chart agar terlihat seperti tren arus kas
      data: {
        labels: dataHarian.labels, // Contoh: ['1 Apr', '2 Apr', '3 Apr', ...]
        datasets: [
          {
            label: "Pendapatan Harian (Rp)",
            data: dataHarian.pendapatan,
            borderColor: "#8b5a33",
            backgroundColor: "rgba(139, 90, 51, 0.1)", // Efek blok warna transparan di bawah garis
            borderWidth: 3,
            pointBackgroundColor: "#c28147",
            pointRadius: 4,
            fill: true,
            tension: 0.3, // Membuat garis sedikit melengkung (smooth)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "Rp " + value.toLocaleString("id-ID"),
            }, // Format angka di sumbu Y
          },
        },
      },
    });
  } catch (error) {
    console.error("Error grafik:", error);
  }
};

// --- JALANKAN SAAT HALAMAN DIBUKA ---
onMounted(() => {
  // Semua fungsi dipanggil serentak
  ambilSummary();
  ambilLeaderboard();
  ambilRiwayat();
  gambarGrafik();
});
</script>
