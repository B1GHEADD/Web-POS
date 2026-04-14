<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-6xl mx-auto w-full space-y-8">
      <!-- HEADER -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#e5b976] pb-4 gap-4"
      >
        <div>
          <h1 class="text-3xl font-extrabold text-[#4a2f1d] tracking-tight">
            Manajemen Produksi
          </h1>
          <p class="text-sm text-[#8b5a33] mt-1 font-medium">
            Atur pemasukan bahan baku dan eksekusi resep harian Anda.
          </p>
        </div>
      </div>

      <!-- KONTEN UTAMA: 2 KARTU -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- ========================================== -->
        <!-- KARTU KIRI: INPUT BAHAN BAKU (MASUK) -->
        <!-- ========================================== -->
        <div
          class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ce97] border-opacity-50 hover:shadow-md transition-shadow duration-300 flex flex-col relative overflow-hidden"
        >
          <!-- Hiasan Sudut -->
          <div
            class="absolute -right-6 -top-6 bg-[#fdf5e6] w-24 h-24 rounded-full opacity-50 pointer-events-none"
          ></div>

          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4 relative z-10"
          >
            <div class="bg-[#c28147] p-2.5 rounded-xl shadow-inner text-white">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-[#4a2f1d]">
              Input Bahan Baku
              <span class="text-[#8b5a33] font-medium text-base"
                >(Restock)</span
              >
            </h2>
          </div>

          <div class="space-y-5 flex-1 relative z-10">
            <!-- Row 1: Tanggal & Nama -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-600"
                  >Tanggal Input</label
                >
                <input
                  type="date"
                  v-model="tanggalInputBahan"
                  class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] focus:bg-white transition-all font-medium"
                />
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-600"
                  >Nama Bahan</label
                >
                <select
                  v-model="namaBahanMasuk"
                  class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] focus:bg-white transition-all font-medium appearance-none"
                >
                  <option value="" disabled selected>Pilih Bahan...</option>
                  <option
                    v-for="(bahan, index) in listBahan"
                    :key="index"
                    :value="bahan.nama_bahan"
                  >
                    {{ bahan.nama_bahan }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 2: Jumlah & Satuan -->
            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-gray-600"
                >Jumlah & Satuan</label
              >
              <div class="flex gap-3">
                <input
                  type="number"
                  v-model="jumlahBahanMasuk"
                  placeholder="Contoh: 1000"
                  class="w-2/3 bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] focus:bg-white transition-all font-bold"
                />
                <select
                  v-model="satuanBahanMasuk"
                  class="w-1/3 bg-[#fdf8f2] border border-[#e8d5c4] text-[#8b5a33] font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] focus:bg-white transition-all appearance-none text-center"
                >
                  <option value="" disabled>Satuan</option>
                  <option>ml</option>
                  <option>Gram</option>
                  <option>Pcs</option>
                </select>
              </div>
            </div>

            <!-- Row 3: Harga Beli -->
            <div class="space-y-1.5">
              <label class="block text-sm font-bold text-gray-600"
                >Total Harga Beli (Rp)</label
              >
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-bold"
                  >Rp</span
                >
                <input
                  type="number"
                  v-model="hargaBahanMasuk"
                  placeholder="50000"
                  class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c28147] focus:bg-white transition-all font-bold"
                />
              </div>
            </div>

            <!-- Row 4: Expired -->
            <div class="space-y-1.5 pb-4">
              <label class="block text-sm font-bold text-gray-600"
                >Tanggal Kedaluwarsa (Expired)</label
              >
              <input
                type="date"
                v-model="expiredBahanMasuk"
                class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-red-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-white transition-all font-bold"
              />
            </div>

            <button
              @click="simpanRestock"
              :disabled="isRestockLoading"
              class="w-full bg-[#e5b976] hover:bg-[#c28147] disabled:bg-gray-300 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ isRestockLoading ? "Memproses..." : "Tambah ke Gudang" }}
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- KARTU KANAN: PRODUKSI KOPI (RESEP) -->
        <!-- ========================================== -->
        <div
          class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ce97] border-opacity-50 hover:shadow-md transition-shadow duration-300 flex flex-col relative overflow-hidden"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4 relative z-10"
          >
            <div class="bg-[#5c3a21] p-2.5 rounded-xl shadow-inner text-white">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-[#4a2f1d]">
              Produksi Kopi
              <span class="text-[#8b5a33] font-medium text-base"
                >(Sistem Resep)</span
              >
            </h2>
          </div>

          <div class="space-y-6 flex-1 flex flex-col relative z-10">
            <div
              class="bg-[#fdf5e6] p-4 rounded-2xl border border-[#f0ce97] flex gap-3 items-start shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-[#c28147] flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-xs text-[#8b5a33] font-medium leading-relaxed">
                Produksi otomatis akan
                <strong class="text-[#4a2f1d]">memotong stok bahan baku</strong>
                sesuai resep dan menambahkan stok produk jadi ke kulkas.
              </p>
            </div>

            <div class="space-y-5 flex-1">
              <!-- Tanggal Dibuat & Expired -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-gray-500 uppercase tracking-wide"
                    >Tgl Dibuat</label
                  >
                  <input
                    type="date"
                    v-model="tanggalProduksi"
                    class="w-full bg-[#fcf9f5] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5c3a21] font-medium text-sm"
                  />
                </div>
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-bold text-gray-500 uppercase tracking-wide"
                    >Expired (3 Hari)</label
                  >
                  <input
                    type="date"
                    :value="tanggalExpired"
                    disabled
                    class="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-3 py-2.5 cursor-not-allowed font-medium text-sm"
                  />
                </div>
              </div>

              <!-- Menu Dibuat -->
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-600"
                  >Menu yang Dibuat</label
                >
                <select
                  v-model="menuDibuat"
                  class="w-full bg-[#fcf9f5] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c3a21] transition-all font-bold text-lg appearance-none"
                >
                  <option value="" disabled selected>
                    Pilih Varian Kopi...
                  </option>
                  <option
                    v-for="(menu, index) in listMenu"
                    :key="index"
                    :value="menu.nama_produk"
                  >
                    {{ menu.nama_produk }}
                  </option>
                </select>
              </div>

              <!-- Jumlah Porsi -->
              <div class="space-y-1.5 pb-4">
                <label class="block text-sm font-bold text-gray-600"
                  >Jumlah Porsi</label
                >
                <div class="flex items-center gap-3">
                  <input
                    type="number"
                    v-model="jumlahProduksi"
                    placeholder="0"
                    class="w-1/2 bg-[#fcf9f5] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c3a21] transition-all font-extrabold text-2xl text-center"
                  />
                  <span class="text-gray-500 font-bold text-lg">Cup</span>
                </div>
              </div>
            </div>

            <!-- Tombol Eksekusi -->
            <button
              @click="simpanProduksi"
              :disabled="isProduksiLoading"
              class="w-full bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-400 disabled:to-gray-500 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
              {{
                isProduksiLoading ? "Memproses Resep..." : "Eksekusi Produksi"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// --- FUNGSI AMBIL TANGGAL LOKAL (ANTI UTC BUG) ---
const getTanggalLokal = () => {
  const tgl = new Date();
  const tahun = tgl.getFullYear();
  const bulan = String(tgl.getMonth() + 1).padStart(2, "0");
  const hari = String(tgl.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
};

// ==========================================
// 1. DATA REAKTIF SISI KIRI (RESTOCK BAHAN)
// ==========================================
const tanggalInputBahan = ref(getTanggalLokal());
const namaBahanMasuk = ref("");
const jumlahBahanMasuk = ref(null);
const satuanBahanMasuk = ref("");
const hargaBahanMasuk = ref(null);
const expiredBahanMasuk = ref("");
const isRestockLoading = ref(false);

const listBahan = ref([]);

// ==========================================
// 2. DATA REAKTIF SISI KANAN (PRODUKSI KOPI)
// ==========================================
const tanggalProduksi = ref(getTanggalLokal());
const menuDibuat = ref("");
const jumlahProduksi = ref(null);
const isProduksiLoading = ref(false);

const listMenu = ref([]);

// --- LOGIKA TANGGAL EXPIRED PRODUKSI (+3 HARI) ---
const tanggalExpired = computed(() => {
  if (!tanggalProduksi.value) return "";
  const tgl = new Date(tanggalProduksi.value);
  tgl.setDate(tgl.getDate() + 3);
  const year = tgl.getFullYear();
  const month = String(tgl.getMonth() + 1).padStart(2, "0");
  const day = String(tgl.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});

// ==========================================
// FUNGSI TARIK DATA DARI BACKEND
// ==========================================
const ambilDataMenu = async () => {
  try {
    const res = await fetch("http://localhost:3000/list-menu-produksi");
    const data = await res.json();
    listMenu.value = data;
  } catch (err) {
    console.error("Gagal menarik data menu:", err);
  }
};

const ambilDataBahan = async () => {
  try {
    const res = await fetch("http://localhost:3000/list-bahan-baku");
    const data = await res.json();
    listBahan.value = data;
  } catch (err) {
    console.error("Gagal menarik data bahan baku:", err);
  }
};

// ==========================================
// 3. FUNGSI SIMPAN RESTOCK BAHAN BAKU (KIRI)
// ==========================================
const simpanRestock = async () => {
  if (
    !tanggalInputBahan.value ||
    !namaBahanMasuk.value ||
    !jumlahBahanMasuk.value ||
    !satuanBahanMasuk.value ||
    !hargaBahanMasuk.value ||
    !expiredBahanMasuk.value
  ) {
    alert("⚠️ Gagal menyimpan! Harap lengkapi semua data input bahan baku.");
    return;
  }

  if (jumlahBahanMasuk.value <= 0 || hargaBahanMasuk.value <= 0) {
    alert("⚠️ Jumlah Stok dan Harga harus lebih dari 0.");
    return;
  }

  isRestockLoading.value = true;

  try {
    const response = await fetch("http://localhost:3000/restock-bahan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tanggal_input: tanggalInputBahan.value,
        nama_bahan: namaBahanMasuk.value,
        jumlah_masuk: jumlahBahanMasuk.value,
        satuan: satuanBahanMasuk.value,
        harga_total: hargaBahanMasuk.value,
        tanggal_expired: expiredBahanMasuk.value,
      }),
    });

    const hasil = await response.json();

    if (response.ok) {
      alert(
        `✅ Berhasil!\nStok ${namaBahanMasuk.value} telah ditambahkan ke gudang.`,
      );
      namaBahanMasuk.value = "";
      jumlahBahanMasuk.value = null;
      satuanBahanMasuk.value = "";
      hargaBahanMasuk.value = null;
      expiredBahanMasuk.value = "";
    } else {
      alert(`❌ Gagal: ${hasil.error || "Gagal memperbarui database"}`);
    }
  } catch (error) {
    console.error("Error simpan restock:", error);
    alert("❌ Terjadi kesalahan koneksi ke server backend.");
  } finally {
    isRestockLoading.value = false;
  }
};

// ==========================================
// 4. FUNGSI SIMPAN PRODUKSI KOPI (KANAN)
// ==========================================
const simpanProduksi = async () => {
  if (
    !tanggalProduksi.value ||
    !menuDibuat.value ||
    !jumlahProduksi.value ||
    jumlahProduksi.value <= 0
  ) {
    alert(
      "⚠️ Gagal menyimpan! Harap isi Tanggal Produksi, Pilih Menu, dan Jumlah Porsi.",
    );
    return;
  }

  const yakin = confirm(
    `Apakah Anda yakin ingin memproduksi ${jumlahProduksi.value} Cup ${menuDibuat.value}?`,
  );
  if (!yakin) return;

  isProduksiLoading.value = true;

  try {
    const response = await fetch("http://localhost:3000/produksi-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_produk: menuDibuat.value,
        jumlah_produksi: jumlahProduksi.value,
      }),
    });

    const hasil = await response.json();

    if (response.ok) {
      alert(`✅ Berhasil!\n${hasil.message || "Stok berhasil dipotong."}`);
      menuDibuat.value = "";
      jumlahProduksi.value = null;
    } else {
      if (hasil.detail && hasil.detail.length > 0) {
        alert(
          `❌ Gagal: ${hasil.error}\n\nDetail:\n- ${hasil.detail.join("\n- ")}`,
        );
      } else {
        alert(`❌ Gagal: ${hasil.error || "Terjadi kesalahan"}`);
      }
    }
  } catch (error) {
    console.error("Error saat simpan produksi:", error);
    alert("❌ Terjadi kesalahan koneksi ke server backend.");
  } finally {
    isProduksiLoading.value = false;
  }
};

// ==========================================
// JALANKAN SAAT HALAMAN PERTAMA DIBUKA
// ==========================================
onMounted(() => {
  ambilDataMenu();
  ambilDataBahan();
});
</script>
