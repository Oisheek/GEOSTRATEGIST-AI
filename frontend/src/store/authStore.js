import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);

    set({
      user,
      token,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },

  setUser: (user) => {
    set({ user });
  },
}));

export default useAuthStore;