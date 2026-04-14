<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div
      class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 my-auto"
    >
      <!-- ========================================== -->
      <!-- KOTAK KIRI (KONTEN UTAMA POS) -->
      <!-- ========================================== -->
      <div class="flex-1 flex flex-col gap-6">
        <!-- HEADER & FILTER (Rider & Tanggal) -->
        <div
          class="bg-white rounded-3xl p-6 shadow-sm border border-[#f0ce97] border-opacity-50 flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden"
        >
          <!-- Hiasan Sudut -->
          <div
            class="absolute -left-6 -top-6 bg-[#fdf5e6] w-24 h-24 rounded-full opacity-50 pointer-events-none"
          ></div>

          <div class="relative z-10 w-full md:w-1/3">
            <h1 class="text-2xl font-extrabold text-[#4a2f1d] tracking-tight">
              Kasir Rider <span class="text-[#c28147]">POS</span>
            </h1>
            <p class="text-xs text-[#8b5a33] mt-1 font-medium">
              Catat serah terima dan penjualan harian rider.
            </p>
          </div>

          <div
            class="flex flex-col md:flex-row gap-4 w-full md:w-2/3 relative z-10"
          >
            <div class="flex-1">
              <label
                class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1"
                >Nama Rider</label
              >
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-[#c28147]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <select
                  v-model="namaRider"
                  class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-bold appearance-none"
                >
                  <option value="" disabled selected>Pilih Rider...</option>
                  <option
                    v-for="(rider, index) in listRider"
                    :key="index"
                    :value="rider.nama_rider"
                  >
                    {{ rider.nama_rider }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex-1">
              <label
                class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1"
                >Tanggal</label
              >
              <input
                type="date"
                v-model="tanggalInput"
                class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-bold"
              />
            </div>
          </div>
        </div>

        <!-- DAFTAR PRODUK (KARTU-KARTU MENU) -->
        <div class="flex-1 overflow-y-auto pr-2 space-y-4">
          <div
            v-if="!namaRider"
            class="bg-[#fdf5e6] rounded-2xl p-8 text-center border border-dashed border-[#e5b976] flex flex-col items-center justify-center h-48"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-[#d4a373] mb-3 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <p class="text-[#8b5a33] font-bold text-lg">
              Silakan pilih Nama Rider terlebih dahulu.
            </p>
          </div>

          <div
            v-else
            v-for="(item, index) in listProduk"
            :key="index"
            class="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all duration-300 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6"
            :class="
              item.stok_saat_ini === 0
                ? 'border-red-200 bg-red-50/30 opacity-80'
                : 'border-[#f0ce97]/50'
            "
          >
            <!-- Info Kiri (Nama Menu & Stok Kulkas) -->
            <div class="w-full xl:w-1/3">
              <h3
                class="font-extrabold text-lg truncate mb-1"
                :class="
                  item.stok_saat_ini === 0 ? 'text-red-800' : 'text-[#4a2f1d]'
                "
              >
                {{ item.nama_produk }}
              </h3>
              <span
                v-if="item.stok_saat_ini === 0"
                class="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-md border border-red-200 flex inline-flex items-center gap-1 w-max"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                Stok Kulkas: HABIS
              </span>
              <span
                v-else
                class="text-xs font-bold text-[#8b5a33] bg-[#fdf5e6] px-2.5 py-1 rounded-md border border-[#e5b976]/50 flex inline-flex items-center gap-1 w-max"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fill-rule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Stok Kulkas: {{ item.stok_saat_ini }}
              </span>
            </div>

            <!-- Bagian Kanan (4 Kolom Input & Tombol Aksi) -->
            <div class="w-full xl:w-2/3 flex flex-col gap-4">
              <!-- Grid 4 Kolom Modern -->
              <div class="grid grid-cols-4 gap-3">
                <!-- 1. Ambil -->
                <div class="flex flex-col items-center group">
                  <label
                    class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-[#c28147]"
                    >1. Ambil</label
                  >
                  <input
                    type="number"
                    v-model="item.diambil"
                    placeholder="0"
                    :disabled="item.stok_saat_ini === 0"
                    class="w-full text-center rounded-xl py-2 focus:outline-none font-bold text-base transition-all"
                    :class="
                      item.stok_saat_ini === 0
                        ? 'bg-gray-100 border border-gray-200 cursor-not-allowed text-gray-400'
                        : 'bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] focus:border-[#c28147] focus:ring-2 focus:ring-[#c28147]/20 focus:bg-white'
                    "
                  />
                </div>

                <!-- 2. Dibawa -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-extrabold text-[#c28147] uppercase tracking-wider mb-1.5 w-full text-center whitespace-nowrap"
                    >2. Dibawa</label
                  >
                  <input
                    type="number"
                    :value="item.stok_bawa || 0"
                    disabled
                    class="w-full text-center bg-[#fdf5e6] border border-[#e5b976]/50 text-[#c28147] font-extrabold rounded-xl py-2 cursor-not-allowed text-base shadow-inner"
                  />
                </div>

                <!-- 3. Terjual -->
                <div class="flex flex-col items-center group">
                  <label
                    class="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 transition-colors group-hover:text-green-600"
                    >3. Terjual</label
                  >
                  <input
                    type="number"
                    v-model="item.terjual_input"
                    placeholder="0"
                    class="w-full text-center bg-[#fdf8f2] border border-[#e8d5c4] text-green-700 rounded-xl py-2 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white font-extrabold text-base transition-all"
                  />
                  <span
                    class="text-[9px] font-bold text-green-600 mt-1.5 text-center bg-green-50 px-2 py-0.5 rounded border border-green-100 w-full truncate"
                  >
                    Laku: {{ item.total_terjual || 0 }}
                  </span>
                </div>

                <!-- 4. Sisa -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-extrabold text-[#8b5a33] uppercase tracking-wider mb-1.5"
                    >4. Sisa</label
                  >
                  <input
                    type="number"
                    :value="
                      Math.max(
                        0,
                        (item.stok_bawa || 0) -
                          (Number(item.terjual_input) || 0),
                      )
                    "
                    disabled
                    class="w-full text-center bg-[#8b5a33] border border-[#5c3a21] text-white font-extrabold rounded-xl py-2 cursor-not-allowed text-base shadow-inner"
                  />
                </div>
              </div>

              <!-- Baris Tombol Aksi Minimalis -->
              <div class="flex justify-end gap-2 pt-1">
                <button
                  @click="konfirmasiAmbil(item)"
                  :disabled="
                    isLoading || !item.diambil || item.stok_saat_ini === 0
                  "
                  class="bg-[#f4e8d8] hover:bg-[#e5b976] text-[#8b5a33] hover:text-[#4a2f1d] border border-[#e8d5c4] text-xs font-bold py-1.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Ambil
                </button>

                <button
                  @click="kembalikanSisa(item)"
                  :disabled="
                    isLoading || !item.stok_bawa || item.stok_bawa <= 0
                  "
                  class="bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border border-gray-200 hover:border-red-200 text-xs font-bold py-1.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Kembalikan
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="listProduk.length === 0 && namaRider"
            class="text-center text-sm text-gray-400 py-8 bg-white rounded-2xl border border-gray-100"
          >
            Memuat data produk...
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- KOTAK KANAN (TOMBOL SIMPAN & LOG) -->
      <!-- ========================================== -->
      <div class="lg:w-80 flex flex-col space-y-6">
        <!-- Tombol Utama Simpan Penjualan -->
        <button
          @click="simpanPenjualanMasal"
          :disabled="isLoading || !namaRider"
          class="w-full bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white font-extrabold tracking-widest py-5 px-6 rounded-3xl shadow-lg hover:shadow-xl transition-all uppercase text-sm flex items-center justify-center gap-3 transform hover:-translate-y-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isLoading ? "Menyimpan..." : "Simpan Penjualan" }}
        </button>

        <!-- Kartu Log Jualan Baru -->
        <div
          class="bg-white rounded-3xl p-5 border border-[#e8d5c4] shadow-sm flex flex-col max-h-[500px]"
        >
          <div
            class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100"
          >
            <h3
              class="text-sm font-extrabold text-[#4a2f1d] flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-[#c28147]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Log Jualan Baru
            </h3>
            <button
              @click="ambilRiwayatHariIni"
              class="bg-[#fdf5e6] hover:bg-[#e5b976] text-[#8b5a33] hover:text-white transition-colors p-1.5 rounded-lg"
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
            </button>
          </div>

          <ul
            v-if="riwayatSesi.length > 0"
            class="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200"
          >
            <li
              v-for="(log, index) in riwayatSesi"
              :key="index"
              class="bg-[#fcf9f5] border border-gray-100 p-3.5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-[#e5b976] transition-colors"
            >
              <div
                class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-400 to-green-600"
              ></div>
              <div class="flex justify-between items-start mb-1.5 pl-2 gap-2">
                <span
                  class="font-extrabold text-[#8b5a33] text-xs truncate bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100"
                  >{{ log.rider }}</span
                >
                <span
                  class="text-green-700 font-extrabold text-xs bg-green-100 px-2 py-0.5 rounded-md border border-green-200 whitespace-nowrap shadow-sm"
                  >+ {{ log.terjual }} Laku</span
                >
              </div>
              <span
                class="text-[#4a2f1d] font-bold text-sm block truncate pl-2"
                :title="log.produk"
                >{{ log.produk }}</span
              >
            </li>
          </ul>

          <div
            v-else
            class="flex-1 flex flex-col items-center justify-center opacity-60 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-gray-500 text-xs font-medium text-center">
              Struk jualan hari ini belum ada.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// --- FUNGSI AMBIL TANGGAL LOKAL (ANTI UTC BUG) ---
const getTanggalLokal = () => {
  const tgl = new Date();
  const tahun = tgl.getFullYear();
  const bulan = String(tgl.getMonth() + 1).padStart(2, "0");
  const hari = String(tgl.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
};

// --- DATA REAKTIF ---
const listRider = ref([]);
const listProduk = ref([]);
const namaRider = ref("");
const tanggalInput = ref(getTanggalLokal());
const isLoading = ref(false);
const riwayatSesi = ref([]);

watch([namaRider, tanggalInput], () => {
  if (namaRider.value) {
    ambilDataGabungan();
  }
});

const ambilDataRider = async () => {
  try {
    const res = await fetch("http://localhost:3000/list-rider");
    listRider.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const ambilDataGabungan = async () => {
  try {
    const resKulkas = await fetch("http://localhost:3000/list-produk-tersedia");
    const dataKulkas = await resKulkas.json();

    let dataBox = [];
    if (namaRider.value && tanggalInput.value) {
      const resBox = await fetch(
        `http://localhost:3000/rider/box?nama_rider=${namaRider.value}&tanggal=${tanggalInput.value}`,
      );
      if (resBox.ok) {
        dataBox = await resBox.json();
      }
    }

    listProduk.value = dataKulkas.map((item) => {
      const diBox = dataBox.find((b) => b.nama_produk === item.nama_produk);
      return {
        ...item,
        stok_bawa: diBox ? diBox.stok_bawa : 0,
        total_terjual: diBox ? diBox.terjual : 0,
        diambil: null,
        terjual_input: null,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

const ambilRiwayatHariIni = async () => {
  try {
    const res = await fetch("http://localhost:3000/riwayat-hari-ini");
    riwayatSesi.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const konfirmasiAmbil = async (item) => {
  if (!namaRider.value) return alert("Pilih Nama Rider terlebih dahulu!");

  const jumlah = Number(item.diambil);
  if (!jumlah || jumlah <= 0) return alert("Masukkan jumlah yang diambil!");
  if (jumlah > item.stok_saat_ini)
    return alert(
      `Stok kulkas tidak cukup! Hanya sisa ${item.stok_saat_ini} cup.`,
    );

  isLoading.value = true;
  try {
    const response = await fetch("http://localhost:3000/rider/ambil-kulkas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_rider: namaRider.value,
        tanggal: tanggalInput.value,
        nama_produk: item.nama_produk,
        jumlah_diambil: jumlah,
      }),
    });

    if (response.ok) {
      item.diambil = null;
      ambilDataGabungan();
    } else {
      const hasil = await response.json();
      alert(`❌ Gagal: ${hasil.error}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const kembalikanSisa = async (item) => {
  if (!namaRider.value) return alert("Pilih Nama Rider terlebih dahulu!");

  const sisa = Number(item.stok_bawa);
  if (sisa <= 0) return;

  const konfirmasi = confirm(
    `Kembalikan ${sisa} cup ${item.nama_produk} ke kulkas?`,
  );
  if (!konfirmasi) return;

  isLoading.value = true;
  try {
    const response = await fetch(
      "http://localhost:3000/rider/kembalikan-stok",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_rider: namaRider.value,
          tanggal: tanggalInput.value,
          nama_produk: item.nama_produk,
          jumlah_dikembalikan: sisa,
        }),
      },
    );

    if (response.ok) {
      ambilDataGabungan();
    } else {
      const hasil = await response.json();
      alert(`❌ Gagal: ${hasil.error}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const simpanPenjualanMasal = async () => {
  if (!namaRider.value) return alert("Pilih Nama Rider terlebih dahulu!");

  const itemTerpilih = listProduk.value.filter(
    (item) => Number(item.terjual_input) > 0,
  );

  if (itemTerpilih.length === 0) {
    return alert(
      "Silakan isi angka pada kolom '3. Terjual' minimal pada 1 menu produk!",
    );
  }

  for (const item of itemTerpilih) {
    const laku = Number(item.terjual_input) || 0;
    const dibawa = Number(item.stok_bawa);

    if (laku > dibawa) {
      return alert(
        `Gagal: ${item.nama_produk} laku (${laku}) melebihi sisa di box motor (${dibawa})!`,
      );
    }
  }

  isLoading.value = true;
  let suksesCount = 0;

  for (const item of itemTerpilih) {
    const laku = Number(item.terjual_input) || 0;

    try {
      const response = await fetch("http://localhost:3000/rider/catat-laku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_rider: namaRider.value,
          tanggal: tanggalInput.value,
          nama_produk: item.nama_produk,
          terjual: laku,
        }),
      });

      if (response.ok) suksesCount++;
    } catch (error) {
      console.error(`Gagal menyimpan ${item.nama_produk}:`, error);
    }
  }

  alert(`✅ Berhasil mencatat ${suksesCount} struk penjualan!`);
  ambilDataGabungan();
  ambilRiwayatHariIni();
  isLoading.value = false;
};

onMounted(() => {
  ambilDataRider();
  ambilDataGabungan();
  ambilRiwayatHariIni();
});
</script>
