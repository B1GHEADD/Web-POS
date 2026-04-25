<template>
  <main class="flex-1 p-4 md:p-8 bg-[#fcf9f5] min-h-screen">
    <div
      class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 items-start"
    >
      <div class="flex-1 flex flex-col gap-6 w-full">
        <div
          class="glass-card rounded-3xl p-6 shadow-md border border-white/50 flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden animate-fade-in-up"
        >
          <div
            class="absolute -left-6 -top-6 bg-[#fdf5e6] w-24 h-24 rounded-full opacity-50 pointer-events-none animate-float"
          ></div>

          <div class="relative z-10 w-full md:w-1/3">
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4a2f1d] to-[#8b5a33] tracking-tight">
              Kasir Rider <span class="text-[#c28147]">POS</span>
            </h1>
            <p class="text-sm text-[#8b5a33] mt-1 font-semibold">
              Catat serah terima dan penjualan harian rider.
            </p>
          </div>

          <div
            class="flex flex-col md:flex-row gap-4 w-full md:w-2/3 relative z-10"
          >
            <div class="flex-1">
              <label
                class="block text-xs font-bold text-gray-500 uppercase mb-1.5 pl-1 tracking-wider"
                >Nama Rider</label
              >
              <div class="relative">
                <select
                  v-model="namaRider"
                  :disabled="isRiderLocked"
                  class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-bold appearance-none disabled:bg-gray-100 shadow-sm"
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
                class="block text-xs font-bold text-gray-500 uppercase mb-1.5 pl-1 tracking-wider"
                >Tanggal</label
              >
              <input
                type="date"
                v-model="tanggalInput"
                class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-bold shadow-sm"
              />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-if="!namaRider"
            class="bg-[#fdf5e6] rounded-2xl p-8 text-center border border-dashed border-[#e5b976] flex flex-col items-center justify-center h-48"
          >
            <p class="text-[#8b5a33] font-bold text-lg">
              Silakan pilih Nama Rider terlebih dahulu.
            </p>
          </div>

          <div
            v-else
            v-for="(item, index) in listProduk"
            :key="index"
            class="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 animate-fade-in-up"
            :style="`animation-delay: ${index * 0.05}s`"
          >
            <div class="w-full xl:w-1/3">
              <h3 class="font-black text-xl text-[#4a2f1d] mb-1">
                {{ item.nama_produk }}
              </h3>
              <span
                class="text-xs font-bold text-[#8b5a33] bg-[#fdf5e6] px-2.5 py-1 rounded-md border border-[#e5b976]/50"
              >
                Stok Kulkas: {{ item.stok_saat_ini }}
              </span>
            </div>

            <div class="w-full xl:w-2/3 flex flex-col gap-4">
              <div class="grid grid-cols-4 gap-3">
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wide"
                    >1. Ambil</label
                  >
                  <input
                    type="number"
                    v-model="item.diambil"
                    class="w-full text-center rounded-xl py-2 bg-[#fdf8f2] border border-[#e8d5c4] focus:ring-2 focus:ring-[#c28147] focus:outline-none transition-all font-bold text-lg"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-black text-[#c28147] uppercase mb-1.5 tracking-wide"
                    >2. Dibawa</label
                  >
                  <input
                    type="number"
                    :value="item.stok_bawa || 0"
                    disabled
                    class="w-full text-center bg-[#fdf5e6] border border-[#e5b976]/50 text-[#c28147] font-black rounded-xl py-2 text-xl"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wide"
                    >3. Terjual</label
                  >
                  <input
                    type="number"
                    v-model="item.terjual_input"
                    class="w-full text-center bg-[#fdf8f2] border border-[#e8d5c4] focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-green-700 rounded-xl py-2 font-black text-xl"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <label
                    class="text-[10px] font-black text-[#8b5a33] uppercase mb-1.5 tracking-wide"
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
                    class="w-full text-center bg-gradient-to-b from-[#8b5a33] to-[#5c3a21] border border-[#5c3a21] text-white font-black rounded-xl py-2 text-xl shadow-inner"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-1">
                <button
                  @click="konfirmasiAmbil(item)"
                  class="bg-[#f4e8d8] hover:bg-[#e5b976] text-[#8b5a33] hover:text-white transition-colors text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm"
                >
                  Ambil
                </button>
                <button
                  @click="kembalikanSisa(item)"
                  class="bg-white hover:bg-red-50 text-red-500 border border-red-200 transition-colors text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm"
                >
                  Kembalikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="w-full lg:w-80 sticky top-4 z-40 flex flex-col space-y-6">
        <button
          @click="simpanPenjualanMasal"
          :disabled="isLoading || !namaRider"
          class="w-full btn-primary py-5 px-6 rounded-3xl tracking-widest uppercase text-sm flex items-center justify-center gap-3 animate-fade-in-up" style="animation-delay: 0.3s;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {{ isLoading ? "Menyimpan..." : "Simpan Penjualan" }}
        </button>

        <div
          class="bg-white rounded-3xl p-5 border border-[#e8d5c4] shadow-sm flex flex-col max-h-[calc(100vh-160px)]"
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
              class="bg-[#fdf5e6] text-[#8b5a33] p-1.5 rounded-lg"
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
            class="space-y-3 overflow-y-auto pr-2 flex-1"
          >
            <li
              v-for="(log, index) in riwayatSesi"
              :key="index"
              class="bg-[#fcf9f5] border border-gray-100 p-3.5 rounded-2xl shadow-sm relative overflow-hidden group"
            >
              <div
                class="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"
              ></div>
              <div class="flex justify-between items-start mb-1.5 pl-2 gap-2">
                <span
                  class="font-extrabold text-[#8b5a33] text-xs bg-white px-2 py-0.5 rounded border"
                  >{{ log.rider }}</span
                >
                <span
                  class="text-green-700 font-extrabold text-xs bg-green-100 px-2 py-0.5 rounded-md"
                  >+ {{ log.terjual }} Laku</span
                >
              </div>
              <span
                class="text-[#4a2f1d] font-bold text-sm block truncate pl-2"
                >{{ log.produk }}</span
              >
            </li>
          </ul>
          <div
            v-else
            class="flex-1 flex flex-col items-center justify-center opacity-60 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6"
          >
            <p class="text-gray-500 text-xs font-medium text-center">
              Belum ada struk hari ini.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import apiClient from "../services/axios";

// AMBIL ID CABANG DARI LOCALSTORAGE
const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData);
  }
  return { id_cabang: 1 }; // Fallback jika belum login
};
const idCabang = getUserData().id_cabang;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const getTanggalLokal = () => {
  const tgl = new Date();
  return `${tgl.getFullYear()}-${String(tgl.getMonth() + 1).padStart(2, "0")}-${String(tgl.getDate()).padStart(2, "0")}`;
};

