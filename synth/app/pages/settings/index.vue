<script setup>
import { reactive, onMounted } from "vue";
import { useColorMode } from "@vueuse/core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Select, SelectItem } from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const colorMode = useColorMode();
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  displayName: "",
  email: "",
  audioQuality: "standard",
  notifications: {
    mentions: true,
    follows: true,
    productUpdates: false,
  },
});

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

function logout() {
  authStore.clearAuth();
  router.push("/auth/login");
}

function saveSettings() {
  // TODO: wire to store / API
  // For now we just log the values
  // eslint-disable-next-line no-console
  console.log("Saving settings", JSON.parse(JSON.stringify(form)));
  alert("Settings saved (not wired)");
}

function resetSettings() {
  form.displayName = "";
  form.email = "";
  form.audioQuality = "standard";
  form.notifications.mentions = true;
  form.notifications.follows = true;
  form.notifications.productUpdates = false;
}
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <ClientOnly>
    <div class="min-h-[85vh] bg-background p-6">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Settings</h1>
          <p class="text-muted-foreground mt-1">
            Manage your preferences and account
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Sidebar: Main Settings -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Account Card -->
            <Card>
              <CardHeader class="border-b">
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <Label>Display name</Label>
                    <Input
                      v-model="form.displayName"
                      placeholder="Your display name"
                      class="mt-2"
                    />
                  </Field>

                  <Field>
                    <Label>Email</Label>
                    <Input
                      v-model="form.email"
                      placeholder="you@example.com"
                      type="email"
                      class="mt-2"
                    />
                  </Field>
                </div>

                <div class="flex gap-3 mt-6 pt-4 border-t">
                  <Button
                    @click="saveSettings"
                    class="bg-primary hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                  <Button
                    @click="resetSettings"
                    variant="outline"
                    class="border-gray-600"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <!-- Preferences Card -->
            <Card>
              <CardHeader class="border-b">
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="space-y-6">
                  <!-- Theme Toggle -->
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-secondary/30"
                  >
                    <div>
                      <p class="font-medium">Theme</p>
                      <p class="text-sm text-muted-foreground">
                        {{
                          colorMode.value === "dark"
                            ? "Dark mode"
                            : "Light mode"
                        }}
                      </p>
                    </div>
                    <Button
                      @click="toggleTheme"
                      size="sm"
                      :variant="
                        colorMode.value === 'dark' ? 'secondary' : 'outline'
                      "
                      class="transition-all"
                    >
                      <span v-if="colorMode.value === 'dark'">🌙 Dark</span>
                      <span v-else>☀️ Light</span>
                    </Button>
                  </div>

                  <!-- Audio Quality -->
                  <div
                    class="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-secondary/30"
                  >
                    <div>
                      <Label>Audio quality</Label>
                      <p class="text-sm text-muted-foreground mt-1">
                        Choose your preferred playback quality
                      </p>
                    </div>
                    <Select v-model="form.audioQuality">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High (HQ)</SelectItem>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right Sidebar: Additional Options -->
          <div class="space-y-6">
            <!-- Notifications Card -->
            <Card>
              <CardHeader class="border-b">
                <CardTitle class="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="space-y-4">
                  <div
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p class="font-medium text-sm">Mentions</p>
                      <p class="text-xs text-muted-foreground">
                        When someone mentions you
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      v-model="form.notifications.mentions"
                      class="h-5 w-5 rounded cursor-pointer"
                    />
                  </div>

                  <div
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p class="font-medium text-sm">New followers</p>
                      <p class="text-xs text-muted-foreground">
                        When someone follows you
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      v-model="form.notifications.follows"
                      class="h-5 w-5 rounded cursor-pointer"
                    />
                  </div>

                  <div
                    class="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p class="font-medium text-sm">Product updates</p>
                      <p class="text-xs text-muted-foreground">
                        News and feature updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      v-model="form.notifications.productUpdates"
                      class="h-5 w-5 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Danger Zone Card -->
            <Card class="border-red-900/50">
              <CardHeader class="border-b border-red-900/50">
                <CardTitle class="text-lg text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent class="pt-6 space-y-3">
                <Button @click="logout" variant="destructive" class="w-full">
                  Logout
                </Button>
                <Button
                  @click.prevent="
                    () => alert('Account deletion not implemented')
                  "
                  variant="destructive"
                  class="w-full opacity-70 hover:opacity-100"
                >
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
