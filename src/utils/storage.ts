export const AUTH_STORAGE_KEY = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

export const tokenStorage = {
    setAccessToken: (token: string) => {
        localStorage.setItem(AUTH_STORAGE_KEY.ACCESS_TOKEN, token);
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem(AUTH_STORAGE_KEY.ACCESS_TOKEN);
    },

    setRefreshToken: (token: string) => {
        localStorage.setItem(AUTH_STORAGE_KEY.REFRESH_TOKEN, token);
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(AUTH_STORAGE_KEY.REFRESH_TOKEN);
    },

    clearTokens: () => {
        localStorage.removeItem(AUTH_STORAGE_KEY.ACCESS_TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEY.REFRESH_TOKEN);
    },
};
