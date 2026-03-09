import useAuthStore from "@/store/authStore";
import { tokenStorage } from "@/utils/storage";
import type { requsetImage } from "./profile";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequestOptions {
    method: "GET" | "POST" | "DELETE" | "PUT";
    body?: unknown;
}
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function parseError(response: Response): Promise<ApiError> {
    let message = "처리중 에러발생";
    if (response.status === 401) {
        useAuthStore.getState().logout();
        console.log("logout");
    }
    try {
        const data = await response.json();
        message = data?.error?.message || message;
    } catch {}
    return new ApiError(message, response.status);
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

    return response.json();
}
export async function imgRequest<T>(
    url: string,
    options: RequestOptions,
    file: requsetImage,
): Promise<T> {
    const token = tokenStorage.getAccessToken();
    const response = await fetch(`${BASE_URL}${url}`, {
        method: options.method,
        headers: {
            "Content-Type": file.contentType,
            Authorization: `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw await parseError(response);
    }
    return response.json();
}
