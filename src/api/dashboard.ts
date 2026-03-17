import { request } from "./client";

export interface HeatmapDay {
    colorLevel: number;
    date: string;
    studyTimeHours: number;
}

export interface HeatmapResponse {
    heatmap: HeatmapDay[];
}

export interface StudyLog {
    id: string;
    date: string;
    todayGoal: string;
    studyTime: number;
    totalTasks: number;
    incompleteTasks: number;
    completionRate: number;
}

export interface StudyLogResponse {
    data: {
        studyLogs: StudyLog[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}
export interface StudyStatsResponse {
    averageDailyStudyTime: number;
    consecutiveDays: number;
    taskCompletionRate: number;
    totalStudyTime: number;
    weekdayStudyTime: weekdayStudyTime;
}
export interface weekdayStudyTime {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
}
export interface detailStudyLogData {
    id: string;
    date: string;
    todayGoal: string;
    studyTime: number;
    tasks: [{ id: string; content: string; isCompleted: boolean }];
    review: string;
    completionRate: number;
}
export interface detailStudyLog {
    success: boolean;
    data: detailStudyLogData;
}

export async function getStudyLog(): Promise<StudyLogResponse> {
    return request("/api/study-logs", {
        method: "GET",
    });
}

export async function getHeatmap(): Promise<HeatmapResponse> {
    return request("/api/heatmap", {
        method: "GET",
    });
}
export async function getStudyStats(): Promise<StudyStatsResponse> {
    return request("/api/stats", {
        method: "GET",
    });
}
export async function deleteStudyLog(studyLogId: string) {
    return request(`/api/study-logs/${studyLogId}`, {
        method: "DELETE",
    });
}
export async function getStudyLogDetail(
    studyLogId: string,
): Promise<detailStudyLog> {
    return request(`/api/study-logs/${studyLogId}`, {
        method: "GET",
    });
}
