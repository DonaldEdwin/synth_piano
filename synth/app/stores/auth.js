import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    initFromStorage() {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          this.decodeUser(token);
        }
      }
    },

    setToken(token) {
      this.token = token;
      this.decodeUser(token);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },

    decodeUser(token) {
      if (!token) {
        this.user = null;
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.user = {
          id: payload.id,
          fullname: payload.fullname,
        };
      } catch (err) {
        console.error("Failed to decode token:", err);
        this.user = null;
      }
    },

    clearAuth() {
      this.token = "";
      this.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});
