<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-6 relative overflow-hidden w-full h-full"
  >
    <div
      class="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-6 my-auto"
    >
      <div
        class="bg-[#fffbf7] rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ce97] border-opacity-40 flex-1"
      >
        <h2
          class="text-xl font-bold text-[#4a2f1d] mb-5 border-b border-[#e5b976] pb-2"
        >
          Input Penjualan
        </h2>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="font-medium text-[#4a2f1d] text-sm md:text-base"
              >Nama Rider</label
            >
            <select
              v-model="namaRider"
              class="w-48 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
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

          <div class="flex justify-between items-center">
            <label class="font-medium text-[#4a2f1d] text-sm md:text-base"
              >Tanggal</label
            >
            <input
              type="date"
              v-model="tanggalInput"
              class="w-48 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            />
          </div>

          <div class="flex justify-between items-center">
            <label class="font-medium text-[#4a2f1d] text-sm md:text-base"
              >Nama Produk</label
            >
            <select
              v-model="namaProduk"
              class="w-48 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            >
              <option value="" disabled selected>Pilih Produk</option>
              <option v-if="listProduk.length === 0" disabled>
                Semua Stok Kosong
              </option>
              <option
                v-for="(produk, index) in listProduk"
                :key="index"
                :value="produk.nama_produk"
              >
                {{ produk.nama_produk }}
              </option>
            </select>
          </div>

          <div class="flex justify-between items-center">
            <label class="font-medium text-[#4a2f1d] text-sm md:text-base"
              >Jumlah Dibawa</label
            >
            <input
              type="number"
              placeholder="0"
              v-model="jumlahDibawa"
              class="w-24 text-center bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            />
          </div>

          <div class="flex justify-between items-center">
            <label class="font-medium text-[#4a2f1d] text-sm md:text-base"
              >Terjual</label
            >
            <input
              type="number"
              placeholder="0"
              v-model="terjual"
              class="w-24 text-center bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
            />
          </div>

          <div
            class="flex justify-between items-center pt-3 border-t border-[#f0ce97] border-opacity-50"
          >
            <label class="font-bold text-[#4a2f1d] text-sm md:text-base"
              >Sisa Produk</label
            >
            <div
              class="w-24 text-center bg-[#8b5a33] text-white font-bold rounded-lg px-3 py-2 shadow-inner text-sm"
            >
              {{ sisaKopi }}
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-64 flex flex-col space-y-4 md:mt-[64px]">
        <button
          @click="simpanPenjualan"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all"
        >
          {{ isLoading ? "Menyimpan..." : "Simpan Data" }}
        </button>

        <div
          class="bg-[#fffbf7] rounded-xl p-4 border border-[#e5b976] border-opacity-40 shadow-sm flex-1 flex flex-col min-h-[200px]"
        >
          <h3
            class="text-sm font-bold text-[#4a2f1d] mb-3 border-b border-[#e5b976] pb-2"
          >
            Riwayat Hari Ini
          </h3>

          <ul
            v-if="riwayatSesi.length > 0"
            class="space-y-3 overflow-y-auto max-h-[200px] pr-1"
          >
            <li
              v-for="(item, index) in riwayatSesi"
              :key="index"
              class="text-xs bg-white p-2 rounded border border-gray-100 shadow-sm"
            >
              <span class="font-bold text-[#8b5a33] block">{{
                item.rider
              }}</span>
              <span class="text-[#4a2f1d]">{{ item.produk }}</span>
              <span class="block text-green-600 font-semibold mt-1"
                >Laku: {{ item.terjual }} Cup</span
              >
            </li>
          </ul>

          <div v-else class="flex-1 flex items-center justify-center">
            <p class="text-gray-400 text-xs italic text-center">
              Belum ada data diinput
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// --- DATA REAKTIF ---
const listRider = ref([]);
const listProduk = ref([]); // Penampung produk dinamis
const namaRider = ref("");
const tanggalInput = ref(new Date().toISOString().split("T")[0]);
const namaProduk = ref("");
const jumlahDibawa = ref(null);
const terjual = ref(null);
const isLoading = ref(false);
const riwayatSesi = ref([]);

// --- LOGIKA SISA PRODUK ---
const sisaKopi = computed(() => {
  const bawa = Number(jumlahDibawa.value) || 0;
  const jual = Number(terjual.value) || 0;
  return bawa >= jual ? bawa - jual : 0;
});

// --- FUNGSI AMBIL NAMA RIDER ---
const ambilDataRider = async () => {
  try {
    const response = await fetch("http://localhost:3000/list-rider");
    const data = await response.json();
    listRider.value = data;
  } catch (error) {
    console.error("Gagal mengambil data rider:", error);
  }
};

// --- FUNGSI AMBIL NAMA PRODUK (> 0) ---
const ambilDataProduk = async () => {
  try {
    const response = await fetch("http://localhost:3000/list-produk-tersedia");
    const data = await response.json();
    listProduk.value = data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
  }
};

// --- FUNGSI AMBIL RIWAYAT HARI INI DARI DATABASE ---
const ambilRiwayatHariIni = async () => {
  try {
    const response = await fetch("http://localhost:3000/riwayat-hari-ini");
    const data = await response.json();
    riwayatSesi.value = data; // Timpa ingatan kosong dengan data dari database
  } catch (error) {
    console.error("Gagal mengambil riwayat hari ini:", error);
  }
};

// --- FUNGSI SIMPAN TRANSAKSI ---
const simpanPenjualan = async () => {
  if (
    !namaRider.value ||
    !tanggalInput.value ||
    !namaProduk.value ||
    jumlahDibawa.value === null ||
    terjual.value === null
  ) {
    alert("⚠️ Gagal: Harap isi semua kolom data!");
    return;
  }

  if (Number(terjual.value) > Number(jumlahDibawa.value)) {
    alert(
      "⚠️ Gagal: Jumlah terjual tidak boleh lebih besar dari jumlah yang dibawa!",
    );
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch("http://localhost:3000/penjualan-rider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_rider: namaRider.value,
        tanggal: tanggalInput.value,
        nama_produk: namaProduk.value,
        jumlah_dibawa: jumlahDibawa.value,
        terjual: terjual.value,
        sisa: sisaKopi.value,
      }),
    });

    const hasil = await response.json();

    if (response.ok) {
      alert(`✅ Transaksi Tersimpan!\n${hasil.message}`);

      riwayatSesi.value.unshift({
        rider: namaRider.value,
        produk: namaProduk.value,
        terjual: terjual.value,
      });

      jumlahDibawa.value = null;
      terjual.value = null;
      namaProduk.value = "";

      // Refresh daftar produk agar yang stoknya habis otomatis hilang dari dropdown
      ambilDataProduk();
    } else {
      alert(`❌ Gagal: ${hasil.error}`);
    }
  } catch (error) {
    console.error("Error simpan penjualan:", error);
    alert("❌ Terjadi kesalahan saat menghubungi server.");
  } finally {
    isLoading.value = false;
  }
};

// --- JALANKAN SAAT HALAMAN DIBUKA ---
onMounted(() => {
  ambilDataRider();
  ambilDataProduk();
  ambilRiwayatHariIni();
});
</script>
