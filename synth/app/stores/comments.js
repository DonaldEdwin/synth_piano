import { defineStore } from "pinia";
import { apiGet, apiPost, apiDelete } from "@/utils/api";

export const useCommentsStore = defineStore("comments", {
  state: () => ({
    comments: {},
    loading: false,
  }),

  actions: {
    async fetchComments(audioId) {
      try {
        if (!this.comments[audioId]) {
          this.comments[audioId] = [];
        }
        const token = localStorage.getItem("token");
        this.comments[audioId] = await apiGet(`/comments/${audioId}`, token);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    },

    async addComment(audioId, body) {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await apiPost(`/comments/${audioId}`, { body }, token);
        if (response.success) {
          await this.fetchComments(audioId);
        }
        return response;
      } catch (err) {
        console.error("Failed to add comment:", err);
      } finally {
        this.loading = false;
      }
    },

    async deleteComment(commentId, audioId) {
      try {
        const token = localStorage.getItem("token");
        const response = await apiDelete(`/comments/${commentId}`, token);
        if (response.success) {
          await this.fetchComments(audioId);
        }
        return response;
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
    },
  },
});
