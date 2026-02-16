import S from "./Timer.module.css";
import Start from "@assets/start.svg";
import StartDisabled from "@assets/StartDisabled.svg";
import Pause from "@assets/Pause.svg";
import Finish from "@assets/Finish.svg";
import TodoList from "@assets/SetTodoList.svg";
import Reset from "@assets/Reset.png";
import PasueDisabled from "@assets/PauseDisabled.svg";
import FinishDisabled from "@assets/FinishDisabled.svg";
import { useTimer } from "./TimerContext";

export default function Timer() {
    const {
        timeFormatted,
        reset,
        start,
        resume,
        pause,
        stop,
        timerRunning,
        timerId,
        setIsModalOpen,
        isModalOpen,
    } = useTimer();

    // 예시 목표/할일 (모달 추가 전)

    const handleStart = () => {
        if (timerId) {
            resume(); // 재개
        } else {
            handleModal();
        }
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
        console.log(isModalOpen);
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
                    <img src={timerRunning ? Pause : PasueDisabled} />
                </button>
                <button onClick={stop}>
                    <img src={timerId ? Finish : FinishDisabled} />
                </button>

                <button
                    onClick={() => handleModal()}
                    style={timerId ? {} : { display: "none" }}
                >
                    <img src={TodoList} alt="todoList" />
                </button>
                <button
                    onClick={reset}
                    style={timerId ? {} : { display: "none" }}
                >
                    <img src={Reset} alt="reset" />
                </button>
            </div>
        </div>
    );
}
