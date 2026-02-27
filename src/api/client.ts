import useAuthStore from "@/store/authStore";
import { tokenStorage } from "@/utils/storage";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequestOptions {
    method: "GET" | "POST" | "DELETE" | "PUT";
    body?: unknown;
}

async function parseError(response: Response): Promise<Error> {
    let message = "처리중 에러발생";
    try {
        const data = await response.json();
        message = data?.error?.message || message;
    } catch {}
    return new Error(message);
}
export async function request<T>(
    url: string,
    options: RequestOptions,
): Promise<T> {
    const token = tokenStorage.getAccessToken();
    const response = await fetch(`${BASE_URL}${url}`, {
        method: options.method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw await parseError(response);
    }
    if (response.status === 401) {
        useAuthStore.getState().logout();
        throw await parseError(response);
    }
    return response.json();
}
