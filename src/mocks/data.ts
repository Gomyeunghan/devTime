export const mockUser = {
    email: "test@devtime.app",
    nickname: "테스트유저",
};

export const mockAccessToken = "mock-access-token";
export const mockRefreshToken = "mock-refresh-token";

export const mockProfile = {
    nickname: mockUser.nickname,
    email: mockUser.email,
    profile: {
        career: "0 - 3년" as const,
        purpose: "취업 준비" as const,
        goal: "매일 2시간씩 꾸준히 공부하기",
        techStacks: ["React", "TypeScript"],
        profileImage: "",
    },
};

export const mockTechStacks = [
    { id: 1, name: "React" },
    { id: 2, name: "TypeScript" },
    { id: 3, name: "JavaScript" },
    { id: 4, name: "Node.js" },
    { id: 5, name: "Next.js" },
];

let timerSeq = 1;
export const mockTimers = new Map<
    string,
    {
        timerId: string;
        studyLogId: string;
        splitTimes: { date: string; timeSpent: number }[];
        startTime: string;
        lastUpdateTime: string;
    }
>();

export function createMockTimer() {
    const now = new Date().toISOString();
    const timerId = `timer-${timerSeq}`;
    const studyLogId = `log-${timerSeq}`;
    timerSeq += 1;
    const timer = {
        timerId,
        studyLogId,
        splitTimes: [],
        startTime: now,
        lastUpdateTime: now,
    };
    mockTimers.set(timerId, timer);
    return timer;
}

export const mockStudyLogs = [
    {
        id: "log-1",
        date: "2026-08-20",
        todayGoal: "React Query 학습",
        studyTime: 7200,
        totalTasks: 3,
        incompleteTasks: 1,
        completionRate: 66,
    },
    {
        id: "log-2",
        date: "2026-08-21",
        todayGoal: "MSW 세팅",
        studyTime: 5400,
        totalTasks: 2,
        incompleteTasks: 0,
        completionRate: 100,
    },
];

export const mockStudyLogDetail = {
    id: "log-1",
    date: "2026-08-20",
    todayGoal: "React Query 학습",
    studyTime: 7200,
    tasks: [
        { id: "task-1", content: "useQuery 정리", isCompleted: true },
        { id: "task-2", content: "useMutation 정리", isCompleted: false },
    ],
    review: "무한스크롤까지 정리하면 좋을 듯",
    completionRate: 66,
};

export const mockHeatmap = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(2026, 7, i + 1);
    return {
        date: date.toISOString().slice(0, 10),
        colorLevel: Math.floor(Math.random() * 5),
        studyTimeHours: Math.round(Math.random() * 6 * 10) / 10,
    };
});

export const mockStudyStats = {
    averageDailyStudyTime: 5400,
    consecutiveDays: 4,
    taskCompletionRate: 78,
    totalStudyTime: 129600,
    weekdayStudyTime: {
        Monday: 3600,
        Tuesday: 5400,
        Wednesday: 7200,
        Thursday: 1800,
        Friday: 5400,
        Saturday: 0,
        Sunday: 0,
    },
};

export const mockRankings = Array.from({ length: 10 }).map((_, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    nickname: `유저${i + 1}`,
    totalStudyTime: 100000 - i * 5000,
    averageStudyTime: 5000 - i * 200,
    profile: {
        career: "0 - 3년",
        purpose: "취업 준비",
        profileImage: "",
        techStacks: [{ id: 1, name: "React" }],
    },
}));
