<template>
  <main
    class="flex-1 flex flex-col p-4 md:p-8 relative overflow-y-auto w-full h-full bg-[#fcf9f5]"
  >
    <div class="max-w-6xl mx-auto w-full space-y-8 h-full flex flex-col">
      <!-- HEADER -->
      <div
        class="flex justify-between items-end border-b border-[#e5b976] pb-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[#4a2f1d]">Laporan Keuangan</h1>
          <p class="text-sm text-[#8b5a33] mt-1">
            Pantau arus kas, laba rugi, dan performa finansial Kupi Kita
          </p>
        </div>
      </div>

      <!-- KONTEN COMING SOON -->
      <div class="flex-1 flex items-center justify-center pb-20">
        <div
          class="bg-[#fffbf7] rounded-3xl p-10 md:p-16 shadow-sm border border-[#f0ce97] border-opacity-40 text-center max-w-lg w-full flex flex-col items-center"
        >
          <!-- Ikon Waktu / Konstruksi (Animasi Pulse) -->
          <div
            class="w-24 h-24 bg-[#fdf5e6] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#e5b976] animate-pulse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-[#c28147]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 class="text-3xl font-extrabold text-[#4a2f1d] mb-3">
            Coming Soon!
          </h2>
          <p class="text-[#8b5a33] mb-8 leading-relaxed">
            Fitur Laporan Keuangan sedang dalam tahap pengembangan. Nantinya
            Anda dapat melihat detail laba/rugi, pengeluaran bahan baku, dan
            arus kas secara komprehensif di halaman ini.
          </p>

          <!-- Tombol Kembali (Bisa menggunakan router-link jika vue-router digunakan) -->
          <router-link
            to="/"
            class="bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Kembali ke Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// Halaman Coming Soon biasanya statis, jadi kita belum memerlukan logika javascript atau fetch API di sini.
</script>
