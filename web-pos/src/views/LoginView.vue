<template>
  <div
    class="min-h-screen bg-[#fcf9f5] flex flex-col justify-center items-center p-4 relative overflow-hidden"
  >
    <div
      class="absolute -top-40 -right-40 w-96 h-96 bg-[#fdf5e6] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
    ></div>
    <div
      class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#f0ce97] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
    ></div>

    <div
      class="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-[#f0ce97] border-opacity-50 w-full max-w-md relative z-10"
    >
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fdf5e6] border-2 border-[#e5b976] text-[#8b5a33] mb-4 shadow-inner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-[#4a2f1d]">
          Kupi <span class="text-[#c28147]">Kita</span>
        </h1>
        <p class="text-sm text-gray-500 mt-2 font-medium">
          Silakan masuk ke akun Anda
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >Username</label
          >
          <input
            type="text"
            v-model="username"
            required
            class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-medium"
            placeholder="Masukkan username..."
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >Password</label
          >
          <input
            type="password"
            v-model="password"
            required
            class="w-full bg-[#fdf8f2] border border-[#e8d5c4] text-[#4a2f1d] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c28147] transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-[#8b5a33] to-[#5c3a21] hover:from-[#6b4226] hover:to-[#3e2511] disabled:from-gray-400 disabled:to-gray-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          {{ isLoading ? "Memeriksa..." : "Masuk ke Sistem" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const success = await authStore.login(username.value, password.value);

    if (success) {
      router.push("/dashboard");
    } else {
      alert(authStore.error || "Login gagal.");
    }
  } catch (error) {
    alert("Terjadi kesalahan sistem.");
  } finally {
    isLoading.value = false;
  }
};
</script>
