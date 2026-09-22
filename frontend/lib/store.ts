import { create } from "zustand";
import { Language } from "./translations";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "entrepreneur" | "admin";
  language: string;
  phone?: string;
}

interface AppState {
  // Auth
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  updateUserProfile: (user: UserProfile) => void;
  logout: () => void;

  // Active Context
  district: string;
  mandal: string;
  village: string;
  marginCapital: number;
  businessCategory: string;
  gender: string;
  socialCategory: string;
  setDistrict: (district: string) => void;
  setMandal: (mandal: string) => void;
  setVillage: (village: string) => void;
  setMarginCapital: (amount: number) => void;
  setBusinessCategory: (category: string) => void;
  setDemographics: (gender: string, socialCategory: string) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Initial state reading from localStorage if in browser
const getInitialAuth = () => {
  if (typeof window !== "undefined") {
    try {
      const savedToken = localStorage.getItem("gramvikas_token");
      const savedUser = localStorage.getItem("gramvikas_user");
      if (savedToken && savedUser) {
        return {
          token: savedToken,
          user: JSON.parse(savedUser) as UserProfile,
          isAuthenticated: true,
        };
      }
    } catch {
      // Fallback
    }
  }
  // Default session for instant evaluation if no saved credentials
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialAuth = getInitialAuth();

export const useAppStore = create<AppState>((set) => ({
  token: initialAuth.token,
  user: initialAuth.user,
  isAuthenticated: initialAuth.isAuthenticated,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gramvikas_token", token);
        localStorage.setItem("gramvikas_user", JSON.stringify(user));
      } catch {}
    }
    set({ token, user, isAuthenticated: true });
  },

  updateUserProfile: (user) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gramvikas_user", JSON.stringify(user));
      } catch {}
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("gramvikas_token");
        localStorage.removeItem("gramvikas_user");
      } catch {}
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  // Default Initial Location: Adilabad, Tamsi, Tamsi-B
  district: "Adilabad",
  mandal: "Tamsi",
  village: "Tamsi-B",
  marginCapital: 100000,
  businessCategory: "Food Processing",
  gender: "Male",
  socialCategory: "General",

  setDistrict: (district) => set({ district, mandal: "", village: "" }),
  setMandal: (mandal) => set({ mandal, village: "" }),
  setVillage: (village) => set({ village }),
  setMarginCapital: (marginCapital) => set({ marginCapital }),
  setBusinessCategory: (businessCategory) => set({ businessCategory }),
  setDemographics: (gender, socialCategory) => set({ gender, socialCategory }),

  // Language
  language: "en",
  setLanguage: (language) => set({ language }),

  // Search
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
