export interface Task {
    content: string;
    isCompleted: boolean;
}
export interface requestTiemr {
    todayGoal: string;
    task: Task[];
}
export interface responseTimer {
    timerId: "string";
    studyLogId: "string";
    splitTimes: [
        {
            date: string;
            timeSpent: number;
        },
    ];
    startTime: string;
    lastUpdateTime: string;
}
export interface pausedTimerData {
    splitTimes: { date: string; timeSpent: number }[];
    review: string;
    tasks: Task[];
}

import { request } from "./client";

export async function getTimer(): Promise<responseTimer> {
    return await request("/api/timers", { method: "GET" });
}

export async function postTimer(data?: requestTiemr): Promise<responseTimer> {
    return await request("/api/timers", { method: "POST", body: data });
}
export async function pusedTimer(
    data: requestTiemr,
    timerId: string,
): Promise<responseTimer> {
    return await request(`/api/timers/${timerId}`, {
        method: "PUT",
        body: data,
    });
}

export async function deleteTimer(timerId: string) {
    return await request(`api/timers/${timerId}`, { method: "DELETE" });
}
export async function updateTimer(timerId: string, data: any) {
    return await request(`/api/timers/${timerId}`, {
        method: "PUT",
        body: data,
    });
}