const listRider = ref([]);
const listProduk = ref([]);
const namaRider = ref("");
const tanggalInput = ref(getTanggalLokal());
const isLoading = ref(false);
const riwayatSesi = ref([]);
const isRiderLocked = ref(false);

watch([namaRider, tanggalInput], () => {
  if (namaRider.value) ambilDataGabungan();
});

const ambilDataRider = async () => {
  try {
    const res = await apiClient.get(`/list-rider?id_cabang=${idCabang}`);
    listRider.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const ambilDataGabungan = async () => {
  try {
    const resKulkas = await apiClient.get(`/list-produk-tersedia?id_cabang=${idCabang}`);
    const dataKulkas = resKulkas.data;
    let dataBox = [];
    if (namaRider.value) {
      const resBox = await apiClient.get(`/rider/box?nama_rider=${namaRider.value}&tanggal=${tanggalInput.value}&id_cabang=${idCabang}`);
      dataBox = resBox.data;
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
    const res = await apiClient.get(`/riwayat-hari-ini?id_cabang=${idCabang}`);
    riwayatSesi.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const konfirmasiAmbil = async (item) => {
  if (!namaRider.value)
    return Swal.fire("Peringatan", "Pilih Rider!", "warning");
  isLoading.value = true;
  try {
    await apiClient.post("/rider/ambil-kulkas", {
      id_cabang: idCabang,
      nama_rider: namaRider.value,
      tanggal: tanggalInput.value,
      nama_produk: item.nama_produk,
      jumlah_diambil: item.diambil,
    });
    item.diambil = null;
    Toast.fire({ icon: "success", title: "Berhasil mengambil stok" });
    ambilDataGabungan();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.error || "Gagal mengambil stok", "error");
  } finally {
    isLoading.value = false;
  }
};

const kembalikanSisa = async (item) => {
  const result = await Swal.fire({
    title: "Kembalikan?",
    icon: "question",
    showCancelButton: true,
  });
  if (!result.isConfirmed) return;
  isLoading.value = true;
  try {
    await apiClient.post("/rider/kembalikan-stok", {
      id_cabang: idCabang,
      nama_rider: namaRider.value,
      tanggal: tanggalInput.value,
      nama_produk: item.nama_produk,
      jumlah_dikembalikan: item.stok_bawa,
    });
    ambilDataGabungan();
    Toast.fire({ icon: "success", title: "Stok dikembalikan" });
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.response?.data?.error || "Gagal mengembalikan stok", "error");
  } finally {
    isLoading.value = false;
  }
};

const simpanPenjualanMasal = async () => {
  const itemTerpilih = listProduk.value.filter(
    (i) => Number(i.terjual_input) > 0,
  );
  if (!itemTerpilih.length)
    return Swal.fire("Info", "Isi kolom terjual!", "info");
  isLoading.value = true;
  for (const item of itemTerpilih) {
    try {
      await apiClient.post("/rider/catat-laku", {
        id_cabang: idCabang,
        nama_rider: namaRider.value,
        tanggal: tanggalInput.value,
        nama_produk: item.nama_produk,
        terjual: item.terjual_input,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.error || "Gagal mencatat transaksi", "error");
      isLoading.value = false;
      return;
    }
  }
  Swal.fire("Berhasil", "Data tersimpan", "success");
  ambilDataGabungan();
  ambilRiwayatHariIni();
  isLoading.value = false;
};

onMounted(() => {
  ambilDataRider();
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    if (user.role === "rider") {
      namaRider.value = user.nama_lengkap;
      isRiderLocked.value = true;
    }
  }
  ambilDataGabungan();
  ambilRiwayatHariIni();
});
</script>
