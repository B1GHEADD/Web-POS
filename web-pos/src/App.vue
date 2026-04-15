<template>
  <div class="flex h-screen w-full bg-[#fdfaf6] font-sans overflow-hidden">
    <Sidebar v-if="$route.path !== '/'" class="flex-shrink-0 shadow-xl z-20" />

    <main class="flex-1 h-full overflow-y-auto relative scroll-smooth">
      <div :class="$route.path !== '/' ? 'p-4 md:p-8' : 'h-full'">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import { RouterView } from "vue-router";
</script>
