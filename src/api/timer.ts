import { request } from "./client";
export interface Task {
    content: string;
    isCompleted: boolean;
}
export interface requestTiemr {
    todayGoal: string;
    tasks: string[];
}
export interface requestPutTimer {
    splitTimes: { date: string; timeSpent: number }[];
}
export interface responseTimer {
    timerId: string;
    studyLogId: string;
    splitTimes: {
        date: string;
        timeSpent: number;
    }[];

    startTime: string;
    lastUpdateTime: string;
}
export interface stopTimerData {
    splitTimes: { date: string; timeSpent: number }[];
    review: string;
    tasks: Task[];
}
export interface StudyLog {
    id: string;
    date: string;
    todayGoal: string;
    studyTime: number;
    completionRate: number;
    review: string;
    tasks: Task[];
}
export interface StudyLogApiResponse {
    success: boolean;
    data: StudyLog;
}

export async function getTimer(): Promise<responseTimer> {
    return await request("/api/timers", { method: "GET" });
}

export async function postTimer(data?: requestTiemr): Promise<responseTimer> {
    return await request("/api/timers", { method: "POST", body: data });
}

export async function deleteTimer(timerId: string) {
    return await request(`/api/timers/${timerId}`, { method: "DELETE" });
}
export async function updateTimer(
    timerId: string,
    data: Partial<requestPutTimer>, // any 대신 명확한 타입
): Promise<responseTimer> {
    return await request(`/api/timers/${timerId}`, {
        method: "PUT",
        body: data,
    });
}
export async function getTask(
    studyLogId: responseTimer["studyLogId"],
): Promise<StudyLogApiResponse> {
    return await request(`/api/study-logs/${studyLogId}`, { method: "GET" });
}
export async function stopTimer(tiemrid: string, data: stopTimerData) {
    console.log(data);
    return await request(`/api/timers/${tiemrid}/stop`, {
        method: "POST",
        body: data,
    });
}

export async function updateTasks(studyLogId: string, tasks: Task[]) {
    return await request(`/api/${studyLogId}/tasks`, {
        method: "PUT",
        body: { tasks },
    });
}
