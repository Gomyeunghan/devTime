import { tokenStorage } from "@/utils/storage";
import { create } from "zustand";

interface AuthStore {
    isLoggedIn: boolean;
    isFirstLogin: boolean;
    logout: () => void;
}

const useAuthStore = create<AuthStore>(set => ({
    isLoggedIn: !!tokenStorage.getAccessToken(),
    isFirstLogin: false,
    logout: () => {
        tokenStorage.clearTokens();
        set({ isLoggedIn: false });
    },
}));

export default useAuthStore;
