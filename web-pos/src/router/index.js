import { createRouter, createWebHistory } from "vue-router";
import Swal from "sweetalert2"; // Import SweetAlert2
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

// ==========================================
// SATPAM PENJAGA ROUTE (NAVIGATION GUARD)
// ==========================================
import { useAuthStore } from "../stores/auth";

router.beforeEach((to, from, next) => {
  // Ambil data user dari Pinia Store
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;

  // 1. Jika BELUM login, dan mencoba akses halaman selain Login (/), tendang ke Login!
  if (!isAuthenticated && to.path !== "/") {
    return next("/");
  }

  // 2. Jika SUDAH login, tapi iseng buka halaman Login (/), arahkan ke Dashboard
  if (isAuthenticated && to.path === "/") {
    return next("/dashboard");
  }

  // 3. PEMBATASAN BERDASARKAN ROLE & CABANG
  if (isAuthenticated && user) {
    const isSuperAdmin = authStore.isSuperAdmin;

    // --- ROLE SUPER ADMIN PUSAT ---
    if (isSuperAdmin) {
      // Super Admin hanya pantau data, DILARANG masuk ke produksi atau kasir rider
      const allowedSuperAdminPaths = [
        "/dashboard",
        "/laporan-produksi",
        "/laporan-penjualan",
        "/laporan-keuangan",
      ];
      if (!allowedSuperAdminPaths.includes(to.path)) {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Super Admin hanya dapat mengakses halaman Laporan & Dashboard Pusat.",
          confirmButtonColor: "#8b5a33",
        });
        return next("/dashboard");
      }
    }

    // --- ROLE ADMIN CABANG ---
    // Admin cabang (role 'admin' dengan id_cabang terisi) tidak dibatasi di else ini, bebas ke mana saja di cabangnya.

    // --- ROLE RIDER ---
    else if (user.role === "rider") {
      const allowedRiderPaths = ["/dashboard", "/rider", "/laporan-penjualan"];
      if (!allowedRiderPaths.includes(to.path)) {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini bukan untuk akses Rider!",
          confirmButtonColor: "#8b5a33",
        });
        return next("/dashboard");
      }
    }

    // --- ROLE PRODUKSI ---
    else if (user.role === "produksi") {
      const allowedProduksiPaths = [
        "/dashboard",
        "/produksi",
        "/laporan-produksi",
      ];
      if (!allowedProduksiPaths.includes(to.path)) {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Halaman ini khusus Tim Produksi & Admin!",
          confirmButtonColor: "#8b5a33",
        });
        return next("/dashboard");
      }
    }
  }

  // Jika lolos semua pemeriksaan di atas, silakan masuk (buka pintu)
  next();
});

export default router;
