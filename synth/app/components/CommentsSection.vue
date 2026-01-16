<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h3 class="font-semibold text-sm">Comments ({{ comments.length }})</h3>
      
      <div v-if="!isAuthenticated" class="text-sm text-muted-foreground p-2 border rounded">
        <NuxtLink to="/auth/login" class="text-primary hover:underline">Login</NuxtLink> to comment
      </div>

      <div v-else class="space-y-2">
        <div class="flex gap-2">
          <input
            v-model="newComment"
            placeholder="Add a comment..."
            class="flex-1 px-3 py-2 border rounded-md text-sm"
            :disabled="commentsStore.loading"
          />
          <Button
            @click="submitComment"
            size="sm"
            :disabled="!newComment.trim() || commentsStore.loading"
          >
            {{ commentsStore.loading ? "Posting..." : "Comment" }}
          </Button>
        </div>
      </div>
    </div>

    <div class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="p-3 border rounded-md space-y-1"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-semibold text-sm">{{ comment.fullname }}</p>
            <p class="text-sm text-muted-foreground">{{ comment.body }}</p>
          </div>
          <Button
            v-if="canDeleteComment(comment.id)"
            @click="deleteComment(comment.id)"
            size="sm"
            variant="ghost"
            class="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          {{ new Date(comment.created_at).toLocaleDateString() }}
        </p>
      </div>

      <div v-if="comments.length === 0" class="text-center py-4 text-muted-foreground text-sm">
        No comments yet. Be the first to comment!
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useCommentsStore } from "@/stores/comments";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";

const props = defineProps({
  audio: {
    type: Object,
    required: true,
  },
});

const commentsStore = useCommentsStore();
const authStore = useAuthStore();
const newComment = ref("");

const isAuthenticated = computed(() => !!authStore.user);
const comments = computed(() => commentsStore.comments[props.audio.id] || []);

const canDeleteComment = (commentId) => {
  const comment = comments.value.find((c) => c.id === commentId);
  return comment && authStore.user?.id === comment.user_id;
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  await commentsStore.addComment(props.audio.id, newComment.value);
  newComment.value = "";
};

const deleteComment = async (commentId) => {
  if (!confirm("Delete this comment?")) return;
  await commentsStore.deleteComment(commentId, props.audio.id);
};

onMounted(() => {
  commentsStore.fetchComments(props.audio.id);
});

watch(
  () => props.audio.id,
  () => {
    commentsStore.fetchComments(props.audio.id);
  }
);
</script>
