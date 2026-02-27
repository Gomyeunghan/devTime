import { request } from "./client";

const CAREER_OPTIONS = [
    "경력없음",
    "0-3년",
    "4-7년",
    "8-10년",
    "11년이상",
] as const;
const PURPOSE_OPTIONS = [
    "취업준비",
    "이직준비",
    "단순 개발 역량 향상",
    "회사 내 프로젝트 원활하게 수행",
    "기타((직접입력)",
] as const;

export interface responseProfile {
    nickname: string;
    carrer?: (typeof CAREER_OPTIONS)[number];
    purpose?: (typeof PURPOSE_OPTIONS)[number];
    goal?: string;
    stack?: string[];
    prfileImage?: string;
    password?: string;
}

export async function getProfile(): Promise<responseProfile> {
    return await request("/api/profile", {
        method: "GET",
    });
}
