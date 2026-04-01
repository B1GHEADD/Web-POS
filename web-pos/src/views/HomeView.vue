<template>
  <main class="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 w-full">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-xl md:text-2xl font-semibold text-[#4a2f1d]">
        Selamat Datang, Admin!
      </h1>
      <div class="flex items-center space-x-4">
        <div
          class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border-2 border-[#6b4226]"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin"
          />
        </div>
        <button
          class="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-[#6b4226]"
        >
          🔔
        </button>
        <button
          class="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-[#6b4226]"
        >
          ⚙️
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        class="p-5 rounded-2xl bg-gradient-to-r from-[#6b4226] to-[#8b5a33] text-white shadow-md"
      >
        <p class="text-sm opacity-80">Penjualan Hari Ini</p>
        <h2 class="text-2xl font-bold mt-1">Rp 2.500.000</h2>
      </div>
      <div
        class="p-5 rounded-2xl bg-gradient-to-r from-[#e5b976] to-[#f0ce97] text-[#4a2f1d] shadow-md"
      >
        <p class="text-sm opacity-80 font-medium">Kopi Terjual</p>
        <h2 class="text-2xl font-bold mt-1">
          120 <span class="text-lg font-normal">Cup</span>
        </h2>
      </div>
      <div
        class="p-5 rounded-2xl bg-[#f4e8d8] border border-[#e5b976] text-[#4a2f1d] shadow-sm"
      >
        <p class="text-sm opacity-80 font-medium">Biaya Produksi</p>
        <h2 class="text-2xl font-bold mt-1">Rp 900.000</h2>
      </div>
      <div
        class="p-5 rounded-2xl bg-gradient-to-r from-[#6b705c] to-[#8a907a] text-white shadow-md"
      >
        <p class="text-sm opacity-80">Estimasi Profit</p>
        <h2 class="text-2xl font-bold mt-1">Rp 1.600.000</h2>
      </div>
    </div>
  </main>
</template>
