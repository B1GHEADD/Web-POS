import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import RiderView from "@/views/RiderView.vue";
import ProduksiView from "@/views/ProduksiView.vue";
import LaporanProduksiView from "@/views/LaporanProduksiView.vue";
import LaporanPenjualanView from "@/views/LaporanPenjualanView.vue";
import LaporanKeuanganView from "@/views/LaporanKeuanganView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "LoginView",
      component: LoginView,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: DashboardView,
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
    {
      path: "/laporan-keuangan",
      name: "laporan-keuangan",
      component: LaporanKeuanganView,
    },
  ],
});

// --- SATPAM PENJAGA ROUTE (NAVIGATION GUARD) ---
router.beforeEach((to, from, next) => {
  // Ambil data user dari penyimpanan browser
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // 1. Jika BELUM login, dan mencoba akses halaman selain Login (/), tendang ke Login!
  if (!user && to.path !== "/") {
    return next("/");
  }

  // 2. Jika SUDAH login, tapi iseng buka halaman Login (/), arahkan ke Dashboard
  if (user && to.path === "/") {
    return next("/dashboard");
  }

  // 3. PEMBATASAN BERDASARKAN ROLE
  if (user) {
    // --- ROLE RIDER ---
    if (user.role === "rider") {
      // Daftar halaman yang BOLEH diakses Rider
      const allowedRiderPaths = ["/dashboard", "/rider", "/laporan-penjualan"];
      if (!allowedRiderPaths.includes(to.path)) {
        alert("Akses Ditolak: Halaman ini bukan untuk akses Rider!");
        return next("/dashboard");
      }
    }

    // --- ROLE PRODUKSI ---
    if (user.role === "produksi") {
      // Daftar halaman yang BOLEH diakses Tim Produksi
      const allowedProduksiPaths = [
        "/dashboard",
        "/produksi",
        "/laporan-produksi",
      ];
      if (!allowedProduksiPaths.includes(to.path)) {
        alert("Akses Ditolak: Halaman ini khusus Tim Produksi & Admin!");
        return next("/dashboard");
      }
    }

    // --- ROLE ADMIN ---
    // Admin bebas ke mana saja, jadi tidak ada blokir untuk admin.
  }

  // Jika lolos semua pemeriksaan di atas, silakan masuk (buka pintu)
  next();
});

export default router;
