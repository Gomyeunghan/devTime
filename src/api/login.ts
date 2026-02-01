import { request } from "./client";
import type { LoginRequest, LoginResponse } from "./types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
    return request("/api/auth/login", {
        method: "POST",
        body: data,
    });
}
