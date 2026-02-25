import { createContext, useContext, useRef, useState, useEffect } from "react";
import type { Task } from "@/api/timer";
import {
    postTimer,
    deleteTimer,
    getTimer,
    updateTimer,
    getTask,
    stopTimer,
} from "@/api/timer";
import { secondsToTime } from "@/utils/time";

interface TimerContextType {
    totalSeconds: number;
    timeFormatted: { hours: string; minutes: string; seconds: string };
    timerRunning: boolean;
    tasks: Task[];
    todayGoal: string;
    isModalOpen: boolean;
    timerId?: string;
    review: string;
    studyLogId?: string;
    isTimerStop: boolean;
    start: (todayGoal: string, tasks: Task[]) => Promise<void>;
    pause: () => Promise<void>;
    handleStop: () => Promise<void>;
    reset: () => Promise<void>;
    resume: () => void;
    addTask: (task: Task) => void;
    updateTask: (index: number, task: Task) => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTodayGoal: React.Dispatch<React.SetStateAction<string>>;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setIsTimerStop: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const intervalRef = useRef<number | null>(null);
    const pollingRef = useRef<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [todayGoal, setTodayGoal] = useState("");
    const [timerId, setTimerId] = useState<string>();
    const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
    const [existingSplitTimes, setExistingSplitTimes] = useState<
        { date: string; timeSpent: number }[]
    >([]);
    const [review, setReview] = useState("");
    const [studyLogId, setStudyLogId] = useState<string>();
    const [isTimerStop, setIsTimerStop] = useState(false);

    useEffect(() => {
        const fetchTimer = async () => {
            try {
                const timer = await getTimer();
                if (!timer?.timerId) return;

                const studyLog = (await getTask(timer.studyLogId)).data;
                setStudyLogId(timer.studyLogId);

                const totalSplitTimeMs =
                    timer.splitTimes?.reduce(
                        (sum, s) => sum + s.timeSpent,
                        0,
                    ) || 0;
                // 타이머 총 누적시간 계산(서버에서 받아온 기록 기반)

                const totalSeconds = Math.floor(totalSplitTimeMs / 1000);

                const isPaused =
                    localStorage.getItem(`timer_${timer.timerId}_paused`) ===
                    "true";

                setTimerId(timer.timerId);
                setTasks(studyLog.tasks);
                setTodayGoal(studyLog.todayGoal);
                setExistingSplitTimes(timer.splitTimes || []);
                setAccumulatedSeconds(totalSeconds);
                setTotalSeconds(totalSeconds);

                if (!isPaused) {
                    startInterval();
                }
            } catch (e) {
                console.error("타이머 복구 실패:", e);
            }
        };

        fetchTimer();

        return () => {
            stopInterval();
            stopPolling();
        };
    }, []);

    const startInterval = () => {
        if (intervalRef.current) return;

        intervalRef.current = window.setInterval(() => {
            setTotalSeconds(prev => prev + 1);
        }, 1000);
        //전체시간에 상태에 바로 추가 따로계산 X

        setTimerRunning(true);
        startPolling();
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerRunning(false);
    };

    const startPolling = () => {
        if (pollingRef.current) return;

        pollingRef.current = window.setInterval(() => {
            saveCurrentSessionRef.current();
        }, 60_000);
    };
    //1분마다 현재 세션 저장

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const saveCurrentSession = async () => {
        if (!timerId) return;

        const sessionSeconds = totalSeconds - accumulatedSeconds;
        if (sessionSeconds <= 0) return;

        const newSplitTimes = [
            ...existingSplitTimes,
            {
                date: new Date().toISOString(),
                timeSpent: sessionSeconds * 1000,
            },
        ];

        await updateTimer(timerId, { splitTimes: newSplitTimes });

        setExistingSplitTimes(newSplitTimes);
        setAccumulatedSeconds(totalSeconds);
    };
    // 현재 세션의 경과 시간을 서버에 저장
    const saveCurrentSessionRef = useRef(saveCurrentSession);

    useEffect(() => {
        saveCurrentSessionRef.current = saveCurrentSession;
    });

    const start = async (goal: string, initialTasks: Task[]) => {
        if (timerId) {
            localStorage.removeItem(`timer_${timerId}_paused`);
            startInterval();
            return;
        }

        const newTimer = await postTimer({
            todayGoal: goal,
            tasks: initialTasks.map(t => t.content),
        });

        setTimerId(newTimer.timerId);
        setTasks(initialTasks);
        setTodayGoal(goal);
        setAccumulatedSeconds(0);
        setTotalSeconds(0);
        setExistingSplitTimes([]);

        startInterval();
    };

    const resume = () => {
        if (timerId) {
            localStorage.removeItem(`timer_${timerId}_paused`);
        }
        startInterval();
    };

    const pause = async () => {
        stopInterval();
        stopPolling();
        if (!timerId) return;
        await saveCurrentSession();

        localStorage.setItem(`timer_${timerId}_paused`, "true");
    };

    const reset = async () => {
        stopInterval();
        stopPolling();

        if (timerId) {
            await deleteTimer(timerId);
            localStorage.removeItem(`timer_${timerId}_paused`);
        }

        setTimerId(undefined);
        setTasks([]);
        setTodayGoal("");
        setTotalSeconds(0);
        setAccumulatedSeconds(0);
        setExistingSplitTimes([]);
    };
    const handleStop = async () => {
        console.log("click");

        stopInterval();
        stopPolling();

        const data = {
            splitTimes: existingSplitTimes,
            review: review,
            tasks: tasks,
        };

        if (!timerId) return;
        await stopTimer(timerId, data);
        setTimerId(undefined);
        setTasks([]);
        setTodayGoal("");
        setTotalSeconds(0);
        setAccumulatedSeconds(0);
        setExistingSplitTimes([]);
    };

    const addTask = (task: Task) => setTasks(p => [...p, task]);
    const updateTask = (index: number, task: Task) =>
        setTasks(p => p.map((t, i) => (i === index ? task : t)));

    return (
        <TimerContext.Provider
            value={{
                totalSeconds,
                timeFormatted: secondsToTime(totalSeconds),
                timerRunning,
                tasks,
                todayGoal,
                review,
                isModalOpen,
                studyLogId,
                timerId,
                isTimerStop,
                start,
                resume,
                pause,
                handleStop,
                reset,
                addTask,
                updateTask,
                setIsModalOpen,
                setTodayGoal,
                setReview,
                setTasks,
                setIsTimerStop,
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
