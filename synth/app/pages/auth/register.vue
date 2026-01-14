<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiPost } from "~/utils/api";
import SignupForm from "@/components/signup-04/components/SignupForm.vue";

const router = useRouter();

const loading = ref(false);
const error = ref("");

async function handleRegister({ username, email, password }) {
  loading.value = true;
  error.value = "";

  try {
    const res = await apiPost("/auth/register", {
      username,
      email,
      password,
    });

    if (res.error) {
      error.value = res.error;
      return;
    }

    // After successful registration, send user to login
    router.push("/login");
  } catch (e) {
    error.value = "Registration failed";
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
      <SignupForm :loading="loading" @submit="handleRegister" />
      <p v-if="error" class="text-red-500 mt-2">
        {{ error }}
      </p>
    </div>
  </div>
</template>
