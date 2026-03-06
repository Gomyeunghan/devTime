import { request } from "./client";

export const CAREER_OPTIONS = [
    "경력 없음",
    "0 - 3년",
    "4 - 7년",
    "8 - 10년",
    "11년 이상",
] as const;
export const PURPOSE_OPTIONS = [
    "취업 준비",
    "이직 준비",
    "단순 개발 역량 향상",
    "회사 내 프로젝트 원활하게 수행",
    "기타(직접 입력)",
] as const;

export interface responseProfile {
    nickname: string;

    career?: (typeof CAREER_OPTIONS)[number];
    purpose?: (typeof PURPOSE_OPTIONS)[number];
    goal?: string;
    stack?: string[];
    profileImage?: string;
    password?: string;
}
export interface requsetProfile {
    career?: (typeof CAREER_OPTIONS)[number];
    purpose?: (typeof PURPOSE_OPTIONS)[number];
    goal?: string;
    techStacks?: string[];
    profileImage: string;
}
export interface requsetImage {
    fileName: string;
    contentType: string;
}

export async function postProfile(data: requsetProfile) {
    return await request("/api/profile", {
        method: "POST",
        body: data,
    });
}

export async function getProfile(): Promise<responseProfile> {
    return await request("/api/profile", {
        method: "GET",
    });
}
export async function updateProfile(data: responseProfile): Promise<void> {
    await request("/api/profile", {
        method: "PUT",
        body: data,
    });
}
export async function getParsingUrl(
    data: requsetImage,
): Promise<{ presignedUrl: string; key: string }> {
    return await request("/api/file/presigned-url", {
        method: "POST",
        body: data,
    });
}
