import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  BASE_URL:
    Platform.OS === "android"
      ? "http://10.0.2.2:3000/api/auth"
      : "http://localhost:3000/api/auth",

  register: async (username, email, password) => {
    set({ isLoading: true });
    const BASE_URL = get().BASE_URL;
    try {
      console.log("Registering user...", username, email, password);
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const BASE_URL = get().BASE_URL;
    set({ isLoading: true });
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log(error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
