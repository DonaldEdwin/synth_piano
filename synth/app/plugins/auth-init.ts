export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Initialize auth from storage immediately
  authStore.initFromStorage();
});
