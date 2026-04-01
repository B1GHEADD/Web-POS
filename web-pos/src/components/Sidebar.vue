<template>
  <aside
    class="w-64 bg-[#4a2f1d] text-white flex flex-col justify-between hidden md:flex rounded-r-3xl shadow-xl z-20 h-screen sticky top-0"
  >
    <div>
      <div class="p-6 flex items-center space-x-3">
        <div
          class="w-8 h-8 rounded-full bg-[#cda989] flex items-center justify-center text-xs"
        >
          ☕
        </div>
        <span class="text-2xl font-bold tracking-wider">Kupi Kita</span>
      </div>

      <nav class="mt-4 flex flex-col">
        <RouterLink
          to="/"
          :class="[
            'flex items-center px-6 py-4 transition-colors',
            $route.path === '/'
              ? 'bg-[#6b4226] border-l-4 border-white font-semibold text-white'
              : 'text-gray-300 hover:bg-[#6b4226] border-l-4 border-transparent',
          ]"
        >
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/rider"
          :class="[
            'flex items-center px-6 py-4 transition-colors',
            $route.path === '/rider'
              ? 'bg-[#6b4226] border-l-4 border-white font-semibold text-white'
              : 'text-gray-300 hover:bg-[#6b4226] border-l-4 border-transparent',
          ]"
        >
          <span>Rider POS</span>
        </RouterLink>

        <RouterLink
          to="/produksi"
          :class="[
            'flex items-center px-6 py-4 transition-colors',
            $route.path === '/produksi'
              ? 'bg-[#6b4226] border-l-4 border-white font-semibold text-white'
              : 'text-gray-300 hover:bg-[#6b4226] border-l-4 border-transparent',
          ]"
        >
          <span>Produksi</span>
        </RouterLink>

        <div class="relative group cursor-pointer">
          <div
            class="flex items-center justify-between px-6 py-4 hover:bg-[#6b4226] transition-colors text-gray-300 border-l-4 border-transparent"
          >
            <span>Laporan</span>
            <span
              class="text-xs transition-transform group-hover:rotate-180 opacity-70"
              >▼</span
            >
          </div>

          <div
            class="hidden group-hover:block bg-[#3e2511] w-full py-2 shadow-inner"
          >
            <RouterLink
              to="/laporan-produksi"
              class="block px-10 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#5a361d] transition-colors"
            >
              Laporan Produksi
            </RouterLink>
            <RouterLink
              to="laporan-penjualan"
              class="block px-10 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#5a361d] transition-colors"
            >
              Laporan Penjualan
            </RouterLink>
            <RouterLink
              to="/laporan/keuangan"
              class="block px-10 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#5a361d] transition-colors"
            >
              Laporan Keuangan
            </RouterLink>
          </div>
        </div>

        <a
          href="#"
          class="flex items-center px-6 py-4 hover:bg-[#6b4226] transition-colors text-gray-300 border-l-4 border-transparent"
        >
          <span>Pengaturan</span>
        </a>
      </nav>
    </div>

    <div class="p-6">
      <div
        class="w-full h-32 bg-[#3e2511] rounded-xl flex items-center justify-center text-sm text-gray-400 border border-[#5c3a21]"
      >
        [Ilustrasi Kopi]
      </div>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
