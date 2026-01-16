<script setup>


import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAudioStore } from "@/stores/audio";
import { useRouter } from "vue-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const authStore = useAuthStore();
const audioStore = useAudioStore();
const router = useRouter();

const userAudioCount = computed(() => {
  return audioStore.audios.filter(
    (audio) => audio.user_id === authStore.user?.id
  ).length;
});

const logout = () => {
  authStore.clearAuth();
  router.push("/auth/login");
};

onMounted(() => {
  audioStore.fetchAudios();
});

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <ClientOnly>
    <div class="min-h-[85vh] bg-background p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold mb-2">My Profile</h1>
          <p class="text-muted-foreground">
            View your profile and manage your account
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Profile Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- User Info Card -->
            <Card class="border-primary/30">
              <CardHeader class="border-b border-primary/20">
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="space-y-6">
                  <!-- User Name -->
                  <div
                    class="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-primary/20"
                  >
                    <div>
                      <p class="text-sm text-muted-foreground">Full Name</p>
                      <p class="text-lg font-semibold mt-1">
                        {{ authStore.user?.fullname || "User" }}
                      </p>
                    </div>
                  </div>

                  <!-- User ID -->
                  <!-- <div
                    class="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-primary/20"
                  >
                    <div>
                      <p class="text-sm text-muted-foreground">User ID</p>
                      <p class="text-lg font-mono mt-1">
                        {{ authStore.user?.id || "N/A" }}
                      </p>
                    </div>
                 
                  </div> -->
                </div>
              </CardContent>
            </Card>

            <!-- Stats Card -->
            <Card class="border-primary/30">
              <CardHeader class="border-b border-primary/20">
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-primary/20"
                  >
                    <p class="text-sm text-muted-foreground">Audios Created</p>
                    <p class="text-3xl font-bold mt-2">{{ userAudioCount }}</p>
                  </div>
                  <div
                    class="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-primary/20"
                  >
                    <p class="text-sm text-muted-foreground">Member Since</p>
                    <p class="text-lg font-semibold mt-2">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right Column: Actions -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <Card class="border-primary/30">
              <CardHeader class="border-b border-primary/20">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent class="pt-6 space-y-3">
                <NuxtLink to="/studio">
                  <Button class="w-full bg-primary hover:bg-primary/90">
                    Go to Studio
                  </Button>
                </NuxtLink>
                <NuxtLink to="/library">
                  <Button variant="outline" class="w-full border-primary/30">
                     Browse Library
                  </Button>
                </NuxtLink>
              
              </CardContent>
            </Card>

            <!-- Danger Zone -->
            <Card class="border-red-900/50">
              <CardHeader class="border-b border-red-900/50">
                <CardTitle class="text-red-400">Account</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <Button @click="logout" variant="destructive" class="w-full">
                  <span class="mr-2">🚪</span> Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
