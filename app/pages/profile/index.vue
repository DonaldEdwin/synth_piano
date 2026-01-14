<script setup>
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <ClientOnly>
    <Button variant="outline" @click="isDark = !isDark">
      <span v-if="colorMode.value === 'dark'">🌙</span>
      <span v-else>☀️</span>
      <span class="ml-2">Toggle Theme</span>
    </Button>
  </ClientOnly>
</template>
