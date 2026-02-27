import { tokenStorage } from "@/utils/storage";
import { create } from "zustand";

interface AuthStore {
    isLoggedIn: boolean;
    logout: () => void;
}

const useAuthStore = create<AuthStore>(set => ({
    isLoggedIn: !!tokenStorage.getAccessToken(),
    logout: () => {
        tokenStorage.clearTokens();
        set({ isLoggedIn: false });
    },
}));

export default useAuthStore;
