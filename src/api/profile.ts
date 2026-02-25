import { request } from "./client";

export interface responseProfile {
    email: string;
    nickname: string;
    profile: {
        career: string;
        purpose: string;
        goal: string;
        techStacks: string[];
        profileImage: string;
    };
}

export async function getProfile(): Promise<responseProfile> {
    return await request("/api/profile", {
        method: "GET",
    });
}
