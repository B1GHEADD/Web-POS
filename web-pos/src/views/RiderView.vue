<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-6 relative overflow-hidden w-full h-full"
  >
    <div
      class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 my-auto"
    >
      <!-- KOTAK KIRI -->
      <div
        class="bg-[#fffbf7] rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ce97] border-opacity-40 flex-1 flex flex-col"
      >
        <h2
          class="text-xl font-bold text-[#4a2f1d] mb-4 border-b border-[#e5b976] pb-2"
        >
          Input Penjualan Harian
        </h2>

        <div class="flex flex-wrap gap-4 mb-6">
          <div class="flex-1 min-w-[200px]">
            <label class="font-medium text-[#4a2f1d] text-sm block mb-1"
              >Nama Rider</label
            >
            <select
              v-model="namaRider"
              class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            >
              <option value="" disabled selected>Pilih Rider</option>
              <option
                v-for="(rider, index) in listRider"
                :key="index"
                :value="rider.nama_rider"
              >
                {{ rider.nama_rider }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="font-medium text-[#4a2f1d] text-sm block mb-1"
              >Tanggal</label
            >
            <input
              type="date"
              v-model="tanggalInput"
              class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            />
          </div>
        </div>

        <!-- DAFTAR PRODUK -->
        <div class="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[300px]">
          <div
            v-for="(item, index) in listProduk"
            :key="index"
            class="flex flex-col xl:flex-row justify-between items-start xl:items-center p-4 bg-white border rounded-xl shadow-sm hover:border-[#8b5a33] transition-colors gap-4"
            :class="
              item.stok_saat_ini === 0
                ? 'border-red-200 bg-red-50 hover:border-red-400 opacity-80'
                : 'border-[#f0ce97]'
            "
          >
            <!-- Info Kiri -->
            <div class="w-full xl:w-1/3 text-center xl:text-left pt-2">
              <span
                class="font-bold block text-base"
                :class="
                  item.stok_saat_ini === 0 ? 'text-red-800' : 'text-[#4a2f1d]'
                "
              >
                {{ item.nama_produk }}
              </span>
              <!-- Tampilan Stok Merah jika 0 -->
              <span
                v-if="item.stok_saat_ini === 0"
                class="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md mt-1 inline-block border border-red-200"
              >
                Stok Kulkas: HABIS
              </span>
              <!-- Tampilan Stok Normal -->
              <span
                v-else
                class="text-xs font-semibold text-[#8b5a33] bg-[#fdf5e6] px-2 py-1 rounded-md mt-1 inline-block border border-[#f0ce97]"
              >
                Stok Kulkas: {{ item.stok_saat_ini }}
              </span>
            </div>

            <!-- 4 Kolom Kanan & Tombol Aksi -->
            <div class="w-full xl:w-2/3 flex flex-col gap-3">
              <div class="grid grid-cols-4 gap-2 items-start">
                <!-- 1. Ambil -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                    >1. Ambil</label
                  >
                  <input
                    type="number"
                    v-model="item.diambil"
                    placeholder="0"
                    :disabled="item.stok_saat_ini === 0"
                    class="w-full text-center border-2 rounded-lg py-1.5 focus:outline-none font-bold text-sm"
                    :class="
                      item.stok_saat_ini === 0
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400'
                        : 'bg-white border-[#e5b976] text-[#4a2f1d] focus:border-[#8b5a33]'
                    "
                  />
                </div>

                <!-- 2. Dibawa -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[9px] md:text-[10px] font-bold text-[#8b5a33] uppercase tracking-wider mb-1 text-center w-full whitespace-nowrap"
                    >2. Dibawa</label
                  >
                  <input
                    type="number"
                    :value="item.stok_bawa || 0"
                    disabled
                    class="w-full text-center bg-[#fdf5e6] border border-[#e5b976] text-[#8b5a33] font-extrabold rounded-lg py-1.5 cursor-not-allowed text-sm"
                  />
                </div>

                <!-- 3. Terjual -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                    >3. Terjual</label
                  >
                  <input
                    type="number"
                    v-model="item.terjual_input"
                    placeholder="0"
                    class="w-full text-center bg-white border-2 border-[#e5b976] text-[#4a2f1d] rounded-lg py-1.5 focus:outline-none focus:border-[#8b5a33] font-bold text-sm"
                  />
                  <!-- INDIKATOR TOTAL TERJUAL HARI INI -->
                  <span
                    class="text-[8px] md:text-[9px] font-bold text-green-600 mt-1.5 text-center bg-green-50 px-2 py-0.5 rounded-md border border-green-200 whitespace-nowrap"
                  >
                    Total Laku: {{ item.total_terjual || 0 }}
                  </span>
                </div>

                <!-- 4. Sisa -->
                <div class="flex flex-col items-center">
                  <label
                    class="text-[9px] md:text-[10px] font-bold text-[#8b5a33] uppercase tracking-wider mb-1"
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
                    class="w-full text-center bg-[#8b5a33] border border-[#5c3a21] text-white font-bold rounded-lg py-1.5 cursor-not-allowed text-sm shadow-inner"
                  />
                </div>
              </div>

              <!-- Baris Tombol Aksi -->
              <div
                class="flex flex-wrap items-center gap-3 border-t border-[#f0ce97] border-opacity-40 pt-3 mt-1"
              >
                <!-- Tombol Konfirmasi Ambil -->
                <button
                  @click="konfirmasiAmbil(item)"
                  :disabled="
                    isLoading || !item.diambil || item.stok_saat_ini === 0
                  "
                  class="bg-[#c28147] hover:bg-[#8b5a33] text-white text-[10px] md:text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
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
                  Ambil Stok
                </button>

                <!-- Tombol Kembalikan Sisa -->
                <button
                  @click="kembalikanSisa(item)"
                  :disabled="
                    isLoading || !item.stok_bawa || item.stok_bawa <= 0
                  "
                  class="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] md:text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
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
                  Kembalikan Sisa ({{ item.stok_bawa || 0 }})
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="listProduk.length === 0"
            class="text-center text-sm text-gray-400 py-8"
          >
            Sistem tidak dapat memuat data produk.
          </div>
        </div>
      </div>

      <!-- KOTAK KANAN -->
      <div class="lg:w-64 flex flex-col space-y-4">
        <button
          @click="simpanPenjualanMasal"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-400 disabled:to-gray-500 text-white font-bold tracking-wide py-4 px-4 rounded-2xl shadow-lg transition-all uppercase text-sm flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
          {{ isLoading ? "Memproses..." : "Simpan Penjualan" }}
        </button>

        <div
          class="bg-[#fffbf7] rounded-2xl p-4 border border-[#e5b976] border-opacity-40 shadow-sm flex flex-col max-h-[500px]"
        >
          <h3
            class="text-sm font-bold text-[#4a2f1d] mb-3 border-b border-[#e5b976] pb-2 flex justify-between items-center"
          >
            Log Jualan Baru
            <button
              @click="ambilRiwayatHariIni"
              class="text-[10px] bg-[#e5b976] text-white px-2 py-0.5 rounded hover:bg-[#c28147]"
            >
              Refresh
            </button>
          </h3>

          <ul
            v-if="riwayatSesi.length > 0"
            class="space-y-3 overflow-y-auto pr-2 flex-1"
          >
            <li
              v-for="(log, index) in riwayatSesi"
              :key="index"
              class="text-xs bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group"
            >
              <div
                class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
              ></div>
              <div class="flex justify-between items-start mb-1 gap-2 pl-2">
                <span class="font-extrabold text-[#8b5a33] truncate">{{
                  log.rider
                }}</span>
                <span
                  class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded whitespace-nowrap border border-green-100"
                  >+ {{ log.terjual }} Laku</span
                >
              </div>
              <span
                class="text-[#4a2f1d] font-medium block truncate pl-2"
                :title="log.produk"
                >{{ log.produk }}</span
              >
            </li>
          </ul>

          <div
            v-else
            class="flex-1 flex flex-col items-center justify-center opacity-50"
          >
            <p class="text-gray-400 text-xs italic text-center">
              Belum ada struk masuk
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
const tanggalInput = ref(getTanggalLokal()); // MEMANGGIL FUNGSI LOKAL DI SINI
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
