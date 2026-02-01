import S from "./Timer.module.css";
import Start from "@assets/start.svg";
import StartDisabled from "@assets/StartDisabled.svg";
import Pause from "@assets/Pause.svg";
import Finish from "@assets/Finish.svg";
import { useTimer } from "./TimerContext";

export default function Timer() {
    const { timeFormatted, start, pause, stop, resume, timerRunning, timerId } =
        useTimer();

    // 예시 목표/할일 (모달 추가 전)
    const exampleGoal = "오늘 목표";
    const exampleTasks = [{ content: "예시 할 일", isCompleted: false }];

    const handleStart = () => {
        if (timerId) {
            resume(); // 재개
        } else {
            start(exampleGoal, exampleTasks); // 새로 시작
        }
    };

    return (
        <div className={S.container}>
            <div className={S.time}>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>{timeFormatted.hours}</span>
                    <span className={S.timeCardText}>H O U R S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>
                        {timeFormatted.minutes}
                    </span>
                    <span className={S.timeCardText}>M I N U T E S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>
                        {timeFormatted.seconds}
                    </span>
                    <span className={S.timeCardText}>S E C O N D S</span>
                </div>
            </div>
            <div className={S.controlBox}>
                <button onClick={() => handleStart()} disabled={timerRunning}>
                    <img src={timerRunning ? StartDisabled : Start} />
                </button>
                <button onClick={pause}>
                    <img src={Pause} />
                </button>
                <button onClick={stop}>
                    <img src={Finish} />
                </button>
            </div>
        </div>
    );
}
