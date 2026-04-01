<template>
  <div class="flex bg-[#fdfaf6] font-sans min-h-screen">
    <Sidebar />

    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import { RouterView } from "vue-router";
</script>
