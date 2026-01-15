<script setup>
import { reactive } from "vue";
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();

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
</script>

<template>
  <ClientOnly>
    <div class="max-w-5xl mx-auto p-6">
      <h1 class="text-2xl font-semibold mb-4">Settings</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium">Account</h2>
                <p class="text-sm text-muted-foreground">
                  Update your personal information.
                </p>
              </div>
              <div>
                <Button size="sm" variant="ghost" @click="resetSettings"
                  >Reset</Button
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <Label>Display name</Label>
                <Input
                  v-model="form.displayName"
                  placeholder="Your display name"
                />
              </Field>

              <Field>
                <Label>Email</Label>
                <Input v-model="form.email" placeholder="you@example.com" />
              </Field>
            </div>
          </Card>

          <Card>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium">Preferences</h2>
                <p class="text-sm text-muted-foreground">
                  Playback and appearance options.
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <Field>
                <Label>Theme</Label>
                <div class="flex items-center gap-3">
                  <Button size="sm" variant="outline" @click="toggleTheme">
                    <span v-if="colorMode.value === 'dark'">🌙 Dark</span>
                    <span v-else>☀️ Light</span>
                  </Button>
                </div>
              </Field>

              <Field>
                <Label>Audio quality</Label>
                <Select v-model="form.audioQuality">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High (HQ)</SelectItem>
                </Select>
              </Field>
            </div>
          </Card>
        </div>

        <div class="space-y-6">
          <Card>
            <div>
              <h2 class="text-lg font-medium">Notifications</h2>
              <p class="text-sm text-muted-foreground">
                Manage email and in-app notifications.
              </p>
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Mentions</div>
                  <div class="text-sm text-muted-foreground">
                    Notify me when someone mentions me
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="form.notifications.mentions"
                  class="h-5 w-5"
                />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">New followers</div>
                  <div class="text-sm text-muted-foreground">
                    Notify me when someone follows me
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="form.notifications.follows"
                  class="h-5 w-5"
                />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Product updates</div>
                  <div class="text-sm text-muted-foreground">
                    News and feature updates
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="form.notifications.productUpdates"
                  class="h-5 w-5"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div>
              <h2 class="text-lg font-medium text-destructive">Danger zone</h2>
              <p class="text-sm text-muted-foreground">
                Actions that cannot be undone.
              </p>
            </div>

            <div class="mt-4 flex gap-3">
              <Button
                variant="destructive"
                @click.prevent="() => alert('Account deletion not implemented')"
                >Delete account</Button
              >
              <Button variant="outline" @click="saveSettings"
                >Save changes</Button
              >
            </div>
          </Card>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
