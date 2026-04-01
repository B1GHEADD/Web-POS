import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RiderView from "@/views/RiderView.vue";
import ProduksiView from "@/views/ProduksiView.vue";
import LaporanProduksiView from "@/views/LaporanProduksiView.vue";
import LaporanPenjualanView from "@/views/LaporanPenjualanView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/rider",
      name: "rider",
      component: RiderView,
    },
    {
      path: "/produksi",
      name: "produksi",
      component: ProduksiView,
    },
    {
      path: "/laporan-produksi",
      name: "laporan-produksi",
      component: LaporanProduksiView,
    },
    {
      path: "/laporan-penjualan",
      name: "laporan-penjualan",
      component: LaporanPenjualanView,
    },
  ],
});

export default router;
