export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register"];

  // If route is not public and user is not authenticated, redirect to login
  if (!publicRoutes.includes(to.path) && !authStore.isLoggedIn) {
    return navigateTo("/auth/login");
  }
});
