import { defineStore } from "pinia";
import { apiGet, apiPost } from "@/utils/api"; // <-- your API wrapper

export const useAudioStore = defineStore("audio", {
  state: () => ({
    audios: [],
    loading: false,
  }),

  actions: {
    async fetchAudios() {
      try {
        const token = localStorage.getItem("token");
        this.audios = await apiGet("/audios", token);
      } catch (err) {
        console.error("Failed to fetch audios:", err);
      }
    },

    async uploadAudio(formData) {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        await apiPost("/audios", formData, token); // FormData supported in apiPost
        await this.fetchAudios();
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Audio upload failed");
      } finally {
        this.loading = false;
      }
    },
  },
});
