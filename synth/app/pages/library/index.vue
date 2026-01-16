<template>
  <div class="mt-3 border mx-auto w-[85rem] min-h-[85vh] p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Audio Library</h1>
      <p class="text-muted-foreground">
        Explore and comment on audios from the community
      </p>
    </div>

    <div v-if="audioStore.loading" class="text-center py-8">
      <p class="text-muted-foreground">Loading audios...</p>
    </div>

    <div v-else-if="audioStore.audios.length === 0" class="text-center py-8">
      <p class="text-muted-foreground">
        No audios yet. Start by creating one in the studio!
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AudioCard
        v-for="audio in audioStore.audios"
        :key="audio.id"
        :audio="audio"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAudioStore } from "@/stores/audio";
import AudioCard from "@/components/AudioCard.vue";

const audioStore = useAudioStore();

onMounted(() => {
  audioStore.fetchAudios();
});

definePageMeta({
  middleware: "auth",
});
</script>
