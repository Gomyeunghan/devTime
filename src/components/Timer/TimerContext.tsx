import { createContext, useContext, useRef, useState, useEffect } from "react";
import type { responseTimer, requestTiemr, Task } from "@/api/timer";
import {
    postTiemr,
    pusedTimer,
    deleteTiemr,
    getTimer,
    updateTimer,
} from "@/api/timer";
import { secondsToTime } from "@/utils/time";
import { tokenStorage } from "@/utils/storage";

interface PausedTimerData {
    splitTimes: { date: string; timeSpent: number }[];
    review: string;
    tasks: Task[];
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
    const pollingRef = useRef<number | null>(null); // 10분마다 업데이트
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [todayGoal, setTodayGoal] = useState("");
    const [timerId, setTimerId] = useState<string>();
    const [isrunTiemr, setisRunTimer] = useState();

    // 서버에서 기존 타이머 가져오기
    useEffect(() => {
        const fetchTimer = async () => {
            const timer = await getTimer();

            if (!timer) return;
            if (timer.timerId) {
                setTimerRunning(true);
            }
            console.log(timer);

            setTimerId(timer.timerId);
            setTodayGoal(""); // 필수세
            setTasks([]); // 필수세팅

            const elapsedSeconds = calcElapsedSeconds(
                timer.startTime,
                timer.lastUpdateTime,
            );
            setTotalSeconds(elapsedSeconds);

            startInterval();
            startPolling();
        };
        fetchTimer();

        return () => {
            stopInterval();
            stopPolling();
        };
    }, []);

    const calcElapsedSeconds = (startTime: string, lastUpdateTime: string) => {
        const now = Date.now();

        const start = new Date(startTime).getTime(); // 사용하지않고있음 검토후 삭제확인
        const last = new Date(lastUpdateTime).getTime();

        return Math.floor((now - last) / 1000);
    };

    const startInterval = () => {
        if (intervalRef.current !== null) return;
        intervalRef.current = window.setInterval(() => {
            setTotalSeconds(prev => prev + 1);
        }, 1000);
        setTimerRunning(true);
    };

    const stopInterval = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerRunning(false);
    };

    // 10분마다 서버 업데이트
    const startPolling = () => {
        if (!timerId || pollingRef.current !== null) return;

        pollingRef.current = window.setInterval(
            () => {
                updateServerTimer();
            },
            10 * 60 * 1000,
        ); // 10분
    };

    const stopPolling = () => {
        if (pollingRef.current !== null) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const updateServerTimer = async () => {
        if (!timerId) return;

        const data = {
            splitTimes: [
                {
                    date: new Date().toISOString(),
                    timeSpent: totalSeconds * 1000,
                },
            ],
        };

        try {
            await updateTimer(timerId, data);
        } catch (err) {
            console.error("타이머 업데이트 실패:", err);
        }
    };

    const start = async (goal: string, initialTasks: Task[]) => {
        console.log(isrunTiemr);
        if (intervalRef.current) return;

        const data: requestTiemr = {
            todayGoal: goal,
            task: initialTasks,
        };

        const newTimer: responseTimer = await postTiemr(data);

        setTimerId(newTimer.timerId);
        setTodayGoal(goal);
        setTasks(initialTasks);
        setTotalSeconds(0);

        startInterval();
        startPolling();
    };

    const pause = async (review: string = "") => {
        stopInterval();
        stopPolling();

        const pausedData: PausedTimerData = {
            splitTimes: [
                {
                    date: new Date().toISOString(),
                    timeSpent: totalSeconds * 1000,
                },
            ],
            review,
            tasks,
        };

        await pusedTimer(pausedData as any);
    };

    const stop = async () => {
        stopInterval();
        stopPolling();

        if (timerId) {
            await deleteTiemr(timerId);
        }

        setTimerId(undefined);
        setTotalSeconds(0);
        setTasks([]);
        setTodayGoal("");
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
