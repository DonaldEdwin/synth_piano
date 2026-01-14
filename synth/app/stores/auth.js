import {defineStore} from "pinia";

export const useAuthstore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || "",
        username: ""
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem("token", token)
        }
    },
    clearAuth() {
      this.token = "";
      this.username = "";
      localStorage.removeItem("token");
    },
    setUsername(name) {
      this.username = name;
    },
})