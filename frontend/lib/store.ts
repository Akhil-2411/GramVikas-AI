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

export const useAppStore = create<AppState>((set) => ({
  // Default Demo Entrepreneur Auth
  token: "demo-jwt-token-sih2026",
  user: {
    id: "demo-user-1",
    full_name: "Ramesh Kumar",
    email: "ramesh.kumar@gramvikas.ai",
    role: "entrepreneur",
    language: "English",
    phone: "+91 98480 22334"
  },
  isAuthenticated: true,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),

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
