import { createContext, useContext, useRef, useState, useEffect } from "react";
import type {
    responseTimer,
    requestTiemr,
    Task,
    pausedTimerData,
} from "@/api/timer";
import {
    postTimer,
    pusedTimer,
    deleteTimer,
    getTimer,
    updateTimer,
} from "@/api/timer";
import { calcElapsedSeconds, secondsToTime } from "@/utils/time";

interface InitTimerParams {
    timerId: string;
    goal: string;
    tasks: Task[];
    accumulatedSeconds: number;
    currentSessionStart: string;
}

interface TimerContextType {
    totalSeconds: number;
    timeFormatted: { hours: string; minutes: string; seconds: string };
    timerRunning: boolean;
    tasks: Task[];
    todayGoal: string;
    start: (todayGoal: string, tasks: Task[]) => Promise<void>;
    pause: (review?: string) => Promise<void>;
    stop: () => Promise<void>;
    addTask: (task: Task) => void;
    updateTask: (index: number, task: Task) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const intervalRef = useRef<number | null>(null);
    const pollingRef = useRef<number | null>(null);

    const [totalSeconds, setTotalSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [todayGoal, setTodayGoal] = useState("");
    const [timerId, setTimerId] = useState<string>();

    const [currentSessionStart, setCurrentSessionStart] = useState<string>("");
    const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
    const [existingSplitTimes, setExistingSplitTimes] = useState<
        Array<{ date: string; timeSpent: number }>
    >([]);

    // 👍 최신 state를 ref로 관리 (클로저 문제 해결)
    const latestStateRef = useRef({
        timerId,
        currentSessionStart,
        existingSplitTimes,
        tasks,
    });

    // State 변경될 때마다 ref 업데이트
    useEffect(() => {
        latestStateRef.current = {
            timerId,
            currentSessionStart,
            existingSplitTimes,
            tasks,
        };
    }, [timerId, currentSessionStart, existingSplitTimes, tasks]);

    // 서버에서 기존 타이머 가져오기
    useEffect(() => {
        const fetchTimer = async () => {
            try {
                const timer = await getTimer();

                if (!timer || !timer.timerId) return;

                console.log("서버 타이머:", timer);

                // 1. splitTimes 총합 계산
                const totalSplitTimeMs =
                    timer.splitTimes?.reduce((sum, split) => {
                        return sum + split.timeSpent;
                    }, 0) || 0;
                const totalSplitTimeSeconds = Math.floor(
                    totalSplitTimeMs / 1000,
                );

                // 2. LocalStorage에서 정지 상태 확인
                const wasPaused =
                    localStorage.getItem(`timer_${timer.timerId}_paused`) ===
                    "true";

                if (wasPaused) {
                    console.log("✅ 정지 상태로 복구");

                    // splitTimes 총합으로 시간 복구
                    setTotalSeconds(totalSplitTimeSeconds);
                    setTimerId(timer.timerId);
                    setTimerRunning(false);
                    setTasks(timer.tasks || []);
                    setTodayGoal(timer.todayGoal || "");
                    setExistingSplitTimes(timer.splitTimes || []);
                    setAccumulatedSeconds(totalSplitTimeSeconds);
                    setCurrentSessionStart("");
                    return;
                }

                // 3. 실행 중 상태 - 현재 세션 경과 시간 계산
                const currentElapsed = calcElapsedSeconds(
                    timer.startTime,
                    timer.lastUpdateTime,
                );

                console.log("splitTimes 총합:", totalSplitTimeSeconds);
                console.log("현재 세션:", currentElapsed);

                setExistingSplitTimes(timer.splitTimes || []);

                initializeTimer({
                    timerId: timer.timerId,
                    goal: timer.todayGoal || "",
                    tasks: timer.tasks || [],
                    accumulatedSeconds: totalSplitTimeSeconds,
                    currentSessionStart: timer.lastUpdateTime,
                });
            } catch (error) {
                console.error("타이머 로드 실패:", error);
            }
        };

        fetchTimer();

        return () => {
            stopInterval();
            stopPolling();
        };
    }, []);

    const initializeTimer = ({
        timerId,
        goal,
        tasks,
        accumulatedSeconds,
        currentSessionStart,
    }: InitTimerParams) => {
        setTimerId(timerId);
        setTodayGoal(goal);
        setTasks(tasks);
        setAccumulatedSeconds(accumulatedSeconds);
        setCurrentSessionStart(currentSessionStart);

        if (currentSessionStart) {
            startInterval(accumulatedSeconds, currentSessionStart);
        } else {
            setTotalSeconds(accumulatedSeconds);
            setTimerRunning(false);
        }
    };

    const startInterval = (baseSeconds: number, sessionStart: string) => {
        if (intervalRef.current !== null) return;

        console.log("startInterval 호출:", { baseSeconds, sessionStart });

        const sessionStartTime = new Date(sessionStart).getTime();

        if (isNaN(sessionStartTime)) {
            console.error("잘못된 sessionStart:", sessionStart);
            return;
        }

        intervalRef.current = window.setInterval(() => {
            const now = Date.now();
            const currentElapsed = Math.floor((now - sessionStartTime) / 1000);
            setTotalSeconds(baseSeconds + currentElapsed);
        }, 1000);

        setTimerRunning(true);
        startPolling();
    };

    const stopInterval = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerRunning(false);
    };

