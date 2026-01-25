import { request } from "./client";
import type {
    CheckDuplicateResponse,
    SignupRequest,
    SignupResponse,
} from "./types";

export async function signup(data: SignupRequest): Promise<SignupResponse> {
    return request("/api/signup", {
        method: "POST",
        body: data,
    });
}

export async function checkEmailDuplicate(
    email: string,
): Promise<CheckDuplicateResponse> {
    return request(
        `/api/signup/check-email?email=${encodeURIComponent(email)}`,
        { method: "GET" },
    );
}
export async function checkNicknameDuplicate(
    nickname: string,
): Promise<CheckDuplicateResponse> {
    return request(
        `/api/signup/check-nickname?nickname=${encodeURIComponent(nickname)}`,
        { method: "GET" },
    );
}
