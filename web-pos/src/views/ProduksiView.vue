<template>
  <main
    class="flex-1 flex items-center justify-center p-2 md:p-4 overflow-hidden w-full h-full"
  >
    <div class="max-w-5xl w-full">
      <div
        class="bg-[#fffbf7] rounded-2xl p-4 md:p-5 shadow-sm border border-[#f0ce97] border-opacity-40 flex flex-col md:flex-row gap-4 md:gap-6"
      >
        <div class="flex-1">
          <h2
            class="text-base md:text-lg font-bold text-[#4a2f1d] mb-3 border-b border-[#e5b976] pb-2"
          >
            Input Bahan Baku (Masuk)
          </h2>

          <div class="space-y-2.5">
            <div>
              <label
                class="block font-medium text-[#4a2f1d] mb-0.5 text-xs md:text-sm"
                >Tanggal Input</label
              >
              <input
                type="date"
                v-model="tanggalInputBahan"
                class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              />
            </div>

            <div>
              <label
                class="block font-medium text-[#4a2f1d] mb-0.5 text-xs md:text-sm"
                >Nama Bahan</label
              >
              <select
                v-model="namaBahanMasuk"
                class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              >
                <option value="" disabled selected>Pilih Bahan</option>
                <option>Biji Kopi Arabika</option>
                <option>Biji Kopi Robusta</option>
                <option>Susu UHT Fresh Milk</option>
                <option>Susu Oat (Oatmilk)</option>
                <option>Gula Aren Cair</option>
                <option>Gula Putih Cair</option>
                <option>Sirup Vanilla</option>
                <option>Sirup Caramel</option>
                <option>Sirup Butterscotch</option>
                <option>Sirup Hazelnut</option>
                <option>Bubuk Matcha</option>
                <option>Bubuk Coklat</option>
                <option>Gelas Cup Plastik (Ice)</option>
                <option>Gelas Cup Kertas (Hot)</option>
              </select>
            </div>

            <div>
              <label
                class="block font-medium text-[#4a2f1d] mb-0.5 text-xs md:text-sm"
                >Jumlah & Satuan</label
              >
              <div class="flex space-x-2">
                <input
                  type="number"
                  v-model="jumlahBahanMasuk"
                  placeholder="0"
                  class="w-2/3 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
                />
                <select
                  v-model="satuanBahanMasuk"
                  class="w-1/3 bg-[#f4e8d8] border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
                >
                  <option value="" disabled>Pilih</option>
                  <option>ml</option>
                  <option>gram</option>
                  <option>pcs</option>
                </select>
              </div>
            </div>

            <div>
              <label
                class="block font-medium text-[#4a2f1d] mb-0.5 text-xs md:text-sm"
                >Total Harga Beli (Rp)</label
              >
              <input
                type="number"
                v-model="hargaBahanMasuk"
                placeholder="Contoh: 50000"
                class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              />
            </div>

            <div>
              <label
                class="block font-medium text-[#4a2f1d] mb-0.5 text-xs md:text-sm"
                >Tanggal Expired Bahan</label
              >
              <input
                type="date"
                v-model="expiredBahanMasuk"
                class="w-full bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              />
            </div>

            <div class="flex justify-end pt-1">
              <button
                @click="simpanRestock"
                :disabled="isRestockLoading"
                class="w-full bg-[#c28147] hover:bg-[#a66a35] disabled:bg-gray-400 text-white font-semibold py-1.5 px-6 rounded-lg shadow transition-colors text-sm"
              >
                {{ isRestockLoading ? "Memproses..." : "Tambah Stok Gudang" }}
              </button>
            </div>
          </div>
        </div>

        <div class="hidden md:block w-px bg-[#e5b976] opacity-50"></div>

        <div class="flex-1">
          <h2
            class="text-base md:text-lg font-bold text-[#4a2f1d] mb-3 border-b border-[#e5b976] pb-2"
          >
            Produksi Kopi (Sistem Resep)
          </h2>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="font-medium text-[#4a2f1d] text-xs md:text-sm"
                >Tanggal Dibuat</label
              >
              <input
                type="date"
                v-model="tanggalProduksi"
                class="w-48 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              />
            </div>

            <div class="flex justify-between items-center">
              <label class="font-medium text-[#4a2f1d] text-xs md:text-sm"
                >Tanggal Expired (3 Hari)</label
              >
              <input
                type="date"
                :value="tanggalExpired"
                disabled
                class="w-48 bg-gray-100 border border-[#e5b976] text-[#8b5a33] font-semibold rounded-lg px-3 py-1.5 focus:outline-none cursor-not-allowed text-sm"
              />
            </div>

            <div class="flex justify-between items-center">
              <label class="font-medium text-[#4a2f1d] text-xs md:text-sm"
                >Menu yang Dibuat</label
              >
              <select
                v-model="menuDibuat"
                class="w-48 bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
              >
                <option value="" disabled selected>Pilih Menu</option>
                <option>Espresso Hot</option>
                <option>Americano Ice</option>
                <option>Kopi Susu Gula Aren</option>
                <option>Vanilla Latte Ice</option>
                <option>Caramel Macchiato Ice</option>
                <option>Butterscotch Coffee Ice</option>
                <option>Hazelnut Latte Hot</option>
                <option>Oatmilk Kopi Susu</option>
                <option>Matcha Latte Ice</option>
                <option>Classic Chocolate Ice</option>
              </select>
            </div>

            <div class="flex justify-between items-center">
              <label class="font-medium text-[#4a2f1d] text-xs md:text-sm"
                >Jumlah Porsi</label
              >
              <div class="flex items-center space-x-2 w-48">
                <input
                  type="number"
                  placeholder="0"
                  v-model="jumlahProduksi"
                  class="w-20 text-center bg-white border border-[#e5b976] text-[#4a2f1d] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8b5a33] text-sm"
                />
                <span class="text-[#4a2f1d] font-medium text-xs md:text-sm"
                  >Cup</span
                >
              </div>
            </div>

            <div
              class="bg-[#f4e8d8] p-2 rounded-lg border border-[#e5b976] mt-2 shadow-inner"
            >
              <p
                class="text-[11px] text-[#8b5a33] text-center font-medium m-0 leading-tight"
              >
                *Stok bahan baku otomatis terpotong & stok barang jadi bertambah
                di database.
              </p>
            </div>

            <div class="flex justify-end pt-2">
              <button
                @click="simpanProduksi"
                :disabled="isProduksiLoading"
                class="bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-1.5 px-8 rounded-lg shadow-md transition-all text-sm"
              >
                {{ isProduksiLoading ? "Memproses..." : "Simpan Produksi" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";

// ==========================================
// 1. DATA REAKTIF SISI KIRI (RESTOCK BAHAN)
// ==========================================
const tanggalInputBahan = ref("");
const namaBahanMasuk = ref("");
const jumlahBahanMasuk = ref(null);
const satuanBahanMasuk = ref("");
const hargaBahanMasuk = ref(null);
const expiredBahanMasuk = ref("");
const isRestockLoading = ref(false);

// ==========================================
// 2. DATA REAKTIF SISI KANAN (PRODUKSI KOPI)
// ==========================================
const tanggalProduksi = ref("");
const menuDibuat = ref("");
const jumlahProduksi = ref(null);
const isProduksiLoading = ref(false);

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
      alert(`❌ Gagal: ${hasil.error || "Terjadi kesalahan"}`);
    }
  } catch (error) {
    console.error("Error saat simpan produksi:", error);
    alert("❌ Terjadi kesalahan koneksi ke server backend.");
  } finally {
    isProduksiLoading.value = false;
  }
};
</script>
