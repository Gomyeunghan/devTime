import { request } from "./client";
import type {
    CheckDuplicateResponse,
    SignupRequest,
    SignupResponse,
} from "./types";

/**
 * Create a new user account with the provided signup information.
 *
 * @param data - The signup request payload containing credentials and profile fields required by the API
 * @returns The server's signup response, typically containing created user details and any authentication data
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
    return request("/api/signup", {
        method: "POST",
        body: data,
    });
}

/**
 * Checks whether an email is already registered.
 *
 * @param email - The email address to check for duplication
 * @returns An object indicating whether the provided email is already in use
 */
export async function checkEmailDuplicate(
    email: string,
): Promise<CheckDuplicateResponse> {
    return request(
        `/api/signup/check-email?email=${encodeURIComponent(email)}`,
        { method: "GET" },
    );
}
/**
 * Checks whether a nickname is already registered.
 *
 * @returns A CheckDuplicateResponse indicating whether the nickname already exists.
 */
export async function checkNicknameDuplicate(
    nickname: string,
): Promise<CheckDuplicateResponse> {
    return request(
        `/api/signup/check-nickname?nickname=${encodeURIComponent(nickname)}`,
        { method: "GET" },
    );
}