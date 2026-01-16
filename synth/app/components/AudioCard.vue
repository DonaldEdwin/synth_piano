<template>
  <Card class="w-full">
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <CardTitle>{{ audio.title }}</CardTitle>
          <CardDescription>by {{ audio.fullname }}</CardDescription>
          <p class="text-xs text-muted-foreground mt-1">
            {{ new Date(audio.created_at).toLocaleDateString() }}
          </p>
        </div>
        <Button
          v-if="isOwner"
          @click="deleteAudio"
          :disabled="deleting"
          size="sm"
          variant="destructive"
        >
          {{ deleting ? "Deleting..." : "Delete" }}
        </Button>
      </div>
    </CardHeader>

    <CardContent class="pb-4">
      <audio :src="audio.file_path" controls class="w-full mb-4" />
    </CardContent>

    <Separator class="my-4" />

    <CardContent class="pt-4">
      <CommentsSection :audio="audio" />
    </CardContent>
  </Card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAudioStore } from "@/stores/audio";
import { useAuthStore } from "@/stores/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CommentsSection from "./CommentsSection.vue";
import { apiDelete } from "@/utils/api";

const props = defineProps({
  audio: {
    type: Object,
    required: true,
  },
});

const audioStore = useAudioStore();
const authStore = useAuthStore();
const deleting = ref(false);

const isOwner = computed(() => {
  return authStore.user?.id === props.audio.user_id;
});

const deleteAudio = async () => {
  if (!confirm("Are you sure you want to delete this audio?")) return;

  deleting.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await apiDelete(`/audios/${props.audio.id}`, token);
    if (response.success) {
      await audioStore.fetchAudios();
    }
  } catch (err) {
    console.error("Failed to delete audio:", err);
  } finally {
    deleting.value = false;
  }
};
</script>
