import { createContext, useContext, useRef, useState, useEffect } from "react";
import type {
    responseTimer,
    requestTiemr,
    Task,
    requestPutTimer,
} from "@/api/timer";
import { postTimer, deleteTimer, getTimer, updateTimer } from "@/api/timer";
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

    const latestStateRef = useRef({
        timerId,
        currentSessionStart,
        existingSplitTimes,
        tasks,
    });
    // state를 ref로 관리 (클로저 문제 해결)
    useEffect(() => {
        latestStateRef.current = {
            timerId,
            currentSessionStart,
            existingSplitTimes,
            tasks,
        };
    }, [timerId, currentSessionStart, existingSplitTimes, tasks]);
    // State 변경될 때마다 ref 업데이트
    useEffect(() => {
        const fetchTimer = async () => {
            try {
                const timer = await getTimer();

                if (!timer || !timer.timerId) return;

                console.log("서버 타이머:", timer);

                // splitTimes 총합 계산
                const totalSplitTimeMs =
                    timer.splitTimes?.reduce((sum, split) => {
                        return sum + split.timeSpent;
                    }, 0) || 0;
                const totalSplitTimeSeconds = Math.floor(
                    totalSplitTimeMs / 1000,
                );

                // LocalStorage에서 정지 상태 확인
                const wasPaused =
                    localStorage.getItem(`timer_${timer.timerId}_paused`) ===
                    "true";

                if (wasPaused) {
                    console.log("정지 상태로 복구");

                    // splitTimes 총합으로 시간 복구
                    setTotalSeconds(totalSplitTimeSeconds);
                    setTimerId(timer.timerId);
                    setTimerRunning(false);
                    setTasks(tasks || []);
                    //할일 관리
                    setTodayGoal(todayGoal || "");
                    //목표관리
                    setExistingSplitTimes(timer.splitTimes || []);
                    //타이머 시간관리
                    setAccumulatedSeconds(totalSplitTimeSeconds);
                    //splite타이머 배열의 spend타임의 누적값
                    setCurrentSessionStart("");
                    return;
                }

                //  실행 중 상태 - 현재 세션 경과 시간 계산
                const currentElapsed = calcElapsedSeconds(
                    timer.startTime,
                    timer.lastUpdateTime,
                );

                console.log("splitTimes 총합:", totalSplitTimeSeconds);
                console.log("현재 세션:", currentElapsed);

                setExistingSplitTimes(timer.splitTimes || []);

                initializeTimer({
                    timerId: timer.timerId,
                    goal: todayGoal || "",
                    tasks: tasks || [],
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
    // 서버에서 기존 타이머 가져오기
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
    //타이머 상태 추상화함수 (타이머ID,목표,할일목록,누적시간,현재섹션시작시간)
    const resetTimer = () => {
        setTimerId(undefined);
        setTotalSeconds(0);
        setTasks([]);
        setTodayGoal("");
        setCurrentSessionStart("");
        setAccumulatedSeconds(0);
        setExistingSplitTimes([]);
        setTimerRunning(false);
    };
    //타이머 정지시 전체상태 초기화 (localStorage도 초기화)
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
    //타이머 시작함수
    const stopInterval = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerRunning(false);
    };
    //타이머 종료함수
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
            1 * 60 * 1000,
        ); // 테스트 1분

        console.log("자동 저장 시작 (10분 간격)");
    };
    //10분마다 자동 업데이트 함수
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
    //일시정지 버튼후 업데이트 종료함수
    const saveCurrentSession = async () => {
        console.log("saveCurrentSession 호출됨");

        // ref에서 최신 값 가져오기
        const { timerId, currentSessionStart, existingSplitTimes, tasks } =
            latestStateRef.current;

        console.log("ref 값:", { timerId, currentSessionStart });

        if (!timerId || !currentSessionStart) {
            console.log("timerId나 currentSessionStart 없음");
            return;
        }

        try {
            const now = Date.now();
            const sessionStart = new Date(currentSessionStart).getTime();
            //최근업데이트된 시간 계산
            const sessionElapsed = Math.floor((now - sessionStart) / 1000);
            //현재시간 - 최근업데이트한 시간 을 초로 바꿈

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
            });
            //시간 계산 해서 post
            console.log("타이머 자동 저장 완료:", sessionElapsed, "초");
        } catch (error) {
            console.error("자동 저장 실패:", error);
        }
    };
    //현재 섹션 포스트

    const start = async (goal: string, initialTasks: Task[]) => {
        // timerId가 있으면 재개 (resume)
        if (timerId) {
            console.log("resume시작");

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
    //타이머 시작 id 없으면 새로운타이머 post

    const pause = async () => {
        if (!timerId || !currentSessionStart) return;

        console.log("Pause 시작");
        console.log("pollingRef:", pollingRef.current);

        // 정지하면 polling정지
        stopInterval();
        stopPolling();

        console.log("정리 후 pollingRef:", pollingRef.current);

        try {
            const now = Date.now();
            const sessionStart = new Date(currentSessionStart).getTime();
            const sessionElapsed = Math.floor((now - sessionStart) / 1000);
            //저징하면서 현재 데이터 post 진행시간 및 task
            console.log("세션 경과(초):", sessionElapsed);

            const newSplitTimes = [
                ...existingSplitTimes,
                {
                    date: currentSessionStart,
                    timeSpent: sessionElapsed * 1000,
                },
            ];

            const pausedData: requestPutTimer = {
                splitTimes: newSplitTimes, // 현재까지 splitTime계산
            };

            await updateTimer(timerId, pausedData);

            // LocalStorage에 정지 상태 저장
            localStorage.setItem(`timer_${timerId}_paused`, "true");

            //새로고침해도 정지상태유지

            setExistingSplitTimes(newSplitTimes);
            setAccumulatedSeconds(totalSeconds);
            setCurrentSessionStart("");

            console.log("Pause 완료");
        } catch (error) {
            console.error("일시정지 실패:", error);
            throw error;
        }
    };
    //일시정지 정지하면 polling stop 현재시간섹션 서버에 put

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

            resetTimer();
        } catch (error) {
            console.error("타이머 종료 실패:", error);
        }
    };
    //타이머 정지(초기화)
    const addTask = (task: Task) => setTasks(prev => [...prev, task]);
    //할일 추가함수 모달로 내려주기

    const updateTask = (index: number, task: Task) =>
        setTasks(prev => prev.map((t, i) => (i === index ? task : t)));
    //할일 수정함수 모달로 내려주기

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
