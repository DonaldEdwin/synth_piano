import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    fullName: "",
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
        }
      }
    },

    setToken(token) {
      this.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },

    clearAuth() {
      this.token = "";
      this.fullName = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },

    setFullName(name) {
      this.fullName = name;
    },
  },
});
