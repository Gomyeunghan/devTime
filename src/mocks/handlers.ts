import { http, HttpResponse } from "msw";
import {
    mockAccessToken,
    mockHeatmap,
    mockProfile,
    mockRankings,
    mockRefreshToken,
    mockStudyLogDetail,
    mockStudyLogs,
    mockStudyStats,
    mockTechStacks,
    mockTimers,
    mockUser,
    createMockTimer,
} from "./data";

export const handlers = [
    // auth
    http.post("*/api/auth/login", () => {
        return HttpResponse.json({
            success: true,
            message: "로그인 성공",
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken,
            isDuplicateLogin: false,
            isFirstLogin: false,
        });
    }),
    http.post("*/api/auth/refresh", () => {
        return HttpResponse.json({ accessToken: mockAccessToken });
    }),

    // signup
    http.post("*/api/signup", () => {
        return HttpResponse.json({ success: true, message: "회원가입 성공" });
    }),
    http.get("*/api/signup/check-email", () => {
        return HttpResponse.json({
            success: true,
            available: true,
            message: "사용 가능한 이메일입니다",
        });
    }),
    http.get("*/api/signup/check-nickname", () => {
        return HttpResponse.json({
            success: true,
            available: true,
            message: "사용 가능한 닉네임입니다",
        });
    }),

    // tech stacks
    http.get("*/api/tech-stacks", ({ request }) => {
        const url = new URL(request.url);
        const keyword = url.searchParams.get("keyword") ?? "";
        return HttpResponse.json(
            mockTechStacks.filter(stack =>
                stack.name.toLowerCase().includes(keyword.toLowerCase()),
            ),
        );
    }),

    // rankings
    http.get("*/api/rankings", () => {
        return HttpResponse.json({
            success: true,
            data: {
                rankings: mockRankings,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: mockRankings.length,
                    hasNext: false,
                    hasPrev: false,
                },
            },
        });
    }),

    // timers
    http.get("*/api/timers", () => {
        const latest = [...mockTimers.values()].at(-1) ?? createMockTimer();
        return HttpResponse.json(latest);
    }),
    http.post("*/api/timers", () => {
        return HttpResponse.json(createMockTimer());
    }),
    http.delete("*/api/timers/:timerId", ({ params }) => {
        mockTimers.delete(params.timerId as string);
        return new HttpResponse(null, { status: 204 });
    }),
    http.put("*/api/timers/:timerId", ({ params }) => {
        const timer = mockTimers.get(params.timerId as string);
        if (!timer) {
            return HttpResponse.json(
                { error: { message: "타이머를 찾을 수 없습니다" } },
                { status: 404 },
            );
        }
        timer.lastUpdateTime = new Date().toISOString();
        return HttpResponse.json(timer);
    }),
    http.post("*/api/timers/:timerId/stop", ({ params }) => {
        const timer = mockTimers.get(params.timerId as string);
        return HttpResponse.json({
            success: true,
            data: { ...mockStudyLogDetail, id: timer?.studyLogId ?? "log-1" },
        });
    }),
    http.put("*/api/:studyLogId/tasks", () => {
        return HttpResponse.json({ success: true });
    }),

    // study logs / dashboard
    http.get("*/api/study-logs", () => {
        return HttpResponse.json({
            data: {
                studyLogs: mockStudyLogs,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: mockStudyLogs.length,
                    hasNext: false,
                    hasPrev: false,
                },
            },
        });
    }),
    http.get("*/api/study-logs/:studyLogId", () => {
        return HttpResponse.json({ success: true, data: mockStudyLogDetail });
    }),
    http.delete("*/api/study-logs/:studyLogId", () => {
        return new HttpResponse(null, { status: 204 });
    }),
    http.get("*/api/heatmap", () => {
        return HttpResponse.json({ heatmap: mockHeatmap });
    }),
    http.get("*/api/stats", () => {
        return HttpResponse.json(mockStudyStats);
    }),

    // profile
    http.get("*/api/profile", () => {
        return HttpResponse.json(mockProfile);
    }),
    http.post("*/api/profile", () => {
        return HttpResponse.json({ success: true });
    }),
    http.put("*/api/profile", () => {
        return new HttpResponse(null, { status: 204 });
    }),
    http.post("*/api/file/presigned-url", () => {
        return HttpResponse.json({
            presignedUrl: "https://example.com/mock-presigned-url",
            key: "mock-key",
        });
    }),

    http.get("*/api/user/me", () => {
        return HttpResponse.json(mockUser);
    }),
];
