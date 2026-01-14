<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { apiPost } from "~/utils/api";
import LoginForm from "@/components/login-04/components/LoginForm.vue";

const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const error = ref("");

async function handleLogin({ email, password }) {
  loading.value = true;
  error.value = "";

  try {
    const res = await apiPost("/auth/login", { email, password });

    if (res.error) {
      error.value = res.error;
      return;
    }

    // Save token in Pinia + localStorage
    auth.setToken(res.token);

    // Optionally decode username later or fetch profile
    router.push("/"); 
  } catch (e) {
    error.value = "Login failed";
  } finally {
    loading.value = false;
  }
}
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
  >
    <div class="w-full max-w-sm md:max-w-4xl">
      <LoginForm :loading="loading" @submit="handleLogin" />

      <p v-if="error" class="text-red-500 mt-2">
        {{ error }}
      </p>
    </div>
  </div>
</template>
