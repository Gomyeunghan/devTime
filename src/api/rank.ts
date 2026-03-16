import { request } from "./client";

export interface Root {
    success: boolean;
    data: Data;
}

export interface Data {
    rankings: RankingData[];
    pagination: Pagination;
}

export interface RankingData {
    rank: number;
    userId: string;
    nickname: string;
    totalStudyTime: number;
    averageStudyTime: number;
    profile: Profile;
}

export interface Profile {
    career: string;
    purpose: string;
    profileImage: string;
    techStacks: TechStack[];
}

export interface TechStack {
    id: number;
    name: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export function getRankings(srotBy: "total" | "avg"): Promise<Root> {
    return request(`/api/rankings?sortBy=${srotBy}&page=1&limit=10`, {
        method: "GET",
    });
}