    const startPolling = () => {
        if (pollingRef.current !== null) return;

        pollingRef.current = window.setInterval(
            async () => {
                console.log(
                    "⏰ Polling 실행:",
                    new Date().toLocaleTimeString(),
                );
                await saveCurrentSession();
            },
            1 * 5 * 1000,
        ); // 10분

        console.log("자동 저장 시작 (10분 간격)");
    };

    const stopPolling = () => {
        console.log("stopPolling 호출, 현재 ref:", pollingRef.current);

        if (pollingRef.current !== null) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            console.log("✅ Polling 중지 완료");
        } else {
            console.log("⚠️ 이미 polling이 없음");
        }
    };

    const saveCurrentSession = async () => {
        console.log("🔍 saveCurrentSession 호출됨!");

        // ref에서 최신 값 가져오기
        const { timerId, currentSessionStart, existingSplitTimes, tasks } =
            latestStateRef.current;

        console.log("ref 값:", { timerId, currentSessionStart });

        if (!timerId || !currentSessionStart) {
            console.log("❌ early return - timerId나 currentSessionStart 없음");
            return;
        }

        try {
            const now = Date.now();
            const sessionStart = new Date(currentSessionStart).getTime();
            const sessionElapsed = Math.floor((now - sessionStart) / 1000);

            console.log("=== Polling 실행 ===");
            console.log("세션 경과(초):", sessionElapsed);

            const newSplitTimes = [
                ...existingSplitTimes,
                {
                    date: currentSessionStart,
                    timeSpent: sessionElapsed * 1000,
                },
            ];

            await updateTimer(timerId, {
                splitTimes: newSplitTimes,
                tasks,
            });

            console.log("✅ 타이머 자동 저장 완료:", sessionElapsed, "초");
        } catch (error) {
            console.error("❌ 자동 저장 실패:", error);
        }
    };

    const start = async (goal: string, initialTasks: Task[]) => {
        // timerId가 있으면 재개 (resume)
        if (timerId) {
            console.log("🔄 재개(resume) 시작");

            // 정지 상태 제거
            localStorage.removeItem(`timer_${timerId}_paused`);
            localStorage.removeItem(`timer_${timerId}_total`);

            const now = new Date().toISOString();
            setCurrentSessionStart(now);
            startInterval(accumulatedSeconds, now);
            return;
        }

        // timerId가 없으면 새로 생성
        if (intervalRef.current) return;

        try {
            const data: requestTiemr = {
                todayGoal: goal,
                task: initialTasks,
            };

            const newTimer: responseTimer = await postTimer(data);

            setExistingSplitTimes([]);

            initializeTimer({
                timerId: newTimer.timerId,
                goal,
                tasks: initialTasks,
                accumulatedSeconds: 0,
                currentSessionStart: newTimer.startTime,
            });
        } catch (error) {
            console.error("타이머 시작 실패:", error);
        }
    };

    const pause = async (review: string = "") => {
        if (!timerId || !currentSessionStart) return;

        console.log("=== Pause 시작 ===");
        console.log("pollingRef 현재 상태:", pollingRef.current);

        // 👍 interval과 polling 먼저 정리!
        stopInterval();
        stopPolling();

        console.log("정리 후 pollingRef:", pollingRef.current);

        try {
            const now = Date.now();
            const sessionStart = new Date(currentSessionStart).getTime();
            const sessionElapsed = Math.floor((now - sessionStart) / 1000);

            console.log("세션 경과(초):", sessionElapsed);

            const newSplitTimes = [
                ...existingSplitTimes,
                {
                    date: currentSessionStart,
                    timeSpent: sessionElapsed * 1000,
                },
            ];

            const pausedData: pausedTimerData = {
                splitTimes: newSplitTimes,
                review: review.length >= 15 ? review : undefined,
                tasks,
            };

            await pusedTimer(pausedData as any, timerId);

            // 👍 LocalStorage에 정지 상태 저장
            localStorage.setItem(`timer_${timerId}_paused`, "true");
            localStorage.setItem(
                `timer_${timerId}_total`,
                totalSeconds.toString(),
            );

            setExistingSplitTimes(newSplitTimes);
            setAccumulatedSeconds(totalSeconds);
            setCurrentSessionStart("");

            console.log("✅ Pause 완료");
        } catch (error) {
            console.error("❌ 일시정지 실패:", error);
            throw error;
        }
    };

    const stop = async () => {
        stopInterval();
        stopPolling();

        try {
            if (timerId) {
                await deleteTimer(timerId);

                // LocalStorage 정리
                localStorage.removeItem(`timer_${timerId}_paused`);
                localStorage.removeItem(`timer_${timerId}_total`);
            }

            setTimerId(undefined);
            setTotalSeconds(0);
            setTasks([]);
            setTodayGoal("");
            setCurrentSessionStart("");
            setAccumulatedSeconds(0);
            setExistingSplitTimes([]);
        } catch (error) {
            console.error("타이머 종료 실패:", error);
        }
    };

    const addTask = (task: Task) => setTasks(prev => [...prev, task]);

    const updateTask = (index: number, task: Task) =>
        setTasks(prev => prev.map((t, i) => (i === index ? task : t)));

    return (
        <TimerContext.Provider
            value={{
                totalSeconds,
                timeFormatted: secondsToTime(totalSeconds),
                timerRunning,
                tasks,
                todayGoal,
                start,
                pause,
                stop,
                addTask,
                updateTask,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error("useTimer must be used within TimerProvider");
    return ctx;
};
